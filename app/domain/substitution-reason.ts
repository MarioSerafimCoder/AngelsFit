export type SubstitutionReason = "equipment_unavailable" | "pain" | "technical_difficulty" | "preference" | "time" | "fatigue" | "other";

function normalized(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("pt-BR");
}

export function normalizeSubstitutionReason(value: unknown): SubstitutionReason {
  if (typeof value !== "string") return "other";
  const reason = normalized(value);
  if (reason === "equipment_unavailable" || /equipamento.*indisponivel/.test(reason)) return "equipment_unavailable";
  if (reason === "pain" || /dor|desconforto/.test(reason)) return "pain";
  if (reason === "technical_difficulty" || /dificuldade.*tecnic/.test(reason)) return "technical_difficulty";
  if (reason === "preference" || /preferencia/.test(reason)) return "preference";
  if (reason === "time" || /tempo/.test(reason)) return "time";
  if (reason === "fatigue" || /fadiga|cansaco/.test(reason)) return "fatigue";
  return "other";
}

