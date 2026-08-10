import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPeriodizationPlan,
  exerciseProgressionGuidance,
  isQualifiedPeriodizationSession,
} from "../app/periodization.ts";

const completed = (overrides = {}) => ({ status: "completed", periodizationTrack: "hypertrophy", sessionRpe: 7, painScore: 0, symptoms: [], completedExercises: 6, totalExercises: 6, ...overrides });
const history = (count, overrides = {}) => Array.from({ length: count }, () => completed(overrides));

test("hypertrophy follows base, overload, intensification and deload across 12 qualified weeks", () => {
  const plan = (sessions) => buildPeriodizationPlan({ goal: "Hipertrofia", safetyCodes: [], history: history(sessions), sessionsPerWeek: 4 });
  assert.deepEqual([plan(0).cycleWeek, plan(0).phase], [1, "Base"]);
  assert.deepEqual([plan(16).cycleWeek, plan(16).phase], [5, "Sobrecarga"]);
  assert.deepEqual([plan(32).cycleWeek, plan(32).phase], [9, "Intensificação"]);
  assert.deepEqual([plan(44).cycleWeek, plan(44).phase, plan(44).isDeload], [12, "Deload e avaliação", true]);
  assert.deepEqual([plan(48).cycleNumber, plan(48).cycleWeek], [2, 1]);
});

test("conditioning uses the eight-week base, build, intensity, specific and taper cycle", () => {
  const plan = (sessions) => buildPeriodizationPlan({ goal: "Condicionamento", safetyCodes: [], history: history(sessions, { periodizationTrack: "conditioning" }), sessionsPerWeek: 3 });
  assert.equal(plan(0).phase, "Base aeróbia");
  assert.equal(plan(6).phase, "Construção");
  assert.equal(plan(12).phase, "Intensificação");
  assert.equal(plan(18).phase, "Específica");
  assert.equal(plan(21).phase, "Redução e teste");
});

test("only technically adequate and recovered sessions advance the training week", () => {
  assert.equal(isQualifiedPeriodizationSession(completed()), true);
  assert.equal(isQualifiedPeriodizationSession(completed({ painScore: 4 })), false);
  assert.equal(isQualifiedPeriodizationSession(completed({ sessionRpe: 10 })), false);
  assert.equal(isQualifiedPeriodizationSession(completed({ recovery24h: "Piorou" })), false);
  const plan = buildPeriodizationPlan({ goal: "Retorno aos treinos", safetyCodes: ["knee"], history: [completed({ painScore: 5, periodizationTrack: "clinical" }), ...history(4, { periodizationTrack: "clinical" })], sessionsPerWeek: 2 });
  assert.equal(plan.cycleWeek, 3);
  assert.equal(plan.decision, "regress");
});

test("repeated fatigue signals trigger a deload independent of the scheduled week", () => {
  const plan = buildPeriodizationPlan({ goal: "Força", safetyCodes: [], history: [completed({ sessionRpe: 9 }), completed({ sessionRpe: 9 }), ...history(4)], sessionsPerWeek: 3 });
  assert.equal(plan.decision, "deload");
  assert.equal(plan.volumeMultiplier, 0.6);
  assert.equal(plan.loadMultiplier, 0.9);
});

test("three consecutive performance drops trigger an unscheduled deload", () => {
  const record = (repetitions) => ({ exerciseId: "row", setsPlanned: 3, setsCompleted: 3, repetitions, load: 20, rirOrRpe: 2, executionFeedback: "adequate", painReported: false });
  const plan = buildPeriodizationPlan({ goal: "Hipertrofia", safetyCodes: [], history: [completed({ exerciseRecords: [record(8)] }), completed({ exerciseRecords: [record(10)] }), completed({ exerciseRecords: [record(12)] })], sessionsPerWeek: 3 });
  assert.equal(plan.decision, "deload");
  assert.match(plan.reason, /desempenho caiu/);
});

test("pregnancy and musculoskeletal limitations select criteria-based tracks", () => {
  assert.equal(buildPeriodizationPlan({ goal: "Hipertrofia", safetyCodes: ["pregnancy"], history: [], sessionsPerWeek: 2 }).track, "pregnancy");
  assert.equal(buildPeriodizationPlan({ goal: "Força", safetyCodes: ["back"], history: [], sessionsPerWeek: 2 }).track, "clinical");
});

test("legacy history is preserved but the professional cycle starts at week one", () => {
  const legacy = history(20, { periodizationTrack: undefined });
  const plan = buildPeriodizationPlan({ goal: "Hipertrofia", safetyCodes: [], history: legacy, sessionsPerWeek: 4 });
  assert.equal(plan.qualifiedSessions, 0);
  assert.equal(plan.cycleWeek, 1);
});

test("double progression requires two matching, complete and technically adequate exposures", () => {
  const periodization = buildPeriodizationPlan({ goal: "Hipertrofia", safetyCodes: [], history: [], sessionsPerWeek: 3 });
  const exerciseRecord = { exerciseId: "squat", setsPlanned: 3, setsCompleted: 3, repetitions: 12, load: 40, rirOrRpe: 2, executionFeedback: "adequate", painReported: false };
  const guidance = exerciseProgressionGuidance({ history: [completed({ exerciseRecords: [exerciseRecord] }), completed({ exerciseRecords: [exerciseRecord] })], exerciseId: "squat", upperRepetitionTarget: 12, periodization });
  assert.match(guidance, /Progressão conquistada/);
  assert.match(guidance, /42 kg/);
});

test("individual progression keeps the last load and sets the next repetition target", () => {
  const periodization = buildPeriodizationPlan({ goal: "Hipertrofia", safetyCodes: [], history: [], sessionsPerWeek: 3 });
  const exerciseRecord = { exerciseId: "row", setsPlanned: 3, setsCompleted: 3, repetitions: 10, load: 30, rirOrRpe: 2, executionFeedback: "adequate", painReported: false };
  const guidance = exerciseProgressionGuidance({ history: [completed({ exerciseRecords: [exerciseRecord] })], exerciseId: "row", upperRepetitionTarget: 12, periodization });
  assert.match(guidance, /Mantenha 30 kg/);
  assert.match(guidance, /11 repetições/);
});
