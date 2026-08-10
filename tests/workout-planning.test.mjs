import assert from "node:assert/strict";
import test from "node:test";

import { estimateExerciseSeconds, estimateWorkoutMinutes, fitWorkoutToTime } from "../app/workout-planning.ts";

const exercise = (id, options = {}) => ({
  exercise: { id, movement: "horizontal_push", muscleGroups: ["Peito"], ...options.exercise },
  sets: options.sets ?? 3,
  reps: options.reps || "8–12",
  rest: options.rest ?? 60,
  tempo: options.tempo || "3–1–2",
  loadSuggestion: "",
  targetRpe: "RPE 7",
  note: "",
});

test("estimates work, rests and transitions instead of copying the profile duration", () => {
  const item = exercise("press");
  assert.equal(estimateExerciseSeconds(item), 3 * 60 + 2 * 60 + 35);
  assert.equal(estimateWorkoutMinutes({ warmup: [], main: [item], cooldown: [] }), 6);
});

test("fits the number of main exercises inside the available time", () => {
  const warmup = [exercise("warmup", { exercise: { movement: "warmup" }, sets: 1, reps: "4–6 min", rest: 0 })];
  const cooldown = [exercise("cooldown", { exercise: { movement: "cooldown" }, sets: 1, reps: "45–60 s", rest: 0 })];
  const main = Array.from({ length: 8 }, (_, index) => exercise(`main-${index}`));
  const fitted = fitWorkoutToTime({ targetMinutes: 30, warmup, main, cooldown, minimumMainExercises: 3 });

  assert.ok(fitted.main.length >= 3);
  assert.ok(fitted.main.length < main.length);
  assert.ok(fitted.estimatedMinutes <= 31);
});
