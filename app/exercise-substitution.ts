import type { Exercise } from "./workout-data";

const levelRank: Record<string, number> = { Iniciante: 1, Intermediário: 2, Avançado: 3 };

function normalized(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

function painAvoidCode(region = ""): string | null {
  const value = normalized(region);
  if (/joelho|patela|menisco/.test(value)) return "knee_acute";
  if (/lombar|coluna|ciatic/.test(value)) return "back_acute";
  if (/ombro|manguito/.test(value)) return "shoulder_acute";
  if (/punho|mao/.test(value)) return "wrist_acute";
  if (/tornozelo/.test(value)) return "ankle_acute";
  if (/cotovelo/.test(value)) return "elbow_acute";
  return null;
}

export type RankedSubstitution = {
  exercise: Exercise;
  explanation: string;
  score: number;
};

export function rankExerciseSubstitutions(options: {
  current: Exercise;
  candidates: Exercise[];
  experience: string;
  location: string;
  reason?: string;
  painRegion?: string;
  safetyAvoidCodes?: string[];
  previouslyPainfulExerciseIds?: string[];
}): RankedSubstitution[] {
  const painCode = painAvoidCode(options.painRegion);
  const expandedSafetyCodes = (options.safetyAvoidCodes || []).flatMap((code) => {
    if (["knee", "back", "shoulder", "wrist", "ankle", "elbow"].includes(code)) return [code, `${code}_acute`];
    if (code === "balance") return [code, "balance_issue"];
    return [code];
  });
  const avoidCodes = new Set([...expandedSafetyCodes, ...(painCode ? [painCode] : [])]);
  const painfulIds = new Set(options.previouslyPainfulExerciseIds || []);
  const equipmentUnavailable = options.reason === "equipment_unavailable" || normalized(options.reason || "").includes("equipamento indisponivel");
  const painReason = options.reason === "pain" || normalized(options.reason || "").includes("dor");
  const currentPrimary = normalized(options.current.primaryGroup || options.current.muscleGroups[0] || "");

  return options.candidates
    .filter((candidate) => candidate.id !== options.current.id)
    .filter((candidate) => candidate.locations.includes(options.location as "Academia" | "Em casa") || options.location === "Ambos")
    .filter((candidate) => (levelRank[candidate.level] || 1) <= (levelRank[options.experience] || 1))
    .filter((candidate) => !candidate.avoidWhen.some((code) => avoidCodes.has(code)))
    .filter((candidate) => !painfulIds.has(candidate.id))
    .filter((candidate) => !equipmentUnavailable || normalized(candidate.equipment) !== normalized(options.current.equipment))
    .map((candidate) => {
      const declaredAlternative = options.current.alternativeIds.includes(candidate.id);
      const sameMovement = candidate.movement === options.current.movement;
      const samePrimaryGroup = normalized(candidate.primaryGroup || candidate.muscleGroups[0] || "") === currentPrimary;
      const complexityDistance = Math.abs((candidate.complexity || 1) - (options.current.complexity || 1));
      const secondaryOverlap = candidate.muscleGroups.filter((group) => options.current.muscleGroups.includes(group)).length;
      const impactImprovement = painReason && candidate.impact === "baixo" ? 12 : 0;
      const score = (declaredAlternative ? 70 : 0) + (sameMovement ? 45 : 0) + (samePrimaryGroup ? 30 : 0) + secondaryOverlap * 5 + impactImprovement - complexityDistance * (painReason ? 8 : 5);
      const reasons = [sameMovement ? "mesmo movimento" : "movimento compatível", samePrimaryGroup ? "mesmo grupo muscular" : "grupo complementar", `${candidate.level.toLocaleLowerCase("pt-BR")}`];
      if (equipmentUnavailable) reasons.push("outro equipamento");
      if (painCode) reasons.push("sem a restrição registrada");
      return { exercise: candidate, score, explanation: reasons.join(" · ") };
    })
    .filter((item) => item.score >= 35)
    .sort((left, right) => right.score - left.score || left.exercise.name.localeCompare(right.exercise.name, "pt-BR"));
}
