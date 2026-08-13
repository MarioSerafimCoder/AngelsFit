import type { ExercisePriority } from "./types.ts";

export const SESSION_QUALITY_WEIGHTS = {
  priorityCompletion: 0.30,
  effectiveSets: 0.20,
  expectedPerformance: 0.20,
  effortTarget: 0.15,
  painAndSymptoms: 0.10,
  operationalAdherence: 0.05,
} as const;

export type SessionQualityInput = {
  exercises?: Array<{ priority: ExercisePriority; completed: boolean }>;
  effectiveSetsPerformed?: number;
  effectiveSetsPrescribed?: number;
  expectedPerformanceRatio?: number;
  effortWithinTargetRatio?: number;
  painScore?: number;
  symptoms?: string[];
  durationMinutes?: number;
  targetDurationMinutes?: number;
};

export type SessionQualityScore = {
  score: number;
  level: "low" | "productive" | "high";
  components: Partial<Record<keyof typeof SESSION_QUALITY_WEIGHTS, number>>;
  availableWeight: number;
  reasons: string[];
};

function clamp(value: number): number { return Math.min(1, Math.max(0, value)); }

export function priorityCompletionScore(exercises: Array<{ priority: ExercisePriority; completed: boolean }>): number | undefined {
  if (!exercises.length) return undefined;
  const priorityWeights: Record<ExercisePriority, number> = { A: 3, B: 2, C: 1 };
  const denominator = exercises.reduce((sum, item) => sum + priorityWeights[item.priority], 0);
  return denominator ? exercises.reduce((sum, item) => sum + (item.completed ? priorityWeights[item.priority] : 0), 0) / denominator : undefined;
}

export function calculateSessionQuality(input: SessionQualityInput): SessionQualityScore {
  const components: SessionQualityScore["components"] = {};
  const priority = input.exercises ? priorityCompletionScore(input.exercises) : undefined;
  if (priority !== undefined) components.priorityCompletion = priority;
  if (typeof input.effectiveSetsPerformed === "number" && typeof input.effectiveSetsPrescribed === "number" && input.effectiveSetsPrescribed > 0) components.effectiveSets = clamp(input.effectiveSetsPerformed / input.effectiveSetsPrescribed);
  if (typeof input.expectedPerformanceRatio === "number") components.expectedPerformance = clamp(input.expectedPerformanceRatio);
  if (typeof input.effortWithinTargetRatio === "number") components.effortTarget = clamp(input.effortWithinTargetRatio);
  if (typeof input.painScore === "number" || input.symptoms !== undefined) {
    const painPenalty = typeof input.painScore === "number" ? clamp(input.painScore / 7) : 0;
    const symptomPenalty = input.symptoms?.length ? Math.min(0.5, input.symptoms.length * 0.18) : 0;
    components.painAndSymptoms = clamp(1 - painPenalty - symptomPenalty);
  }
  if (typeof input.durationMinutes === "number" && typeof input.targetDurationMinutes === "number" && input.targetDurationMinutes > 0) {
    const ratio = input.durationMinutes / input.targetDurationMinutes;
    components.operationalAdherence = ratio < 0.5 ? ratio * 2 : ratio > 1.5 ? Math.max(0, 1 - (ratio - 1.5) * 0.5) : 1;
  }
  const entries = Object.entries(components) as Array<[keyof typeof SESSION_QUALITY_WEIGHTS, number]>;
  const availableWeight = entries.reduce((sum, [key]) => sum + SESSION_QUALITY_WEIGHTS[key], 0);
  const score = availableWeight ? Math.round(entries.reduce((sum, [key, value]) => sum + value * SESSION_QUALITY_WEIGHTS[key], 0) / availableWeight * 100) : 50;
  const reasons = priority !== undefined && priority >= 0.85 ? ["Os movimentos prioritários foram preservados."] : priority !== undefined && priority < 0.6 ? ["Movimentos essenciais ficaram incompletos."] : ["A qualidade foi calculada apenas com os dados disponíveis."];
  return { score, level: score >= 80 ? "high" : score >= 55 ? "productive" : "low", components, availableWeight: Math.round(availableWeight * 100) / 100, reasons };
}

export function qualifySessionCompletion(completedSets: number, prescribedSets: number, qualityScore: number): "completed" | "partial" | "interrupted" {
  if (completedSets <= 0 || prescribedSets <= 0) return "interrupted";
  return completedSets / prescribedSets > 0.5 && qualityScore >= 55 ? "completed" : "partial";
}
