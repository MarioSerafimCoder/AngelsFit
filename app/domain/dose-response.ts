import type { AdaptiveDecision } from "./types.ts";
import type { MuscleState } from "./muscle-state.ts";

type WeeklyWorkout = { main: Array<{ sets: number; exercise: { primaryGroup?: string; muscleGroups: string[] } }> };

export function prescribedWeeklySetsByMuscle(workouts: WeeklyWorkout[]): Map<string, number> {
  const result = new Map<string, number>();
  for (const workout of workouts) for (const item of workout.main) {
    const muscle = item.exercise.primaryGroup || item.exercise.muscleGroups[0];
    if (!muscle) continue;
    result.set(muscle, (result.get(muscle) || 0) + Math.max(0, item.sets));
  }
  return result;
}

export function prescribeAdaptiveDose(state: MuscleState, sessionsSinceLastChange: number): AdaptiveDecision & { suggestedWeeklySets: number } {
  const base = { source: "muscle" as const, affectedEntity: state.muscleGroup, confidence: state.confidenceScore >= 72 ? "high" as const : state.confidenceScore >= 38 ? "medium" as const : "low" as const };
  if (state.painTrend === "recurring" || state.fatigueTrend === "high" || state.recoveryTrend === "worsening") return { ...base, action: "recover", loop: "medium", score: 30, suggestedWeeklySets: Math.max(state.estimatedProductiveMin, state.prescribedWeeklySets - 1), reasons: ["Reduzimos apenas uma série semanal porque fadiga, recuperação ou dor pioraram."] };
  if (state.confidenceScore < 38) return { ...base, action: "maintain", loop: "medium", score: 48, suggestedWeeklySets: state.prescribedWeeklySets, reasons: ["Mantivemos o volume enquanto aprendemos sua resposta individual."] };
  if (sessionsSinceLastChange < 3) return { ...base, action: "maintain", loop: "medium", score: 58, suggestedWeeklySets: state.prescribedWeeklySets, reasons: ["Aguardamos pelo menos três exposições antes de outra mudança estrutural."] };
  if (state.performanceTrend === "improving" && state.prescribedWeeklySets < state.estimatedProductiveMax) return { ...base, action: "progress", loop: "medium", score: 78, suggestedWeeklySets: state.prescribedWeeklySets + 1, reasons: ["Aumentamos uma série semanal como pequeno experimento porque a resposta está melhorando."] };
  return { ...base, action: "maintain", loop: "medium", score: 62, suggestedWeeklySets: state.prescribedWeeklySets, reasons: ["O volume atual parece produtivo e permanece dentro da faixa individual estimada."] };
}
