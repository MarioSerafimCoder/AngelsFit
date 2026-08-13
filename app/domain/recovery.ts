export type Recovery24h = "better" | "normal" | "worse" | "very_fatigued";

const RECOVERY_ALIASES: Record<string, Recovery24h> = {
  better: "better",
  melhor: "better",
  "bem recuperada": "better",
  "bem recuperado": "better",
  normal: "normal",
  igual: "normal",
  worse: "worse",
  pior: "worse",
  piorou: "worse",
  ruim: "worse",
  very_fatigued: "very_fatigued",
  "muito cansada": "very_fatigued",
  "muito cansado": "very_fatigued",
  "exaustão alta": "very_fatigued",
  "exaustao alta": "very_fatigued",
};

function normalized(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("pt-BR");
}

export function normalizeRecovery24h(value: unknown): Recovery24h | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  return RECOVERY_ALIASES[normalized(value)];
}

export const RECOVERY_LABELS: Record<Recovery24h, string> = {
  better: "Melhor",
  normal: "Normal",
  worse: "Pior",
  very_fatigued: "Exaustão alta",
};

export function isPoorRecovery(value: unknown): boolean {
  const recovery = normalizeRecovery24h(value);
  return recovery === "worse" || recovery === "very_fatigued";
}

