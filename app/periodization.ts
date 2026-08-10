export type PeriodizationHistory = {
  status?: string;
  periodizationTrack?: string;
  sessionRpe?: number;
  painScore?: number;
  symptoms?: string[];
  recovery24h?: string;
  completedExercises?: number;
  totalExercises?: number;
  exerciseRecords?: Array<{
    exerciseId: string;
    setsPlanned: number;
    setsCompleted: number;
    repetitions: number;
    load: number;
    rirOrRpe: number;
    executionFeedback: "adequate" | "limited" | "unknown";
    painReported: boolean;
  }>;
};

export type PeriodizationTrack = "hypertrophy" | "strength" | "conditioning" | "mobility" | "pregnancy" | "clinical";
export type PeriodizationDecision = "progress" | "maintain" | "regress" | "deload";

export type PeriodizationPlan = {
  track: PeriodizationTrack;
  model: string;
  cycleNumber: number;
  cycleLengthWeeks: number;
  cycleWeek: number;
  phase: string;
  phaseWeek: number;
  phaseLengthWeeks: number;
  qualifiedSessions: number;
  sessionsPerWeek: number;
  sessionsToNextWeek: number;
  volumeMultiplier: number;
  loadMultiplier: number;
  repetitionTarget: string;
  effortTarget: string;
  decision: PeriodizationDecision;
  isDeload: boolean;
  progressionFocus: string;
  reason: string;
};

type Stage = {
  from: number;
  to: number;
  phase: string;
  volume: number;
  load: number;
  reps: string;
  effort: string;
  focus: string;
  deload?: boolean;
};

const TRACKS: Record<PeriodizationTrack, { model: string; weeks: number; stages: Stage[] }> = {
  hypertrophy: {
    model: "Mesociclo de hipertrofia",
    weeks: 12,
    stages: [
      { from: 1, to: 4, phase: "Base", volume: 0.9, load: 1, reps: "8–12", effort: "RIR 2–3", focus: "Estabelecer cargas, técnica e acumular repetições." },
      { from: 5, to: 8, phase: "Sobrecarga", volume: 1.15, load: 1, reps: "8–12", effort: "RIR 2", focus: "Elevar o estímulo com a menor progressão necessária de repetições, carga ou séries." },
      { from: 9, to: 11, phase: "Intensificação", volume: 1, load: 1, reps: "6–10", effort: "RIR 1–2", focus: "Preservar volume produtivo com maior esforço e falha apenas seletiva." },
      { from: 12, to: 12, phase: "Deload e avaliação", volume: 0.6, load: 0.9, reps: "8–12", effort: "RIR 3–4", focus: "Dissipar fadiga, manter técnica e revisar a resposta ao ciclo.", deload: true },
    ],
  },
  strength: {
    model: "Periodização linear de força",
    weeks: 12,
    stages: [
      { from: 1, to: 4, phase: "Base de força", volume: 1, load: 1, reps: "6–8", effort: "RIR 3", focus: "Consolidar técnica e capacidade de trabalho nos padrões principais." },
      { from: 5, to: 8, phase: "Força", volume: 1, load: 1, reps: "4–6", effort: "RIR 2", focus: "Aumentar carga gradualmente sem perder velocidade ou técnica." },
      { from: 9, to: 11, phase: "Intensificação", volume: 0.85, load: 1, reps: "3–5", effort: "RIR 1–2", focus: "Elevar a especificidade com menor volume e alta qualidade." },
      { from: 12, to: 12, phase: "Deload e avaliação", volume: 0.6, load: 0.9, reps: "5–8", effort: "RIR 3–4", focus: "Reduzir estresse e revisar desempenho antes do próximo ciclo.", deload: true },
    ],
  },
  conditioning: {
    model: "Ciclo de condicionamento",
    weeks: 8,
    stages: [
      { from: 1, to: 2, phase: "Base aeróbia", volume: 0.85, load: 1, reps: "20–30 min", effort: "RPE 2–5", focus: "Construir minutos fáceis e moderados com uma exposição curta a intervalos leves." },
      { from: 3, to: 4, phase: "Construção", volume: 1, load: 1, reps: "25–40 min", effort: "RPE 4–7", focus: "Aumentar a duração total de forma gradual e inserir trabalho de limiar." },
      { from: 5, to: 6, phase: "Intensificação", volume: 0.9, load: 1, reps: "4–6 intervalos", effort: "RPE 6–9", focus: "Separar uma sessão intensa, uma de limiar e sessões fáceis." },
      { from: 7, to: 7, phase: "Específica", volume: 0.8, load: 1, reps: "Demanda específica", effort: "RPE 5–8", focus: "Reproduzir a demanda desejada sem elevar excessivamente o volume." },
      { from: 8, to: 8, phase: "Redução e teste", volume: 0.6, load: 1, reps: "15–25 min", effort: "RPE 3–7", focus: "Reduzir volume e preservar estímulos curtos de intensidade.", deload: true },
    ],
  },
  mobility: {
    model: "Ciclo de capacidade e mobilidade",
    weeks: 8,
    stages: [
      { from: 1, to: 2, phase: "Controle", volume: 0.75, load: 0.85, reps: "6–8 lentas", effort: "RPE 3–4", focus: "Estabelecer amplitudes confortáveis, controle e tolerância." },
      { from: 3, to: 4, phase: "Capacidade", volume: 0.9, load: 0.9, reps: "8–10 lentas", effort: "RPE 4–5", focus: "Acumular repetições com técnica consistente." },
      { from: 5, to: 6, phase: "Expansão", volume: 1, load: 1, reps: "8–12", effort: "RPE 5–6", focus: "Progredir uma variável: amplitude, controle, carga ou complexidade." },
      { from: 7, to: 8, phase: "Integração", volume: 0.9, load: 1, reps: "6–10", effort: "RPE 5–6", focus: "Integrar a mobilidade aos padrões funcionais e reavaliar." },
    ],
  },
  pregnancy: {
    model: "Bloco gestacional autoregulado",
    weeks: 12,
    stages: [
      { from: 1, to: 4, phase: "Técnica e tolerância", volume: 0.75, load: 0.85, reps: "8–12", effort: "RPE 5–6 · RIR 4–5", focus: "Manter hábito, respiração, conforto e técnica." },
      { from: 5, to: 8, phase: "Manutenção de capacidade", volume: 0.9, load: 0.9, reps: "8–12", effort: "RPE 6–7 · RIR 3–4", focus: "Manter força e função com posições estáveis e confortáveis." },
      { from: 9, to: 12, phase: "Consolidação", volume: 0.75, load: 0.85, reps: "8–12", effort: "RPE 5–7", focus: "Preservar capacidade, reduzir exercícios desconfortáveis e priorizar recuperação." },
    ],
  },
  clinical: {
    model: "Retorno progressivo por critérios",
    weeks: 8,
    stages: [
      { from: 1, to: 2, phase: "Controle de sintomas", volume: 0.65, load: 0.7, reps: "10–15", effort: "RPE 4–5", focus: "Criar tolerância com baixa carga, amplitude confortável e função preservada." },
      { from: 3, to: 4, phase: "Capacidade básica", volume: 0.8, load: 0.8, reps: "8–12", effort: "RPE 5–6", focus: "Consolidar padrões básicos sem piora até o dia seguinte." },
      { from: 5, to: 6, phase: "Força geral", volume: 0.95, load: 0.9, reps: "6–10", effort: "RPE 6–7", focus: "Progredir carga ou amplitude quando os sintomas permanecem estáveis." },
      { from: 7, to: 8, phase: "Retorno específico", volume: 1, load: 1, reps: "6–10", effort: "RPE 6–8", focus: "Aproximar o treino da demanda real com confiança e resposta de 24 horas estável." },
    ],
  },
};

function statusOf(item: PeriodizationHistory) {
  return item.status || "completed";
}

export function isQualifiedPeriodizationSession(item: PeriodizationHistory) {
  if (statusOf(item) !== "completed") return false;
  const completion = item.totalExercises ? (item.completedExercises || 0) / item.totalExercises : 1;
  return completion >= 0.7
    && (item.painScore || 0) < 4
    && (item.symptoms?.length || 0) === 0
    && (item.sessionRpe || 0) <= 9
    && !/piorou|muito cansad/i.test(item.recovery24h || "");
}

export function periodizationTrack(goal: string, safetyCodes: string[]): PeriodizationTrack {
  if (safetyCodes.includes("pregnancy")) return "pregnancy";
  if (goal === "Retorno aos treinos" || safetyCodes.some((code) => ["back", "knee", "shoulder", "abdominal_symptoms"].includes(code))) return "clinical";
  if (goal === "Força") return "strength";
  if (goal === "Condicionamento") return "conditioning";
  if (goal === "Mobilidade") return "mobility";
  return "hypertrophy";
}

function recentFatigueDecision(history: PeriodizationHistory[], track: PeriodizationTrack): { decision: PeriodizationDecision; reason: string } | null {
  const recent = history.filter((item) => ["completed", "partial", "interrupted"].includes(statusOf(item))).slice(0, 3);
  if (!recent.length) return null;
  const urgent = recent[0] && ((recent[0].painScore || 0) >= 7 || (recent[0].symptoms?.length || 0) > 0);
  if (urgent) return { decision: "regress", reason: "Sintomas relevantes no treino mais recente pedem redução e reavaliação antes de progredir." };
  if (["clinical", "pregnancy"].includes(track) && (recent[0]?.painScore || 0) >= 4) return { decision: "regress", reason: "A resposta mais recente saiu da faixa estável; reduza uma variável e reavalie antes de progredir." };
  const highRpe = recent.filter((item) => (item.sessionRpe || 0) >= 9).length;
  const pain = recent.filter((item) => (item.painScore || 0) >= 4).length;
  const poorRecovery = recent.filter((item) => /piorou|muito cansad/i.test(item.recovery24h || "")).length;
  const lowCompletion = recent.filter((item) => item.totalExercises && (item.completedExercises || 0) / item.totalExercises < 0.7).length;
  const limitedTechnique = recent.filter((item) => (item.exerciseRecords || []).filter((record) => record.executionFeedback === "limited").length >= 2).length;
  const performance = recent.map((item) => (item.exerciseRecords || []).reduce((sum, record) => sum + record.setsCompleted * Math.max(1, record.repetitions) * Math.max(1, record.load), 0));
  const performanceDecline = performance.length >= 3 && performance.every((value) => value > 0) && performance[0] < performance[1] * 0.95 && performance[1] < performance[2] * 0.95;
  if (performanceDecline) return { decision: "deload", reason: "O desempenho caiu por três sessões consecutivas; o volume foi reduzido para dissipar fadiga." };
  if ([highRpe, pain, poorRecovery, lowCompletion, limitedTechnique].some((count) => count >= 2)) {
    return { decision: "deload", reason: "A resposta das últimas sessões indica fadiga acumulada; o volume foi reduzido temporariamente." };
  }
  if ([highRpe, pain, poorRecovery, lowCompletion, limitedTechnique].some((count) => count === 1)) {
    return { decision: "maintain", reason: "Há um sinal recente de recuperação incompleta; mantenha a dose atual antes de avançar." };
  }
  return null;
}

export function buildPeriodizationPlan(options: { goal: string; safetyCodes: string[]; history: PeriodizationHistory[]; sessionsPerWeek: number }): PeriodizationPlan {
  const track = periodizationTrack(options.goal, options.safetyCodes);
  const config = TRACKS[track];
  const sessionsPerWeek = Math.max(1, options.sessionsPerWeek);
  const qualifiedSessions = options.history.filter((item) => item.periodizationTrack === track && isQualifiedPeriodizationSession(item)).length;
  const absoluteWeek = Math.floor(qualifiedSessions / sessionsPerWeek) + 1;
  const cycleNumber = Math.floor((absoluteWeek - 1) / config.weeks) + 1;
  const cycleWeek = ((absoluteWeek - 1) % config.weeks) + 1;
  const stage = config.stages.find((item) => cycleWeek >= item.from && cycleWeek <= item.to) || config.stages[0];
  const completedThisWeek = qualifiedSessions % sessionsPerWeek;
  const fatigue = recentFatigueDecision(options.history, track);
  let decision: PeriodizationDecision = stage.deload ? "deload" : "progress";
  let volumeMultiplier = stage.volume;
  let loadMultiplier = stage.load;
  let effortTarget = stage.effort;
  let reason = stage.focus;
  let isDeload = Boolean(stage.deload);

  if (fatigue?.decision === "deload") {
    decision = "deload";
    volumeMultiplier = Math.min(volumeMultiplier, 0.6);
    loadMultiplier = Math.min(loadMultiplier, 0.9);
    effortTarget = track === "conditioning" ? "RPE 2–6" : "RIR 3–4";
    reason = fatigue.reason;
    isDeload = true;
  } else if (fatigue?.decision === "regress") {
    decision = "regress";
    volumeMultiplier = Math.min(volumeMultiplier, 0.7);
    loadMultiplier = Math.min(loadMultiplier, 0.85);
    effortTarget = track === "conditioning" ? "RPE 2–5" : "RPE 4–5";
    reason = fatigue.reason;
  } else if (fatigue?.decision === "maintain") {
    decision = "maintain";
    volumeMultiplier = Math.min(volumeMultiplier, 1);
    loadMultiplier = Math.min(loadMultiplier, 1);
    reason = fatigue.reason;
  }

  return {
    track,
    model: config.model,
    cycleNumber,
    cycleLengthWeeks: config.weeks,
    cycleWeek,
    phase: stage.phase,
    phaseWeek: cycleWeek - stage.from + 1,
    phaseLengthWeeks: stage.to - stage.from + 1,
    qualifiedSessions,
    sessionsPerWeek,
    sessionsToNextWeek: sessionsPerWeek - completedThisWeek,
    volumeMultiplier,
    loadMultiplier,
    repetitionTarget: stage.reps,
    effortTarget,
    decision,
    isDeload,
    progressionFocus: stage.focus,
    reason,
  };
}

export function exerciseProgressionGuidance(options: { history: PeriodizationHistory[]; exerciseId: string; upperRepetitionTarget: number; periodization: PeriodizationPlan }) {
  if (options.periodization.isDeload) return `Use cerca de ${Math.round(options.periodization.loadMultiplier * 100)}% da carga habitual e preserve a técnica.`;
  if (options.periodization.decision === "regress") return `Reduza carga, amplitude ou volume e reavalie a resposta até o dia seguinte.`;
  if (options.periodization.loadMultiplier < 1) return `Use até ${Math.round(options.periodization.loadMultiplier * 100)}% da carga habitual e progrida somente com resposta estável até o dia seguinte.`;
  const records = options.history.flatMap((item) => item.exerciseRecords || []).filter((item) => item.exerciseId === options.exerciseId).slice(0, 3);
  const lastTwo = records.slice(0, 2);
  const sameLoad = lastTwo.length === 2 && lastTwo[0].load > 0 && lastTwo[0].load === lastTwo[1].load;
  const earned = sameLoad && lastTwo.every((item) => item.setsCompleted >= item.setsPlanned
    && item.repetitions >= options.upperRepetitionTarget
    && item.rirOrRpe >= 1
    && item.executionFeedback === "adequate"
    && !item.painReported);
  if (earned) return "Progressão conquistada: aumente a menor carga disponível e retorne à base da faixa de repetições.";
  if (records[0]?.painReported || records[0]?.executionFeedback === "limited") return "Mantenha ou reduza a carga até recuperar técnica estável e ausência de piora dos sintomas.";
  return "Mantenha a carga e acumule repetições até alcançar o topo da faixa com o RIR-alvo em duas sessões.";
}

export function upperRepetitionTarget(value: string) {
  const numbers = value.match(/\d+/g)?.map(Number) || [];
  return numbers.length ? Math.max(...numbers) : 0;
}
