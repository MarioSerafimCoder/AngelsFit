export type ConfidenceLevel = "low" | "medium" | "high";
export type PerformanceTrend = "improving" | "stable" | "oscillating" | "plateau" | "declining";
export type FatigueTrend = "low" | "normal" | "high" | "unknown";
export type RecoveryTrend = "improving" | "stable" | "worsening" | "unknown";
export type PainTrend = "none" | "isolated" | "recurring" | "worsening";
export type ReadinessLevel = "high" | "normal" | "low" | "unknown";
export type ExercisePriority = "A" | "B" | "C";
export type LearningLoop = "fast" | "medium" | "slow";
export type CalibrationStatus = "calibrating" | "calibrated";

export type AdaptiveDecisionAction =
  | "progress"
  | "maintain"
  | "reduce"
  | "recover"
  | "investigate"
  | "safety_adjustment";

export type AdaptiveDecisionSource = "exercise" | "muscle" | "session" | "schedule" | "cycle" | "safety";

export type AdaptiveDecision = {
  action: AdaptiveDecisionAction;
  confidence: ConfidenceLevel;
  score?: number;
  reasons: string[];
  source: AdaptiveDecisionSource;
  affectedEntity?: string;
  loop?: LearningLoop;
};

export const CONFIDENCE_COPY: Record<ConfidenceLevel, string> = {
  low: "Aprendendo seu ritmo",
  medium: "Personalização em evolução",
  high: "Treino altamente personalizado",
};

export function clamp(value: number, minimum = 0, maximum = 1): number {
  return Math.min(maximum, Math.max(minimum, value));
}

export function confidenceFromScore(score: number): ConfidenceLevel {
  if (score >= 0.72) return "high";
  if (score >= 0.38) return "medium";
  return "low";
}

