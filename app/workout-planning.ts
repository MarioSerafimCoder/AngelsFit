import type { GeneratedExercise } from "./workout-engine";

type WorkoutSections = {
  warmup: GeneratedExercise[];
  main: GeneratedExercise[];
  cooldown: GeneratedExercise[];
};

function numericRangeAverage(value: string): number {
  const values = value.match(/\d+(?:[.,]\d+)?/g)?.map((item) => Number(item.replace(",", "."))) || [];
  if (!values.length) return 0;
  return values.reduce((total, item) => total + item, 0) / values.length;
}

function tempoSeconds(tempo: string): number {
  const parts = tempo.match(/\d+/g)?.map(Number) || [];
  const total = parts.reduce((sum, item) => sum + item, 0);
  return total > 0 ? total : 4;
}

export function estimateExerciseSeconds(item: GeneratedExercise): number {
  const repetitions = numericRangeAverage(item.reps);
  const lowerReps = item.reps.toLocaleLowerCase("pt-BR");
  const transitionSeconds = 35;

  if (/\bmin\b/.test(lowerReps)) return Math.max(60, repetitions * 60) + transitionSeconds;
  if (/\bs\b|seg/.test(lowerReps)) return Math.max(20, repetitions) * Math.max(1, item.sets) + transitionSeconds;
  if (item.exercise.movement === "cardio") return Math.max(8 * 60, repetitions * 60) + transitionSeconds;

  const workPerSet = Math.max(25, Math.max(1, repetitions) * tempoSeconds(item.tempo));
  const workSeconds = workPerSet * Math.max(1, item.sets);
  const restSeconds = Math.max(0, item.sets - 1) * Math.max(0, item.rest);
  return workSeconds + restSeconds + transitionSeconds;
}

export function estimateWorkoutMinutes(sections: WorkoutSections): number {
  const items = [...sections.warmup, ...sections.main, ...sections.cooldown];
  const totalSeconds = items.reduce((total, item) => total + estimateExerciseSeconds(item), 0);
  return Math.max(1, Math.ceil(totalSeconds / 60));
}

export function fitWorkoutToTime(options: WorkoutSections & { targetMinutes: number; minimumMainExercises?: number }): WorkoutSections & { estimatedMinutes: number } {
  const targetSeconds = Math.max(15, options.targetMinutes) * 60;
  const minimumMain = Math.min(options.main.length, Math.max(2, options.minimumMainExercises || 3));
  const selectedMain = options.main.slice(0, minimumMain);
  let currentSeconds = [...options.warmup, ...selectedMain, ...options.cooldown].reduce((total, item) => total + estimateExerciseSeconds(item), 0);

  for (const item of options.main.slice(minimumMain)) {
    const nextSeconds = estimateExerciseSeconds(item);
    if (currentSeconds + nextSeconds > targetSeconds * 1.03) break;
    selectedMain.push(item);
    currentSeconds += nextSeconds;
  }

  const fitted = { warmup: options.warmup, main: selectedMain, cooldown: options.cooldown };
  return { ...fitted, estimatedMinutes: estimateWorkoutMinutes(fitted) };
}
