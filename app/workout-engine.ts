import { EXERCISE_DATABASE_VERSION, exerciseById, exercises, type Exercise } from "./workout-data.ts";
import { POSTPARTUM_BLOCKS, type PostpartumPrescription } from "./postpartum-program.ts";
import { recommendedWorkoutIndex, type TrainingHistoryLike } from "./training-intelligence.ts";
import { defaultRestSeconds } from "./rest-policy.ts";
import { buildPeriodizationPlan, exerciseProgressionGuidance, upperRepetitionTarget, type PeriodizationPlan } from "./periodization.ts";
import { fitWorkoutToTime } from "./workout-planning.ts";
import { buildAdaptivePlan } from "./domain/adaptive-training.ts";
import { buildExerciseState } from "./domain/exercise-state.ts";
import { buildMuscleState } from "./domain/muscle-state.ts";
import { prescribeAdaptiveDose, prescribedWeeklySetsByMuscle } from "./domain/dose-response.ts";
import { assessExerciseSafety } from "./domain/safety-engine.ts";
import { exerciseDoseMetadata, stimulusFatigueScore } from "./domain/stimulus-fatigue.ts";
import { isPoorRecovery } from "./domain/recovery.ts";
import type { ExercisePriority } from "./domain/types.ts";

export type ProfileForGeneration = {
  goal: string;
  experience: string;
  days: string[];
  duration: string;
  location: string;
  limitations: string;
  specialConditions?: string[];
  medicalClearance?: boolean;
  createdAt?: string;
  secondaryGoals?: string[];
  monthsConsistent?: number;
  monthsSinceTraining?: number;
  averageSleepHours?: number;
  stressLevel?: string;
  recoveryFeeling?: string;
  availableEquipment?: string[];
  preferredExercises?: string;
  rejectedExercises?: string;
  deliveryDate?: string;
  deliveryType?: string;
  incisionHealed?: boolean;
  postpartumSymptoms?: string[];
};

export type GenerationContext = {
  history?: TrainingHistoryLike[];
  now?: Date;
};

export type GeneratedExercise = {
  exercise: Exercise;
  sets: number;
  reps: string;
  rest: number;
  tempo: string;
  loadSuggestion: string;
  targetRpe: string;
  note: string;
  priority?: ExercisePriority;
  adaptiveReasons?: string[];
};

export type GeneratedWorkout = {
  id: string;
  name: string;
  focus: string;
  estimatedMinutes: number;
  targetMinutes?: number;
  warmup: GeneratedExercise[];
  main: GeneratedExercise[];
  cooldown: GeneratedExercise[];
  notices: string[];
};

export type GeneratedProgram = {
  databaseVersion: string;
  status: "ready" | "clearance_required";
  title: string;
  summary: string;
  split: string;
  workouts: GeneratedWorkout[];
  safetyCodes: string[];
  notices: string[];
  cycleNumber: number;
  validFrom: string;
  validUntil: string;
  daysRemaining: number;
  todayWorkoutIndex: number;
  progressionNote: string;
  effectiveExperience: string;
  recoveryClass: string;
  effectiveDays: number;
  specialPhase?: string;
  phaseCompletedSessions?: number;
  phaseRequiredSessions?: number;
  recommendationReason?: string;
  periodization?: PeriodizationPlan;
  adaptiveConfidence?: "low" | "medium" | "high";
  adaptiveReasons?: string[];
  calibrationStatus?: "calibrating" | "calibrated";
};

export const specialConditionOptions = [
  { id: "postpartum", label: "Pós-parto" },
  { id: "cesarean", label: "Pós-cesárea" },
  { id: "pregnancy", label: "Gestação" },
  { id: "knee", label: "Dor no joelho" },
  { id: "back", label: "Dor lombar" },
  { id: "shoulder", label: "Dor no ombro" },
  { id: "hypertension", label: "Hipertensão" },
  { id: "cardiovascular", label: "Condição cardíaca" },
  { id: "diabetes", label: "Diabetes" },
  { id: "balance", label: "Equilíbrio reduzido" },
  { id: "low_impact", label: "Somente baixo impacto" },
];

const patterns: Array<[string, RegExp]> = [
  ["postpartum", /p[oó]s[- ]?parto|puerp[eé]rio/i],
  ["cesarean", /ces[aá]rea|cesariana|cicatriz abdominal/i],
  ["pregnancy", /gesta(?:nte|ç[aã]o)|gr[aá]vida/i],
  ["knee", /joelho|patela|menisco/i],
  ["back", /lombar|coluna|h[eé]rnia de disco|ci[aá]tica/i],
  ["shoulder", /ombro|manguito|bursite/i],
  ["hypertension", /hipertens|press[aã]o alta/i],
  ["cardiovascular", /card[ií]ac|cardiovascular|arritmia/i],
  ["diabetes", /diabet|hipoglicemia/i],
  ["balance", /equil[ií]brio|tontura/i],
  ["low_impact", /baixo impacto|sem impacto/i],
  ["wrist", /punho|m[aã]o/i],
  ["ankle", /tornozelo/i],
  ["elbow", /cotovelo/i],
  ["abdominal_symptoms", /di[aá]stase|press[aã]o p[eé]lvica|escape urin[aá]rio|dor abdominal/i],
];

const redFlagPattern = /dor no peito|desmaio|falta de ar (?:em repouso|intensa)|sangramento aumentado|febre|press[aã]o (?:descontrolada|muito alta)|cirurgia recente|p[oó]s[- ]?operat[oó]rio recente/i;

function unique<T>(items: T[]) { return [...new Set(items)]; }

export function detectSafetyCodes(profile: ProfileForGeneration) {
  const text = profile.limitations || "";
  const codes = [...(profile.specialConditions || [])];
  for (const [code, pattern] of patterns) if (pattern.test(text)) codes.push(code);
  if (redFlagPattern.test(text)) codes.push("red_flag");
  return unique(codes);
}

function safetyAvoidCodes(codes: string[]) {
  const avoid: string[] = [];
  if (codes.includes("postpartum") || codes.includes("cesarean")) avoid.push("postpartum", "abdominal_symptoms");
  if (codes.includes("pregnancy")) avoid.push("pregnancy", "postpartum", "abdominal_symptoms");
  if (codes.includes("knee")) avoid.push("knee_acute");
  if (codes.includes("back")) avoid.push("back_acute");
  if (codes.includes("shoulder")) avoid.push("shoulder_acute");
  if (codes.includes("hypertension")) avoid.push("hypertension");
  if (codes.includes("cardiovascular")) avoid.push("cardiovascular");
  if (codes.includes("balance")) avoid.push("balance_issue");
  if (codes.includes("wrist")) avoid.push("wrist_acute");
  if (codes.includes("ankle")) avoid.push("ankle_acute");
  if (codes.includes("elbow")) avoid.push("elbow_acute");
  if (codes.includes("abdominal_symptoms")) avoid.push("abdominal_symptoms");
  return unique(avoid);
}

function safetyNotices(codes: string[]) {
  const notices: string[] = [];
  if (codes.includes("postpartum") || codes.includes("cesarean")) notices.push("Interrompa se houver dor abdominal, pressão pélvica, escape urinário, sangramento aumentado ou desconforto na cicatriz.");
  if (codes.includes("knee")) notices.push("Use amplitude sem dor e interrompa se o joelho piorar durante ou após o exercício.");
  if (codes.includes("back")) notices.push("Mantenha carga leve e coluna confortável; dor irradiada, formigamento ou perda de força exigem avaliação.");
  if (codes.includes("shoulder")) notices.push("Evite amplitude dolorosa e movimentos acima da cabeça enquanto houver sintomas.");
  if (codes.includes("hypertension")) notices.push("Respire continuamente, não faça manobra de Valsalva e mantenha esforço moderado.");
  if (codes.includes("diabetes")) notices.push("Tenha fonte de carboidrato disponível e siga a orientação pessoal de monitoramento da glicose.");
  if (codes.includes("balance")) notices.push("Faça exercícios perto de apoio estável e evite mudanças rápidas de direção.");
  if (codes.includes("low_impact")) notices.push("A sessão foi limitada a opções de baixo impacto.");
  return notices;
}

function scheme(profile: ProfileForGeneration, safetyCodes: string[]) {
  const beginner = profile.experience === "Iniciante" || profile.goal === "Retorno aos treinos";
  const rest = defaultRestSeconds(profile, safetyCodes);
  if (profile.goal === "Força") return { sets: beginner ? 3 : 4, reps: beginner ? "6–8" : "4–6", rest, tempo: "2–1–2", rpe: beginner ? "RPE 6" : "RPE 7" };
  if (profile.goal === "Condicionamento") return { sets: beginner ? 2 : 3, reps: "10–15", rest, tempo: "controlado", rpe: beginner ? "RPE 5–6" : "RPE 7" };
  if (profile.goal === "Mobilidade") return { sets: 2, reps: "6–10 lentas", rest, tempo: "3–2–3", rpe: "RPE 4–5" };
  if (profile.goal === "Retorno aos treinos") return { sets: 2, reps: "8–12", rest, tempo: "3–1–2", rpe: "RPE 5–6" };
  if (profile.goal === "Hipertrofia") return { sets: beginner ? 3 : 4, reps: "8–12", rest, tempo: "3–1–2", rpe: beginner ? "RPE 6" : "RPE 7–8" };
  return { sets: beginner ? 2 : 3, reps: "8–12", rest, tempo: "3–1–2", rpe: beginner ? "RPE 6" : "RPE 7–8" };
}

function workoutTemplates(days: number) {
  if (days <= 1) return [{ name: "A — Corpo inteiro", focus: "full" }];
  if (days === 2) return [{ name: "A — Corpo inteiro", focus: "full" }, { name: "B — Corpo inteiro", focus: "full" }];
  if (days === 3) return [{ name: "A — Superiores", focus: "upper" }, { name: "B — Inferiores e core", focus: "lower" }, { name: "C — Corpo inteiro", focus: "full" }];
  if (days === 4) return [{ name: "A — Superiores", focus: "upper" }, { name: "B — Inferiores", focus: "lower" }, { name: "C — Superiores", focus: "upper" }, { name: "D — Inferiores e core", focus: "lower" }];
  return [{ name: "A — Empurrar", focus: "push" }, { name: "B — Puxar", focus: "pull" }, { name: "C — Inferiores", focus: "lower" }, { name: "D — Superiores", focus: "upper" }, { name: "E — Corpo inteiro", focus: "full" }];
}

type TrainingSlot = { movements: Exercise["movement"][]; groups?: string[] };

const focusSlots: Record<string, TrainingSlot[]> = {
  full: [
    { movements: ["squat"], groups: ["Quadríceps", "Glúteos"] },
    { movements: ["horizontal_push"], groups: ["Peito"] },
    { movements: ["horizontal_pull"], groups: ["Costas"] },
    { movements: ["hinge"], groups: ["Posteriores de coxa", "Corpo inteiro e potência"] },
    { movements: ["vertical_push", "upper_accessory"], groups: ["Ombros"] },
    { movements: ["vertical_pull"], groups: ["Costas"] },
    { movements: ["core"], groups: ["Core"] },
    { movements: ["lower_accessory", "arms"] },
  ],
  upper: [
    { movements: ["horizontal_push"], groups: ["Peito"] },
    { movements: ["horizontal_pull"], groups: ["Costas"] },
    { movements: ["vertical_push"], groups: ["Ombros"] },
    { movements: ["vertical_pull"], groups: ["Costas"] },
    { movements: ["upper_accessory"], groups: ["Ombros"] },
    { movements: ["arms"], groups: ["Bíceps"] },
    { movements: ["arms"], groups: ["Tríceps"] },
    { movements: ["core"], groups: ["Core"] },
  ],
  lower: [
    { movements: ["squat"], groups: ["Quadríceps"] },
    { movements: ["hinge"], groups: ["Posteriores de coxa"] },
    { movements: ["glute"], groups: ["Glúteos"] },
    { movements: ["lower_accessory"], groups: ["Adutores e abdutores"] },
    { movements: ["squat", "glute"], groups: ["Glúteos", "Quadríceps"] },
    { movements: ["lower_accessory"], groups: ["Panturrilhas e tibial"] },
    { movements: ["core"], groups: ["Core"] },
    { movements: ["cardio"] },
  ],
  push: [
    { movements: ["horizontal_push"], groups: ["Peito"] },
    { movements: ["vertical_push"], groups: ["Ombros"] },
    { movements: ["upper_accessory"], groups: ["Ombros"] },
    { movements: ["arms"], groups: ["Tríceps"] },
    { movements: ["squat"], groups: ["Quadríceps"] },
    { movements: ["core"], groups: ["Core"] },
    { movements: ["cardio"] },
  ],
  pull: [
    { movements: ["horizontal_pull"], groups: ["Costas"] },
    { movements: ["vertical_pull"], groups: ["Costas"] },
    { movements: ["hinge"], groups: ["Posteriores de coxa", "Corpo inteiro e potência"] },
    { movements: ["arms"], groups: ["Bíceps", "Antebraços e pegada"] },
    { movements: ["upper_accessory"], groups: ["Ombros"] },
    { movements: ["core"], groups: ["Core"] },
    { movements: ["cardio"] },
  ],
};

const experienceRank: Record<string, number> = { Iniciante: 1, Intermediário: 2, Avançado: 3 };

function normalizedText(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

function matchesSlot(exercise: Exercise, slot: TrainingSlot) {
  if (!slot.movements.includes(exercise.movement)) return false;
  if (!slot.groups?.length) return true;
  const group = normalizedText(exercise.primaryGroup || exercise.muscleGroups[0] || "");
  return slot.groups.some((candidate) => group === normalizedText(candidate));
}

function targetComplexity(profile: ProfileForGeneration, periodization: PeriodizationPlan) {
  const base = profile.experience === "Iniciante" ? 1 : profile.experience === "Intermediário" ? 2 : 3;
  const phaseBonus = periodization.isDeload || periodization.phase.toLocaleLowerCase("pt-BR").includes("base")
    ? 0
    : periodization.phase.toLocaleLowerCase("pt-BR").includes("intens")
      ? 2
      : 1;
  return Math.min(5, base + phaseBonus);
}

function isAllowed(exercise: Exercise, profile: ProfileForGeneration, avoidCodes: string[], lowImpact: boolean) {
  if (profile.location === "Em casa" && !exercise.locations.includes("Em casa")) return false;
  if (profile.location === "Academia" && !exercise.locations.includes("Academia")) return false;
  if ((experienceRank[exercise.level] || 1) > (experienceRank[profile.experience] || 1)) return false;
  if (lowImpact && exercise.impact !== "baixo") return false;
  return !exercise.avoidWhen.some((code) => avoidCodes.includes(code));
}

function prescribe(exercise: Exercise, profile: ProfileForGeneration, codes: string[], section: "warmup" | "main" | "cooldown", periodization?: PeriodizationPlan, history: TrainingHistoryLike[] = [], priority: ExercisePriority = "B"): GeneratedExercise {
  if (section === "warmup") return { exercise, sets: 1, reps: "4–6 min", rest: 0, tempo: "leve", loadSuggestion: "Sem carga", targetRpe: "RPE 3–4", note: "Prepare o corpo sem fadigar.", priority: "B" };
  if (section === "cooldown") return { exercise, sets: 1, reps: "45–60 s", rest: 0, tempo: "confortável", loadSuggestion: "Sem carga", targetRpe: "RPE 2–3", note: "Sem forçar amplitude.", priority: "C" };
  const base = scheme(profile, codes);
  const conservative = codes.some((code) => ["postpartum", "cesarean", "pregnancy", "hypertension", "cardiovascular", "back", "knee", "shoulder"].includes(code));
  if (exercise.movement === "cardio") {
    const reps = periodization?.track === "conditioning" ? periodization.repetitionTarget : "12–20 min";
    return {
      exercise,
      sets: 1,
      reps,
      rest: 0,
      tempo: periodization?.track === "conditioning" ? periodization.phase.toLowerCase() : "leve/moderado",
      loadSuggestion: "Ajuste pela respiração e pelo talk test",
      targetRpe: periodization?.track === "conditioning" ? periodization.effortTarget : "RPE 3–5",
      note: periodization?.progressionFocus || "Mantenha conversa confortável e evite acumular fadiga desnecessária.",
    };
  }
  const periodizedSets = periodization ? Math.max(1, Math.round(base.sets * periodization.volumeMultiplier)) : base.sets;
  const clinicalSetCap = periodization?.track === "clinical" ? (periodization.cycleWeek <= 2 ? 2 : periodization.cycleWeek <= 6 ? 3 : 4) : periodization?.track === "pregnancy" ? 3 : 2;
  const experienceSetCap = profile.experience === "Iniciante" ? 3 : 5;
  const prescribedSets = Math.min(periodizedSets, experienceSetCap, conservative ? clinicalSetCap : 5);
  const periodizedReps = periodization?.track === "conditioning" ? base.reps : periodization?.repetitionTarget || base.reps;
  const targetRir = /RPE\s*(\d+)/i.test(periodization?.effortTarget || base.rpe) ? Math.max(0, 10 - Number((periodization?.effortTarget || base.rpe).match(/\d+/)?.[0] || 8)) : 2;
  const state = buildExerciseState({ exerciseId: exercise.id, history, repRange: periodizedReps, targetRir });
  const progressionLoad = state.suggestedAction === "progress" ? state.suggestedLoad : null;
  const progression = progressionLoad
    ? `Próxima referência: ${String(progressionLoad).replace(".", ",")} kg. ${state.reasons[0]}`
    : periodization
    ? exerciseProgressionGuidance({ history, exerciseId: exercise.id, upperRepetitionTarget: upperRepetitionTarget(periodizedReps), periodization })
    : "Mantenha a carga enquanto acumula repetições com técnica estável.";
  const bodyweight = exercise.equipment === "Nenhum" || exercise.equipment.includes("Parede") || exercise.equipment.includes("Colchonete");
  return {
    exercise,
    sets: prescribedSets,
    reps: exercise.movement === "core" && exercise.tags.includes("isometria") ? "15–25 s" : periodizedReps,
    rest: conservative ? Math.max(base.rest, 75) : base.rest,
    tempo: base.tempo,
    loadSuggestion: bodyweight ? `Peso corporal · ${progression}` : progression,
    targetRpe: conservative && !periodization ? "RPE 5–6" : periodization?.effortTarget || base.rpe,
    note: `${periodization?.progressionFocus || "A última repetição deve permanecer tecnicamente limpa."} ${conservative ? "Pare ao primeiro sinal de piora dos sintomas." : "Progrida apenas uma variável por vez."}`,
    priority,
    adaptiveReasons: state.reasons.slice(0, 2),
  };
}

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function equipmentStyle(exercise: Exercise) {
  if (exercise.tags.includes("maquina")) return "machine";
  if (exercise.tags.includes("cabo")) return "cable";
  if (exercise.tags.includes("peso-livre") || /Halter|Barra|anilhas/i.test(exercise.equipment)) return "free";
  return "conventional";
}

function classifyExperience(profile: ProfileForGeneration, codes: string[]) {
  if (codes.some((code) => ["postpartum", "cesarean"].includes(code))) return "Iniciante";
  if ((profile.monthsSinceTraining || 0) >= 6 || (profile.monthsConsistent !== undefined && profile.monthsConsistent < 6)) return "Iniciante";
  if (profile.experience === "Avançado" && (profile.monthsConsistent || 0) < 24) return "Intermediário";
  return profile.experience || "Iniciante";
}

function classifyRecovery(profile: ProfileForGeneration, codes: string[], history: GenerationContext["history"] = []) {
  const lowSignals = [
    (profile.averageSleepHours || 8) < 6,
    profile.stressLevel === "Alto",
    profile.recoveryFeeling === "Ruim",
    codes.some((code) => ["postpartum", "cesarean", "back", "knee"].includes(code)),
    history.slice(0, 3).some((item) => (item.painScore || 0) >= 4 || isPoorRecovery(item.recovery24h)),
  ].filter(Boolean).length;
  if (lowSignals >= 2) return "Baixa";
  if ((profile.averageSleepHours || 0) >= 7 && profile.stressLevel === "Baixo" && profile.recoveryFeeling === "Boa") return "Alta";
  return "Média";
}

function effectiveFrequency(profile: ProfileForGeneration, experience: string, recovery: string, adaptiveDays?: number) {
  const desired = Math.max(1, adaptiveDays || profile.days.length || 3);
  const experienceLimit = experience === "Iniciante" ? 4 : experience === "Intermediário" ? 5 : 6;
  const recoveryLimit = recovery === "Baixa" ? 4 : recovery === "Média" ? 5 : 6;
  return Math.min(desired, experienceLimit, recoveryLimit);
}

function matchesAvailableEquipment(exercise: Exercise, selected: string[] = []) {
  if (!selected.length) return true;
  const equipment = `${exercise.equipment} ${exercise.tags.join(" ")}`.toLocaleLowerCase("pt-BR");
  if (/nenhum|parede|colchonete|banco|apoio|degrau/.test(equipment)) return true;
  if (/máquina|maquina|leg press|esteira|bicicleta|elíptico|remo ergômetro/.test(equipment)) return selected.includes("Máquinas");
  if (/polia|cabo/.test(equipment)) return selected.includes("Cabos");
  if (/halter|kettlebell/.test(equipment)) return selected.includes("Halteres");
  if (/barra|rack|landmine|anilhas/.test(equipment)) return selected.includes("Barra e anilhas");
  if (/elástico/.test(equipment)) return selected.includes("Elásticos");
  return true;
}

function reviewPreviousCycle(history: NonNullable<GenerationContext["history"]>, plannedSessions: number) {
  if (!history.length) return { action: "reference" as const, adherence: 0 };
  const completed = history.filter((item) => (item.completedExercises || 0) / Math.max(1, item.totalExercises || 0) >= 0.7);
  const adherence = completed.length / Math.max(1, plannedSessions);
  const symptomsWorsened = history.some((item) => (item.painScore || 0) >= 4 || (item.symptoms || []).length > 0 || isPoorRecovery(item.recovery24h));
  const poorRecovery = history.some((item) => (item.sessionRpe || 0) >= 9 || isPoorRecovery(item.recovery24h));
  if (symptomsWorsened) return { action: "regress" as const, adherence };
  if (adherence < 0.6 || poorRecovery) return { action: "simplify" as const, adherence };
  if (adherence < 0.8) return { action: "maintain" as const, adherence };
  return { action: "progress" as const, adherence };
}

function postpartumGeneratedExercise(item: PostpartumPrescription): GeneratedExercise | null {
  const exercise = exerciseById.get(item.exerciseId);
  if (!exercise) return null;
  return {
    exercise,
    sets: item.sets,
    reps: item.reps,
    rest: item.rest,
    tempo: "controlado",
    loadSuggestion: /Nenhum|Colchonete|Parede|apoio/i.test(exercise.equipment) ? "Peso corporal" : "Carga conservadora; ajustar pela primeira série",
    targetRpe: item.rpe,
    note: item.note,
  };
}

function safeDate(value: string | undefined) {
  if (!value) return null;
  const date = startOfLocalDay(new Date(`${value}T12:00:00`));
  return Number.isNaN(date.getTime()) ? null : date;
}

export type PostpartumSafetyAssessment = {
  applicable: boolean;
  eligible: boolean;
  postpartumWeeks: number | null;
  reasons: string[];
};

export function assessPostpartumSafety(profile: ProfileForGeneration, now = new Date()): PostpartumSafetyAssessment {
  const codes = detectSafetyCodes(profile);
  const applicable = codes.some((code) => ["postpartum", "cesarean"].includes(code));
  if (!applicable) return { applicable: false, eligible: true, postpartumWeeks: null, reasons: [] };

  const delivery = safeDate(profile.deliveryDate);
  const currentDay = startOfLocalDay(now);
  const postpartumDays = delivery ? Math.floor((currentDay.getTime() - delivery.getTime()) / 86_400_000) : null;
  const postpartumWeeks = postpartumDays === null ? null : Math.floor(postpartumDays / 7);
  const cesarean = codes.includes("cesarean") || /ces[aá]rea/i.test(profile.deliveryType || "");
  const severeSymptoms = (profile.postpartumSymptoms || []).some((item) => ["bleeding", "scar_pain", "pelvic_pressure", "pelvic_pain"].includes(item));
  const reasons: string[] = [];

  if (!delivery) reasons.push("Informe a data do parto antes de gerar o programa pós-parto.");
  else if (postpartumWeeks !== null && postpartumWeeks < 10) reasons.push("O programa estruturado começa a partir da 10ª semana pós-parto.");
  if (!profile.medicalClearance) reasons.push("Registre a liberação de profissional habilitado antes de iniciar.");
  if (cesarean && !profile.incisionHealed) reasons.push("Confirme que a cicatriz está fechada e sem sinais de infecção.");
  if (severeSymptoms) reasons.push("Há sintomas de alerta registrados; procure avaliação antes de iniciar ou retomar o programa.");

  return { applicable, eligible: reasons.length === 0, postpartumWeeks, reasons };
}

function postpartumProgram(profile: ProfileForGeneration, context: GenerationContext, codes: string[], now: Date, notices: string[]): GeneratedProgram | null {
  if (!codes.some((code) => ["postpartum", "cesarean"].includes(code))) return null;
  const delivery = safeDate(profile.deliveryDate);
  if (!delivery) return null;
  const postpartumDays = Math.max(0, Math.floor((now.getTime() - delivery.getTime()) / 86_400_000));
  const postpartumWeeks = Math.floor(postpartumDays / 7);
  const blockIndex = Math.min(POSTPARTUM_BLOCKS.length - 1, Math.max(0, Math.floor((postpartumWeeks - 10) / 2)));
  const requestedBlock = POSTPARTUM_BLOCKS[blockIndex];
  const anchor = delivery;
  const priorBlockStart = new Date(anchor); priorBlockStart.setDate(priorBlockStart.getDate() + Math.max(10, 10 + (blockIndex - 1) * 2) * 7);
  const cycleStart = new Date(anchor); cycleStart.setDate(cycleStart.getDate() + (10 + blockIndex * 2) * 7);
  const cycleEnd = new Date(cycleStart); cycleEnd.setDate(cycleEnd.getDate() + 13);
  const priorHistory = (context.history || []).filter((item) => { const date = new Date(item.completedAt); return date >= priorBlockStart && date < cycleStart; });
  const currentBlockHistory = (context.history || []).filter((item) => { const date = new Date(item.completedAt); return date >= cycleStart && date <= cycleEnd && (item.status || "completed") === "completed"; });
  const review = reviewPreviousCycle(priorHistory, blockIndex > 0 ? POSTPARTUM_BLOCKS[blockIndex - 1].totalDays * 2 : requestedBlock.totalDays * 2);
  const block = POSTPARTUM_BLOCKS[blockIndex];
  const workouts = block.sessions.map((session, sessionIndex) => {
    const warmup = session.warmupIds.map((id) => exerciseById.get(id)).filter((item): item is Exercise => Boolean(item)).map((exercise) => ({ exercise, sets: 1, reps: exercise.movement === "warmup" ? "5 ciclos" : "5-7 min", rest: 0, tempo: "leve", loadSuggestion: "Sem carga", targetRpe: "RPE 2-3", note: "Preparar sem fadigar e observar sintomas." }));
    let main = session.main.map(postpartumGeneratedExercise).filter((item): item is GeneratedExercise => Boolean(item));
    if (["simplify", "regress"].includes(review.action)) main = main.slice(0, Math.max(4, main.length - 2)).map((item) => ({ ...item, sets: Math.max(1, item.sets - 1), targetRpe: "RPE 4-5" }));
    const cooldown = ["breathing_reset", session.kind === "strength" ? "hip_flexor_stretch" : "thoracic_rotation"].map((id) => exerciseById.get(id)).filter((item): item is Exercise => Boolean(item)).map((exercise) => ({ exercise, sets: 1, reps: exercise.movement === "cooldown" ? "45-60 s" : "5 ciclos", rest: 0, tempo: "confortável", loadSuggestion: "Sem carga", targetRpe: "RPE 2", note: "Encerrar relaxada e sem piora de sintomas." }));
    return { id: `postpartum-${block.block}-${sessionIndex + 1}`, name: session.name, focus: session.focus, estimatedMinutes: session.minutes, warmup, main, cooldown, notices };
  });
  const daysRemaining = Math.max(1, Math.floor((cycleEnd.getTime() - now.getTime()) / 86_400_000) + 1);
  const blockWeek = Math.min(2, Math.max(1, Math.floor(Math.max(0, now.getTime() - cycleStart.getTime()) / (7 * 86_400_000)) + 1));
  const progressionNote = review.action === "regress" ? "Sintomas relevantes foram registrados; o bloco foi reduzido e não deve progredir até a resposta voltar ao nível habitual." : review.action === "simplify" ? "O volume foi reduzido para recuperar aderência antes de progredir." : review.action === "progress" ? block.secondWeekRule : block.objective;
  const programLabel = codes.includes("cesarean") || /ces[aá]rea/i.test(profile.deliveryType || "") ? "Pós-cesárea" : "Pós-parto";
  return {
    databaseVersion: EXERCISE_DATABASE_VERSION, status: "ready", title: `${programLabel} · bloco ${block.block}`, summary: `Semana ${postpartumWeeks} pós-parto · ciclo de 14 dias, no máximo ${block.strengthDays} dias de força por semana.`, split: block.sessions.map((session) => session.name).join(" · "), workouts, safetyCodes: codes,
    notices, cycleNumber: block.block, validFrom: toDateKey(cycleStart), validUntil: toDateKey(cycleEnd), daysRemaining, todayWorkoutIndex: recommendedWorkoutIndex(context.history || [], workouts.length),
    progressionNote, effectiveExperience: "Iniciante", recoveryClass: "Baixa", effectiveDays: block.totalDays, specialPhase: `Semana ${postpartumWeeks} pós-parto · ${block.rpe}`,
    recommendationReason: "O próximo treino segue a ordem das sessões concluídas, mesmo quando um dia planejado é perdido.",
    periodization: {
      track: "clinical", model: "Blocos pós-parto por critérios", cycleNumber: block.block, cycleLengthWeeks: 2, cycleWeek: blockWeek,
      phase: `Bloco ${block.block}`, phaseWeek: blockWeek, phaseLengthWeeks: 2, qualifiedSessions: currentBlockHistory.length, sessionsPerWeek: block.totalDays,
      sessionsToNextWeek: Math.max(1, block.totalDays - (currentBlockHistory.length % block.totalDays)), volumeMultiplier: review.action === "simplify" ? 0.7 : 1,
      loadMultiplier: review.action === "simplify" ? 0.85 : 1, repetitionTarget: "Conforme o bloco", effortTarget: block.rpe,
      decision: review.action === "simplify" || review.action === "regress" ? "regress" : review.action === "progress" ? "progress" : "maintain",
      isDeload: block.block === 6 || block.block === 8, progressionFocus: block.objective, reason: progressionNote,
    },
  };
}

export function generateProgram(profile: ProfileForGeneration, context: GenerationContext = {}): GeneratedProgram {
  const now = startOfLocalDay(context.now || new Date());
  const created = profile.createdAt ? startOfLocalDay(new Date(profile.createdAt)) : now;
  const anchor = Number.isNaN(created.getTime()) || created > now ? now : created;
  const elapsedDays = Math.max(0, Math.floor((now.getTime() - anchor.getTime()) / 86_400_000));
  const cycleIndex = Math.floor(elapsedDays / 14);
  const cycleStart = new Date(anchor);
  cycleStart.setDate(cycleStart.getDate() + cycleIndex * 14);
  const cycleEnd = new Date(cycleStart);
  cycleEnd.setDate(cycleEnd.getDate() + 13);
  const daysRemaining = Math.max(1, Math.floor((cycleEnd.getTime() - now.getTime()) / 86_400_000) + 1);
  const codes = detectSafetyCodes(profile);
  const effectiveExperience = classifyExperience(profile, codes);
  const recoveryClass = classifyRecovery(profile, codes, context.history);
  const adaptivePlan = buildAdaptivePlan(profile, context.history || [], now);
  const effectiveDays = effectiveFrequency(profile, effectiveExperience, recoveryClass, adaptivePlan.effectiveDays);
  const effectiveProfile = { ...profile, experience: effectiveExperience };
  const postpartumSafety = assessPostpartumSafety(profile, now);
  const clearanceRequired = codes.includes("red_flag") || codes.includes("pregnancy") || (codes.includes("cardiovascular") && !profile.medicalClearance) || !postpartumSafety.eligible;
  const notices = safetyNotices(codes);
  if (clearanceRequired) {
    return {
      databaseVersion: EXERCISE_DATABASE_VERSION,
      status: "clearance_required",
      title: "Liberação necessária",
      summary: "O AngelsFit não gera treino automático quando há uma condição que precisa de avaliação individual.",
      split: "Pausado por segurança",
      workouts: [],
      safetyCodes: codes,
      notices: [...postpartumSafety.reasons, ...(postpartumSafety.reasons.length ? [] : ["Procure liberação de profissional habilitado antes de iniciar."]), ...notices],
      cycleNumber: cycleIndex + 1,
      validFrom: toDateKey(cycleStart),
      validUntil: toDateKey(cycleEnd),
      daysRemaining,
      todayWorkoutIndex: 0,
      progressionNote: "O ciclo será definido após a liberação profissional.",
      effectiveExperience,
      recoveryClass,
      effectiveDays: 0,
    };
  }

  const specialProgram = postpartumProgram(profile, context, codes, now, notices);
  if (specialProgram) return specialProgram;
  const basePeriodization = buildPeriodizationPlan({ goal: profile.goal, safetyCodes: codes, history: context.history || [], sessionsPerWeek: effectiveDays });
  const adaptiveReduction = adaptivePlan.cycle.action === "reduce";
  const adaptiveIncrease = adaptivePlan.cycle.action === "progress";
  const periodization: PeriodizationPlan = {
    ...basePeriodization,
    volumeMultiplier: adaptiveReduction
      ? Math.min(basePeriodization.volumeMultiplier, 0.8)
      : adaptiveIncrease
        ? Math.min(1.2, basePeriodization.volumeMultiplier + 0.1)
        : basePeriodization.volumeMultiplier,
    loadMultiplier: adaptivePlan.cycle.action === "reduce" ? Math.min(basePeriodization.loadMultiplier, 0.9) : basePeriodization.loadMultiplier,
    decision: adaptivePlan.cycle.action === "reduce" && !basePeriodization.isDeload ? "regress" : basePeriodization.decision,
    reason: `${basePeriodization.reason} ${adaptivePlan.volume.reasons[0]} ${adaptivePlan.cycle.reasons[0]}`,
  };

  const avoidCodes = safetyAvoidCodes(codes);
  const lowImpact = codes.some((code) => ["postpartum", "cesarean", "pregnancy", "knee", "back", "balance", "low_impact", "cardiovascular"].includes(code));
  const rejectedTerms = (profile.rejectedExercises || "").toLocaleLowerCase("pt-BR").split(/[,;\n]/).map((item) => item.trim()).filter(Boolean);
  const preferredTerms = (profile.preferredExercises || "").toLocaleLowerCase("pt-BR").split(/[,;\n]/).map((item) => item.trim()).filter(Boolean);
  const allowed = exercises.filter((exercise) => isAllowed(exercise, effectiveProfile, avoidCodes, lowImpact) && matchesAvailableEquipment(exercise, profile.availableEquipment) && !rejectedTerms.some((term) => exercise.name.toLocaleLowerCase("pt-BR").includes(term)));
  const minutes = adaptivePlan.effectiveDurationMinutes;
  const mainCount = 8;
  const templates = workoutTemplates(effectiveDays);
  const phaseSeed = Math.max(0, periodization.cycleWeek - periodization.phaseWeek);
  const complexityTarget = targetComplexity(effectiveProfile, periodization);
  const exerciseStateCache = new Map(allowed.map((exercise) => [exercise.id, buildExerciseState({ exerciseId: exercise.id, history: context.history || [] })]));
  const rawWorkouts = templates.map((template, templateIndex) => {
    const selected = new Set<string>();
    const main: GeneratedExercise[] = [];
    const slots = focusSlots[template.focus] || focusSlots.full;
    for (let index = 0; index < mainCount; index += 1) {
      const slot = slots[index % slots.length];
      const candidates = allowed.filter((exercise) => matchesSlot(exercise, slot) && !selected.has(exercise.id));
      const styleOrder = ["machine", "free", "cable", "conventional"];
      const preferredStyle = styleOrder[(index + templateIndex + phaseSeed) % styleOrder.length];
      const styled = candidates.filter((exercise) => equipmentStyle(exercise) === preferredStyle);
      const pool = styled.length ? styled : candidates;
      const ranked = [...pool].sort((a, b) => {
        const learnedA = adaptivePlan.preferences.find((item) => item.fromExerciseId === a.id || item.preferredExerciseId === a.id);
        const learnedB = adaptivePlan.preferences.find((item) => item.fromExerciseId === b.id || item.preferredExerciseId === b.id);
        const learnedScore = (item: typeof learnedA, id: string) => item?.preferredExerciseId === id ? 3 : item ? -(item.recentPainEvents * 2 + item.skips) : 0;
        const learnedDifference = learnedScore(learnedB, b.id) - learnedScore(learnedA, a.id);
        if (learnedDifference) return learnedDifference;
        const affinityDifference = (exerciseStateCache.get(b.id)?.preferenceScore || 0) - (exerciseStateCache.get(a.id)?.preferenceScore || 0);
        if (affinityDifference) return affinityDifference;
        const preferredDifference = Number(preferredTerms.some((term) => b.name.toLocaleLowerCase("pt-BR").includes(term))) - Number(preferredTerms.some((term) => a.name.toLocaleLowerCase("pt-BR").includes(term)));
        if (preferredDifference) return preferredDifference;
        const sourceDifference = Number(b.source === "Base academia 182") - Number(a.source === "Base academia 182");
        if (sourceDifference) return sourceDifference;
        const complexityDifference = Math.abs((a.complexity || 1) - complexityTarget) - Math.abs((b.complexity || 1) - complexityTarget);
        if (complexityDifference) return complexityDifference;
        return a.name.localeCompare(b.name, "pt-BR");
      });
      const stablePoolSize = Math.min(3, ranked.length);
      const exercise = ranked[stablePoolSize ? (phaseSeed + templateIndex + index) % stablePoolSize : 0]
        || allowed.find((item) => !selected.has(item.id) && !["warmup", "cooldown", "mobility"].includes(item.movement));
      if (!exercise) continue;
      selected.add(exercise.id);
      const priority: ExercisePriority = index < 2 ? "A" : index < 5 ? "B" : "C";
      const safety = assessExerciseSafety(profile, exercise, context.history || []);
      if (!safety.allowed) continue;
      let generated = prescribe(exercise, effectiveProfile, codes, "main", periodization, context.history || [], priority);
      if (safety.disposition === "allowedWithModification") generated = { ...generated, sets: Math.max(1, generated.sets - 1), loadSuggestion: `Carga conservadora. ${safety.modifications[0] || safety.reasons[0]}`, adaptiveReasons: [...(generated.adaptiveReasons || []), ...safety.reasons] };
      main.push(generated);
    }
    const warmupCandidates = allowed.filter((exercise) => exercise.movement === "warmup" || exercise.movement === "mobility");
    const cooldownCandidates = allowed.filter((exercise) => exercise.movement === "cooldown");
    const supportExerciseCount = minutes <= 30 ? 1 : 2;
    const warmup = Array.from({ length: Math.min(supportExerciseCount, warmupCandidates.length) }, (_, index) => warmupCandidates[(phaseSeed + templateIndex + index) % warmupCandidates.length]).map((exercise) => prescribe(exercise, effectiveProfile, codes, "warmup"));
    const cooldown = Array.from({ length: Math.min(supportExerciseCount, cooldownCandidates.length) }, (_, index) => cooldownCandidates[(phaseSeed + templateIndex + index) % cooldownCandidates.length]).map((exercise) => prescribe(exercise, effectiveProfile, codes, "cooldown"));
    return {
      id: `cycle-${periodization.cycleNumber}-week-${periodization.cycleWeek}-${templateIndex + 1}`,
      name: template.name,
      focus: profile.goal,
      warmup: warmup.length ? warmup : [prescribe(exercises[0], effectiveProfile, codes, "warmup")],
      main,
      cooldown: cooldown.length ? cooldown : [prescribe(exercises.find((exercise) => exercise.id === "breathing_reset")!, effectiveProfile, codes, "cooldown")],
      notices,
    };
  });

  const prescribedByMuscle = prescribedWeeklySetsByMuscle(rawWorkouts);
  const doseByMuscle = new Map([...prescribedByMuscle.entries()].map(([muscle, prescribedSets]) => {
    const state = buildMuscleState({ muscleGroup: muscle, history: context.history || [], prescribedWeeklySets: prescribedSets, now });
    const sessionsSinceChange = state.lastVolumeChange ? (context.history || []).filter((session) => new Date(session.completedAt) > new Date(state.lastVolumeChange!)).length : 6;
    return [muscle, { state, decision: prescribeAdaptiveDose(state, sessionsSinceChange) }] as const;
  }));
  const adjustmentTargets = new Map<string, string>();
  for (const [muscle, { decision }] of doseByMuscle) {
    const candidates = rawWorkouts.flatMap((workout) => workout.main.map((item) => ({ key: `${workout.id}:${item.exercise.id}`, item }))).filter(({ item }) => (item.exercise.primaryGroup || item.exercise.muscleGroups[0]) === muscle);
    if (decision.suggestedWeeklySets < (prescribedByMuscle.get(muscle) || 0)) {
      const target = candidates.filter(({ item }) => item.sets > 1).sort((left, right) => exerciseDoseMetadata(right.item.exercise).fatigueCost - exerciseDoseMetadata(left.item.exercise).fatigueCost)[0];
      if (target) adjustmentTargets.set(muscle, target.key);
    } else if (decision.suggestedWeeklySets > (prescribedByMuscle.get(muscle) || 0)) {
      const priorityRank: Record<ExercisePriority, number> = { A: 0, B: 1, C: 2 };
      const target = candidates.sort((left, right) => priorityRank[left.item.priority || "B"] - priorityRank[right.item.priority || "B"] || stimulusFatigueScore(exerciseDoseMetadata(right.item.exercise)) - stimulusFatigueScore(exerciseDoseMetadata(left.item.exercise)))[0];
      if (target) adjustmentTargets.set(muscle, target.key);
    }
  }
  const workouts: GeneratedWorkout[] = rawWorkouts.map((workout) => {
    const main = workout.main.map((item) => {
      const muscle = item.exercise.primaryGroup || item.exercise.muscleGroups[0];
      const dose = doseByMuscle.get(muscle);
      if (!dose || adjustmentTargets.get(muscle) !== `${workout.id}:${item.exercise.id}`) return item;
      const delta = Math.sign(dose.decision.suggestedWeeklySets - (prescribedByMuscle.get(muscle) || 0));
      return { ...item, sets: Math.max(1, item.sets + delta), adaptiveReasons: [...(item.adaptiveReasons || []), ...dose.decision.reasons] };
    });
    const fitted = fitWorkoutToTime({ targetMinutes: minutes, warmup: workout.warmup, main, cooldown: workout.cooldown, minimumMainExercises: minutes <= 30 ? 3 : 4 });
    return { ...workout, estimatedMinutes: fitted.estimatedMinutes, targetMinutes: minutes, warmup: fitted.warmup, main: fitted.main, cooldown: fitted.cooldown };
  });

  const todayWorkoutIndex = recommendedWorkoutIndex(context.history || [], workouts.length);
  const progressionNote = periodization.reason;

  return {
    databaseVersion: EXERCISE_DATABASE_VERSION,
    status: "ready",
    title: `${profile.goal || "Condicionamento geral"} · ${periodization.phase}`,
    summary: `${periodization.model}, semana ${periodization.cycleWeek} de ${periodization.cycleLengthWeeks}. ${effectiveExperience}, ${effectiveDays}x por semana e recuperação ${recoveryClass.toLowerCase()}.`,
    split: templates.map((item) => item.name.replace(/^[A-E] — /, "")).join(" · "),
    workouts,
    safetyCodes: codes,
    notices,
    cycleNumber: periodization.cycleNumber,
    validFrom: toDateKey(cycleStart),
    validUntil: toDateKey(cycleEnd),
    daysRemaining,
    todayWorkoutIndex,
    progressionNote,
    effectiveExperience,
    recoveryClass,
    effectiveDays,
    phaseCompletedSessions: periodization.sessionsPerWeek - periodization.sessionsToNextWeek,
    phaseRequiredSessions: periodization.sessionsPerWeek,
    recommendationReason: `${adaptivePlan.reasons[0]} ${periodization.reason} A semana do ciclo só avança quando prontidão e evidência são suficientes.`,
    periodization,
    adaptiveConfidence: adaptivePlan.confidence,
    adaptiveReasons: adaptivePlan.reasons.slice(0, 2),
    calibrationStatus: adaptivePlan.calibrationStatus,
  };
}
