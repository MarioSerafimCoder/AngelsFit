import type { Exercise } from "../workout-data.ts";

export type ExerciseDoseMetadata = {
  stimulus: number;
  fatigueCost: number;
  stabilityDemand: number;
  complexity: number;
  axialLoad: number;
  jointStress: number;
  rangeOfMotion: "short" | "moderate" | "long";
  movementPattern: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
};

function clamp5(value: number): number { return Math.min(5, Math.max(1, Math.round(value))); }

export function exerciseDoseMetadata(exercise: Exercise): ExerciseDoseMetadata {
  const machine = /máquina|leg press|smith|hack|polia|puxador|mesa|cadeira/i.test(exercise.equipment);
  const freeWeight = /barra|halter/i.test(exercise.equipment);
  const compound = ["squat", "hinge", "horizontal_push", "vertical_push", "horizontal_pull", "vertical_pull"].includes(exercise.movement);
  const axial = ["squat", "hinge"].includes(exercise.movement) && freeWeight ? 4 : compound ? 2 : 1;
  const complexity = clamp5(exercise.complexity || (compound ? 3 : 2));
  const fatigueCost = clamp5((compound ? 3 : 1.5) + (freeWeight ? 1 : 0) - (machine ? 0.7 : 0));
  const stimulus = clamp5((compound ? 4 : 3) + (machine ? 0.2 : 0));
  return {
    stimulus,
    fatigueCost,
    stabilityDemand: clamp5(machine ? 1 : freeWeight ? complexity : 2),
    complexity,
    axialLoad: axial,
    jointStress: clamp5(exercise.impact === "alto" ? 5 : exercise.impact === "moderado" ? 3 : compound ? 2 : 1),
    rangeOfMotion: /parcial|curta/i.test(exercise.instructions) ? "short" : /amplitude|desça|along/i.test(exercise.instructions) ? "long" : "moderate",
    movementPattern: exercise.biomechanicalPattern || exercise.movement,
    primaryMuscles: [exercise.primaryGroup || exercise.muscleGroups[0]].filter(Boolean) as string[],
    secondaryMuscles: exercise.secondaryMuscles || exercise.muscleGroups.slice(1),
  };
}

export function stimulusFatigueScore(metadata: Pick<ExerciseDoseMetadata, "stimulus" | "fatigueCost" | "jointStress" | "stabilityDemand">): number {
  return Math.round((metadata.stimulus / Math.max(1, metadata.fatigueCost * 0.65 + metadata.jointStress * 0.2 + metadata.stabilityDemand * 0.15)) * 100) / 100;
}

