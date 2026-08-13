import type { PerformanceTrend } from "./types.ts";

export type PerformanceSample = {
  recordedAt: string;
  load?: number;
  repetitions?: number;
  completedRatio?: number;
  rir?: number;
  sessionRpe?: number;
};

export type PerformanceTrendAnalysis = {
  trend: PerformanceTrend;
  exposureCount: number;
  last: number | null;
  average3: number | null;
  average5: number | null;
  recentBest: number | null;
  slope: number;
  reasons: string[];
};

function mean(values: number[]): number | null {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function performanceScore(sample: PerformanceSample): number | null {
  const load = typeof sample.load === "number" && sample.load > 0 ? sample.load : null;
  const repetitions = typeof sample.repetitions === "number" && sample.repetitions > 0 ? sample.repetitions : null;
  const completion = typeof sample.completedRatio === "number" ? Math.min(1, Math.max(0, sample.completedRatio)) : 1;
  if (load !== null && repetitions !== null) return load * repetitions * completion;
  if (repetitions !== null) return repetitions * completion;
  return typeof sample.completedRatio === "number" ? completion * 100 : null;
}

export function analyzePerformanceTrend(samples: PerformanceSample[]): PerformanceTrendAnalysis {
  const ordered = [...samples]
    .sort((left, right) => new Date(left.recordedAt).getTime() - new Date(right.recordedAt).getTime())
    .map((sample) => ({ sample, score: performanceScore(sample) }))
    .filter((item): item is { sample: PerformanceSample; score: number } => item.score !== null && Number.isFinite(item.score));
  const scores = ordered.map((item) => item.score);
  const recent = scores.slice(-5);
  const average3 = mean(scores.slice(-3));
  const average5 = mean(recent);
  const last = scores.at(-1) ?? null;
  const best = recent.length ? Math.max(...recent) : null;
  if (scores.length < 2) return { trend: "stable", exposureCount: scores.length, last, average3, average5, recentBest: best, slope: 0, reasons: ["Ainda há poucas exposições comparáveis; mantivemos a referência."] };

  const firstHalf = recent.slice(0, Math.ceil(recent.length / 2));
  const secondHalf = recent.slice(Math.floor(recent.length / 2));
  const baseline = mean(firstHalf) || 1;
  const slope = ((mean(secondHalf) || baseline) - baseline) / Math.max(1, baseline);
  const directions = recent.slice(1).map((value, index) => Math.sign(value - recent[index]));
  const directionChanges = directions.slice(1).filter((value, index) => value !== 0 && directions[index] !== 0 && value !== directions[index]).length;
  const spread = best === null ? 0 : (best - Math.min(...recent)) / Math.max(1, best);
  const nearFlat = Math.abs(slope) < 0.025 && spread < 0.06;
  let trend: PerformanceTrend;
  if (recent.length >= 4 && nearFlat) trend = "plateau";
  else if (directionChanges >= 2 && spread >= 0.08) trend = "oscillating";
  else if (slope >= 0.035) trend = "improving";
  else if (slope <= -0.05) trend = "declining";
  else trend = "stable";
  const reasons = trend === "improving" ? ["A média das exposições recentes está subindo."]
    : trend === "declining" ? ["A queda aparece em mais de uma exposição recente, não apenas na última sessão."]
      : trend === "plateau" ? ["Quatro ou mais exposições permaneceram praticamente iguais."]
        : trend === "oscillating" ? ["A performance variou em direções alternadas nas exposições recentes."]
          : ["A performance recente permanece dentro de uma faixa estável."];
  return { trend, exposureCount: scores.length, last: last === null ? null : round(last), average3: average3 === null ? null : round(average3), average5: average5 === null ? null : round(average5), recentBest: best === null ? null : round(best), slope: round(slope), reasons };
}

