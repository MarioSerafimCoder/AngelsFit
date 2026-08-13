import assert from "node:assert/strict";
import test from "node:test";

import {
  actualTrainingBehavior,
  algorithmConfidence,
  buildAdaptivePlan,
  calculateCycleReadiness,
  decideExerciseProgression,
  decideVolume,
  learnExercisePreferences,
} from "../app/domain/adaptive-training.ts";
import { mergeLegacyCheckIns } from "../app/training-intelligence.ts";

const record = (index, extra = {}) => ({
  id: String(index), workoutName: "Treino A", completedAt: new Date(Date.UTC(2026, 6, 1 + index * 3, 12)).toISOString(),
  status: "completed", durationMinutes: 42, completedExercises: 6, totalExercises: 6, sessionRpe: 7, painScore: 0, recovery24h: "Igual",
  exerciseRecords: [{ exerciseId: "leg_press", setsPlanned: 3, setsCompleted: 3, repetitions: 12, load: 50, rirOrRpe: 2, restTime: 90, technique: "padrão", executionFeedback: "adequate", painReported: false }],
  ...extra,
});

test("one session never triggers aggressive adaptation", () => {
  assert.equal(algorithmConfidence([record(0)]).level, "low");
  assert.equal(decideVolume([record(0)]).action, "maintain");
  assert.equal(decideExerciseProgression("leg_press", [record(0)]).action, "maintain");
});

test("exercise load progresses only after repeated adequate evidence", () => {
  const decision = decideExerciseProgression("leg_press", [record(3), record(2, { exerciseRecords: [{ ...record(2).exerciseRecords[0], repetitions: 11 }] }), record(1, { exerciseRecords: [{ ...record(1).exerciseRecords[0], repetitions: 10 }] })]);
  assert.equal(decision.action, "increase");
  assert.ok(decision.suggestedLoad > 50);
  assert.match(decision.reasons[0], /três sessões/i);
});

test("recurring pain reduces exercise progression and volume", () => {
  const painful = Array.from({ length: 6 }, (_, index) => record(index, { painScore: 5, exerciseRecords: [{ ...record(index).exerciseRecords[0], painReported: true }] }));
  assert.equal(decideExerciseProgression("leg_press", painful).action, "reduce");
  assert.equal(decideVolume(painful).action, "reduce");
});

test("real frequency and duration influence the plan only with enough history", () => {
  const profile = { goal: "Força", experience: "Intermediário", days: ["Seg", "Ter", "Qua", "Qui", "Sex"], duration: "60 min", location: "Academia", limitations: "" };
  const sparse = buildAdaptivePlan(profile, [record(0)], new Date(2026, 7, 13));
  assert.equal(sparse.effectiveDays, 5);
  assert.equal(sparse.effectiveDurationMinutes, 60);
  const stable = buildAdaptivePlan(profile, Array.from({ length: 12 }, (_, index) => record(index)), new Date(2026, 7, 13));
  assert.ok(stable.effectiveDays < 5);
  assert.ok(stable.effectiveDurationMinutes < 60);
});

test("repeated substitutions become learned preferences", () => {
  const history = Array.from({ length: 4 }, (_, index) => record(index, { exerciseRecords: [{ ...record(index).exerciseRecords[0], exerciseId: "back_squat", substitutedExerciseId: "leg_press" }] }));
  const preference = learnExercisePreferences(history)[0];
  assert.equal(preference.preferredExerciseId, "leg_press");
  assert.equal(preference.substitutions, 4);
});

test("cycle readiness has explicit progress, maintain and recovery thresholds", () => {
  const strong = Array.from({ length: 12 }, (_, index) => record(index));
  assert.equal(calculateCycleReadiness(strong, 3).action, "increase");
  const recovering = strong.map((item) => ({ ...item, completedExercises: 2, sessionRpe: 10, painScore: 6, recovery24h: "Piorou" }));
  assert.equal(calculateCycleReadiness(recovering, 3).action, "reduce");
  assert.equal(calculateCycleReadiness(strong.slice(0, 3), 3).action, "maintain");
});

test("legacy check-ins migrate without duplicating an existing workout day", () => {
  const history = [record(0)];
  const merged = mergeLegacyCheckIns(history, [{ id: "same", checkedAt: history[0].completedAt }, { id: "other", checkedAt: "2026-07-02T12:00:00.000Z" }]);
  assert.equal(merged.length, 2);
  assert.equal(merged.filter((item) => item.status === "attendance_legacy").length, 1);
});

test("behavior ignores skipped sessions when calculating attendance", () => {
  const behavior = actualTrainingBehavior([record(0), { ...record(1), status: "skipped", durationMinutes: 0 }], new Date(2026, 6, 10));
  assert.equal(behavior.sessions, 1);
});
