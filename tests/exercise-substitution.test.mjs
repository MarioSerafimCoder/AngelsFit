import assert from "node:assert/strict";
import test from "node:test";

import { rankExerciseSubstitutions } from "../app/exercise-substitution.ts";

const exercise = (id, overrides = {}) => ({
  id,
  name: id,
  muscleGroups: ["Quadríceps"],
  primaryGroup: "Quadríceps",
  equipment: "Barra",
  locations: ["Academia"],
  movement: "squat",
  level: "Iniciante",
  impact: "baixo",
  tags: [],
  avoidWhen: [],
  instructions: "",
  commonErrors: "",
  alternativeIds: [],
  complexity: 1,
  ...overrides,
});

test("prioritizes same-pattern declared alternatives at the user's level", () => {
  const current = exercise("back-squat", { alternativeIds: ["leg-press"] });
  const ranked = rankExerciseSubstitutions({ current, candidates: [current, exercise("curl", { movement: "arms", primaryGroup: "Bíceps", muscleGroups: ["Bíceps"] }), exercise("leg-press", { equipment: "Máquina" })], experience: "Iniciante", location: "Academia" });
  assert.equal(ranked[0].exercise.id, "leg-press");
});

test("removes painful, restricted and unavailable-equipment options", () => {
  const current = exercise("back-squat");
  const ranked = rankExerciseSubstitutions({
    current,
    candidates: [current, exercise("same-bar"), exercise("knee-risk", { equipment: "Máquina", avoidWhen: ["knee_acute"] }), exercise("safe-box", { equipment: "Banco" })],
    experience: "Iniciante",
    location: "Academia",
    reason: "Equipamento indisponível",
    painRegion: "joelho direito",
    previouslyPainfulExerciseIds: ["knee-risk"],
  });
  assert.deepEqual(ranked.map((item) => item.exercise.id), ["safe-box"]);
});
