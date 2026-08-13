import type { GeneratedWorkout } from "./workout-engine";

function calculateEstimatedOneRepMax(loadKg: number, repetitions: number): number {
  if (!Number.isFinite(loadKg) || !Number.isFinite(repetitions) || loadKg <= 0 || repetitions <= 0) return 0;
  return loadKg * (1 + repetitions / 30);
}

export type SessionStatus = "setup" | "active" | "feedback";

export type SeriesLoadType = "carga" | "peso_corporal" | "assistencia" | "lastro";
export type SeriesRestStatus = "completed" | "skipped";

export type SeriesPerformance = {
  series: number;
  completed: boolean;
  loadKg: string;
  repetitions: string;
  rir: string;
  durationSeconds: string;
  assistanceKg: string;
  distanceKm: string;
  side: "ambos" | "direito" | "esquerdo";
  loadType: SeriesLoadType;
  completedAt?: string;
  actualRestSeconds?: number;
  restStatus?: SeriesRestStatus;
};

export type ActiveWorkoutSession = {
  schemaVersion: 2;
  id: string;
  workout: GeneratedWorkout;
  plannedDate: string;
  sequenceNumber: number;
  sequenceAdvance: number;
  sequenceAction: "recommended" | "repeated" | "manually_advanced";
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
  elapsedBeforeSeconds: number;
  elapsedStartedAt: string | null;
  currentExerciseIndex: number;
  completedSeries: Record<string, number[]>;
  seriesData: Record<string, SeriesPerformance[]>;
  setOverrides: Record<string, number>;
  completedRestSeries: Record<string, number[]>;
  loads: Record<string, string>;
  actualReps: Record<string, string>;
  rir: Record<string, string>;
  /** @deprecated Preserved only when an older saved session contains notes. */
  notes?: Record<string, string>;
  exerciseOverrides: Record<string, string>;
  substitutions: Array<{ fromExerciseId: string; toExerciseId: string; reason: string; changedAt: string }>;
  painEvents: Array<{ exerciseId: string; region: string; intensity: number; recordedAt: string }>;
  restEndsAt: string | null;
  restPausedSeconds: number | null;
  restStartedAt: string | null;
  restElapsedBeforeSeconds: number;
  restTargetSeconds: number | null;
  activeRestExerciseId: string | null;
  activeRestSeries: number | null;
  lastRestExerciseId: string | null;
  lastRestSeries: number | null;
  sleepLastNight: string;
  energy: string;
  stress: string;
  painBefore: string;
  newPain: boolean;
  postpartumAlert: boolean;
  plannedCardioMinutes: string;
  plannedCardioIntensity: string;
  cardioMinutes: string;
  cardioIntensity: string;
  sessionRpe: string;
  painAfter: string;
  postSymptoms: string[];
};

export type SessionSummary = {
  completedExercises: number;
  totalExercises: number;
  elapsedSeconds: number;
  totalVolumeKg: number;
  estimatedOneRepMax: number;
  cardioMinutes: number;
  cardioIntensity: string;
  sessionRpe?: number;
  averageRir?: number;
  painScore?: number;
  symptoms: string[];
};

function iso(now: number): string {
  return new Date(now).toISOString();
}

function sessionId(now: number): string {
  const randomId = globalThis.crypto?.randomUUID?.();
  return randomId ?? `${now}-${Math.random().toString(36).slice(2)}`;
}

export function createActiveWorkoutSession(workout: GeneratedWorkout, now = Date.now(), options: Partial<Pick<ActiveWorkoutSession, "plannedDate" | "sequenceNumber" | "sequenceAdvance" | "sequenceAction">> = {}): ActiveWorkoutSession {
  const timestamp = iso(now);
  return {
    schemaVersion: 2,
    id: sessionId(now),
    workout,
    plannedDate: options.plannedDate || timestamp.slice(0, 10),
    sequenceNumber: options.sequenceNumber || 1,
    sequenceAdvance: options.sequenceAdvance ?? 1,
    sequenceAction: options.sequenceAction || "recommended",
    status: "setup",
    createdAt: timestamp,
    updatedAt: timestamp,
    elapsedBeforeSeconds: 0,
    elapsedStartedAt: null,
    currentExerciseIndex: 0,
    completedSeries: {},
    seriesData: {},
    setOverrides: {},
    completedRestSeries: {},
    loads: {},
    actualReps: {},
    rir: {},
    exerciseOverrides: {},
    substitutions: [],
    painEvents: [],
    restEndsAt: null,
    restPausedSeconds: null,
    restStartedAt: null,
    restElapsedBeforeSeconds: 0,
    restTargetSeconds: null,
    activeRestExerciseId: null,
    activeRestSeries: null,
    lastRestExerciseId: null,
    lastRestSeries: null,
    sleepLastNight: "",
    energy: "",
    stress: "",
    painBefore: "",
    newPain: false,
    postpartumAlert: false,
    plannedCardioMinutes: "",
    plannedCardioIntensity: "Sem cardio hoje",
    cardioMinutes: "",
    cardioIntensity: "Sem cardio hoje",
    sessionRpe: "",
    painAfter: "",
    postSymptoms: [],
  };
}

export function emptySeriesPerformance(series: number): SeriesPerformance {
  return {
    series,
    completed: false,
    loadKg: "",
    repetitions: "",
    rir: "",
    durationSeconds: "",
    assistanceKg: "",
    distanceKm: "",
    side: "ambos",
    loadType: "carga",
  };
}

function normalizeSeriesPerformance(value: Partial<SeriesPerformance>, series: number): SeriesPerformance {
  return {
    ...emptySeriesPerformance(series),
    ...value,
    series,
    completed: Boolean(value.completed),
  };
}

function migrateLegacySeries(session: ActiveWorkoutSession): Record<string, SeriesPerformance[]> {
  const migrated: Record<string, SeriesPerformance[]> = {};
  for (const [exerciseId, completed] of Object.entries(session.completedSeries || {})) {
    const highestSeries = Math.max(0, ...completed);
    if (!highestSeries) continue;
    migrated[exerciseId] = Array.from({ length: highestSeries }, (_, index) => {
      const series = index + 1;
      return normalizeSeriesPerformance({
        series,
        completed: completed.includes(series),
        loadKg: session.loads?.[exerciseId] || "",
        repetitions: session.actualReps?.[exerciseId] || "",
        rir: session.rir?.[exerciseId] || "",
      }, series);
    });
  }
  return migrated;
}

export function seriesPerformances(session: ActiveWorkoutSession, exerciseId: string, setCount: number): SeriesPerformance[] {
  const stored = session.seriesData?.[exerciseId] || [];
  return Array.from({ length: Math.max(0, setCount) }, (_, index) => {
    const series = index + 1;
    const existing = stored.find((item) => item.series === series);
    return normalizeSeriesPerformance(existing || {}, series);
  });
}

export function patchSeriesPerformance(
  session: ActiveWorkoutSession,
  exerciseId: string,
  series: number,
  values: Partial<SeriesPerformance>,
  now = Date.now(),
): ActiveWorkoutSession {
  const existing = session.seriesData?.[exerciseId] || [];
  const nextEntry = normalizeSeriesPerformance({ ...existing.find((item) => item.series === series), ...values }, series);
  const nextSeries = [...existing.filter((item) => item.series !== series), nextEntry].sort((left, right) => left.series - right.series);
  const completed = nextSeries.filter((item) => item.completed).map((item) => item.series);
  return patchActiveSession(session, {
    seriesData: { ...session.seriesData, [exerciseId]: nextSeries },
    completedSeries: { ...session.completedSeries, [exerciseId]: completed },
  }, now);
}

export function completeSeriesPerformance(
  session: ActiveWorkoutSession,
  exerciseId: string,
  series: number,
  values: Partial<SeriesPerformance>,
  now = Date.now(),
): ActiveWorkoutSession {
  return patchSeriesPerformance(session, exerciseId, series, { ...values, completed: true, completedAt: iso(now) }, now);
}

export function reopenSeriesPerformance(session: ActiveWorkoutSession, exerciseId: string, series: number, now = Date.now()): ActiveWorkoutSession {
  return patchSeriesPerformance(session, exerciseId, series, { completed: false, completedAt: undefined, actualRestSeconds: undefined, restStatus: undefined }, now);
}

export function normalizeActiveWorkoutSession(session: ActiveWorkoutSession): ActiveWorkoutSession {
  const rawSeriesData = session.seriesData && Object.keys(session.seriesData).length ? session.seriesData : migrateLegacySeries(session);
  const seriesData = Object.fromEntries(Object.entries(rawSeriesData).map(([exerciseId, entries]) => [
    exerciseId,
    entries.map((entry, index) => normalizeSeriesPerformance(entry, entry.series || index + 1)),
  ]));
  const setupOrActive = session.status === "setup" || session.status === "active";
  return {
    ...session,
    schemaVersion: 2,
    plannedDate: session.plannedDate || session.createdAt.slice(0, 10),
    sequenceNumber: session.sequenceNumber || 1,
    sequenceAdvance: session.sequenceAdvance ?? 1,
    sequenceAction: session.sequenceAction || "recommended",
    completedSeries: session.completedSeries || {},
    seriesData,
    setOverrides: session.setOverrides || {},
    completedRestSeries: session.completedRestSeries || {},
    loads: session.loads || {},
    actualReps: session.actualReps || {},
    rir: session.rir || {},
    ...(session.notes ? { notes: session.notes } : {}),
    exerciseOverrides: session.exerciseOverrides || {},
    substitutions: session.substitutions || [],
    painEvents: session.painEvents || [],
    postSymptoms: session.postSymptoms || [],
    cardioMinutes: session.cardioMinutes || "",
    cardioIntensity: session.cardioIntensity || "Sem cardio hoje",
    plannedCardioMinutes: session.plannedCardioMinutes ?? (setupOrActive ? session.cardioMinutes || "" : ""),
    plannedCardioIntensity: session.plannedCardioIntensity || (setupOrActive ? session.cardioIntensity || "Sem cardio hoje" : "Sem cardio hoje"),
    restStartedAt: session.restStartedAt || null,
    restElapsedBeforeSeconds: session.restElapsedBeforeSeconds || 0,
    restTargetSeconds: session.restTargetSeconds ?? null,
    activeRestExerciseId: session.activeRestExerciseId || null,
    activeRestSeries: session.activeRestSeries || null,
    lastRestExerciseId: session.lastRestExerciseId || null,
    lastRestSeries: session.lastRestSeries || null,
  };
}

export function patchActiveSession(
  session: ActiveWorkoutSession,
  patch: Partial<ActiveWorkoutSession>,
  now = Date.now(),
): ActiveWorkoutSession {
  return { ...session, ...patch, updatedAt: iso(now) };
}

export function beginActiveSession(session: ActiveWorkoutSession, now = Date.now(), previousWorkout?: PreviousWorkoutReadiness): ActiveWorkoutSession {
  if (session.status !== "setup") return session;
  const readiness = sessionReadiness(session, previousWorkout);
  if (readiness === "atenção") return session;

  const setOverrides = { ...session.setOverrides };
  for (const item of session.workout.main) {
    const adjustedSets = effectiveSets(item.sets, readiness);
    if (adjustedSets !== item.sets && setOverrides[item.exercise.id] === undefined) {
      setOverrides[item.exercise.id] = adjustedSets;
    }
  }

  return patchActiveSession(session, { status: "active", elapsedStartedAt: iso(now), setOverrides }, now);
}

export function getElapsedSeconds(session: ActiveWorkoutSession, now = Date.now()): number {
  if (!session.elapsedStartedAt || session.status !== "active") return Math.max(0, session.elapsedBeforeSeconds);
  const running = Math.max(0, Math.floor((now - new Date(session.elapsedStartedAt).getTime()) / 1000));
  return session.elapsedBeforeSeconds + running;
}

export function enterFeedback(session: ActiveWorkoutSession, now = Date.now()): ActiveWorkoutSession {
  const withoutRest = session.activeRestExerciseId ? skipRest(session, now) : session;
  const usePlannedCardio = withoutRest.cardioIntensity === "Sem cardio hoje" && withoutRest.cardioMinutes === "";
  return patchActiveSession(withoutRest, {
    status: "feedback",
    elapsedBeforeSeconds: getElapsedSeconds(session, now),
    elapsedStartedAt: null,
    restEndsAt: null,
    restPausedSeconds: null,
    restStartedAt: null,
    restElapsedBeforeSeconds: 0,
    restTargetSeconds: null,
    activeRestExerciseId: null,
    activeRestSeries: null,
    cardioMinutes: usePlannedCardio ? withoutRest.plannedCardioMinutes : withoutRest.cardioMinutes,
    cardioIntensity: usePlannedCardio ? withoutRest.plannedCardioIntensity : withoutRest.cardioIntensity,
  }, now);
}

export function getRestRemainingSeconds(session: ActiveWorkoutSession, now = Date.now()): number {
  if (session.restPausedSeconds !== null) return Math.max(0, session.restPausedSeconds);
  if (!session.restEndsAt) return 0;
  return Math.max(0, Math.ceil((new Date(session.restEndsAt).getTime() - now) / 1000));
}

export function getRestElapsedSeconds(session: ActiveWorkoutSession, now = Date.now()): number {
  const running = session.restStartedAt ? Math.max(0, Math.floor((now - new Date(session.restStartedAt).getTime()) / 1000)) : 0;
  return Math.max(0, (session.restElapsedBeforeSeconds || 0) + running);
}

export function startRest(session: ActiveWorkoutSession, seconds: number, now = Date.now()): ActiveWorkoutSession {
  if (seconds <= 0) return session;
  return patchActiveSession(session, {
    restEndsAt: iso(now + seconds * 1000),
    restPausedSeconds: null,
    restStartedAt: iso(now),
    restElapsedBeforeSeconds: 0,
    restTargetSeconds: seconds,
    lastRestExerciseId: null,
    lastRestSeries: null,
  }, now);
}

export function addRestSeconds(session: ActiveWorkoutSession, seconds: number, now = Date.now()): ActiveWorkoutSession {
  const remaining = getRestRemainingSeconds(session, now);
  const nextRemaining = Math.max(0, remaining + seconds);
  const nextTarget = Math.max(0, (session.restTargetSeconds ?? remaining) + seconds);
  if (session.restPausedSeconds !== null) {
    return patchActiveSession(session, { restPausedSeconds: nextRemaining, restTargetSeconds: nextTarget }, now);
  }
  return patchActiveSession(session, { restEndsAt: iso(now + nextRemaining * 1000), restTargetSeconds: nextTarget }, now);
}

export function pauseRest(session: ActiveWorkoutSession, now = Date.now()): ActiveWorkoutSession {
  const remaining = getRestRemainingSeconds(session, now);
  if (!remaining) return session;
  return patchActiveSession(session, { restEndsAt: null, restPausedSeconds: remaining, restElapsedBeforeSeconds: getRestElapsedSeconds(session, now), restStartedAt: null }, now);
}

export function resumeRest(session: ActiveWorkoutSession, now = Date.now()): ActiveWorkoutSession {
  if (session.restPausedSeconds === null || session.restPausedSeconds <= 0) return session;
  return patchActiveSession(session, {
    restEndsAt: iso(now + session.restPausedSeconds * 1000),
    restPausedSeconds: null,
    restStartedAt: iso(now),
  }, now);
}

function finishActiveRest(session: ActiveWorkoutSession, status: SeriesRestStatus, now: number): ActiveWorkoutSession {
  const exerciseId = session.activeRestExerciseId;
  const series = session.activeRestSeries;
  let next = session;
  if (exerciseId && series) {
    next = patchSeriesPerformance(next, exerciseId, series, { actualRestSeconds: getRestElapsedSeconds(session, now), restStatus: status }, now);
  }
  return patchActiveSession(next, {
    restEndsAt: null,
    restPausedSeconds: null,
    restStartedAt: null,
    restElapsedBeforeSeconds: 0,
    restTargetSeconds: null,
    activeRestExerciseId: null,
    activeRestSeries: null,
    lastRestExerciseId: status === "completed" ? exerciseId : null,
    lastRestSeries: status === "completed" ? series : null,
  }, now);
}

export function completeRest(session: ActiveWorkoutSession, now = Date.now()): ActiveWorkoutSession {
  const exerciseId = session.activeRestExerciseId;
  const series = session.activeRestSeries;
  let next = finishActiveRest(session, "completed", now);
  if (exerciseId && series) {
    const completed = session.completedRestSeries[exerciseId] || [];
    next = patchActiveSession(next, {
      completedRestSeries: {
        ...session.completedRestSeries,
        [exerciseId]: completed.includes(series) ? completed : [...completed, series].sort((left, right) => left - right),
      },
    }, now);
  }
  return next;
}

export function skipRest(session: ActiveWorkoutSession, now = Date.now()): ActiveWorkoutSession {
  return finishActiveRest(session, "skipped", now);
}

export function clearRestNotice(session: ActiveWorkoutSession, now = Date.now()): ActiveWorkoutSession {
  return patchActiveSession(session, { lastRestExerciseId: null, lastRestSeries: null }, now);
}

export type PreviousWorkoutReadiness = {
  status?: string;
  sessionRpe?: number;
  painScore?: number;
  symptoms?: string[];
  recovery24h?: string;
};

export function sessionReadiness(session: ActiveWorkoutSession, previousWorkout?: PreviousWorkoutReadiness): "atenção" | "muito baixa" | "baixa" | "moderada" | "alta" {
  const sleep = session.sleepLastNight === "" ? null : Number(session.sleepLastNight);
  const energy = session.energy === "" ? null : Number(session.energy);
  const stress = session.stress === "" ? null : Number(session.stress);
  const pain = session.painBefore === "" ? null : Number(session.painBefore);
  const previousPenalty = !previousWorkout ? 0
    : (previousWorkout.status === "partial" || previousWorkout.status === "interrupted" ? 1 : 0)
      + ((previousWorkout.sessionRpe || 0) >= 9 ? 2 : (previousWorkout.sessionRpe || 0) >= 8 ? 1 : 0)
      + ((previousWorkout.painScore || 0) >= 4 ? 2 : (previousWorkout.painScore || 0) >= 2 ? 1 : 0)
      + ((previousWorkout.symptoms?.length || 0) > 0 ? 2 : 0)
      + (/ruim|não recuper|dolor/i.test(previousWorkout.recovery24h || "") ? 2 : 0);
  const penalty = (sleep !== null && sleep < 6 ? 2 : sleep !== null && sleep < 7 ? 1 : 0)
    + (energy !== null && energy <= 2 ? 2 : energy === 3 ? 1 : 0)
    + (stress !== null && stress >= 4 ? 2 : stress === 3 ? 1 : 0)
    + (pain !== null && pain >= 4 ? 2 : pain !== null && pain >= 2 ? 1 : 0)
    + previousPenalty;
  if (session.newPain || session.postpartumAlert || (pain !== null && pain >= 7) || (previousWorkout?.painScore || 0) >= 7) return "atenção";
  if (penalty >= 6) return "muito baixa";
  if (penalty >= 4) return "baixa";
  if (penalty >= 2) return "moderada";
  return "alta";
}

export function effectiveSets(sets: number, readiness: ReturnType<typeof sessionReadiness>): number {
  if (readiness === "muito baixa") return 1;
  if (readiness === "baixa") return Math.max(1, Math.round(sets * 0.7));
  return sets;
}

export function isCardioEntryValid(minutesValue: string, intensity: string): boolean {
  if (!intensity) return false;
  if (intensity === "Sem cardio hoje") return true;
  const minutes = Number(minutesValue);
  return Number.isInteger(minutes) && minutes >= 1 && minutes <= 120;
}

export function isCardioPlanValid(session: Pick<ActiveWorkoutSession, "cardioMinutes" | "cardioIntensity"> & Partial<Pick<ActiveWorkoutSession, "plannedCardioMinutes" | "plannedCardioIntensity">>): boolean {
  return isCardioEntryValid(session.plannedCardioMinutes ?? session.cardioMinutes, session.plannedCardioIntensity ?? session.cardioIntensity);
}

export function isCardioResultValid(session: Pick<ActiveWorkoutSession, "cardioMinutes" | "cardioIntensity">): boolean {
  return isCardioEntryValid(session.cardioMinutes, session.cardioIntensity);
}

export function summarizeActiveSession(session: ActiveWorkoutSession, now = Date.now()): SessionSummary {
  session = normalizeActiveWorkoutSession(session);
  const items = [...session.workout.warmup, ...session.workout.main, ...session.workout.cooldown];
  const readiness = sessionReadiness(session);
  let completedExercises = 0;
  let totalVolumeKg = 0;
  let estimatedOneRepMax = 0;

  for (const item of items) {
    const recommendedSets = session.workout.main.includes(item) ? effectiveSets(item.sets, readiness) : item.sets;
    const sets = session.setOverrides[item.exercise.id] ?? recommendedSets;
    const performedSeries = seriesPerformances(session, item.exercise.id, sets).filter((entry) => entry.completed);
    const setsDone = performedSeries.length;
    if (setsDone >= sets) completedExercises += 1;
    for (const performed of performedSeries) {
      const loadValue = performed.loadType === "assistencia" || performed.loadType === "peso_corporal" ? "0" : performed.loadKg;
      const load = Number.parseFloat((loadValue || "0").replace(",", "."));
      const repetitions = Number.parseInt(performed.repetitions || "0", 10);
      if (load > 0 && repetitions > 0) totalVolumeKg += load * repetitions;
      const estimate = repetitions <= 10 ? calculateEstimatedOneRepMax(load, repetitions) : 0;
      if (estimate) estimatedOneRepMax = Math.max(estimatedOneRepMax, estimate);
    }
  }

  const rirValues = Object.values(session.seriesData).flat().filter((entry) => entry.completed && entry.rir !== "").map((entry) => Number(entry.rir)).filter(Number.isFinite);
  const sessionRpe = session.sessionRpe === "" ? undefined : Number(session.sessionRpe);
  const painAfter = session.painAfter === "" ? undefined : Number(session.painAfter);
  const reportedPain = session.painEvents.map((event) => event.intensity);
  return {
    completedExercises,
    totalExercises: items.length,
    elapsedSeconds: getElapsedSeconds(session, now),
    totalVolumeKg: Math.round(totalVolumeKg),
    estimatedOneRepMax: Math.round(estimatedOneRepMax * 10) / 10,
    cardioMinutes: Number.parseInt(session.cardioMinutes || "0", 10),
    cardioIntensity: session.cardioIntensity,
    sessionRpe,
    averageRir: rirValues.length ? Math.round((rirValues.reduce((sum, value) => sum + value, 0) / rirValues.length) * 10) / 10 : undefined,
    painScore: painAfter !== undefined || reportedPain.length ? Math.max(painAfter ?? 0, ...reportedPain, 0) : undefined,
    symptoms: [...new Set([...session.postSymptoms, ...session.painEvents.map((event) => `${event.region} (${event.intensity}/10)`)])],
  };
}

export function hasMeaningfulSessionActivity(session: ActiveWorkoutSession): boolean {
  return Object.values(session.seriesData || {}).some((entries) => entries.some((entry) => entry.completed))
    || Object.values(session.completedSeries || {}).some((series) => series.length > 0)
    || session.substitutions.length > 0
    || session.painEvents.length > 0
    || Number.parseInt(session.cardioMinutes || "", 10) > 0;
}

export function sessionCompletionProgress(session: ActiveWorkoutSession): { completedSeries: number; totalSeries: number; percentage: number; moreThanHalf: boolean } {
  session = normalizeActiveWorkoutSession(session);
  const items = [...session.workout.warmup, ...session.workout.main, ...session.workout.cooldown];
  const readiness = sessionReadiness(session);
  let completedSeries = 0;
  let totalSeries = 0;

  for (const item of items) {
    const recommendedSets = session.workout.main.includes(item) ? effectiveSets(item.sets, readiness) : item.sets;
    const sets = session.setOverrides[item.exercise.id] ?? recommendedSets;
    totalSeries += sets;
    completedSeries += seriesPerformances(session, item.exercise.id, sets).filter((entry) => entry.completed).length;
  }

  const percentage = totalSeries ? Math.round((completedSeries / totalSeries) * 100) : 0;
  return { completedSeries, totalSeries, percentage, moreThanHalf: totalSeries > 0 && completedSeries / totalSeries > 0.5 };
}
