import assert from "node:assert/strict";
import test from "node:test";

import {
  BACKUP_FORMAT_VERSION,
  BackupValidationError,
  parseBackupJson,
} from "../app/backup.ts";

const profile = {
  id: "mario",
  name: "Mário",
  days: ["Seg", "Qua"],
};

test("restores legacy FitLocal and BrasaFit backups with safe defaults", () => {
  const backup = parseBackupJson(JSON.stringify({
    app: "FitLocal",
    version: 1,
    exportedAt: "2026-08-01T12:00:00.000Z",
    profile,
    history: [],
  }));

  assert.deepEqual(backup.profile, profile);
  assert.deepEqual(backup.measurements, []);
  assert.deepEqual(backup.checkIns, []);
  assert.equal(backup.activeSession, null);
  assert.equal(backup.settings, undefined);
});

test("parses a complete AngelsFit backup including preferences", () => {
  const settings = {
    theme: "light",
    preferences: { sound: true, vibration: false, keepAwake: true, workoutFontSize: "large" },
  };
  const backup = parseBackupJson(JSON.stringify({
    app: "AngelsFit",
    version: BACKUP_FORMAT_VERSION,
    exportedAt: "2026-08-09T18:00:00.000Z",
    profile,
    history: [{ id: "h1", workoutName: "Treino A", completedAt: "2026-08-08T12:00:00.000Z" }],
    measurements: [{ recordedAt: "2026-08-07T12:00:00.000Z", weightKg: 78.2 }],
    checkIns: [{ id: "c1", checkedAt: "2026-08-09T12:00:00.000Z" }],
    activeSession: null,
    settings,
  }));

  assert.equal(backup.history.length, 1);
  assert.equal(backup.measurements.length, 1);
  assert.equal(backup.checkIns.length, 1);
  assert.deepEqual(backup.settings, { ...settings, preferences: { ...settings.preferences, restNotifications: false } });
});

test("rejects malformed, foreign and future backup files", () => {
  assert.throws(() => parseBackupJson("not-json"), BackupValidationError);
  assert.throws(() => parseBackupJson(JSON.stringify({ app: "Outro", version: 1 })), /não foi criado/);
  assert.throws(() => parseBackupJson(JSON.stringify({
    app: "AngelsFit",
    version: BACKUP_FORMAT_VERSION + 1,
    exportedAt: "2026-08-09T18:00:00.000Z",
    profile,
    history: [],
  })), /versão mais nova/);
});
