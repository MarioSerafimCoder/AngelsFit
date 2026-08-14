import type { ProfileForGeneration } from "../workout-engine";
import type { ExercisePerformanceRecord, TrainingHistoryLike } from "../training-intelligence";
import { buildExerciseState } from "./exercise-state.ts";
import { calculateSessionQuality } from "./session-quality.ts";
import { isPoorRecovery } from "./recovery.ts";
import type { AdaptiveDecision, CalibrationStatus } from "./types.ts";

export type AlgorithmConfidence = "low" | "medium" | "high";
export type ExerciseProgressionDecision = AdaptiveDecision & {
  exerciseId: string;
  suggestedLoad?: number;
};

export type LearnedExercisePreference = {
  fromExerciseId: string;
  preferredExerciseId?: string;
  substitutions: number;
  skips: number;
  recentPainEvents: number;
  confidence: AlgorithmConfidence;
};

export type AdaptivePlan = {
  effectiveDays: number;
  effectiveDurationMinutes: number;
  volume: AdaptiveDecision;
  cycle: AdaptiveDecision;
  confidence: AlgorithmConfidence;
  confidenceScore: number;
  reasons: string[];
  preferences: LearnedExercisePreference[];
  calibrationStatus: CalibrationStatus;
};

const ATTENDED = new Set(["completed", "partial", "repeated", "attendance_legacy"]);

function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function confidenceFromScore(score: number): AlgorithmConfidence {
  if (score >= 0.72) return "high";
  if (score >= 0.38) return "medium";
  return "low";
}

function attended(history: TrainingHistoryLike[]): TrainingHistoryLike[] {
  return history.filter((item) => ATTENDED.has(item.status || "completed"));
}

function completionRatio(item: TrainingHistoryLike): number | null {
  if (!finite(item.completedExercises) || !finite(item.totalExercises) || item.totalExercises <= 0) return null;
  return clamp(item.completedExercises / item.totalExercises, 0, 1);
}

function recordsForExercise(history: TrainingHistoryLike[], exerciseId: string): Array<{ session: TrainingHistoryLike; record: ExercisePerformanceRecord }> {
  return attended(history)
    .flatMap((session) => (session.exerciseRecords || []).filter((record) => record.exerciseId === exerciseId).map((record) => ({ session, record })))
    .sort((left, right) => new Date(right.session.completedAt).getTime() - new Date(left.session.completedAt).getTime());
}

export function algorithmConfidence(history: TrainingHistoryLike[]): { score: number; level: AlgorithmConfidence; reasons: string[] } {
  const sessions = attended(history).slice(0, 20);
  const exerciseRecords = sessions.flatMap((item) => item.exerciseRecords || []);
  const sessionCoverage = clamp(sessions.length / 16, 0, 1);
  const completionCoverage = sessions.length ? sessions.filter((item) => completionRatio(item) !== null).length / sessions.length : 0;
  const durationCoverage = sessions.length ? sessions.filter((item) => finite(item.durationMinutes) && item.durationMinutes > 0).length / sessions.length : 0;
  const performanceCoverage = exerciseRecords.length
    ? exerciseRecords.filter((item) => finite(item.load) && item.load > 0 && finite(item.repetitions) && item.repetitions > 0).length / exerciseRecords.length
    : 0;
  const recoveryCoverage = sessions.length
    ? sessions.filter((item) => finite(item.sessionRpe) || finite(item.averageRir) || finite(item.painScore) || Boolean(item.recovery24h)).length / sessions.length
    : 0;
  const score = clamp(sessionCoverage * 0.5 + completionCoverage * 0.15 + durationCoverage * 0.1 + performanceCoverage * 0.15 + recoveryCoverage * 0.1, 0, 1);
  const reasons = sessions.length < 3
    ? ["Poucas sessões registradas: os ajustes permanecem mínimos."]
    : performanceCoverage < 0.35
      ? ["A frequência e a conclusão já orientam o plano; carga, repetições e RIR ainda têm baixa cobertura."]
      : ["O histórico já combina frequência, conclusão, duração e desempenho para orientar ajustes graduais."];
  const level = sessions.length < 3 ? "low" : sessions.length < 6 && confidenceFromScore(score) === "high" ? "medium" : confidenceFromScore(score);
  return { score: Math.round(score * 100) / 100, level, reasons };
}

export function actualTrainingBehavior(history: TrainingHistoryLike[], now = new Date()): { sessions: number; weeks: number; weeklyFrequency: number; averageDuration: number } {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 42);
  const recent = attended(history).filter((item) => new Date(item.completedAt) >= cutoff);
  const dated = recent.map((item) => new Date(item.completedAt).getTime()).filter(Number.isFinite);
  const spanDays = dated.length > 1 ? Math.max(7, Math.ceil((Math.max(...dated) - Math.min(...dated)) / 86_400_000) + 1) : 7;
  const weeks = Math.min(6, Math.max(1, spanDays / 7));
  const durations = recent.map((item) => item.durationMinutes).filter((value): value is number => finite(value) && value > 0 && value < 240);
  return {
    sessions: recent.length,
    weeks: Math.round(weeks * 10) / 10,
    weeklyFrequency: Math.round((recent.length / weeks) * 10) / 10,
    averageDuration: durations.length ? Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length) : 0,
  };
}

export function decideExerciseProgression(exerciseId: string, history: TrainingHistoryLike[], repRange?: string, targetRir = 2): ExerciseProgressionDecision {
  const samples = recordsForExercise(history, exerciseId).slice(0, 4);
  const inferredRepRange = repRange || samples.find(({ record }) => record.targetRepRange)?.record.targetRepRange;
  const state = buildExerciseState({ exerciseId, history, repRange: inferredRepRange, targetRir });
  const decisionBase = { exerciseId, affectedEntity: exerciseId, source: "exercise" as const };
  if (state.suggestedAction === "safety_adjustment" || state.suggestedAction === "recover" || state.suggestedAction === "reduce") return { ...decisionBase, action: "reduce", confidence: state.confidenceScore >= 72 ? "high" : state.confidenceScore >= 38 ? "medium" : "low", score: 30, reasons: state.reasons };
  if (state.suggestedAction === "progress" && state.suggestedLoad !== null && state.suggestedLoad !== state.currentLoadReference) return { ...decisionBase, action: "progress", confidence: state.confidenceScore >= 72 ? "high" : state.confidenceScore >= 38 ? "medium" : "low", score: 82, suggestedLoad: state.suggestedLoad, reasons: state.reasons };
  const confidence = confidenceFromScore(clamp(samples.length / 4, 0, 1));
  if (samples.length < 3) return { ...decisionBase, action: "maintain", confidence, score: 50, reasons: ["Mantivemos a referência porque ainda são necessárias três execuções comparáveis."] };

  const valid = samples.filter(({ record }) => finite(record.load) && record.load > 0 && finite(record.repetitions) && record.repetitions > 0);
  const painful = samples.filter(({ session, record }) => record.painReported || (finite(session.painScore) && session.painScore >= 4)).length;
  const incomplete = samples.filter(({ record }) => record.setsCompleted < Math.max(1, record.setsPlanned)).length;
  const hard = samples.filter(({ session, record }) => (finite(record.rirOrRpe) && record.rirOrRpe <= 1) || (finite(session.sessionRpe) && session.sessionRpe >= 9)).length;

  if (painful >= 2 || incomplete >= 3 || hard >= 3) {
    return { ...decisionBase, action: "reduce", confidence, score: 32, reasons: [painful >= 2 ? "Dor recorrente foi registrada recentemente neste exercício." : incomplete >= 3 ? "As séries planejadas ficaram incompletas repetidamente." : "O esforço recente ficou alto demais para progredir com segurança."] };
  }

  return { ...decisionBase, action: "maintain", confidence, score: valid.length >= 3 ? 62 : 58, reasons: [inferredRepRange ? "Mantivemos a carga até todas as séries alcançarem o topo da faixa com esforço adequado." : "Mantivemos a carga porque o histórico ainda não informa uma faixa de repetições comparável."] };
}

export function decideVolume(history: TrainingHistoryLike[]): AdaptiveDecision {
  const sessions = attended(history).slice(0, 8);
  const confidence = confidenceFromScore(clamp(sessions.length / 8, 0, 1));
  const base = { source: "session" as const, affectedEntity: "weekly-volume" };
  if (sessions.length < 4) return { ...base, action: "maintain", confidence, score: 50, reasons: ["O volume foi mantido porque ainda há menos de quatro sessões comparáveis."] };
  const quality = sessions.map((item) => item.sessionQualityScore ?? calculateSessionQuality({ exercises: (item.exerciseRecords || []).map((record, index) => ({ priority: record.priority || (index < 2 ? "A" : index < 5 ? "B" : "C"), completed: record.setsCompleted >= record.setsPlanned })), effectiveSetsPerformed: (item.exerciseRecords || []).reduce((sum, record) => sum + record.setsCompleted, 0), effectiveSetsPrescribed: (item.exerciseRecords || []).reduce((sum, record) => sum + record.setsPlanned, 0), painScore: item.painScore, symptoms: item.symptoms, durationMinutes: item.durationMinutes }).score / 100);
  const averageCompletion = quality.length ? quality.reduce((sum, value) => sum + value, 0) / quality.length : 0.75;
  const highEffort = sessions.filter((item) => finite(item.sessionRpe) && item.sessionRpe >= 9).length;
  const recurringPain = sessions.filter((item) => finite(item.painScore) && item.painScore >= 4).length;
  const poorRecovery = sessions.filter((item) => isPoorRecovery(item.recovery24h)).length;
  if (averageCompletion < 0.65 || highEffort >= 3 || recurringPain >= 2 || poorRecovery >= 3) return { ...base, action: "reduce", confidence, score: 35, reasons: [recurringPain >= 2 ? "Reduzimos uma série porque houve dor recorrente nas sessões recentes." : "Reduzimos levemente o volume porque conclusão, esforço ou recuperação pioraram de forma repetida."] };
  if (sessions.length >= 6 && averageCompletion >= 0.9 && highEffort === 0 && recurringPain === 0 && poorRecovery === 0) return { ...base, action: "progress", confidence, score: 80, reasons: ["Aumentamos uma série em exercícios prioritários porque seis sessões tiveram alta conclusão, recuperação estável e ausência de dor recorrente."] };
  return { ...base, action: "maintain", confidence, score: 62, reasons: ["Mantivemos o volume: a resposta recente está adequada, mas ainda não justifica progressão adicional."] };
}

export function learnExercisePreferences(history: TrainingHistoryLike[]): LearnedExercisePreference[] {
  const sessions = attended(history).slice(0, 20);
  const map = new Map<string, { targets: Map<string, number>; substitutions: number; skips: number; pain: number }>();
  for (const session of sessions) {
    for (const record of session.exerciseRecords || []) {
      const current = map.get(record.exerciseId) || { targets: new Map<string, number>(), substitutions: 0, skips: 0, pain: 0 };
      if (record.substitutedExerciseId) {
        current.substitutions += 1;
        current.targets.set(record.substitutedExerciseId, (current.targets.get(record.substitutedExerciseId) || 0) + 1);
      }
      if (record.setsCompleted === 0) current.skips += 1;
      if (record.painReported) current.pain += 1;
      map.set(record.exerciseId, current);
    }
  }
  return [...map.entries()].map(([fromExerciseId, value]) => {
    const preferred = [...value.targets.entries()].sort((a, b) => b[1] - a[1])[0];
    const evidence = Math.max(value.substitutions, value.skips, value.pain);
    return {
      fromExerciseId,
      preferredExerciseId: preferred && preferred[1] >= 3 ? preferred[0] : undefined,
      substitutions: value.substitutions,
      skips: value.skips,
      recentPainEvents: value.pain,
      confidence: confidenceFromScore(clamp(evidence / 4, 0, 1)),
    };
  }).filter((item) => item.substitutions >= 2 || item.skips >= 3 || item.recentPainEvents >= 2);
}

export function calculateCycleReadiness(history: TrainingHistoryLike[], plannedFrequency: number): AdaptiveDecision {
  const sessions = attended(history).slice(0, 12);
  const confidence = confidenceFromScore(clamp(sessions.length / 12, 0, 1));
  const base = { source: "cycle" as const, affectedEntity: "current-cycle", loop: "slow" as const };
  if (sessions.length < 6) return { ...base, action: "maintain", confidence, score: 50, reasons: ["O ciclo permanece estável até reunir pelo menos seis sessões."] };
  const completionValues = sessions.map(completionRatio).filter((value): value is number => value !== null);
  const completion = completionValues.length ? completionValues.reduce((sum, value) => sum + value, 0) / completionValues.length : 0.7;
  const behavior = actualTrainingBehavior(sessions);
  const adherence = clamp(behavior.weeklyFrequency / Math.max(1, plannedFrequency), 0, 1);
  const records = sessions.flatMap((item) => item.exerciseRecords || []);
  const performance = records.length ? records.filter((item) => item.setsCompleted >= item.setsPlanned).length / records.length : completion;
  const qualityValues = sessions.map((item) => item.sessionQualityScore).filter((value): value is number => finite(value));
  const sessionQuality = qualityValues.length ? qualityValues.reduce((sum, value) => sum + value, 0) / qualityValues.length / 100 : completion;
  const recovery = 1 - clamp(sessions.filter((item) => isPoorRecovery(item.recovery24h)).length / Math.max(1, sessions.length / 3), 0, 1);
  const effort = 1 - clamp(sessions.filter((item) => finite(item.sessionRpe) && item.sessionRpe >= 9).length / Math.max(1, sessions.length / 3), 0, 1);
  const pain = 1 - clamp(sessions.filter((item) => finite(item.painScore) && item.painScore >= 4).length / Math.max(1, sessions.length / 3), 0, 1);
  const score = Math.round((adherence * 0.25 + completion * 0.15 + performance * 0.15 + sessionQuality * 0.1 + recovery * 0.15 + effort * 0.1 + pain * 0.1) * 100);
  if (score >= 75) return { ...base, action: "progress", confidence, score, reasons: ["O ciclo pode progredir: aderência, conclusão, desempenho e recuperação superaram o limite de 75 pontos."] };
  if (score < 50) return { ...base, action: "reduce", confidence, score, reasons: ["O próximo bloco será de recuperação porque o score de prontidão ficou abaixo de 50 pontos."] };
  return { ...base, action: "maintain", confidence, score, reasons: ["O ciclo será mantido para consolidar o resultado antes de progredir."] };
}

function declaredDuration(profile: ProfileForGeneration): number {
  return Number.parseInt(profile.duration || "", 10) || 45;
}

export function buildAdaptivePlan(profile: ProfileForGeneration, history: TrainingHistoryLike[], now = new Date()): AdaptivePlan {
  const confidence = algorithmConfidence(history);
  const behavior = actualTrainingBehavior(history, now);
  const declaredDays = Math.max(1, profile.days?.length || 3);
  const declaredMinutes = declaredDuration(profile);
  const canAdaptSchedule = behavior.sessions >= 6;
  const weight = confidence.level === "high" ? 0.75 : confidence.level === "medium" ? 0.5 : 0.25;
  const observedDays = clamp(Math.round(behavior.weeklyFrequency || declaredDays), 1, 6);
  const effectiveDays = canAdaptSchedule ? clamp(Math.round(declaredDays * (1 - weight) + observedDays * weight), 1, 6) : declaredDays;
  const observedDuration = behavior.averageDuration || declaredMinutes;
  const effectiveDurationMinutes = canAdaptSchedule ? clamp(Math.round((declaredMinutes * (1 - weight) + observedDuration * weight) / 5) * 5, 20, 90) : declaredMinutes;
  const volume = decideVolume(history);
  const cycle = calculateCycleReadiness(history, effectiveDays);
  const reasons = [...confidence.reasons];
  if (canAdaptSchedule && effectiveDays !== declaredDays) reasons.push(`Ajustamos o próximo ciclo para ${effectiveDays} dias porque sua frequência real recente foi ${behavior.weeklyFrequency.toFixed(1)} por semana.`);
  if (canAdaptSchedule && Math.abs(effectiveDurationMinutes - declaredMinutes) >= 5) reasons.push(`Priorizamos sessões de cerca de ${effectiveDurationMinutes} minutos com base na duração das últimas sessões.`);
  reasons.push(...volume.reasons, ...cycle.reasons);
  return { effectiveDays, effectiveDurationMinutes, volume, cycle, confidence: confidence.level, confidenceScore: confidence.score, reasons: [...new Set(reasons)], preferences: learnExercisePreferences(history), calibrationStatus: confidence.level === "high" && attended(history).length >= 8 ? "calibrated" : "calibrating" };
}
