import assert from "node:assert/strict";
import test from "node:test";

import { buildMuscleState } from "../app/domain/muscle-state.ts";
import { prescribeAdaptiveDose, prescribedWeeklySetsByMuscle } from "../app/domain/dose-response.ts";
import { inferPassiveReadiness } from "../app/domain/readiness.ts";
import { assessExerciseSafety } from "../app/domain/safety-engine.ts";
import { exerciseDoseMetadata, stimulusFatigueScore } from "../app/domain/stimulus-fatigue.ts";
import { resolveEffectiveSchedule, resolveSequenceSelection } from "../app/domain/schedule.ts";
import { exerciseById } from "../app/workout-data.ts";

const muscleSession = (index, sets, repetitions = 10, extra = {}) => ({
  id: String(index), workoutName: "A", completedAt: new Date(Date.UTC(2026, 6, 1 + index * 5)).toISOString(), status: "completed", durationMinutes: 45,
  sessionRpe: 7, painScore: 0, recovery24h: "normal", completedExercises: 1, totalExercises: 1,
  exerciseRecords: [{ exerciseId: "leg_press", primaryMuscleGroup: "Quadríceps", muscleGroups: ["Quadríceps", "Glúteos"], setsPlanned: sets, setsCompleted: sets, repetitions, load: 80, rirOrRpe: 2, restTime: 90, technique: "padrão", executionFeedback: "adequate", painReported: false }], ...extra,
});

test("muscle state learns a bounded productive range", () => {
  const history = [muscleSession(5, 12, 12), muscleSession(4, 10, 11), muscleSession(3, 10, 10), muscleSession(2, 8, 10), muscleSession(1, 8, 9)];
  const state = buildMuscleState({ muscleGroup: "Quadríceps", history, prescribedWeeklySets: 10, now: new Date(Date.UTC(2026, 7, 1)) });
  assert.ok(state.estimatedProductiveMin >= 2);
  assert.ok(state.estimatedProductiveMax >= state.estimatedProductiveMin);
  assert.ok(state.confidenceScore > 0);
});

test("adaptive dose changes volume in small steps and respects cooldown", () => {
  const improving = { muscleGroup: "Peito", prescribedWeeklySets: 10, performedWeeklySets: 10, estimatedProductiveMin: 8, estimatedProductiveMax: 12, performanceTrend: "improving", fatigueTrend: "normal", recoveryTrend: "stable", painTrend: "none", toleranceScore: 80, confidenceScore: 80, stimulusScore: 80, fatigueCost: 40, lastVolumeChange: null, reasons: [] };
  assert.equal(prescribeAdaptiveDose(improving, 1).suggestedWeeklySets, 10);
  assert.equal(prescribeAdaptiveDose(improving, 3).suggestedWeeklySets, 11);
  const fatigued = { ...improving, fatigueTrend: "high", recoveryTrend: "worsening" };
  assert.equal(prescribeAdaptiveDose(fatigued, 4).suggestedWeeklySets, 9);
});

test("weekly prescription sums every generated session before adapting dose", () => {
  const exercise = { primaryGroup: "Peito", muscleGroups: ["Peito"] };
  const weekly = prescribedWeeklySetsByMuscle([{ main: [{ sets: 3, exercise }] }, { main: [{ sets: 4, exercise }] }, { main: [{ sets: 2, exercise }] }]);
  assert.equal(weekly.get("Peito"), 9);
});

test("passive readiness treats absent data as unknown, not low", () => {
  assert.equal(inferPassiveReadiness([]).level, "unknown");
  const low = inferPassiveReadiness([muscleSession(1, 3, 8, { sessionRpe: 10, painScore: 6, recovery24h: "very_fatigued" })], {}, new Date(Date.UTC(2026, 6, 7)));
  assert.equal(low.level, "low");
});

test("safety engine is transversal and contextual", () => {
  const squat = exerciseById.get("back_squat");
  assert.ok(squat);
  const blocked = assessExerciseSafety({ specialConditions: ["cardiovascular"], medicalClearance: false }, squat, []);
  assert.equal(blocked.disposition, "blocked");
  const isolated = assessExerciseSafety({}, squat, [{ ...muscleSession(1, 3), exerciseRecords: [{ ...muscleSession(1, 3).exerciseRecords[0], exerciseId: "back_squat", painReported: true }] }]);
  assert.equal(isolated.allowed, true);
  const recurring = assessExerciseSafety({}, squat, [1, 2].map((index) => ({ ...muscleSession(index, 3), exerciseRecords: [{ ...muscleSession(index, 3).exerciseRecords[0], exerciseId: "back_squat", painReported: true }] })));
  assert.equal(recurring.disposition, "allowedWithModification");
});

test("stimulus-fatigue metadata is deterministic", () => {
  const squat = exerciseById.get("back_squat");
  const legPress = exerciseById.get("leg_press");
  assert.ok(squat && legPress);
  const squatMeta = exerciseDoseMetadata(squat);
  const legPressMeta = exerciseDoseMetadata(legPress);
  assert.ok(squatMeta.fatigueCost >= legPressMeta.fatigueCost);
  assert.ok(stimulusFatigueScore(legPressMeta) > 0);
});

test("effective schedule honors explicit days and fills empty profiles", () => {
  assert.deepEqual(resolveEffectiveSchedule(["Seg", "Qua", "Sex"], 3), ["Seg", "Qua", "Sex"]);
  const generated = resolveEffectiveSchedule([], 3);
  assert.equal(generated.length, 3);
  assert.ok(new Set(generated).size === 3);
});

test("postponing keeps the sequence while skipping or choosing ahead advances it", () => {
  assert.deepEqual(resolveSequenceSelection(1, true), { sequenceAdvance: 1, action: "recommended" });
  assert.deepEqual(resolveSequenceSelection(1, false), { sequenceAdvance: 2, action: "manually_advanced" });
});
