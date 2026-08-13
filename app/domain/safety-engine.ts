import type { Exercise } from "../workout-data.ts";
import type { TrainingHistoryLike } from "../training-intelligence.ts";

export type SafetyDisposition = "allowed" | "allowedWithModification" | "avoid" | "blocked";
export type SafetyAssessment = { disposition: SafetyDisposition; allowed: boolean; reasons: string[]; modifications: string[] };

type SafetyProfile = {
  specialConditions?: string[];
  medicalClearance?: boolean;
  postpartumSymptoms?: string[];
  incisionHealed?: boolean;
  limitations?: string;
};

const REGION_CODES: Array<[RegExp, string]> = [[/joelho|patela/i, "knee_acute"], [/lombar|coluna|ci[aá]t/i, "back_acute"], [/ombro|manguito/i, "shoulder_acute"], [/punho|m[aã]o/i, "wrist_acute"], [/cotovelo/i, "elbow_acute"], [/tornozelo/i, "ankle_acute"]];

export function assessExerciseSafety(profile: SafetyProfile, exercise: Exercise, history: TrainingHistoryLike[] = []): SafetyAssessment {
  const conditions = new Set(profile.specialConditions || []);
  const limitations = profile.limitations || "";
  for (const [pattern, code] of REGION_CODES) if (pattern.test(limitations)) conditions.add(code.replace("_acute", ""));
  const reasons: string[] = [];
  const modifications: string[] = [];
  const severePostpartumSymptoms = (profile.postpartumSymptoms || []).some((value) => ["bleeding", "scar_pain", "pelvic_pressure", "pelvic_pain"].includes(value));
  if ((conditions.has("pregnancy") || conditions.has("cardiovascular")) && !profile.medicalClearance) return { disposition: "blocked", allowed: false, reasons: ["É necessária liberação profissional antes desta prescrição."], modifications };
  if ((conditions.has("postpartum") || conditions.has("cesarean")) && (severePostpartumSymptoms || (conditions.has("cesarean") && !profile.incisionHealed))) return { disposition: "blocked", allowed: false, reasons: ["Sintomas ou recuperação pós-parto exigem avaliação antes de continuar."], modifications };

  const avoidCodes = new Set<string>();
  if (conditions.has("postpartum") || conditions.has("cesarean")) avoidCodes.add("postpartum");
  if (conditions.has("pregnancy")) avoidCodes.add("pregnancy");
  for (const code of ["knee", "back", "shoulder", "wrist", "ankle", "elbow"]) if (conditions.has(code)) avoidCodes.add(`${code}_acute`);
  if (conditions.has("hypertension")) avoidCodes.add("hypertension");
  if (conditions.has("balance")) avoidCodes.add("balance_issue");
  if (exercise.avoidWhen.some((code) => avoidCodes.has(code))) {
    reasons.push("O perfil de segurança atual é incompatível com este exercício.");
    return { disposition: "avoid", allowed: false, reasons, modifications };
  }

  const painEvents = history.flatMap((session) => (session.painEvents || []).filter((event) => event.exerciseId === exercise.id));
  const legacyPain = history.filter((session) => (session.exerciseRecords || []).some((record) => record.exerciseId === exercise.id && record.painReported)).length;
  const matchingRegionCodes = painEvents.flatMap((event) => REGION_CODES.filter(([pattern]) => pattern.test(event.region)).map(([, code]) => code));
  const recurrentPain = legacyPain + painEvents.filter((event) => event.intensity >= 3).length >= 2;
  if (recurrentPain || exercise.avoidWhen.some((code) => matchingRegionCodes.includes(code))) {
    reasons.push("Há dor recorrente ou contextual associada a este padrão.");
    modifications.push("Reduzir amplitude, carga e custo de fadiga; oferecer substituição biomecânica.");
    return { disposition: "allowedWithModification", allowed: true, reasons, modifications };
  }
  if (conditions.has("hypertension") || conditions.has("cardiovascular")) modifications.push("Evitar prender a respiração e manter esforço submáximo.");
  return { disposition: modifications.length ? "allowedWithModification" : "allowed", allowed: true, reasons: reasons.length ? reasons : ["Nenhuma restrição transversal foi identificada para este exercício."], modifications };
}
