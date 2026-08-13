import assert from "node:assert/strict";
import test from "node:test";

import { EXERCISE_DATABASE_VERSION, exerciseById, exerciseMuscleGroups, exercises } from "../app/workout-data.ts";
import { generateProgram } from "../app/workout-engine.ts";

const baseProfile = {
  goal: "Hipertrofia",
  experience: "Iniciante",
  days: ["Seg"],
  duration: "45 min",
  location: "Academia",
  limitations: "",
  specialConditions: [],
  availableEquipment: [],
  createdAt: "2026-08-09T12:00:00.000Z",
};

test("imports the complete 182-exercise gym catalog without duplicating existing support entries", () => {
  const imported = [...exerciseById.values()].filter((exercise) => exercise.source === "Base academia 182");
  assert.equal(EXERCISE_DATABASE_VERSION, "5.0");
  assert.equal(imported.length, 182);
  assert.equal(exerciseMuscleGroups.length, 13);
  assert.equal(exercises.length, 240);
  assert.equal(new Set(exercises.map((exercise) => exercise.id)).size, exercises.length);
});

test("only prescribes movements at or below the user's effective experience", () => {
  const beginnerProgram = generateProgram(baseProfile, { now: new Date("2026-08-09T12:00:00.000Z") });
  const beginnerMain = beginnerProgram.workouts.flatMap((workout) => workout.main);
  assert.ok(beginnerMain.length > 0);
  assert.ok(beginnerMain.every((item) => item.exercise.level === "Iniciante"));
  assert.ok(beginnerMain.some((item) => item.exercise.source === "Base academia 182"));

  const intermediateProgram = generateProgram({ ...baseProfile, experience: "Intermediário", monthsConsistent: 18 }, { now: new Date("2026-08-09T12:00:00.000Z") });
  assert.ok(intermediateProgram.workouts.flatMap((workout) => workout.main).every((item) => item.exercise.level !== "Avançado"));
});

test("keeps the same movements during a phase so load and repetition progression remain measurable", () => {
  const weekOne = generateProgram(baseProfile, { now: new Date("2026-08-09T12:00:00.000Z") });
  const qualifiedHistory = [{
    id: "session-1",
    completedAt: "2026-08-10T12:00:00.000Z",
    status: "completed",
    periodizationTrack: "hypertrophy",
    completedExercises: 6,
    totalExercises: 6,
    sessionRpe: 7,
    painScore: 0,
    recovery24h: "Bem recuperada",
    exerciseRecords: [],
  }];
  const weekTwo = generateProgram(baseProfile, { now: new Date("2026-08-11T12:00:00.000Z"), history: qualifiedHistory });
  assert.equal(weekOne.periodization?.phase, weekTwo.periodization?.phase);
  assert.deepEqual(
    weekOne.workouts[0].main.map((item) => item.exercise.name),
    weekTwo.workouts[0].main.map((item) => item.exercise.name),
  );
});

test("caps beginners at three sets when observed frequency adapts the cycle", () => {
  const qualifiedHistory = Array.from({ length: 8 }, (_, index) => ({
    id: `session-${index + 1}`,
    completedAt: new Date(Date.UTC(2026, 7, index + 1, 12)).toISOString(),
    status: "completed",
    periodizationTrack: "hypertrophy",
    completedExercises: 6,
    totalExercises: 6,
    sessionRpe: 7,
    painScore: 0,
    recovery24h: "Bem recuperada",
    exerciseRecords: [],
  }));
  const program = generateProgram(baseProfile, { now: new Date("2026-08-10T12:00:00.000Z"), history: qualifiedHistory });
  assert.ok(program.workouts.flatMap((workout) => workout.main).every((item) => item.sets <= 3));
});

test("cycle recovery score protects periodized volume and load", () => {
  const difficultHistory = Array.from({ length: 8 }, (_, index) => ({
    id: `difficult-${index}`,
    completedAt: new Date(Date.UTC(2026, 7, index + 1, 12)).toISOString(),
    status: "partial",
    periodizationTrack: "hypertrophy",
    durationMinutes: 35,
    completedExercises: 2,
    totalExercises: 6,
    sessionRpe: 10,
    painScore: 6,
    recovery24h: "Piorou",
    exerciseRecords: [],
  }));
  const program = generateProgram(baseProfile, { now: new Date("2026-08-10T12:00:00.000Z"), history: difficultHistory });
  assert.ok(["regress", "deload"].includes(program.periodization?.decision || ""));
  assert.ok((program.periodization?.volumeMultiplier || 1) <= 0.8);
  assert.ok((program.periodization?.loadMultiplier || 1) <= 0.9);
  assert.match(program.periodization?.reason || "", /score de prontidão|recuperação/i);
});
