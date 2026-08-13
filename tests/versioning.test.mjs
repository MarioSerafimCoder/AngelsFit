import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  CONTENT_VERSION,
  CURRENT_DATA_SCHEMA_VERSION,
  DATA_SCHEMA_VERSION_KEY,
  compareVersions,
  runDataMigrations,
} from "../app/versioning.ts";

class MemoryStorage {
  values = new Map();
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, value); }
  removeItem(key) { this.values.delete(key); }
}

test("migrates sequentially from schema 1", () => {
  const storage = new MemoryStorage();
  storage.setItem(DATA_SCHEMA_VERSION_KEY, "1");

  assert.deepEqual(runDataMigrations(storage), [2, 3, 4, 5, 6, 7, 8]);
  assert.equal(storage.getItem(DATA_SCHEMA_VERSION_KEY), String(CURRENT_DATA_SCHEMA_VERSION));
});

test("migrates from the previous schema without replaying completed work", () => {
  const storage = new MemoryStorage();
  storage.setItem(DATA_SCHEMA_VERSION_KEY, "2");

  assert.deepEqual(runDataMigrations(storage), [3, 4, 5, 6, 7, 8]);
  assert.deepEqual(runDataMigrations(storage), []);
});

test("schema 4 preserves history while adding deterministic sequence data", () => {
  const storage = new MemoryStorage();
  storage.setItem(DATA_SCHEMA_VERSION_KEY, "3");
  storage.setItem("brasafit.history.v2", JSON.stringify([
    { id: "old-1", workoutName: "Treino A", completedAt: "2026-08-01T12:00:00.000Z" },
  ]));

  assert.deepEqual(runDataMigrations(storage), [4, 5, 6, 7, 8]);
  const [migrated] = JSON.parse(storage.getItem("brasafit.history.v2"));
  assert.equal(migrated.id, "old-1");
  assert.equal(migrated.status, "completed");
  assert.equal(migrated.sequenceNumber, 1);
  assert.equal(migrated.sequenceAdvance, 1);
});

test("schema 5 expands legacy exercise records and active sessions per series", () => {
  const storage = new MemoryStorage();
  storage.setItem(DATA_SCHEMA_VERSION_KEY, "4");
  storage.setItem("brasafit.history.v2", JSON.stringify([{ id: "h1", workoutName: "A", completedAt: "2026-08-10T12:00:00.000Z", exerciseRecords: [{ exerciseId: "squat", setsPlanned: 3, setsCompleted: 2, load: 20, repetitions: 10, rirOrRpe: 2 }] }]));
  storage.setItem("angelsfit.active-session.v1", JSON.stringify({ schemaVersion: 1, id: "s1", status: "active", createdAt: "2026-08-10T12:00:00.000Z", updatedAt: "2026-08-10T12:00:00.000Z", workout: { id: "a" }, currentExerciseIndex: 0, completedSeries: { squat: [1, 2] }, loads: { squat: "20" }, actualReps: { squat: "10" }, rir: { squat: "2" } }));

  assert.deepEqual(runDataMigrations(storage), [5, 6, 7, 8]);
  const [history] = JSON.parse(storage.getItem("brasafit.history.v2"));
  const session = JSON.parse(storage.getItem("angelsfit.active-session.v1"));
  assert.deepEqual(history.exerciseRecords[0].sets.map((entry) => entry.completed), [true, true, false]);
  assert.equal(session.schemaVersion, 3);
  assert.deepEqual(session.seriesData.squat.map((entry) => entry.loadKg), ["20", "20"]);
});

test("schema 6 converts legacy check-ins into non-advancing attendance", () => {
  const storage = new MemoryStorage();
  storage.setItem(DATA_SCHEMA_VERSION_KEY, "5");
  storage.setItem("brasafit.history.v2", "[]");
  storage.setItem("brasafit.checkins.v1", JSON.stringify([{ id: "c1", checkedAt: "2026-08-12T12:00:00.000Z" }]));
  assert.deepEqual(runDataMigrations(storage), [6, 7, 8]);
  const [attendance] = JSON.parse(storage.getItem("brasafit.history.v2"));
  assert.equal(attendance.status, "attendance_legacy");
  assert.equal(attendance.sequenceAdvance, 0);
});

test("schema 7 normalizes recovery and reconstructs derived quality without losing history", () => {
  const storage = new MemoryStorage();
  storage.setItem(DATA_SCHEMA_VERSION_KEY, "6");
  storage.setItem("brasafit.history.v2", JSON.stringify([{ id: "h7", workoutName: "A", completedAt: "2026-08-12T12:00:00.000Z", recovery24h: "Muito cansada", durationMinutes: 40, exerciseRecords: [{ exerciseId: "bench", setsPlanned: 3, setsCompleted: 2 }] }]));
  assert.deepEqual(runDataMigrations(storage), [7, 8]);
  const [history] = JSON.parse(storage.getItem("brasafit.history.v2"));
  assert.equal(history.id, "h7");
  assert.equal(history.recovery24h, "very_fatigued");
  assert.equal(typeof history.sessionQualityScore, "number");
});

test("schema 8 migrates localized cardio state inside an active session", () => {
  const storage = new MemoryStorage();
  storage.setItem(DATA_SCHEMA_VERSION_KEY, "7");
  storage.setItem("brasafit.history.v2", JSON.stringify([{ id: "h8", workoutName: "A", completedAt: "2026-08-12T12:00:00.000Z", exerciseRecords: [{ exerciseId: "bench", setsPlanned: 1, setsCompleted: 1, repetitions: 10, load: 20, rirOrRpe: 0, sets: [{ series: 1, completed: true, repetitions: 10, loadKg: 20, rir: null }] }] }]));
  storage.setItem("angelsfit.active-session.v1", JSON.stringify({ schemaVersion: 2, id: "s8", status: "active", createdAt: "2026-08-12T12:00:00.000Z", updatedAt: "2026-08-12T12:00:00.000Z", workout: { id: "a" }, currentExerciseIndex: 0, completedSeries: {}, seriesData: {}, loads: {}, actualReps: {}, rir: {}, cardioIntensity: "Moderada", plannedCardioIntensity: "Sem cardio hoje" }));
  assert.deepEqual(runDataMigrations(storage), [8]);
  const session = JSON.parse(storage.getItem("angelsfit.active-session.v1"));
  assert.equal(session.schemaVersion, 3);
  assert.equal(session.cardioIntensity, "moderate");
  assert.equal(session.plannedCardioIntensity, "none");
  const [history] = JSON.parse(storage.getItem("brasafit.history.v2"));
  assert.equal(history.exerciseRecords[0].rirOrRpe, undefined);
});

test("compares native and content versions numerically", () => {
  assert.equal(compareVersions("1.10.0", "1.2.0") > 0, true);
  assert.equal(compareVersions("1.0", "1.0.0"), 0);
});

test("keeps published metadata and the iPhone cache aligned with the content version", async () => {
  const metadata = JSON.parse(await readFile(new URL("../public/version.json", import.meta.url), "utf8"));
  const serviceWorker = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");
  const cacheVersion = CONTENT_VERSION.replaceAll(".", "-");

  assert.equal(metadata.contentVersion, CONTENT_VERSION);
  assert.equal(metadata.dataSchemaVersion, CURRENT_DATA_SCHEMA_VERSION);
  assert.match(serviceWorker, new RegExp(`CONTENT_VERSION = "${CONTENT_VERSION.replaceAll(".", "\\.")}"`));
  assert.match(serviceWorker, new RegExp(`CACHE_NAME = "angels-fit-shell-v\\d+-${cacheVersion}"`));
  assert.match(serviceWorker, /version\.json[\s\S]*cache: "no-store"/);
  assert.match(serviceWorker, /clients\.matchAll\(\{ type: "window", includeUncontrolled: true \}\)/);
  assert.match(serviceWorker, /client\.navigate\(url\.toString\(\)\)/);
  assert.match(serviceWorker, /fetch\(event\.request, \{ cache: "no-store" \}\)/);
});
