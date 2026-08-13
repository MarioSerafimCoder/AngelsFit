import assert from "node:assert/strict";
import test from "node:test";

import {
  addRestSeconds,
  beginActiveSession,
  completeRest,
  completeSeriesPerformance,
  createActiveWorkoutSession,
  getElapsedSeconds,
  getRestRemainingSeconds,
  hasMeaningfulSessionActivity,
  isCardioPlanValid,
  normalizeActiveWorkoutSession,
  pauseRest,
  patchActiveSession,
  resumeRest,
  seriesPerformances,
  sessionCompletionProgress,
  sessionReadiness,
  startRest,
  summarizeActiveSession,
} from "../app/active-session.ts";

const exercise = (id, sets = 3) => ({
  exercise: { id, name: id, muscleGroups: [], equipment: "", alternativeIds: [], instructions: "", commonErrors: "" },
  sets,
  reps: "10",
  rest: 60,
  tempo: "",
  loadSuggestion: "",
  targetRpe: "RPE 6",
  note: "",
});

test("combines today's check-in with the previous workout and keeps blank answers neutral", () => {
  const blank = createActiveWorkoutSession(workout, 0);
  assert.equal(sessionReadiness(blank), "alta");
  assert.equal(sessionReadiness(blank, { sessionRpe: 9, painScore: 4, status: "partial" }), "baixa");
  assert.equal(sessionReadiness(blank, { painScore: 7 }), "atenção");
});

test("does not start a session when today's safety check requires attention", () => {
  const session = { ...createActiveWorkoutSession(workout, 0), newPain: true };
  const started = beginActiveSession(session, 1_000);

  assert.equal(sessionReadiness(session), "atenção");
  assert.equal(started.status, "setup");
  assert.equal(started.elapsedStartedAt, null);
});

test("materializes readiness-adjusted sets so completion uses what the user saw", () => {
  const previousWorkout = { sessionRpe: 9, painScore: 4, status: "partial" };
  let session = beginActiveSession(createActiveWorkoutSession(workout, 0), 1_000, previousWorkout);

  assert.equal(sessionReadiness(session, previousWorkout), "baixa");
  assert.equal(session.setOverrides.squat, 2);

  session = { ...session, completedSeries: { warmup: [1], squat: [1, 2] } };
  const summary = summarizeActiveSession(session, 2_000);
  assert.equal(summary.completedExercises, 2);
});

test("validates and summarizes the cardio plan stored in the active session", () => {
  const session = createActiveWorkoutSession(workout, 0);
  assert.equal(session.cardioIntensity, "Sem cardio hoje");
  assert.equal(isCardioPlanValid(session), true);
  assert.equal(isCardioPlanValid({ cardioIntensity: "Moderada", cardioMinutes: "" }), false);
  assert.equal(isCardioPlanValid({ cardioIntensity: "Moderada", cardioMinutes: "20.5" }), false);
  assert.equal(isCardioPlanValid({ cardioIntensity: "Moderada", cardioMinutes: "25" }), true);

  const summary = summarizeActiveSession({ ...session, cardioIntensity: "Moderada", cardioMinutes: "25" }, 0);
  assert.equal(summary.cardioMinutes, 25);
  assert.equal(summary.cardioIntensity, "Moderada");
});

const workout = {
  id: "workout-a",
  name: "Treino A",
  focus: "Força",
  estimatedMinutes: 30,
  warmup: [exercise("warmup", 1)],
  main: [exercise("squat")],
  cooldown: [],
  notices: [],
};

test("restores elapsed time from an absolute start timestamp", () => {
  const created = createActiveWorkoutSession(workout, 1_000);
  const started = beginActiveSession(created, 5_000);

  assert.equal(getElapsedSeconds(started, 70_500), 65);
});

test("persists the selected date and sequence action with the session", () => {
  const session = createActiveWorkoutSession(workout, Date.UTC(2026, 7, 6), { plannedDate: "2026-08-08", sequenceNumber: 4, sequenceAdvance: 2, sequenceAction: "manually_advanced" });

  assert.equal(session.plannedDate, "2026-08-08");
  assert.equal(session.sequenceNumber, 4);
  assert.equal(session.sequenceAdvance, 2);
  assert.equal(session.sequenceAction, "manually_advanced");
});

test("keeps rest timer correct across pause, resume and background time", () => {
  const session = beginActiveSession(createActiveWorkoutSession(workout, 0), 0);
  const resting = startRest(session, 60, 10_000);
  assert.equal(getRestRemainingSeconds(resting, 25_000), 45);

  const paused = pauseRest(resting, 25_000);
  assert.equal(getRestRemainingSeconds(paused, 90_000), 45);

  const extended = addRestSeconds(paused, 15, 90_000);
  const resumed = resumeRest(extended, 100_000);
  assert.equal(getRestRemainingSeconds(resumed, 130_000), 30);
});

test("summarizes completed series, volume and repetitions from persisted state", () => {
  let session = beginActiveSession(createActiveWorkoutSession(workout, 0), 0);
  session = {
    ...session,
    completedSeries: { warmup: [1], squat: [1, 2, 3] },
    loads: { squat: "20" },
    actualReps: { squat: "10" },
    rir: { squat: "2" },
    cardioMinutes: "12",
    cardioIntensity: "Leve",
  };
  const summary = summarizeActiveSession(session, 120_000);

  assert.equal(summary.completedExercises, 2);
  assert.equal(summary.totalVolumeKg, 600);
  assert.equal(summary.elapsedSeconds, 120);
  assert.equal(summary.cardioMinutes, 12);
});

test("stores different values per series and calculates the real volume", () => {
  let session = beginActiveSession(createActiveWorkoutSession(workout, 0), 0);
  session = completeSeriesPerformance(session, "warmup", 1, { durationSeconds: "180" }, 1_000);
  session = completeSeriesPerformance(session, "squat", 1, { loadKg: "20", repetitions: "12", rir: "3" }, 2_000);
  session = completeSeriesPerformance(session, "squat", 2, { loadKg: "22.5", repetitions: "10", rir: "2" }, 3_000);
  session = completeSeriesPerformance(session, "squat", 3, { loadKg: "25", repetitions: "8", rir: "1" }, 4_000);

  const summary = summarizeActiveSession(session, 5_000);
  assert.equal(summary.totalVolumeKg, 665);
  assert.equal(summary.estimatedOneRepMax, 31.7);
  assert.deepEqual(seriesPerformances(session, "squat", 3).map((entry) => entry.loadKg), ["20", "22.5", "25"]);
  assert.equal(summary.averageRir, 2);
});

test("records the actual rest time for the series", () => {
  let session = beginActiveSession(createActiveWorkoutSession(workout, 0), 0);
  session = completeSeriesPerformance(session, "squat", 1, { loadKg: "20", repetitions: "10" }, 5_000);
  session = startRest(session, 90, 10_000);
  session = patchActiveSession(session, { activeRestExerciseId: "squat", activeRestSeries: 1 }, 10_000);
  session = completeRest(session, 70_000);

  const firstSeries = seriesPerformances(session, "squat", 3)[0];
  assert.equal(firstSeries.actualRestSeconds, 60);
  assert.equal(firstSeries.restStatus, "completed");
  assert.equal(session.lastRestSeries, 1);
});

test("migrates an old exercise-level load into its completed series", () => {
  const legacy = createActiveWorkoutSession(workout, 0);
  delete legacy.seriesData;
  legacy.schemaVersion = 1;
  legacy.completedSeries = { squat: [1, 2, 3] };
  legacy.loads = { squat: "30" };
  legacy.actualReps = { squat: "8" };
  legacy.rir = { squat: "2" };

  const normalized = normalizeActiveWorkoutSession(legacy);
  assert.equal(normalized.schemaVersion, 2);
  assert.deepEqual(seriesPerformances(normalized, "squat", 3).map((entry) => [entry.completed, entry.loadKg, entry.repetitions, entry.rir]), [[true, "30", "8", "2"], [true, "30", "8", "2"], [true, "30", "8", "2"]]);
});

test("normalizes older persisted sessions and includes pain events in the summary", () => {


  const legacy = createActiveWorkoutSession(workout, 0);
  delete legacy.notes;
  delete legacy.exerciseOverrides;
  delete legacy.substitutions;
  delete legacy.painEvents;

  const normalized = normalizeActiveWorkoutSession(legacy);
  normalized.painEvents.push({ exerciseId: "squat", region: "Joelho direito", intensity: 5, recordedAt: new Date(0).toISOString() });
  const summary = summarizeActiveSession(normalized, 0);

  assert.equal(normalized.notes, undefined);
  assert.equal(summary.painScore, 5);
  assert.deepEqual(summary.symptoms, ["Joelho direito (5/10)"]);
});
test("uses the adjusted set recommendation and restores new rest progress fields", () => {
  const legacy = createActiveWorkoutSession(workout, 0);
  delete legacy.setOverrides;
  delete legacy.completedRestSeries;
  delete legacy.activeRestExerciseId;
  delete legacy.activeRestSeries;

  const normalized = normalizeActiveWorkoutSession(legacy);
  normalized.setOverrides = { squat: 2 };
  normalized.completedSeries = { warmup: [1], squat: [1, 2] };
  const summary = summarizeActiveSession(normalized, 0);

  assert.deepEqual(normalized.completedRestSeries, {});
  assert.equal(normalized.activeRestExerciseId, null);
  assert.equal(summary.completedExercises, 2);
});

test("qualifies attendance only after more than half of the planned series", () => {
  let session = beginActiveSession(createActiveWorkoutSession(workout, 0), 1_000);
  session = completeSeriesPerformance(session, "warmup", 1, {}, 2_000);
  session = completeSeriesPerformance(session, "squat", 1, {}, 3_000);
  assert.deepEqual(sessionCompletionProgress(session), { completedSeries: 2, totalSeries: 4, percentage: 50, moreThanHalf: false });

  session = completeSeriesPerformance(session, "squat", 2, {}, 4_000);
  assert.deepEqual(sessionCompletionProgress(session), { completedSeries: 3, totalSeries: 4, percentage: 75, moreThanHalf: true });
});

test("keeps blank feedback unknown and counts a completed blank series as activity", () => {
  let session = beginActiveSession(createActiveWorkoutSession(workout, 0), 0);
  assert.equal(hasMeaningfulSessionActivity(session), false);
  let series = seriesPerformances(session, "squat", 3)[0];
  session = completeSeriesPerformance(session, "squat", 1, series);
  assert.equal(hasMeaningfulSessionActivity(session), true);
  const summary = summarizeActiveSession(session, 0);
  assert.equal(summary.sessionRpe, undefined);
  assert.equal(summary.painScore, undefined);
});
