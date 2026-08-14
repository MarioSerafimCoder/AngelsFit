import type { ExercisePerformanceRecord, TrainingHistoryLike } from "../training-intelligence.ts";
import { analyzePerformanceTrend, type PerformanceSample } from "./performance-trend.ts";
import { isPoorRecovery } from "./recovery.ts";
import { decideAdaptiveAction } from "./decision-engine.ts";
import { clamp, confidenceFromScore, type AdaptiveDecision, type FatigueTrend, type PainTrend, type PerformanceTrend } from "./types.ts";

export type PlateauStatus = "none" | "possible" | "confirmed" | "fatigue_likely";

export type ExerciseState = {
  exerciseId: string;
  currentLoadReference: number | null;
  repRange: { minimum: number; maximum: number } | null;
  targetRir: number | null;
  performanceTrend: PerformanceTrend;
  fatigueTrend: FatigueTrend;
  painTrend: PainTrend;
  lastProgressionAt: string | null;
  successfulSessions: number;
  failedSessions: number;
  preferenceScore: number;
  toleranceScore: number;
  confidenceScore: number;
  plateauStatus: PlateauStatus;
  recentExposureCount: number;
  suggestedAction: AdaptiveDecision["action"];
  suggestedLoad: number | null;
  reasons: string[];
  memory: { last: number | null; average3: number | null; average5: number | null; recentBest: number | null };
};

type Exposure = { session: TrainingHistoryLike; record: ExercisePerformanceRecord };

function finite(value: unknown): value is number { return typeof value === "number" && Number.isFinite(value); }

export function parseRepRange(value?: string): { minimum: number; maximum: number } | null {
  const values = value?.match(/\d+/g)?.map(Number) || [];
  if (!values.length) return null;
  return { minimum: Math.min(...values), maximum: Math.max(...values) };
}

function exerciseExposures(exerciseId: string, history: TrainingHistoryLike[]): Exposure[] {
  return history.flatMap((session) => (session.exerciseRecords || [])
    .filter((record) => record.exerciseId === exerciseId || record.plannedExerciseId === exerciseId)
    .map((record) => ({ session, record })))
    .sort((left, right) => new Date(right.session.completedAt).getTime() - new Date(left.session.completedAt).getTime());
}

function representativeRepetitions(record?: ExercisePerformanceRecord): number | undefined {
  if (!record) return undefined;
  const setReps = (record.sets || []).filter((set) => set.completed && set.repetitions > 0).map((set) => set.repetitions);
  return setReps.length ? setReps.reduce((sum, value) => sum + value, 0) / setReps.length : finite(record.repetitions) && record.repetitions > 0 ? record.repetitions : undefined;
}

function representativeLoad(record?: ExercisePerformanceRecord): number | undefined {
  if (!record) return undefined;
  const setLoads = (record.sets || []).filter((set) => set.completed && set.loadKg > 0 && !["assistencia", "peso_corporal"].includes(set.loadType)).map((set) => set.loadKg);
  return setLoads.length ? setLoads.reduce((sum, value) => sum + value, 0) / setLoads.length : finite(record.load) && record.load > 0 ? record.load : undefined;
}

function representativeRir(exposure: Exposure): number | undefined {
  const setRir = (exposure.record.sets || []).filter((set) => set.completed && finite(set.rir)).map((set) => set.rir as number);
  if (setRir.length) return setRir.reduce((sum, value) => sum + value, 0) / setRir.length;
  return finite(exposure.record.rirOrRpe) ? exposure.record.rirOrRpe : finite(exposure.session.averageRir) ? exposure.session.averageRir : undefined;
}

function loadIncrement(load: number): number {
  if (load < 10) return 0.5;
  if (load < 20) return 1;
  if (load < 60) return 2;
  if (load < 120) return 2.5;
  return 5;
}

function detectFatigue(exposures: Exposure[], performance: PerformanceTrend): FatigueTrend {
  const recent = exposures.slice(0, 4);
  const highEffort = recent.filter(({ session, record }) => (session.sessionRpe || 0) >= 9 || (finite(record.rirOrRpe) && record.rirOrRpe <= 0)).length;
  const poorRecovery = recent.filter(({ session }) => isPoorRecovery(session.recovery24h)).length;
  const incomplete = recent.filter(({ record }) => record.setsCompleted < Math.max(1, record.setsPlanned)).length;
  if (!recent.length) return "unknown";
  if ((performance === "declining" && highEffort + poorRecovery >= 2) || highEffort >= 3 || poorRecovery >= 3 || incomplete >= 3) return "high";
  if (recent.length >= 3 && highEffort === 0 && poorRecovery === 0 && incomplete === 0) return "low";
  return "normal";
}

function detectPain(exposures: Exposure[]): PainTrend {
  const pain = exposures.slice(0, 5).map(({ session, record }) => record.painReported || (session.painScore || 0) >= 4);
  const count = pain.filter(Boolean).length;
  if (!count) return "none";
  if (count === 1) return "isolated";
  return pain[0] && pain[1] ? "worsening" : "recurring";
}

export function calculateExerciseAffinity(exposures: Exposure[], available = true): number {
  if (!exposures.length) return available ? 50 : 20;
  const recent = exposures.slice(0, 8);
  const adherence = recent.reduce((sum, { record }) => sum + clamp(record.setsCompleted / Math.max(1, record.setsPlanned)), 0) / recent.length;
  const pain = recent.filter(({ session, record }) => record.painReported || (session.painScore || 0) >= 4).length / recent.length;
  const substitutions = recent.filter(({ record }) => Boolean(record.substitutedExerciseId)).length / recent.length;
  const adequate = recent.filter(({ record }) => record.executionFeedback !== "limited").length / recent.length;
  const performance = analyzePerformanceTrend(recent.map(({ session, record }) => ({ recordedAt: session.completedAt, load: representativeLoad(record), repetitions: representativeRepetitions(record), completedRatio: record.setsCompleted / Math.max(1, record.setsPlanned) }))).trend;
  const performanceScore = performance === "improving" ? 1 : performance === "stable" || performance === "plateau" ? 0.7 : performance === "oscillating" ? 0.5 : 0.25;
  return Math.round(clamp(adherence * 0.35 + adequate * 0.2 + performanceScore * 0.15 + (available ? 0.1 : 0) + (1 - pain) * 0.15 + (1 - substitutions) * 0.05) * 100);
}

export function buildExerciseState(options: { exerciseId: string; history: TrainingHistoryLike[]; repRange?: string; targetRir?: number; now?: Date; available?: boolean }): ExerciseState {
  const exposures = exerciseExposures(options.exerciseId, options.history);
  const recent = exposures.slice(0, 5);
  const samples: PerformanceSample[] = exposures.map(({ session, record }) => ({
    recordedAt: session.completedAt,
    load: representativeLoad(record),
    repetitions: representativeRepetitions(record),
    completedRatio: record.setsCompleted / Math.max(1, record.setsPlanned),
    rir: representativeRir({ session, record }),
    sessionRpe: session.sessionRpe,
  }));
  const performance = analyzePerformanceTrend(samples);
  const fatigue = detectFatigue(exposures, performance.trend);
  const pain = detectPain(exposures);
  const successfulSessions = recent.filter(({ record }) => record.setsCompleted >= record.setsPlanned && record.executionFeedback !== "limited").length;
  const failedSessions = recent.filter(({ record }) => record.setsCompleted < record.setsPlanned || record.executionFeedback === "limited").length;
  const fieldCoverage = recent.length ? recent.reduce((sum, exposure) => sum + Number(finite(representativeLoad(exposure.record))) + Number(finite(representativeRepetitions(exposure.record))) + Number(finite(representativeRir(exposure))), 0) / (recent.length * 3) : 0;
  const confidenceScore = Math.round(clamp(recent.length / 5 * 0.65 + fieldCoverage * 0.35) * 100);
  const confidence = confidenceFromScore(confidenceScore / 100);
  const cooldownActive = (() => {
    const ordered = [...exposures].reverse();
    for (let index = ordered.length - 1; index >= 1; index -= 1) {
      const previous = representativeLoad(ordered[index - 1].record);
      const current = representativeLoad(ordered[index].record);
      if (finite(previous) && finite(current) && Math.abs(current - previous) > 0.01) return ordered.length - 1 - index < 2;
    }
    return false;
  })();
  const lastProgressionAt = (() => {
    const ordered = [...exposures].reverse();
    for (let index = ordered.length - 1; index >= 1; index -= 1) {
      const previous = representativeLoad(ordered[index - 1].record);
      const current = representativeLoad(ordered[index].record);
      if (finite(previous) && finite(current) && current > previous) return ordered[index].session.completedAt;
    }
    return null;
  })();
  const decision = decideAdaptiveAction({ affectedEntity: options.exerciseId, source: "exercise", performance: performance.trend, fatigue, pain, confidence, cooldownActive });
  const repRange = parseRepRange(options.repRange);
  const currentLoadReference = representativeLoad(exposures[0]?.record) ?? null;
  const recentLoads = recent.slice(0, 3).map((exposure) => representativeLoad(exposure.record)).filter(finite);
  const stableLoad = recentLoads.length === 3 && Math.max(...recentLoads) - Math.min(...recentLoads) <= 0.01;
  const progressionEvidence = Boolean(repRange && recent.length >= 3 && recent.slice(0, 3).every((exposure, index) => {
    const completedSets = (exposure.record.sets || []).filter((set) => set.completed);
    const representative = representativeRepetitions(exposure.record) || 0;
    const latestReachedTop = index > 0 || (completedSets.length
      ? completedSets.length >= exposure.record.setsPlanned && completedSets.every((set) => set.repetitions >= repRange.maximum)
      : representative >= repRange.maximum);
    const rir = representativeRir(exposure);
    return latestReachedTop && representative >= repRange.minimum && exposure.record.setsCompleted >= exposure.record.setsPlanned && exposure.record.executionFeedback !== "limited" && finite(rir) && rir >= (options.targetRir ?? 2) && !exposure.record.painReported;
  }) && stableLoad && recent.slice(0, 3).every((exposure, index, values) => index === values.length - 1 || (representativeRepetitions(exposure.record) || 0) >= (representativeRepetitions(values[index + 1].record) || 0)));
  const suggestedAction = progressionEvidence && pain !== "recurring" && pain !== "worsening" && fatigue !== "high" && confidence !== "low" && !cooldownActive ? "progress" : decision.action;
  const suggestedLoad = progressionEvidence && suggestedAction === "progress" && currentLoadReference !== null ? Math.round((currentLoadReference + loadIncrement(currentLoadReference)) * 2) / 2 : currentLoadReference;
  const plateauStatus: PlateauStatus = fatigue === "high" && performance.trend === "declining" ? "fatigue_likely" : performance.trend === "plateau" && recent.length >= 4 ? "confirmed" : performance.trend === "stable" && recent.length >= 3 ? "possible" : "none";
  const reasons = [...decision.reasons];
  if (progressionEvidence && suggestedAction === "progress") reasons.unshift("Sugerimos o menor aumento de carga porque três exposições evoluíram até o topo da faixa, com séries completas e RIR adequado.");
  else if (recent.length < 3) reasons.unshift("Não aumentamos a carga com menos de três exposições comparáveis.");
  if (pain === "isolated") reasons.push("Uma ocorrência isolada de dor foi observada sem banir automaticamente o exercício.");
  return {
    exerciseId: options.exerciseId,
    currentLoadReference,
    repRange,
    targetRir: options.targetRir ?? null,
    performanceTrend: performance.trend,
    fatigueTrend: fatigue,
    painTrend: pain,
    lastProgressionAt,
    successfulSessions,
    failedSessions,
    preferenceScore: calculateExerciseAffinity(exposures, options.available),
    toleranceScore: Math.round(clamp(1 - failedSessions / Math.max(1, recent.length) * 0.45 - recent.filter(({ record }) => record.painReported).length / Math.max(1, recent.length) * 0.55) * 100),
    confidenceScore,
    plateauStatus,
    recentExposureCount: recent.length,
    suggestedAction,
    suggestedLoad,
    reasons: [...new Set(reasons)],
    memory: { last: performance.last, average3: performance.average3, average5: performance.average5, recentBest: performance.recentBest },
  };
}
