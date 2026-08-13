import type { ProfileForGeneration } from "../workout-engine";
import type { ExercisePerformanceRecord, TrainingHistoryLike } from "../training-intelligence";

export type AlgorithmConfidence = "low" | "medium" | "high";
export type AdaptiveAction = "increase" | "maintain" | "reduce";

export type AdaptiveDecision = {
  action: AdaptiveAction;
  confidence: AlgorithmConfidence;
  score: number;
  reasons: string[];
};

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

export function decideExerciseProgression(exerciseId: string, history: TrainingHistoryLike[]): ExerciseProgressionDecision {
  const samples = recordsForExercise(history, exerciseId).slice(0, 4);
  const confidence = confidenceFromScore(clamp(samples.length / 4, 0, 1));
  if (samples.length < 3) return { exerciseId, action: "maintain", confidence, score: 50, reasons: ["Mantivemos a referência porque ainda são necessárias três execuções comparáveis."] };

  const valid = samples.filter(({ record }) => finite(record.load) && record.load > 0 && finite(record.repetitions) && record.repetitions > 0);
  const painful = samples.filter(({ session, record }) => record.painReported || (finite(session.painScore) && session.painScore >= 4)).length;
  const incomplete = samples.filter(({ record }) => record.setsCompleted < Math.max(1, record.setsPlanned)).length;
  const hard = samples.filter(({ session, record }) => (finite(record.rirOrRpe) && record.rirOrRpe <= 1) || (finite(session.sessionRpe) && session.sessionRpe >= 9)).length;

  if (painful >= 2 || incomplete >= 3 || hard >= 3) {
    return { exerciseId, action: "reduce", confidence, score: 32, reasons: [painful >= 2 ? "Dor recorrente foi registrada recentemente neste exercício." : incomplete >= 3 ? "As séries planejadas ficaram incompletas repetidamente." : "O esforço recente ficou alto demais para progredir com segurança."] };
  }

  if (valid.length >= 3) {
    const recent = valid.slice(0, 3);
    const sameLoad = Math.max(...recent.map(({ record }) => record.load!)) - Math.min(...recent.map(({ record }) => record.load!)) <= 0.01;
    const repTrend = recent[0].record.repetitions! >= recent[1].record.repetitions! && recent[1].record.repetitions! >= recent[2].record.repetitions!;
    const adequateRir = recent.every(({ record }) => !finite(record.rirOrRpe) || record.rirOrRpe >= 2);
    const complete = recent.every(({ record }) => record.setsCompleted >= record.setsPlanned);
    if (sameLoad && repTrend && adequateRir && complete) {
      const load = recent[0].record.load!;
      const increment = load < 20 ? 1 : load < 60 ? 2 : 2.5;
      return { exerciseId, action: "increase", confidence, score: 82, suggestedLoad: Math.round((load + increment) * 2) / 2, reasons: ["Aumentamos a referência porque três sessões mantiveram ou elevaram repetições com séries completas e margem adequada."] };
    }
  }
  return { exerciseId, action: "maintain", confidence, score: 58, reasons: ["Mantivemos a carga de referência para consolidar repetições, técnica e esforço antes do próximo aumento."] };
}

export function decideVolume(history: TrainingHistoryLike[]): AdaptiveDecision {
  const sessions = attended(history).slice(0, 8);
  const confidence = confidenceFromScore(clamp(sessions.length / 8, 0, 1));
  if (sessions.length < 4) return { action: "maintain", confidence, score: 50, reasons: ["O volume foi mantido porque ainda há menos de quatro sessões comparáveis."] };
  const completion = sessions.map(completionRatio).filter((value): value is number => value !== null);
  const averageCompletion = completion.length ? completion.reduce((sum, value) => sum + value, 0) / completion.length : 0.75;
  const highEffort = sessions.filter((item) => finite(item.sessionRpe) && item.sessionRpe >= 9).length;
  const recurringPain = sessions.filter((item) => finite(item.painScore) && item.painScore >= 4).length;
  const poorRecovery = sessions.filter((item) => ["Piorou", "Muito cansada"].includes(item.recovery24h || "")).length;
  if (averageCompletion < 0.65 || highEffort >= 3 || recurringPain >= 2 || poorRecovery >= 3) return { action: "reduce", confidence, score: 35, reasons: [recurringPain >= 2 ? "Reduzimos uma série porque houve dor recorrente nas sessões recentes." : "Reduzimos levemente o volume porque conclusão, esforço ou recuperação pioraram de forma repetida."] };
  if (sessions.length >= 6 && averageCompletion >= 0.9 && highEffort === 0 && recurringPain === 0 && poorRecovery === 0) return { action: "increase", confidence, score: 80, reasons: ["Aumentamos uma série em exercícios prioritários porque seis sessões tiveram alta conclusão, recuperação estável e ausência de dor recorrente."] };
  return { action: "maintain", confidence, score: 62, reasons: ["Mantivemos o volume: a resposta recente está adequada, mas ainda não justifica progressão adicional."] };
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
  if (sessions.length < 6) return { action: "maintain", confidence, score: 50, reasons: ["O ciclo permanece estável até reunir pelo menos seis sessões."] };
  const completionValues = sessions.map(completionRatio).filter((value): value is number => value !== null);
  const completion = completionValues.length ? completionValues.reduce((sum, value) => sum + value, 0) / completionValues.length : 0.7;
  const behavior = actualTrainingBehavior(sessions);
  const adherence = clamp(behavior.weeklyFrequency / Math.max(1, plannedFrequency), 0, 1);
  const records = sessions.flatMap((item) => item.exerciseRecords || []);
  const performance = records.length ? records.filter((item) => item.setsCompleted >= item.setsPlanned).length / records.length : completion;
  const recovery = 1 - clamp(sessions.filter((item) => ["Piorou", "Muito cansada"].includes(item.recovery24h || "")).length / Math.max(1, sessions.length / 3), 0, 1);
  const effort = 1 - clamp(sessions.filter((item) => finite(item.sessionRpe) && item.sessionRpe >= 9).length / Math.max(1, sessions.length / 3), 0, 1);
  const pain = 1 - clamp(sessions.filter((item) => finite(item.painScore) && item.painScore >= 4).length / Math.max(1, sessions.length / 3), 0, 1);
  const score = Math.round((adherence * 0.25 + completion * 0.2 + performance * 0.2 + recovery * 0.15 + effort * 0.1 + pain * 0.1) * 100);
  if (score >= 75) return { action: "increase", confidence, score, reasons: ["O ciclo pode progredir: aderência, conclusão, desempenho e recuperação superaram o limite de 75 pontos."] };
  if (score < 50) return { action: "reduce", confidence, score, reasons: ["O próximo bloco será de recuperação porque o score de prontidão ficou abaixo de 50 pontos."] };
  return { action: "maintain", confidence, score, reasons: ["O ciclo será mantido para consolidar o resultado antes de progredir."] };
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
  return { effectiveDays, effectiveDurationMinutes, volume, cycle, confidence: confidence.level, confidenceScore: confidence.score, reasons: [...new Set(reasons)], preferences: learnExercisePreferences(history) };
}
