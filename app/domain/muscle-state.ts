import type { TrainingHistoryLike } from "../training-intelligence.ts";
import { analyzePerformanceTrend } from "./performance-trend.ts";
import { isPoorRecovery } from "./recovery.ts";
import { clamp, confidenceFromScore, type FatigueTrend, type PainTrend, type PerformanceTrend, type RecoveryTrend } from "./types.ts";

export type MuscleState = {
  muscleGroup: string;
  prescribedWeeklySets: number;
  performedWeeklySets: number;
  estimatedProductiveMin: number;
  estimatedProductiveMax: number;
  performanceTrend: PerformanceTrend;
  fatigueTrend: FatigueTrend;
  recoveryTrend: RecoveryTrend;
  painTrend: PainTrend;
  toleranceScore: number;
  confidenceScore: number;
  stimulusScore: number;
  fatigueCost: number;
  lastVolumeChange: string | null;
  reasons: string[];
};

export function buildMuscleState(options: { muscleGroup: string; history: TrainingHistoryLike[]; prescribedWeeklySets: number; now?: Date }): MuscleState {
  const now = options.now || new Date();
  const cutoff = now.getTime() - 42 * 86_400_000;
  const sessions = options.history.filter((item) => new Date(item.completedAt).getTime() >= cutoff).sort((left, right) => new Date(left.completedAt).getTime() - new Date(right.completedAt).getTime());
  const exposures = sessions.flatMap((session) => (session.exerciseRecords || []).filter((record) => [record.primaryMuscleGroup, ...(record.muscleGroups || [])].filter(Boolean).includes(options.muscleGroup)).map((record) => ({ session, record })));
  const weeklySets = new Map<string, number>();
  const weeklyPrescribed = new Map<string, number>();
  const weeklyRecords = new Map<string, typeof exposures>();
  for (const { session, record } of exposures) {
    const date = new Date(session.completedAt);
    const week = `${date.getUTCFullYear()}-${Math.floor((date.getTime() - Date.UTC(date.getUTCFullYear(), 0, 1)) / (7 * 86_400_000))}`;
    weeklySets.set(week, (weeklySets.get(week) || 0) + record.setsCompleted);
    weeklyPrescribed.set(week, (weeklyPrescribed.get(week) || 0) + record.setsPlanned);
    weeklyRecords.set(week, [...(weeklyRecords.get(week) || []), { session, record }]);
  }
  const volumes = [...weeklySets.values()];
  const performance = analyzePerformanceTrend(exposures.map(({ session, record }) => ({ recordedAt: session.completedAt, load: record.load, repetitions: record.repetitions, completedRatio: record.setsCompleted / Math.max(1, record.setsPlanned) })));
  const poorRecovery = sessions.filter((session) => isPoorRecovery(session.recovery24h)).length;
  const painCount = exposures.filter(({ session, record }) => record.painReported || (session.painScore || 0) >= 4).length;
  const fatigueTrend: FatigueTrend = performance.trend === "declining" && poorRecovery >= 2 ? "high" : poorRecovery === 0 && exposures.length >= 3 ? "low" : exposures.length ? "normal" : "unknown";
  const recoveryTrend: RecoveryTrend = poorRecovery >= 2 ? "worsening" : sessions.some((session) => session.recovery24h) ? "stable" : "unknown";
  const painTrend: PainTrend = painCount >= 2 ? "recurring" : painCount === 1 ? "isolated" : "none";
  const confidenceScore = Math.round(clamp(exposures.length / 12 * 0.6 + volumes.length / 5 * 0.4) * 100);
  const weekEntries = [...weeklyRecords.entries()];
  const weeklyPerformance = weekEntries.map(([, records]) => {
    const scores = records.map(({ record }) => {
      const completion = record.setsCompleted / Math.max(1, record.setsPlanned);
      if (record.load > 0 && record.repetitions > 0) return record.load * record.repetitions * completion;
      return record.repetitions > 0 ? record.repetitions * completion : completion * 100;
    });
    return scores.length ? scores.reduce((sum, value) => sum + value, 0) / scores.length : 0;
  });
  const productiveVolumes = weekEntries.flatMap(([week, records], index) => {
    const recovered = !records.some(({ session }) => isPoorRecovery(session.recovery24h));
    const painFree = !records.some(({ session, record }) => record.painReported || (session.painScore || 0) >= 4);
    const previousScore = weeklyPerformance[index - 1];
    const responseMaintained = previousScore === undefined || weeklyPerformance[index] >= previousScore * 0.98;
    return recovered && painFree && responseMaintained ? [weeklySets.get(week) || 0] : [];
  });
  const seed = Math.max(2, options.prescribedWeeklySets || 6);
  const estimatedProductiveMin = productiveVolumes.length >= 2 ? Math.max(2, Math.min(...productiveVolumes)) : Math.max(2, seed - 2);
  const estimatedProductiveMax = productiveVolumes.length >= 2 ? Math.max(estimatedProductiveMin, Math.max(...productiveVolumes)) : seed + 2;
  const performedWeeklySets = volumes.at(-1) || 0;
  const volumeEntries = [...weeklyPrescribed.entries()];
  const lastVolumeChange = (() => {
    for (let index = volumeEntries.length - 1; index >= 1; index -= 1) if (volumeEntries[index][1] !== volumeEntries[index - 1][1]) return sessions.find((session) => {
      const date = new Date(session.completedAt);
      return `${date.getUTCFullYear()}-${Math.floor((date.getTime() - Date.UTC(date.getUTCFullYear(), 0, 1)) / (7 * 86_400_000))}` === volumeEntries[index][0];
    })?.completedAt || null;
    return null;
  })();
  const reasons = !exposures.length ? ["Usamos uma faixa inicial conservadora até existir resposta individual."]
    : fatigueTrend === "high" ? ["O limite superior foi contido porque desempenho e recuperação pioraram juntos."]
      : confidenceFromScore(confidenceScore / 100) === "low" ? ["A faixa produtiva ainda tem baixa confiança e será ajustada em pequenos passos."]
        : ["A faixa produtiva reflete o volume associado à resposta recente deste grupo muscular."];
  return {
    muscleGroup: options.muscleGroup,
    prescribedWeeklySets: options.prescribedWeeklySets,
    performedWeeklySets,
    estimatedProductiveMin,
    estimatedProductiveMax,
    performanceTrend: performance.trend,
    fatigueTrend,
    recoveryTrend,
    painTrend,
    toleranceScore: Math.round(clamp(1 - poorRecovery / Math.max(1, sessions.length) * 0.5 - painCount / Math.max(1, exposures.length) * 0.5) * 100),
    confidenceScore,
    stimulusScore: Math.round(clamp(performance.trend === "improving" ? 0.85 : performance.trend === "stable" ? 0.65 : 0.4) * 100),
    fatigueCost: Math.round(clamp(fatigueTrend === "high" ? 0.9 : fatigueTrend === "normal" ? 0.55 : fatigueTrend === "low" ? 0.3 : 0.5) * 100),
    lastVolumeChange,
    reasons,
  };
}
