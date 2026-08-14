import assert from "node:assert/strict";
import test from "node:test";

import { buildExerciseState, calculateExerciseAffinity } from "../app/domain/exercise-state.ts";
import { analyzePerformanceTrend } from "../app/domain/performance-trend.ts";
import { calculateSessionQuality, priorityCompletionScore, qualifySessionCompletion, SESSION_QUALITY_WEIGHTS } from "../app/domain/session-quality.ts";
import { decideAdaptiveAction } from "../app/domain/decision-engine.ts";
import { normalizeRecovery24h } from "../app/domain/recovery.ts";
import { normalizeSubstitutionReason } from "../app/domain/substitution-reason.ts";

const exerciseRecord = (repetitions, extra = {}) => ({
  exerciseId: "bench", primaryMuscleGroup: "Peito", muscleGroups: ["Peito", "Tríceps"], setsPlanned: 3, setsCompleted: 3,
  repetitions, load: 50, rirOrRpe: 2, restTime: 90, technique: "padrão", executionFeedback: "adequate", painReported: false,
  sets: Array.from({ length: 3 }, (_, index) => ({ series: index + 1, completed: true, loadKg: 50, repetitions, rir: 2, durationSeconds: 0, assistanceKg: 0, distanceKm: 0, side: "ambos", loadType: "carga" })),
  ...extra,
});

const session = (index, repetitions, extra = {}) => ({
  id: String(index), workoutName: "A", completedAt: new Date(Date.UTC(2026, 6, index + 1)).toISOString(), status: "completed",
  durationMinutes: 45, completedExercises: 1, totalExercises: 1, sessionRpe: 7, painScore: 0, recovery24h: "normal",
  exerciseRecords: [exerciseRecord(repetitions)], ...extra,
});

test("performance memory uses last, three, five and ignores one noisy bad result", () => {
  const samples = [10, 11, 12, 12, 8].map((repetitions, index) => ({ recordedAt: new Date(2026, 0, index + 1).toISOString(), load: 50, repetitions }));
  const result = analyzePerformanceTrend(samples);
  assert.equal(result.exposureCount, 5);
  assert.ok(result.average3 > result.last);
  assert.ok(result.average5 > result.last);
  assert.equal(result.recentBest, 600);
  assert.notEqual(result.trend, "declining", "one isolated bad exposure must not become a decline trend");
});

test("double progression requires repeated top-range evidence", () => {
  const sparse = buildExerciseState({ exerciseId: "bench", history: [session(1, 12)], repRange: "8–12", targetRir: 2 });
  assert.notEqual(sparse.suggestedAction, "progress");
  const consistent = buildExerciseState({ exerciseId: "bench", history: [session(3, 12), session(2, 12), session(1, 12)], repRange: "8–12", targetRir: 2 });
  assert.equal(consistent.suggestedAction, "progress");
  assert.equal(consistent.suggestedLoad, 52);

  const uneven = [session(3, 12), session(2, 12), session(1, 12)].map((item) => ({ ...item, exerciseRecords: [exerciseRecord(12, { sets: [12, 12, 8].map((repetitions, index) => ({ series: index + 1, completed: true, loadKg: 50, repetitions, rir: 2, durationSeconds: 0, assistanceKg: 0, distanceKm: 0, side: "ambos", loadType: "carga" })) })] }));
  assert.notEqual(buildExerciseState({ exerciseId: "bench", history: uneven, repRange: "8–12", targetRir: 2 }).suggestedAction, "progress");
});

test("a recent load change activates cooldown before another progression", () => {
  const exposure = (index, load) => session(index, 12, { exerciseRecords: [exerciseRecord(12, { load, sets: Array.from({ length: 3 }, (_, setIndex) => ({ series: setIndex + 1, completed: true, loadKg: load, repetitions: 12, rir: 2, durationSeconds: 0, assistanceKg: 0, distanceKm: 0, side: "ambos", loadType: "carga" })) })] });
  const state = buildExerciseState({ exerciseId: "bench", history: [exposure(4, 54), exposure(3, 52), exposure(2, 52), exposure(1, 50)], repRange: "8–12", targetRir: 2 });
  assert.equal(state.suggestedAction, "maintain");
  assert.equal(state.suggestedLoad, 54);
});

test("exercise state separates plateau from fatigue and recurring pain", () => {
  const plateau = buildExerciseState({ exerciseId: "bench", history: [session(4, 10), session(3, 10), session(2, 10), session(1, 10)], repRange: "8–12", targetRir: 2 });
  assert.equal(plateau.plateauStatus, "confirmed");
  assert.equal(plateau.suggestedAction, "investigate");
  const fatigued = [session(5, 8, { sessionRpe: 10, recovery24h: "very_fatigued" }), session(4, 9, { sessionRpe: 9, recovery24h: "worse" }), session(3, 10), session(2, 11)];
  const fatigueState = buildExerciseState({ exerciseId: "bench", history: fatigued, repRange: "8–12", targetRir: 2 });
  assert.equal(fatigueState.fatigueTrend, "high");
  assert.notEqual(fatigueState.suggestedAction, "progress");
  const painfulHistory = [session(4, 10, { exerciseRecords: [exerciseRecord(10, { painReported: true })] }), session(3, 10, { exerciseRecords: [exerciseRecord(10, { painReported: true })] }), session(2, 10)];
  assert.equal(buildExerciseState({ exerciseId: "bench", history: painfulHistory }).suggestedAction, "safety_adjustment");
});

test("session quality normalizes missing weights and gives priority A more value", () => {
  assert.equal(Object.values(SESSION_QUALITY_WEIGHTS).reduce((sum, value) => sum + value, 0), 1);
  const onlySets = calculateSessionQuality({ effectiveSetsPerformed: 8, effectiveSetsPrescribed: 10 });
  assert.equal(onlySets.score, 80);
  assert.equal(onlySets.availableWeight, 0.2);
  const essentials = priorityCompletionScore([{ priority: "A", completed: true }, { priority: "C", completed: false }]);
  const accessories = priorityCompletionScore([{ priority: "A", completed: false }, { priority: "C", completed: true }]);
  assert.ok(essentials > accessories);
  assert.equal(qualifySessionCompletion(7, 10, 70), "completed");
  assert.equal(qualifySessionCompletion(8, 10, 40), "partial");
});

test("decision engine applies confidence and anti-instability gates", () => {
  assert.equal(decideAdaptiveAction({ affectedEntity: "bench", source: "exercise", performance: "improving", fatigue: "normal", pain: "none", confidence: "low" }).action, "maintain");
  assert.equal(decideAdaptiveAction({ affectedEntity: "bench", source: "exercise", performance: "improving", fatigue: "normal", pain: "none", confidence: "high", cooldownActive: true }).action, "maintain");
  assert.equal(decideAdaptiveAction({ affectedEntity: "bench", source: "exercise", performance: "improving", fatigue: "normal", pain: "none", confidence: "high" }).action, "progress");
});

test("recovery migration maps localized legacy strings to enums", () => {
  assert.equal(normalizeRecovery24h("Melhor"), "better");
  assert.equal(normalizeRecovery24h("Igual"), "normal");
  assert.equal(normalizeRecovery24h("Muito cansada"), "very_fatigued");
});

test("substitution reasons remain language-independent", () => {
  assert.equal(normalizeSubstitutionReason("Equipamento indisponível"), "equipment_unavailable");
  assert.equal(normalizeSubstitutionReason("Desconforto ou dor"), "pain");
  assert.equal(normalizeSubstitutionReason("Preferência pessoal"), "preference");
});

test("affinity does not treat one substitution as rejection", () => {
  const exposures = [{ session: session(1, 10), record: exerciseRecord(10, { substitutedExerciseId: "machine_press" }) }];
  assert.ok(calculateExerciseAffinity(exposures) >= 50);
});
