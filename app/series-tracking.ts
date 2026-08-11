import type { SeriesPerformance } from "./active-session";
import type { SeriesPerformanceRecord } from "./training-intelligence";
import type { Exercise } from "./workout-data";

export type ExerciseTrackingMode = "strength" | "bodyweight" | "timed" | "cardio";

export function exerciseTrackingMode(exercise: Exercise, prescription: string): ExerciseTrackingMode {
  if (exercise.movement === "cardio") return "cardio";
  if (["warmup", "mobility", "cooldown"].includes(exercise.movement) || /\b(min|seg|segundo|s)\b/i.test(prescription)) return "timed";
  if (/nenhum|peso corporal|parede|colchonete|apoio est[aá]vel/i.test(exercise.equipment)) return "bodyweight";
  return "strength";
}

export function isUnilateralExercise(exercise: Exercise): boolean {
  return exercise.tags.includes("unilateral") || /unilateral/i.test(exercise.laterality || "");
}

export function seriesHasTrackingData(mode: ExerciseTrackingMode, entry: SeriesPerformance): boolean {
  if (mode === "timed" || mode === "cardio") return Number(entry.durationSeconds) > 0;
  if (mode === "bodyweight") return Number(entry.repetitions) > 0;
  return Number(String(entry.loadKg).replace(",", ".")) >= 0 && entry.loadKg !== "" && Number(entry.repetitions) > 0;
}

export function seriesPerformanceLabel(entry: SeriesPerformance | SeriesPerformanceRecord): string {
  const load = "loadKg" in entry ? Number(String(entry.loadKg).replace(",", ".")) : 0;
  const repetitions = Number(entry.repetitions || 0);
  const duration = Number(entry.durationSeconds || 0);
  const rir = entry.rir === null || entry.rir === "" ? null : Number(entry.rir);
  const parts: string[] = [];
  if (entry.loadType === "peso_corporal") parts.push("peso corporal");
  else if (entry.loadType === "assistencia") {
    const assistance = Number(String(entry.assistanceKg || 0).replace(",", "."));
    parts.push(assistance ? `${assistance} kg assistência` : "com assistência");
  } else if (load > 0) parts.push(`${load.toLocaleString("pt-BR")} kg${entry.loadType === "lastro" ? " lastro" : ""}`);
  if (repetitions > 0) parts.push(`${repetitions} rep`);
  if (duration > 0) parts.push(`${duration}s`);
  if (rir !== null && Number.isFinite(rir)) parts.push(`RIR ${rir}`);
  return parts.join(" · ") || (entry.completed ? "Concluída sem dados" : "Pendente");
}

export function seriesVolume(entry: Pick<SeriesPerformanceRecord, "completed" | "loadKg" | "loadType" | "repetitions">): number {
  if (!entry.completed || ["assistencia", "peso_corporal"].includes(entry.loadType)) return 0;
  return Math.max(0, entry.loadKg) * Math.max(0, entry.repetitions);
}
