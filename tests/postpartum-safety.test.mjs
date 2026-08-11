import assert from "node:assert/strict";
import test from "node:test";

import { assessPostpartumSafety, generateProgram } from "../app/workout-engine.ts";

const now = new Date("2026-08-11T12:00:00");
const baseProfile = {
  goal: "Retorno aos treinos",
  experience: "Iniciante",
  days: ["Ter", "Qui"],
  duration: "45 min",
  location: "Academia",
  limitations: "",
  specialConditions: ["postpartum"],
  deliveryType: "Vaginal",
  medicalClearance: true,
  deliveryDate: "2026-06-02",
};

test("blocks postpartum programming until the delivery date and tenth week are reached", () => {
  const missingDate = generateProgram({ ...baseProfile, deliveryDate: "" }, { now });
  const beforeWeekTen = generateProgram({ ...baseProfile, deliveryDate: "2026-06-03" }, { now });
  const atWeekTen = generateProgram(baseProfile, { now });

  assert.equal(missingDate.status, "clearance_required");
  assert.equal(missingDate.workouts.length, 0);
  assert.match(missingDate.notices.join(" "), /data do parto/i);
  assert.equal(beforeWeekTen.status, "clearance_required");
  assert.match(beforeWeekTen.notices.join(" "), /10ª semana/i);
  assert.equal(atWeekTen.status, "ready");
  assert.ok(atWeekTen.workouts.length > 0);
});

test("requires professional clearance and confirmed cesarean healing", () => {
  const noClearance = assessPostpartumSafety({ ...baseProfile, medicalClearance: false }, now);
  const unhealedCesarean = generateProgram({ ...baseProfile, specialConditions: ["cesarean"], deliveryType: "Cesárea", incisionHealed: false }, { now });
  const healedCesarean = generateProgram({ ...baseProfile, specialConditions: ["cesarean"], deliveryType: "Cesárea", incisionHealed: true }, { now });

  assert.equal(noClearance.eligible, false);
  assert.match(noClearance.reasons.join(" "), /liberação/i);
  assert.equal(unhealedCesarean.status, "clearance_required");
  assert.match(unhealedCesarean.notices.join(" "), /cicatriz/i);
  assert.equal(healedCesarean.status, "ready");
});

test("blocks postpartum programming while alert symptoms are registered", () => {
  const program = generateProgram({ ...baseProfile, postpartumSymptoms: ["bleeding"] }, { now });

  assert.equal(program.status, "clearance_required");
  assert.equal(program.workouts.length, 0);
  assert.match(program.notices.join(" "), /sintomas de alerta/i);
});
