import assert from "node:assert/strict";
import test from "node:test";

import { exerciseTrackingMode, isUnilateralExercise, seriesHasTrackingData, seriesVolume } from "../app/series-tracking.ts";
import { emptySeriesPerformance } from "../app/active-session.ts";

const exercise = (overrides = {}) => ({
  id: "exercise",
  name: "Exercise",
  muscleGroups: [],
  equipment: "Máquina",
  locations: ["Academia"],
  movement: "squat",
  level: "Iniciante",
  impact: "baixo",
  tags: [],
  avoidWhen: [],
  instructions: "",
  commonErrors: "",
  alternativeIds: [],
  ...overrides,
});

test("chooses contextual fields for strength, bodyweight, timed and cardio movements", () => {
  assert.equal(exerciseTrackingMode(exercise(), "8–12"), "strength");
  assert.equal(exerciseTrackingMode(exercise({ equipment: "Nenhum" }), "10"), "bodyweight");
  assert.equal(exerciseTrackingMode(exercise({ movement: "mobility" }), "30 s"), "timed");
  assert.equal(exerciseTrackingMode(exercise({ movement: "cardio" }), "5 min"), "cardio");
  assert.equal(isUnilateralExercise(exercise({ tags: ["unilateral"] })), true);
});

test("validates the relevant fields and excludes assistance from external-load volume", () => {
  const strength = { ...emptySeriesPerformance(1), loadKg: "22.5", repetitions: "10", completed: true };
  const bodyweight = { ...emptySeriesPerformance(1), loadType: "peso_corporal", repetitions: "12", completed: true };
  const timed = { ...emptySeriesPerformance(1), durationSeconds: "30", completed: true };
  assert.equal(seriesHasTrackingData("strength", strength), true);
  assert.equal(seriesHasTrackingData("bodyweight", bodyweight), true);
  assert.equal(seriesHasTrackingData("timed", timed), true);
  assert.equal(seriesVolume({ completed: true, loadKg: 22.5, repetitions: 10, loadType: "carga" }), 225);
  assert.equal(seriesVolume({ completed: true, loadKg: 40, repetitions: 10, loadType: "assistencia" }), 0);
});
