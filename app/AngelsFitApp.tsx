"use client";

/* eslint-disable react-hooks/set-state-in-effect, @next/next/no-img-element */

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { exercises, exerciseById, exerciseMuscleGroups, EXERCISE_DATABASE_VERSION } from "./workout-data";
import { exerciseMedia } from "./exercise-media.generated";
import { exerciseMediaQueries } from "./exercise-media-queries";
import { GeneratedProgram, GeneratedWorkout, detectSafetyCodes, generateProgram, specialConditionOptions } from "./workout-engine";
import { BodyMeasurement, bmiCategory, calculateAge, calculateBmi, epleyEstimatedOneRepMax, estimateRestingEnergy, formatMetric, waistRatioCategory, waistToHeightRatio } from "./performance-metrics";
import { getBrowserDataRepository } from "./data-repository";
import { ActiveWorkoutSession, SeriesPerformance, addRestSeconds, beginActiveSession, clearRestNotice, completeRest, completeSeriesPerformance, enterFeedback, getElapsedSeconds, getRestRemainingSeconds, hasMeaningfulSessionActivity, normalizeActiveWorkoutSession, normalizeCardioIntensity, patchActiveSession, patchSeriesPerformance, pauseRest, reopenSeriesPerformance, resumeRest, seriesPerformances, sessionCompletionProgress, skipRest, startRest, createActiveWorkoutSession, summarizeActiveSession, type CardioIntensity } from "./active-session";
import { APP_VERSION, CONTENT_VERSION, CURRENT_DATA_SCHEMA_VERSION, LAST_UPDATE_CHECK_KEY, MINIMUM_SUPPORTED_APP_VERSION, compareVersions, runDataMigrations, validateVersionMetadata } from "./versioning";
import { configureNativeChrome, getInstalledAppVersion, hapticImpact, isIosDevice, isNativeApp, openExternal, registerNativeBackButton } from "./native-platform";
import { applyReturnAdaptation, buildCalendarSchedule, buildWeeklyMuscleVolume, calculateAdherence, completedSequenceCount, eligibleProtocols, getReturnAdaptation, isAttendedTrainingSession, mergeLegacyCheckIns, migrateTrainingHistory, normalizedTrainingStatus, recommendedWorkoutIndex, trainingStatusLabel, toLocalDateKey, type ExercisePerformanceRecord, type SeriesPerformanceRecord, type TrainingHistoryLike, type TrainingSessionStatus } from "./training-intelligence";
import { BACKUP_FORMAT_VERSION, BackupValidationError, MAX_BACKUP_FILE_SIZE, parseBackupJson, type ParsedBackup } from "./backup";
import { rankExerciseSubstitutions } from "./exercise-substitution";
import { exerciseTrackingMode, isUnilateralExercise, seriesHasTrackingData, seriesPerformanceLabel, seriesVolume } from "./series-tracking";
import { RECOVERY_LABELS, type Recovery24h } from "./domain/recovery";
import { resolveEffectiveSchedule, resolveSequenceSelection } from "./domain/schedule";
import { calculateSessionQuality, qualifySessionCompletion } from "./domain/session-quality";
import { CONFIDENCE_COPY } from "./domain/types";
import { inferPassiveReadiness } from "./domain/readiness";
import type { SubstitutionReason } from "./domain/substitution-reason";

type AppTab = "today" | "program" | "exercises" | "progress" | "profile";

const CARDIO_LABELS: Record<CardioIntensity, string> = { none: "Sem cardio hoje", light: "Leve", moderate: "Moderada", vigorous: "Intensa" };
const POSTPONED_WORKOUT_KEY = "angelsfit.postponed-workout.v1";

function cardioLabel(value: unknown): string {
  return CARDIO_LABELS[normalizeCardioIntensity(value)];
}

type Profile = {
  id: "mario";
  name: string;
  photo: string;
  goal: string;
  experience: string;
  days: string[];
  duration: string;
  location: string;
  limitations: string;
  specialConditions?: string[];
  medicalClearance?: boolean;
  birthDate?: string;
  biologicalSex?: string;
  heightCm?: number;
  weightKg?: number;
  waistCm?: number;
  restingHeartRate?: number;
  activityLevel?: string;
  currentWeeklySessions?: number;
  weeklyActivityMinutes?: number;
  createdAt: string;
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

type WorkoutHistory = TrainingHistoryLike & {
  durationMinutes: number;
  completedExercises: number;
  totalExercises: number;
  completionPercentage?: number;
  totalVolumeKg?: number;
  estimatedOneRepMax?: number;
  cardioMinutes?: number;
  cardioIntensity?: string;
  sessionRpe?: number;
  averageRir?: number;
  painScore?: number;
  symptoms?: string[];
  recovery24h?: Recovery24h | string;
  periodizationTrack?: string;
  status?: TrainingSessionStatus;
};

const THEME_KEY = "angelsfit.theme.v1";
const LEGACY_THEME_KEY = "fitlocal.theme.v1";
const PREFERENCES_KEY = "angelsfit.preferences.v1";

type AppPreferences = {
  sound: boolean;
  vibration: boolean;
  keepAwake: boolean;
  restNotifications: boolean;
  workoutFontSize: "compact" | "comfortable" | "large";
};

const workoutFontSizes: AppPreferences["workoutFontSize"][] = ["compact", "comfortable", "large"];

function isWorkoutFontSize(value: unknown): value is AppPreferences["workoutFontSize"] {
  return typeof value === "string" && workoutFontSizes.includes(value as AppPreferences["workoutFontSize"]);
}

type UpdateStatus = "idle" | "checking" | "current" | "available" | "offline" | "error" | "native-required";

const defaultPreferences: AppPreferences = { sound: false, vibration: true, keepAwake: true, restNotifications: false, workoutFontSize: "comfortable" };

const initialProfile: Profile = {
  id: "mario",
  name: "",
  photo: "",
  goal: "",
  experience: "",
  days: [],
  duration: "",
  location: "",
  limitations: "",
  specialConditions: [],
  medicalClearance: false,
  birthDate: "",
  biologicalSex: "",
  heightCm: undefined,
  weightKg: undefined,
  waistCm: undefined,
  restingHeartRate: undefined,
  activityLevel: "",
  currentWeeklySessions: undefined,
  weeklyActivityMinutes: undefined,
  createdAt: "",
  secondaryGoals: [],
  monthsConsistent: undefined,
  monthsSinceTraining: undefined,
  averageSleepHours: undefined,
  stressLevel: "",
  recoveryFeeling: "",
  availableEquipment: [],
  preferredExercises: "",
  rejectedExercises: "",
  deliveryDate: "",
  deliveryType: "",
  incisionHealed: false,
  postpartumSymptoms: [],
};

const goals = ["Hipertrofia", "Força", "Condicionamento", "Mobilidade", "Retorno aos treinos"];
const experiences = ["Iniciante", "Intermediário", "Avançado"];
const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const durations = ["30 min", "45 min", "60 min", "75 min+"];
const activityLevels = ["Sedentária", "Pouco ativa", "Ativa", "Muito ativa"];
const equipmentOptions = ["Máquinas", "Cabos", "Halteres", "Barra e anilhas", "Elásticos"];
const postpartumSymptomOptions = [
  { id: "bleeding", label: "Sangramento aumentado" },
  { id: "scar_pain", label: "Dor na cicatriz" },
  { id: "pelvic_pressure", label: "Pressão ou peso pélvico" },
  { id: "urinary_leakage", label: "Escape urinário" },
  { id: "pelvic_pain", label: "Dor pélvica" },
  { id: "doming", label: "Abaulamento abdominal" },
  { id: "back_pain", label: "Dor lombar crescente" },
  { id: "fatigue", label: "Fadiga desproporcional" },
];

function todayLabel() {
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "short" }).format(new Date());
}

function localDateKey(value = new Date()) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function attendanceStreak(history: WorkoutHistory[]) {
  const attended = new Set(history.filter((item) => isAttendedTrainingSession(item)).map((item) => localDateKey(new Date(item.completedAt))));
  const cursor = new Date();
  if (!attended.has(localDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (attended.has(localDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

function Avatar({ profile, size = "medium" }: { profile: Profile; size?: "small" | "medium" | "large" }) {
  return (
    <div className={`avatar avatar-${size}`} aria-label={`Foto de ${profile.name}`}>
      {profile.photo ? <img src={profile.photo} alt="" /> : <span>{initials(profile.name || "M")}</span>}
    </div>
  );
}

export default function AngelsFitApp() {
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [draft, setDraft] = useState<Profile>(initialProfile);
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState<AppTab>("today");
  const [editingProfile, setEditingProfile] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [online, setOnline] = useState(true);
  const [installed, setInstalled] = useState(false);
  const [iosDevice, setIosDevice] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [activeSession, setActiveSession] = useState<ActiveWorkoutSession | null>(null);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [endSessionPrompt, setEndSessionPrompt] = useState(false);
  const [preferences, setPreferences] = useState<AppPreferences>(defaultPreferences);
  const [installedAppVersion, setInstalledAppVersion] = useState(APP_VERSION);
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>("idle");
  const [lastUpdateCheck, setLastUpdateCheck] = useState<string | null>(null);
  const [history, setHistory] = useState<WorkoutHistory[]>([]);
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [previewWorkout, setPreviewWorkout] = useState<GeneratedWorkout | null>(null);
  const [discardProfilePrompt, setDiscardProfilePrompt] = useState(false);
  const [pendingBackup, setPendingBackup] = useState<ParsedBackup | null>(null);
  const [backupError, setBackupError] = useState("");
  const [restoringBackup, setRestoringBackup] = useState(false);
  const backupInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_KEY) ?? window.localStorage.getItem(LEGACY_THEME_KEY);
    const storedPreferences = window.localStorage.getItem(PREFERENCES_KEY);
    const nextTheme = storedTheme === "light" ? "light" : "dark";
    if (window.localStorage.getItem(THEME_KEY) === null && storedTheme !== null) window.localStorage.setItem(THEME_KEY, storedTheme);
    setTheme(nextTheme);
    if (storedPreferences) {
      try {
        const parsed = JSON.parse(storedPreferences) as Partial<AppPreferences>;
        setPreferences({
          ...defaultPreferences,
          ...parsed,
          workoutFontSize: isWorkoutFontSize(parsed.workoutFontSize) ? parsed.workoutFontSize : defaultPreferences.workoutFontSize,
        });
      } catch { /* keep safe defaults */ }
    }
    setLastUpdateCheck(window.localStorage.getItem(LAST_UPDATE_CHECK_KEY));
    document.documentElement.dataset.theme = nextTheme;
    setOnline(navigator.onLine);
    const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
    setInstalled(isNativeApp() || window.matchMedia("(display-mode: standalone)").matches || navigatorWithStandalone.standalone === true);
    setIosDevice(isIosDevice());
    let mounted = true;
    const repository = getBrowserDataRepository();
    void repository.createSnapshot().then(() => {
      runDataMigrations(window.localStorage);
      return repository.load();
    }).catch(async () => {
      await repository.restoreLatestSnapshot();
      return repository.load();
    }).then(({ data }) => {
      if (!mounted) return;
      if (data.profile) {
        const parsed = data.profile as Profile;
        const normalized = { ...initialProfile, ...parsed, specialConditions: parsed.specialConditions || [], secondaryGoals: parsed.secondaryGoals || [], availableEquipment: parsed.availableEquipment || [], postpartumSymptoms: parsed.postpartumSymptoms || [], medicalClearance: parsed.medicalClearance || false };
        setProfile(normalized);
        setDraft(normalized);
      }
      const mergedHistory = mergeLegacyCheckIns(data.history as WorkoutHistory[], data.checkIns as Array<{ id: string; checkedAt: string }>) as WorkoutHistory[];
      setHistory(mergedHistory);
      if (mergedHistory.length !== data.history.length) void repository.write("history", mergedHistory);
      setMeasurements(data.measurements as BodyMeasurement[]);
      setActiveSession(data.activeSession ? normalizeActiveWorkoutSession(data.activeSession as ActiveWorkoutSession) : null);
      setHydrated(true);
    }).catch(() => {
      if (mounted) setHydrated(true);
    });

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    const captureInstallPrompt = (event: Event) => { event.preventDefault(); setInstallPrompt(event as InstallPromptEvent); };
    window.addEventListener("beforeinstallprompt", captureInstallPrompt);
    let refreshWorker: (() => void) | undefined;
    if ("serviceWorker" in navigator) {
      refreshWorker = () => {
        if (!navigator.onLine || document.visibilityState === "hidden") return;
        void navigator.serviceWorker.getRegistration().then((registration) => registration?.update()).catch(() => undefined);
      };
      void navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" })
        .then(async (registration) => {
          registration.waiting?.postMessage({ type: "SKIP_WAITING" });
          await registration.update();
        })
        .catch(() => undefined);
      window.addEventListener("online", refreshWorker);
      document.addEventListener("visibilitychange", refreshWorker);
    }
    void configureNativeChrome();
    void getInstalledAppVersion().then((version) => { if (version && mounted) setInstalledAppVersion(version); });

    return () => {
      mounted = false;
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", captureInstallPrompt);
      if (refreshWorker) {
        window.removeEventListener("online", refreshWorker);
        document.removeEventListener("visibilitychange", refreshWorker);
      }
    };
  }, []);

  const program = useMemo<GeneratedProgram | null>(() => profile ? generateProgram(profile, { history }) : null, [profile, history]);
  const profileDirty = Boolean(profile && JSON.stringify(profile) !== JSON.stringify(draft));

  useEffect(() => {
    if (!editingProfile || !profileDirty) return;
    const protectUnsavedWork = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", protectUnsavedWork);
    return () => window.removeEventListener("beforeunload", protectUnsavedWork);
  }, [editingProfile, profileDirty]);

  function changeTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem(THEME_KEY, next);
  }

  function changePreference<K extends keyof AppPreferences>(name: K, value: AppPreferences[K]) {
    const next = { ...preferences, [name]: value };
    setPreferences(next);
    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next));
  }

  function toggleDay(day: string) {
    setDraft((current) => ({
      ...current,
      days: current.days.includes(day) ? current.days.filter((item) => item !== day) : [...current.days, day],
    }));
  }

  function toggleSpecialCondition(condition: string) {
    setDraft((current) => {
      const selected = current.specialConditions || [];
      return { ...current, specialConditions: selected.includes(condition) ? selected.filter((item) => item !== condition) : [...selected, condition] };
    });
  }

  function toggleListField(field: "secondaryGoals" | "availableEquipment" | "postpartumSymptoms", value: string) {
    setDraft((current) => {
      const selected = current[field] || [];
      return { ...current, [field]: selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value] };
    });
  }

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 320;
        const context = canvas.getContext("2d");
        if (!context) return;
        const scale = Math.max(320 / image.width, 320 / image.height);
        const width = image.width * scale;
        const height = image.height * scale;
        context.drawImage(image, (320 - width) / 2, (320 - height) / 2, width, height);
        setDraft((current) => ({ ...current, photo: canvas.toDataURL("image/jpeg", 0.78) }));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function saveProfile(event?: FormEvent) {
    event?.preventDefault();
    const next = {
      ...draft,
      name: draft.name.trim() || "Você",
      goal: draft.goal || "Condicionamento",
      experience: draft.experience || "Iniciante",
      days: draft.days.length ? draft.days : ["Seg", "Qua", "Sex"],
      duration: draft.duration || "45 min",
      location: draft.location || "Ambos",
      specialConditions: draft.specialConditions || [],
      secondaryGoals: (draft.secondaryGoals || []).slice(0, 2),
      availableEquipment: draft.availableEquipment || [],
      postpartumSymptoms: draft.postpartumSymptoms || [],
      medicalClearance: draft.medicalClearance || false,
      createdAt: draft.createdAt || new Date().toISOString(),
    };
    void getBrowserDataRepository().write("profile", next);
    if (next.weightKg) {
      const latest = measurements[0];
      const changed = !latest || latest.weightKg !== next.weightKg || latest.waistCm !== next.waistCm || latest.restingHeartRate !== next.restingHeartRate;
      if (changed) {
        const nextMeasurement: BodyMeasurement = { recordedAt: new Date().toISOString(), weightKg: next.weightKg, waistCm: next.waistCm, restingHeartRate: next.restingHeartRate };
        const nextMeasurements = [nextMeasurement, ...measurements].slice(0, 120);
        setMeasurements(nextMeasurements);
        void getBrowserDataRepository().write("measurements", nextMeasurements);
      }
    }
    setProfile(next);
    setDraft(next);
    setEditingProfile(false);
    setTab("today");
    setSavedMessage("Perfil salvo no aparelho");
    window.setTimeout(() => setSavedMessage(""), 2600);
  }

  function registerRecovery24h(historyId: string, response: Recovery24h) {
    const nextHistory = history.map((item) => item.id === historyId ? { ...item, recovery24h: response } : item);
    setHistory(nextHistory);
    void getBrowserDataRepository().write("history", nextHistory);
    setSavedMessage("Recuperação registrada");
    window.setTimeout(() => setSavedMessage(""), 2600);
  }

  function cancelProfileEdit() {
    if (profileDirty) {
      setDiscardProfilePrompt(true);
      return;
    }
    setDraft(profile!);
    setEditingProfile(false);
  }

  function discardProfileChanges() {
    setDraft(profile!);
    setEditingProfile(false);
    setDiscardProfilePrompt(false);
  }

  function exportBackup() {
    if (!profile) return;
    const backup = {
      app: "AngelsFit",
      version: BACKUP_FORMAT_VERSION,
      dataSchemaVersion: CURRENT_DATA_SCHEMA_VERSION,
      databaseVersion: EXERCISE_DATABASE_VERSION,
      contentVersion: CONTENT_VERSION,
      exportedAt: new Date().toISOString(),
      profile,
      program,
      history,
      checkIns: [],
      measurements,
      activeSession,
      settings: { theme, preferences },
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `angelsfit-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function toggleRestNotifications() {
    if (preferences.restNotifications) {
      changePreference("restNotifications", false);
      return;
    }
    if (typeof Notification === "undefined") {
      setSavedMessage("Este navegador não oferece notificações de descanso");
      window.setTimeout(() => setSavedMessage(""), 3000);
      return;
    }
    const permission = await Notification.requestPermission();
    changePreference("restNotifications", permission === "granted");
    setSavedMessage(permission === "granted" ? "Avisos de descanso ativados" : "Permissão de notificação não concedida");
    window.setTimeout(() => setSavedMessage(""), 3000);
  }

  function saveMeasurement(measurement: BodyMeasurement, originalRecordedAt?: string) {
    const withoutOriginal = originalRecordedAt ? measurements.filter((item) => item.recordedAt !== originalRecordedAt) : measurements;
    const nextMeasurements = [measurement, ...withoutOriginal]
      .sort((left, right) => new Date(right.recordedAt).getTime() - new Date(left.recordedAt).getTime())
      .slice(0, 120);
    setMeasurements(nextMeasurements);
    void getBrowserDataRepository().write("measurements", nextMeasurements);
    const latest = nextMeasurements[0];
    if (latest && profile) {
      const nextProfile = { ...profile, weightKg: latest.weightKg, waistCm: latest.waistCm, restingHeartRate: latest.restingHeartRate };
      setProfile(nextProfile);
      setDraft(nextProfile);
      void getBrowserDataRepository().write("profile", nextProfile);
    }
    setSavedMessage(originalRecordedAt ? "Medição atualizada" : "Medição registrada");
    window.setTimeout(() => setSavedMessage(""), 2600);
  }

  function deleteMeasurement(recordedAt: string) {
    const nextMeasurements = measurements.filter((item) => item.recordedAt !== recordedAt);
    setMeasurements(nextMeasurements);
    void getBrowserDataRepository().write("measurements", nextMeasurements);
    setSavedMessage("Medição removida");
    window.setTimeout(() => setSavedMessage(""), 2600);
  }

  function updateWorkoutHistory(record: WorkoutHistory) {
    const nextHistory = history.map((item) => item.id === record.id ? record : item);
    setHistory(nextHistory);
    void getBrowserDataRepository().write("history", nextHistory);
    setSavedMessage("Treino corrigido");
    window.setTimeout(() => setSavedMessage(""), 2600);
  }

  function deleteWorkoutHistory(historyId: string) {
    const nextHistory = history.filter((item) => item.id !== historyId);
    setHistory(nextHistory);
    void getBrowserDataRepository().write("history", nextHistory);
    setSavedMessage("Treino removido do histórico");
    window.setTimeout(() => setSavedMessage(""), 2600);
  }

  function openBackupPicker() {
    setBackupError("");
    backupInputRef.current?.click();
  }

  async function handleBackupSelection(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    setBackupError("");
    if (file.size > MAX_BACKUP_FILE_SIZE) {
      setBackupError("O arquivo é grande demais. Selecione um backup do AngelsFit com até 10 MB.");
      return;
    }
    try {
      setPendingBackup(parseBackupJson(await file.text()));
    } catch (error) {
      setBackupError(error instanceof BackupValidationError ? error.message : "Não foi possível ler este arquivo de backup.");
    }
  }

  async function restoreBackup() {
    if (!pendingBackup || restoringBackup) return;
    setRestoringBackup(true);
      const previousTheme = window.localStorage.getItem(THEME_KEY);
    const previousPreferences = window.localStorage.getItem(PREFERENCES_KEY);
    try {
      const parsedProfile = pendingBackup.profile as Profile;
      const normalizedProfile: Profile = {
        ...initialProfile,
        ...parsedProfile,
        specialConditions: parsedProfile.specialConditions || [],
        secondaryGoals: parsedProfile.secondaryGoals || [],
        availableEquipment: parsedProfile.availableEquipment || [],
        postpartumSymptoms: parsedProfile.postpartumSymptoms || [],
        medicalClearance: parsedProfile.medicalClearance || false,
      };
      const restoredHistory = mergeLegacyCheckIns(migrateTrainingHistory(pendingBackup.history as TrainingHistoryLike[]), pendingBackup.checkIns as Array<{ id: string; checkedAt: string }>) as WorkoutHistory[];
      const restoredMeasurements = pendingBackup.measurements as BodyMeasurement[];
      const restoredActiveSession = pendingBackup.activeSession
        ? normalizeActiveWorkoutSession(pendingBackup.activeSession as ActiveWorkoutSession)
        : null;

      if (pendingBackup.settings) {
        window.localStorage.setItem(THEME_KEY, pendingBackup.settings.theme);
        window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(pendingBackup.settings.preferences));
      }
      await getBrowserDataRepository().replaceAll({
        profile: normalizedProfile,
        history: restoredHistory,
        measurements: restoredMeasurements,
        checkIns: [],
        activeSession: restoredActiveSession,
      });

      setProfile(normalizedProfile);
      setDraft(normalizedProfile);
      setHistory(restoredHistory);
      setMeasurements(restoredMeasurements);
      setActiveSession(restoredActiveSession);
      setSessionOpen(false);
      setEditingProfile(false);
      setStep(0);
      setTab("today");
      if (pendingBackup.settings) {
        setTheme(pendingBackup.settings.theme);
        setPreferences(pendingBackup.settings.preferences);
        document.documentElement.dataset.theme = pendingBackup.settings.theme;
      }
      setPendingBackup(null);
      setSavedMessage("Backup restaurado com sucesso");
      window.setTimeout(() => setSavedMessage(""), 3200);
    } catch {
      try {
        if (previousTheme === null) window.localStorage.removeItem(THEME_KEY);
        else window.localStorage.setItem(THEME_KEY, previousTheme);
        if (previousPreferences === null) window.localStorage.removeItem(PREFERENCES_KEY);
        else window.localStorage.setItem(PREFERENCES_KEY, previousPreferences);
      } catch {
        // Critical training data already uses the repository snapshot rollback.
      }
      setPendingBackup(null);
      setBackupError("A restauração não pôde ser concluída. Os dados que estavam no aparelho foram preservados.");
    } finally {
      setRestoringBackup(false);
    }
  }

  function openProfileEditor() {
    setDraft(profile!);
    setEditingProfile(true);
    setTab("profile");
  }

  function startWorkout(workout: GeneratedWorkout, options: Partial<Pick<ActiveWorkoutSession, "plannedDate" | "sequenceNumber" | "sequenceAdvance" | "sequenceAction">> = {}) {
    if (activeSession) {
      setSessionOpen(true);
      setSavedMessage("O treino em andamento foi retomado");
      return;
    }
    const previousWorkout = history.find((item) => isAttendedTrainingSession(item));
    const passiveReadiness = inferPassiveReadiness(history);
    const session = beginActiveSession(createActiveWorkoutSession(workout, Date.now(), {
      plannedDate: options.plannedDate || toLocalDateKey(new Date()),
      sequenceNumber: options.sequenceNumber || completedSequenceCount(history) + 1,
      sequenceAdvance: options.sequenceAdvance ?? 1,
      sequenceAction: options.sequenceAction || "recommended",
    }), Date.now(), previousWorkout, passiveReadiness.level);
    setActiveSession(session);
    setSessionOpen(true);
    void getBrowserDataRepository().write("activeSession", session);
  }

  function persistActiveSession(session: ActiveWorkoutSession) {
    setActiveSession(session);
    void getBrowserDataRepository().write("activeSession", session);
  }

  function finishWorkout(session: ActiveWorkoutSession, status: "completed" | "partial" | "interrupted" = "completed") {
    const normalizedSession = normalizeActiveWorkoutSession(session);
    if (!hasMeaningfulSessionActivity(normalizedSession)) {
      setActiveSession(null);
      setSessionOpen(false);
      setEndSessionPrompt(false);
      void getBrowserDataRepository().remove("activeSession");
      setSavedMessage("Sessão descartada sem registrar presença");
      window.setTimeout(() => setSavedMessage(""), 2600);
      return;
    }
    const metrics = summarizeActiveSession(normalizedSession);
    const completion = sessionCompletionProgress(normalizedSession);
    const workout = normalizedSession.workout;
    const items = [...workout.warmup, ...workout.main, ...workout.cooldown];
    const exerciseRecords: ExercisePerformanceRecord[] = items.map((item) => {
      const plannedSets = normalizedSession.setOverrides[item.exercise.id] ?? item.sets;
      const performedSets = seriesPerformances(normalizedSession, item.exercise.id, plannedSets);
      const completed = performedSets.filter((entry) => entry.completed);
      const completedSets = completed.length;
      const substitution = normalizedSession.substitutions.find((entry) => entry.fromExerciseId === item.exercise.id);
      const performedExercise = substitution ? exerciseById.get(substitution.toExerciseId) || item.exercise : item.exercise;
      const setRecords: SeriesPerformanceRecord[] = performedSets.map((entry) => ({
        series: entry.series,
        completed: entry.completed,
        loadKg: Number.parseFloat((entry.loadKg || "0").replace(",", ".")) || 0,
        repetitions: Number.parseInt(entry.repetitions || "0", 10) || 0,
        rir: entry.rir === "" ? null : Number(entry.rir),
        durationSeconds: Number.parseInt(entry.durationSeconds || "0", 10) || 0,
        assistanceKg: Number.parseFloat((entry.assistanceKg || "0").replace(",", ".")) || 0,
        distanceKm: Number.parseFloat((entry.distanceKm || "0").replace(",", ".")) || 0,
        side: entry.side,
        loadType: entry.loadType,
        actualRestSeconds: entry.actualRestSeconds,
        restStatus: entry.restStatus,
      }));
      const completedSetRecords = setRecords.filter((entry) => entry.completed);
      const repetitionValues = completedSetRecords.map((entry) => entry.repetitions).filter((value) => value > 0);
      const repetitions = repetitionValues.length ? Math.min(...repetitionValues) : 0;
      const loads = completedSetRecords.map((entry) => entry.loadKg).filter((value) => value > 0);
      const rirValues = completedSetRecords.map((entry) => entry.rir).filter((value): value is number => value !== null && Number.isFinite(value));
      const actualRests = completedSetRecords.map((entry) => entry.actualRestSeconds).filter((value): value is number => Number.isFinite(value));
      return {
        exerciseId: performedExercise.id,
        plannedExerciseId: item.exercise.id,
        primaryMuscleGroup: performedExercise.primaryGroup || performedExercise.muscleGroups[0],
        muscleGroups: performedExercise.muscleGroups,
        setsPlanned: plannedSets,
        setsCompleted: completedSets,
        repetitions,
        load: loads.length ? Math.max(...loads) : 0,
        rirOrRpe: rirValues.length ? rirValues.reduce((sum, value) => sum + value, 0) / rirValues.length : undefined,
        restTime: actualRests.length ? Math.round(actualRests.reduce((sum, value) => sum + value, 0) / actualRests.length) : item.rest,
        technique: "padrão",
        executionFeedback: completedSets >= plannedSets ? "adequate" : completedSets > 0 ? "limited" : "unknown",
        painReported: normalizedSession.painEvents.some((event) => event.exerciseId === performedExercise.id || event.plannedExerciseId === item.exercise.id),
        substitutedExerciseId: substitution?.toExerciseId,
        substitutionReason: substitution?.reason,
        priority: item.priority,
        targetRepRange: item.reps,
        targetRir: 2,
        sets: setRecords,
      };
    });
    const sessionQualityScore = calculateSessionQuality({
      exercises: exerciseRecords.map((record, index) => ({ priority: record.priority || (index < 2 ? "A" : index < 5 ? "B" : "C"), completed: record.setsCompleted >= record.setsPlanned })),
      effectiveSetsPerformed: exerciseRecords.reduce((sum, record) => sum + record.setsCompleted, 0),
      effectiveSetsPrescribed: exerciseRecords.reduce((sum, record) => sum + record.setsPlanned, 0),
      effortWithinTargetRatio: metrics.sessionRpe === undefined ? undefined : metrics.sessionRpe >= 5 && metrics.sessionRpe <= 8 ? 1 : 0.45,
      painScore: metrics.painScore,
      symptoms: metrics.symptoms,
      durationMinutes: Math.max(1, Math.round(metrics.elapsedSeconds / 60)),
      targetDurationMinutes: workout.targetMinutes || workout.estimatedMinutes,
    }).score;
    const finalStatus: TrainingSessionStatus = status !== "completed" ? status : qualifySessionCompletion(completion.completedSeries, completion.totalSeries, sessionQualityScore);
    const record: WorkoutHistory = {
      id: normalizedSession.id,
      workoutId: workout.id,
      workoutName: workout.name,
      completedAt: new Date().toISOString(),
      plannedDate: normalizedSession.plannedDate,
      sequenceNumber: normalizedSession.sequenceNumber,
      sequenceAdvance: finalStatus === "completed" ? normalizedSession.sequenceAdvance : 0,
      phaseId: program?.periodization ? `periodization-${program.periodization.track}-cycle-${program.periodization.cycleNumber}-week-${program.periodization.cycleWeek}` : `phase-${program?.cycleNumber || 1}`,
      periodizationTrack: program?.periodization?.track,
      durationMinutes: Math.max(1, Math.round(metrics.elapsedSeconds / 60)),
      completedExercises: metrics.completedExercises,
      totalExercises: metrics.totalExercises,
      completionPercentage: completion.percentage,
      totalVolumeKg: metrics.totalVolumeKg,
      estimatedOneRepMax: metrics.estimatedOneRepMax,
      cardioMinutes: metrics.cardioMinutes,
      cardioIntensity: metrics.cardioIntensity,
      sessionRpe: metrics.sessionRpe,
      averageRir: metrics.averageRir,
      painScore: metrics.painScore,
      symptoms: metrics.symptoms,
      painEvents: normalizedSession.painEvents,
      sessionQualityScore,
      status: finalStatus,
      exerciseRecords,
      wasRepeated: normalizedSession.sequenceAction === "repeated",
      wasManuallyAdvanced: normalizedSession.sequenceAction === "manually_advanced",
    };
    const nextHistory = [record, ...history];
    setHistory(nextHistory);
    void getBrowserDataRepository().write("history", nextHistory);
    setActiveSession(null);
    setSessionOpen(false);
    setEndSessionPrompt(false);
    void getBrowserDataRepository().remove("activeSession");
    setTab("progress");
    setSavedMessage(finalStatus === "completed" ? "Treino registrado" : finalStatus === "partial" ? "Sessão parcial salva" : "Sessão interrompida salva");
    window.setTimeout(() => setSavedMessage(""), 2600);
  }

  function skipWorkout(workout: GeneratedWorkout, plannedDate: string, sequenceNumber: number) {
    const record: WorkoutHistory = {
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-skip`,
      workoutId: workout.id,
      workoutName: workout.name,
      completedAt: new Date().toISOString(),
      plannedDate,
      sequenceNumber,
      sequenceAdvance: 1,
      phaseId: program?.periodization ? `periodization-${program.periodization.track}-cycle-${program.periodization.cycleNumber}-week-${program.periodization.cycleWeek}` : `phase-${program?.cycleNumber || 1}`,
      periodizationTrack: program?.periodization?.track,
      durationMinutes: 0,
      completedExercises: 0,
      totalExercises: workout.warmup.length + workout.main.length + workout.cooldown.length,
      status: "skipped",
      wasSkipped: true,
      exerciseRecords: [],
    };
    const nextHistory = [record, ...history];
    setHistory(nextHistory);
    void getBrowserDataRepository().write("history", nextHistory);
    setSavedMessage("Treino pulado; a sequência foi avançada");
    window.setTimeout(() => setSavedMessage(""), 2600);
  }

  async function updateApplication() {
    if (!navigator.onLine) { setUpdateStatus("offline"); return; }
    setUpdateStatus("checking");
    try {
      const repository = getBrowserDataRepository();
      if (activeSession) await repository.write("activeSession", activeSession);
      await repository.createSnapshot();
      const response = await fetch(`/version.json?check=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Version metadata unavailable");
      const metadata: unknown = await response.json();
      if (!validateVersionMetadata(metadata)) throw new Error("Invalid version metadata");
      const registration = await navigator.serviceWorker?.getRegistration();
      await registration?.update();
      const checkedAt = new Date().toISOString();
      window.localStorage.setItem(LAST_UPDATE_CHECK_KEY, checkedAt);
      setLastUpdateCheck(checkedAt);
      if (compareVersions(installedAppVersion, metadata.minimumSupportedAppVersion) < 0) {
        setUpdateStatus("native-required");
        return;
      }
      if (compareVersions(metadata.contentVersion, CONTENT_VERSION) > 0) {
        setUpdateStatus("available");
        registration?.waiting?.postMessage({ type: "SKIP_WAITING" });
        if ("caches" in globalThis) {
          const cacheKeys = await globalThis.caches.keys();
          await Promise.all(cacheKeys.filter((key) => key.startsWith("angels-fit-shell-")).map((key) => globalThis.caches.delete(key)));
        }
        const reloadUrl = new URL(window.location.href);
        reloadUrl.searchParams.set("updated", metadata.contentVersion);
        window.location.replace(reloadUrl.toString());
        return;
      }
      setUpdateStatus("current");
    } catch {
      await getBrowserDataRepository().restoreLatestSnapshot();
      setUpdateStatus("error");
    }
  }

  async function installWebApp() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setInstallPrompt(null);
  }

  if (!hydrated) {
    return <main className="loading-screen"><div className="brand-mark" aria-hidden="true"><span /></div><p>ANGELSFIT</p></main>;
  }

  if (!profile) {
    return (
      <main className="onboarding-shell">
        <input ref={backupInputRef} className="sr-only" type="file" accept=".json,application/json" aria-label="Selecionar arquivo de backup do AngelsFit" onChange={handleBackupSelection} />
        <div className="onboarding-top">
          <div className="wordmark"><div className="brand-mark" aria-hidden="true"><span /></div>ANGELSFIT</div>
          {step > 0 && <button className="text-button" onClick={() => setStep((current) => Math.max(0, current - 1))}>Voltar</button>}
        </div>
        <div className="step-status">
          <div className="step-dots" aria-label={step === 0 ? "Apresentação" : "Começo rápido"}>
            {[0, 1].map((item) => <span key={item} className={item <= step ? "active" : ""} />)}
          </div>
          <small>{step === 0 ? "Apresentação" : "Começo rápido"}</small>
        </div>

        {step === 0 && (
          <section className="welcome-panel">
            <div className="welcome-visual" aria-hidden="true">
              <div className="pulse-ring"><span>01</span></div>
              <div className="metric-float metric-one"><strong>3x</strong><small>por semana</small></div>
              <div className="metric-float metric-two"><strong>100%</strong><small>seu ritmo</small></div>
            </div>
            <p className="eyebrow">TREINO PESSOAL, DE VERDADE</p>
            <h1>Seu treino.<br /><em>Seu ritmo.</em></h1>
            <p className="lead">Uma rotina construída para você, disponível mesmo quando estiver sem internet.</p>
            <button className="primary-button" onClick={() => setStep(1)}>Começar agora <span>→</span></button>
            <button className="restore-backup-button" type="button" onClick={openBackupPicker}><span aria-hidden="true">↥</span><div><strong>Restaurar meu backup</strong><small>Recuperar perfil, treinos e evolução</small></div></button>
            <p className="privacy-note">Seus dados começam salvos somente neste aparelho.</p>
          </section>
        )}

        {step === 1 && (
          <section className="form-panel">
            <p className="eyebrow">COMEÇO RÁPIDO</p><h1>Treine do seu jeito.</h1><p className="lead compact">Tudo é opcional. Você pode começar agora e completar seus dados depois.</p>
            <label className="photo-picker"><input type="file" accept="image/*" onChange={handlePhoto} /><Avatar profile={draft} size="large" /><span>{draft.photo ? "Trocar foto" : "Adicionar foto"}</span></label>
            <label className="field-label">Como devemos chamar você? <small>Opcional</small><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Seu nome" autoComplete="name" /></label>
            <p className="field-title">Objetivo <small>Opcional</small></p><div className="choice-grid">{goals.map((goal) => <button type="button" key={goal} aria-pressed={draft.goal === goal} className={draft.goal === goal ? "selected" : ""} onClick={() => setDraft({ ...draft, goal })}>{goal}</button>)}</div>
            <p className="field-title">Nível <small>Opcional</small></p><div className="choice-row">{experiences.map((item) => <button type="button" key={item} aria-pressed={draft.experience === item} className={draft.experience === item ? "selected" : ""} onClick={() => setDraft({ ...draft, experience: item })}>{item}</button>)}</div>
            <p className="field-title">Frequência <small>Opcional</small></p><div className="days-picker">{weekDays.map((day) => <button type="button" key={day} aria-pressed={draft.days.includes(day)} className={draft.days.includes(day) ? "selected" : ""} onClick={() => toggleDay(day)}>{day}</button>)}</div>
            <button className="primary-button" onClick={() => saveProfile()}>Começar <span>→</span></button>
            <button className="text-button onboarding-skip" onClick={() => saveProfile()}>Pular por enquanto</button>
          </section>
        )}
        {pendingBackup && <BackupRestoreDialog backup={pendingBackup} restoring={restoringBackup} onConfirm={restoreBackup} onCancel={() => setPendingBackup(null)} />}
        {backupError && <BackupErrorDialog message={backupError} onClose={() => setBackupError("")} />}
      </main>
    );
  }

  if (activeSession && sessionOpen) {
    return <div className={`app-font-${preferences.workoutFontSize} workout-font-${preferences.workoutFontSize}`}><AdaptiveWorkoutSession session={activeSession} profile={profile} history={history} previousWorkout={history.find((item) => isAttendedTrainingSession(item))} preferences={preferences} onExit={() => setSessionOpen(false)} onPersist={persistActiveSession} onFinish={finishWorkout} /></div>;
  }

  const tabContent = {
    today: <Today profile={profile} online={online} setTab={setTab} onEditProfile={openProfileEditor} program={program!} startWorkout={startWorkout} skipWorkout={skipWorkout} activeSession={activeSession} continueWorkout={() => setSessionOpen(true)} endWorkout={() => setEndSessionPrompt(true)} history={history} onRecovery24h={registerRecovery24h} />,
    program: <Program profile={profile} program={program!} previewWorkout={setPreviewWorkout} openExercises={() => setTab("exercises")} onEditProfile={openProfileEditor} />,
    exercises: <Exercises onBack={() => setTab("program")} />,
    progress: <Progress profile={profile} program={program!} history={history} measurements={measurements} setTab={setTab} onSaveMeasurement={saveMeasurement} onDeleteMeasurement={deleteMeasurement} onUpdateHistory={updateWorkoutHistory} onDeleteHistory={deleteWorkoutHistory} />,
    profile: <div className="profile-tab"><ProfileView profile={profile} draft={draft} setDraft={setDraft} editing={editingProfile} setEditing={setEditingProfile} cancelEditing={cancelProfileEdit} saveProfile={saveProfile} handlePhoto={handlePhoto} toggleDay={toggleDay} toggleSpecialCondition={toggleSpecialCondition} toggleListField={toggleListField} theme={theme} changeTheme={changeTheme} exportBackup={exportBackup} preferences={preferences} changePreference={changePreference} toggleRestNotifications={toggleRestNotifications} installed={installed} iosDevice={iosDevice} installedAppVersion={installedAppVersion} updateStatus={updateStatus} lastUpdateCheck={lastUpdateCheck} updateApplication={updateApplication} />{!editingProfile && <><InstallationSetting installed={installed} iosDevice={iosDevice} canInstall={Boolean(installPrompt)} onInstall={() => { void installWebApp(); }} /><section className="backup-management-card"><span aria-hidden="true">↥</span><div><p>RESTAURAÇÃO SEGURA</p><h2>Recuperar um backup</h2><small>Revise o conteúdo do arquivo antes de substituir os dados deste aparelho.</small><button type="button" onClick={openBackupPicker}>Selecionar backup</button></div></section></>}</div>,
  }[tab];

  const showBottomNav = !editingProfile && !previewWorkout;

  return (
    <main className={`app-shell app-font-${preferences.workoutFontSize}`}><div className="mobile-app">
      <input ref={backupInputRef} className="sr-only" type="file" accept=".json,application/json" aria-label="Selecionar arquivo de backup do AngelsFit" onChange={handleBackupSelection} />
      {savedMessage && <div className="toast">✓ {savedMessage}</div>}
      <div className={`app-content ${showBottomNav ? "" : "without-nav"}`}>{previewWorkout ? <WorkoutPreview workout={previewWorkout} onBack={() => setPreviewWorkout(null)} onStart={() => { setPreviewWorkout(null); startWorkout(previewWorkout); }} /> : tabContent}</div>
      {showBottomNav && <nav className="bottom-nav" aria-label="Navegação principal">
        <NavButton active={tab === "today"} label="Hoje" icon="⌂" onClick={() => setTab("today")} />
        <NavButton active={tab === "program" || tab === "exercises"} label="Treinos" icon="▤" onClick={() => setTab("program")} />
        <NavButton active={tab === "progress"} label="Progresso" icon="↗" onClick={() => setTab("progress")} />
        <NavButton active={tab === "profile"} label="Ajustes" icon="○" onClick={() => setTab("profile")} />
      </nav>}
      {discardProfilePrompt && <ConfirmDialog title="Descartar alterações?" description="As mudanças feitas no perfil ainda não foram salvas." confirmLabel="Descartar" onConfirm={discardProfileChanges} onCancel={() => setDiscardProfilePrompt(false)} />}
      {endSessionPrompt && activeSession && <ConfirmDialog title="Encerrar sessão?" description="O progresso atual será salvo como treino parcialmente concluído." confirmLabel="Salvar e encerrar" onConfirm={() => finishWorkout(activeSession, "partial")} onCancel={() => setEndSessionPrompt(false)} />}
      {pendingBackup && <BackupRestoreDialog backup={pendingBackup} restoring={restoringBackup} onConfirm={restoreBackup} onCancel={() => setPendingBackup(null)} />}
      {backupError && <BackupErrorDialog message={backupError} onClose={() => setBackupError("")} />}
    </div></main>
  );
}

function NavButton({ active, label, icon, onClick }: { active: boolean; label: string; icon: string; onClick: () => void }) {
  return <button aria-current={active ? "page" : undefined} className={active ? "active" : ""} onClick={onClick}><span aria-hidden="true">{icon}</span><small>{label}</small></button>;
}

function ConfirmDialog({ title, description, confirmLabel, onConfirm, onCancel }: { title: string; description: string; confirmLabel: string; onConfirm: () => void; onCancel: () => void }) {
  return <div className="dialog-backdrop" role="presentation"><section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description"><div className="dialog-icon" aria-hidden="true">!</div><h2 id="confirm-title">{title}</h2><p id="confirm-description">{description}</p><div><button onClick={onCancel}>Continuar</button><button className="danger" onClick={onConfirm}>{confirmLabel}</button></div></section></div>;
}

function BackupRestoreDialog({ backup, restoring, onConfirm, onCancel }: { backup: ParsedBackup; restoring: boolean; onConfirm: () => void; onCancel: () => void }) {
  const restoredProfile = backup.profile as Profile;
  const exportedLabel = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(backup.exportedAt));
  return (
    <div className="dialog-backdrop" role="presentation">
      <section className="backup-dialog" role="dialog" aria-modal="true" aria-labelledby="backup-dialog-title" aria-describedby="backup-dialog-description">
        <div className="backup-dialog-icon" aria-hidden="true">↥</div>
        <p className="eyebrow">BACKUP ENCONTRADO</p>
        <h2 id="backup-dialog-title">Restaurar dados de {restoredProfile.name}?</h2>
        <p id="backup-dialog-description">Confira o conteúdo antes de substituir os dados salvos neste aparelho.</p>
        <dl className="backup-summary">
          <div><dt>Criado em</dt><dd>{exportedLabel}</dd></div>
          <div><dt>Treinos no histórico</dt><dd>{backup.history.length}</dd></div>
          <div><dt>Presenças históricas</dt><dd>{backup.checkIns.length}</dd></div>
          <div><dt>Medições</dt><dd>{backup.measurements.length}</dd></div>
          <div><dt>Treino em andamento</dt><dd>{backup.activeSession ? "Sim" : "Não"}</dd></div>
          <div><dt>Preferências do app</dt><dd>{backup.settings ? "Incluídas" : "Manter atuais"}</dd></div>
        </dl>
        <p className="backup-safety-note">Antes da restauração, o AngelsFit cria uma cópia de segurança dos dados atuais para poder recuperá-los se algo falhar.</p>
        <div className="backup-dialog-actions"><button type="button" disabled={restoring} onClick={onCancel}>Cancelar</button><button className="restore-confirm" type="button" disabled={restoring} onClick={onConfirm}>{restoring ? "Restaurando…" : "Restaurar backup"}</button></div>
      </section>
    </div>
  );
}

function BackupErrorDialog({ message, onClose }: { message: string; onClose: () => void }) {
  return <div className="dialog-backdrop" role="presentation"><section className="backup-dialog backup-error-dialog" role="alertdialog" aria-modal="true" aria-labelledby="backup-error-title"><div className="dialog-icon" aria-hidden="true">!</div><h2 id="backup-error-title">Não foi possível restaurar</h2><p>{message}</p><button className="backup-error-close" type="button" onClick={onClose}>Entendi</button></section></div>;
}

function ScreenHeader({ title, profile, kicker, onProfileClick }: { title: string; profile: Profile; kicker?: string; onProfileClick?: () => void }) {
  return <header className="screen-header"><div><p>{kicker}</p><h1>{title}</h1></div>{onProfileClick ? <button className="avatar-button" aria-label="Editar informações do perfil" onClick={onProfileClick}><Avatar profile={profile} size="small" /></button> : <Avatar profile={profile} size="small" />}</header>;
}

function cycleDateLabel(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(`${value}T12:00:00`));
}

function WorkoutBlockOverview({ title, items, block }: { title: string; items: GeneratedWorkout["main"]; block: "warmup" | "main" | "cooldown" }) {
  return <section className={`workout-block block-${block}`}><header><span aria-hidden="true">{block === "warmup" ? "01" : block === "main" ? "02" : "03"}</span><div><small>BLOCO</small><strong>{title}</strong></div></header><div>{items.map((item) => <article key={item.exercise.id}><div><strong>{item.exercise.name}</strong><small>{item.exercise.equipment}</small></div><b>{item.sets}× {item.reps}</b></article>)}</div></section>;
}

function Today({ profile, online, setTab, onEditProfile, program, startWorkout, skipWorkout, activeSession, continueWorkout, endWorkout, history, onRecovery24h }: { profile: Profile; online: boolean; setTab: (tab: AppTab) => void; onEditProfile: () => void; program: GeneratedProgram; startWorkout: (workout: GeneratedWorkout, options?: Partial<Pick<ActiveWorkoutSession, "plannedDate" | "sequenceNumber" | "sequenceAdvance" | "sequenceAction">>) => void; skipWorkout: (workout: GeneratedWorkout, plannedDate: string, sequenceNumber: number) => void; activeSession: ActiveWorkoutSession | null; continueWorkout: () => void; endWorkout: () => void; history: WorkoutHistory[]; onRecovery24h: (historyId: string, response: Recovery24h) => void }) {
  const [now] = useState(() => new Date());
  const recommendedIndex = recommendedWorkoutIndex(history, program.workouts.length);
  const effectiveSchedule = useMemo(() => resolveEffectiveSchedule(profile.days, program.effectiveDays || 3), [profile.days, program.effectiveDays]);
  const calendar = useMemo(() => buildCalendarSchedule({ startDate: now, days: 10, availableDays: effectiveSchedule, workouts: program.workouts, recommendedIndex }), [now, effectiveSchedule, program.workouts, recommendedIndex]);
  const [selectedDateKey, setSelectedDateKey] = useState(() => toLocalDateKey(now));
  const [postponedDateKey, setPostponedDateKey] = useState<string | null>(() => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(POSTPONED_WORKOUT_KEY) || "null") as { dateKey?: string } | null;
      return parsed?.dateKey && parsed.dateKey >= toLocalDateKey(now) ? parsed.dateKey : null;
    } catch {
      return null;
    }
  });
  const [adaptationChoice, setAdaptationChoice] = useState<"pending" | "accepted" | "ignored">("pending");
  const [protocolChoice, setProtocolChoice] = useState<"pending" | "accepted" | "ignored">("pending");
  const selectedDay = calendar.find((day) => day.dateKey === selectedDateKey) || calendar[0];
  const postponed = selectedDay?.dateKey === postponedDateKey;
  const workout = postponed ? program.workouts[recommendedIndex] || null : selectedDay?.workout || null;
  const sequenceSelection = resolveSequenceSelection(selectedDay?.sequenceOffset || 0, postponed);
  const adherence = calculateAdherence(history, now, effectiveSchedule);
  const returnAdaptation = getReturnAdaptation(history, now);
  const protocols = eligibleProtocols({ experience: program.effectiveExperience, recovery: program.recoveryClass, adherencePercentage: adherence.adherencePercentage, painScore: Math.max(...history.slice(0, 3).map((item) => item.painScore || 0), 0), inactivityDays: returnAdaptation.inactivityDays, sessionsThisWeek: history.filter((item) => now.getTime() - new Date(item.completedAt).getTime() <= 7 * 86_400_000).length });
  const suggestedProtocol = protocols[0];
  const sequenceNumber = completedSequenceCount(history) + (postponed ? 0 : selectedDay?.sequenceOffset || 0) + 1;
  const selectedLabel = selectedDay ? new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long" }).format(selectedDay.date) : todayLabel();
  const pendingRecovery = history.find((item) => !item.recovery24h && now.getTime() - new Date(item.completedAt).getTime() >= 12 * 3_600_000 && now.getTime() - new Date(item.completedAt).getTime() <= 72 * 3_600_000);
  const activeSummary = activeSession ? summarizeActiveSession(activeSession, now.getTime()) : null;
  const lastActiveMinutes = activeSession ? Math.max(0, Math.round((now.getTime() - new Date(activeSession.updatedAt).getTime()) / 60_000)) : 0;
  const beginSelectedWorkout = () => {
    if (!workout || !selectedDay) return;
    let prepared = adaptationChoice === "accepted" ? applyReturnAdaptation(workout, returnAdaptation) : workout;
    if (protocolChoice === "accepted" && suggestedProtocol) prepared = { ...prepared, notices: [...prepared.notices, `${suggestedProtocol.name}: ${suggestedProtocol.explanation}`] };
    const offSequence = sequenceSelection.action === "manually_advanced";
    if (offSequence) prepared = { ...prepared, notices: [...prepared.notices, "Treino escolhido fora da sequência sugerida; sua escolha foi preservada."] };
    if (postponed) window.localStorage.removeItem(POSTPONED_WORKOUT_KEY);
    startWorkout(prepared, { plannedDate: selectedDay.dateKey, sequenceNumber, sequenceAdvance: sequenceSelection.sequenceAdvance, sequenceAction: sequenceSelection.action });
  };
  const postponeWorkout = () => {
    const nextTrainingDay = calendar.find((day, index) => index > 0 && day.workout);
    if (!nextTrainingDay) return;
    setPostponedDateKey(nextTrainingDay.dateKey);
    window.localStorage.setItem(POSTPONED_WORKOUT_KEY, JSON.stringify({ dateKey: nextTrainingDay.dateKey, workoutId: program.workouts[recommendedIndex]?.id, createdAt: new Date().toISOString() }));
    setSelectedDateKey(nextTrainingDay.dateKey);
  };
  return (
    <section className="screen">
      <ScreenHeader title={profile.name.trim() ? `Olá, ${profile.name.trim().split(" ")[0]}` : "Olá!"} kicker={todayLabel()} profile={profile} onProfileClick={onEditProfile} />
      <div className={`connection-pill ${online ? "online" : "offline"}`}><span />{online ? "Dados locais prontos" : "Modo offline"}</div>
      {activeSession && activeSummary && <article className="resume-session-card"><p>TREINO EM ANDAMENTO</p><h2>{activeSession.workout.name}</h2><span>{activeSummary.completedExercises} de {activeSummary.totalExercises} exercícios · última atividade {lastActiveMinutes < 1 ? "agora" : `há ${lastActiveMinutes} min`}</span><div><button className="resume-primary" onClick={continueWorkout}>Continuar treino</button><button onClick={endWorkout}>Encerrar sessão</button></div></article>}
      {pendingRecovery && <article className="recovery-followup"><p>RECUPERAÇÃO 24H · OPCIONAL</p><h2>Como você recuperou do treino de ontem?</h2><div>{(Object.keys(RECOVERY_LABELS) as Recovery24h[]).map((response) => <button key={response} onClick={() => onRecovery24h(pendingRecovery.id, response)}>{RECOVERY_LABELS[response]}</button>)}</div></article>}
      <div className="week-strip" aria-label="Calendário de próximos treinos">{calendar.map((day) => <button type="button" key={day.dateKey} aria-pressed={selectedDay?.dateKey === day.dateKey} className={`${day.isToday ? "today" : ""} ${selectedDay?.dateKey === day.dateKey ? "selected" : ""} ${day.workout ? "training-day" : "rest-day"}`} onClick={() => setSelectedDateKey(day.dateKey)}><small>{day.weekdayShort}</small><span>{day.dayNumber}</span><em>{day.monthShort}</em>{day.workout && <i aria-hidden="true" />}</button>)}</div>
      {workout ? <article className="hero-card workout-hero"><div className="hero-orbit" aria-hidden="true"><span>{workout.estimatedMinutes}</span></div><p>{selectedDay?.isToday ? "TREINO DO DIA" : postponed ? "TREINO ADIADO" : "TREINO PLANEJADO"}</p><h2>{workout.name}</h2><span>{workout.focus} · {workout.main.length + workout.warmup.length + workout.cooldown.length} movimentos · estimativa real de {workout.estimatedMinutes} min dentro da sua janela de {workout.targetMinutes || workout.estimatedMinutes} min</span><small className="cycle-validity">{selectedLabel} · posição {sequenceNumber} da sequência</small><button onClick={() => activeSession ? continueWorkout() : beginSelectedWorkout()}>{activeSession ? "Continuar treino" : postponed ? "Iniciar treino adiado" : selectedDay?.sequenceOffset ? "Avançar e iniciar" : "Iniciar treino"} <b>→</b></button></article> : <article className="hero-card rest-hero"><div className="hero-orbit" aria-hidden="true"><span>☾</span></div><p>RECUPERAÇÃO</p><h2>Dia sem treino planejado</h2><span>{selectedLabel}. Escolha outro dia no calendário para consultar o próximo treino.</span></article>}
      <div className="sequence-nav">{postponed && <button onClick={() => { window.localStorage.removeItem(POSTPONED_WORKOUT_KEY); setPostponedDateKey(null); setSelectedDateKey(calendar[0]?.dateKey); }}>Voltar ao recomendado</button>}<button onClick={postponeWorkout}>Adiar para outro dia →</button></div>
      <article className="recommendation-card"><p>POR QUE ESTE TREINO?</p><strong>{program.recommendationReason || "A sessão segue sua sequência registrada."}</strong><span>{program.periodization ? `Ciclo ${program.periodization.cycleNumber} · semana ${program.periodization.cycleWeek} de ${program.periodization.cycleLengthWeeks} · ${program.periodization.phase}` : `Fase ${program.cycleNumber}`}</span></article>
      <article className="personalization-card"><p>O QUE MUDOU PARA VOCÊ</p><strong>{program.adaptiveReasons?.[0] || program.progressionNote}</strong><span>{program.calibrationStatus === "calibrated" ? "Seu plano foi calibrado." : "Seu plano está ficando mais personalizado."} {CONFIDENCE_COPY[program.adaptiveConfidence || "low"]}. Quanto mais você treina, mais preciso fica o plano.</span></article>
      {returnAdaptation.level !== "none" && adaptationChoice === "pending" && <article className="suggestion-card"><p>AJUSTE DE RETORNO</p><h2>{returnAdaptation.explanation}</h2><div><button onClick={() => setAdaptationChoice("accepted")}>Aceitar ajuste</button><button onClick={onEditProfile}>Editar dados</button><button onClick={() => setAdaptationChoice("ignored")}>Ignorar</button></div></article>}
      {suggestedProtocol && protocolChoice === "pending" && <article className="suggestion-card"><p>TÉCNICA OPCIONAL</p><h2>{suggestedProtocol.name}</h2><span>{suggestedProtocol.explanation}</span><div><button onClick={() => setProtocolChoice("accepted")}>Aceitar</button><button onClick={onEditProfile}>Editar</button><button onClick={() => setProtocolChoice("ignored")}>Ignorar</button></div></article>}
      <div className="section-heading"><div><p>{selectedDay?.isToday ? "HOJE" : "DATA SELECIONADA"}</p><h2>{workout ? "Plano da sessão" : "Recuperação planejada"}</h2></div></div>
      {workout ? <><div className="workout-blocks-overview"><WorkoutBlockOverview title="Aquecimento e mobilidade" items={workout.warmup} block="warmup" /><WorkoutBlockOverview title="Parte principal" items={workout.main} block="main" /><WorkoutBlockOverview title="Encerramento e alongamento" items={workout.cooldown} block="cooldown" /></div>{(selectedDay?.sequenceOffset === 0 || postponed) && <button className="skip-workout-button" onClick={() => skipWorkout(workout, selectedDay.dateKey, sequenceNumber)}><span aria-hidden="true">↷</span><div><strong>Pular treino</strong><small>Registrar como pulado e avançar a sequência</small></div><b aria-hidden="true">→</b></button>}</> : <article className="safety-block"><p>Recuperação também faz parte do plano. O próximo treino permanece na sequência.</p></article>}
      {workout && workout.notices.length > 0 && <article className="safety-block compact">{workout.notices.map((notice) => <p key={notice}>! {notice}</p>)}</article>}
      <div className="metrics-grid"><article><p>Objetivo</p><strong>{profile.goal || "Objetivo ainda não definido"}</strong><span>foco principal</span></article><article><p>Rotina efetiva</p><strong>{program.effectiveDays ? `${program.effectiveDays}x` : "Rotina sendo aprendida"}</strong><span>por semana</span></article><article><p>Recuperação</p><strong>{program.recoveryClass}</strong><span>{program.specialPhase || (profile.experience ? program.effectiveExperience : "Nível sendo aprendido")}</span></article></div>
      <div className="quick-actions"><button onClick={() => setTab("profile")}><span>○</span><div><strong>Meu perfil e ajustes</strong><small>Revisar dados, preferências e backup</small></div></button></div>
    </section>
  );
}

function Program({ profile, program, previewWorkout, openExercises, onEditProfile }: { profile: Profile; program: GeneratedProgram; previewWorkout: (workout: GeneratedWorkout) => void; openExercises: () => void; onEditProfile: () => void }) {
  const periodization = program.periodization;
  const cycleProgress = periodization ? Math.max(8, (periodization.cycleWeek / periodization.cycleLengthWeeks) * 100) : Math.max(8, ((14 - program.daysRemaining) / 14) * 100);
  return (
    <section className="screen">
      <ScreenHeader title="Meu programa" kicker="PLANEJAMENTO" profile={profile} onProfileClick={onEditProfile} />
      <article className="program-overview"><p>PROGRAMA DE {profile.name.toUpperCase()}</p><h2>{program.title}</h2><div><span><strong>{program.effectiveDays}</strong> dias efetivos</span><span><strong>{profile.duration}</strong> por sessão</span></div><div className="program-progress"><span style={{ width: `${cycleProgress}%` }} /></div><small>{periodization ? `${periodization.model} · semana ${periodization.cycleWeek} de ${periodization.cycleLengthWeeks}` : program.status === "ready" ? `${cycleDateLabel(program.validFrom)} a ${cycleDateLabel(program.validUntil)}` : program.split}</small>{program.specialPhase && <em className="program-phase">{program.specialPhase}</em>}</article>
      {periodization && <article className={`periodization-card decision-${periodization.decision}`}><header><div><p>FASE ATUAL</p><h2>{periodization.phase}</h2></div><strong>{periodization.effortTarget}</strong></header><div className="periodization-facts"><span><small>Volume</small><b>{Math.round(periodization.volumeMultiplier * 100)}%</b></span><span><small>Carga-base</small><b>{Math.round(periodization.loadMultiplier * 100)}%</b></span><span><small>Faixa</small><b>{periodization.repetitionTarget}</b></span></div><p>{periodization.reason}</p><small>A semana avança após {periodization.sessionsPerWeek} sessões qualificadas. Técnica, conclusão, esforço, dor, sintomas e recuperação são considerados.</small></article>}
      <div className="section-heading"><div><p>{periodization ? `CICLO ${periodization.cycleNumber} · ${periodization.cycleLengthWeeks} SEMANAS` : "PROGRAMA ATUAL"}</p><h2>Treinos desta fase</h2></div></div>
      {program.workouts.length > 0 ? <div className="program-list">{program.workouts.map((workout, index) => <button key={workout.id} aria-label={`Ver treino ${workout.name}`} onClick={() => previewWorkout(workout)}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{workout.name}</strong><small>{workout.warmup.length + workout.main.length + workout.cooldown.length} movimentos · estimativa {workout.estimatedMinutes} min · 3 blocos</small></div><b>Ver</b></button>)}</div> : <article className="safety-block">{program.notices.map((notice) => <p key={notice}>! {notice}</p>)}</article>}
      <button className="library-entry" onClick={openExercises}><span aria-hidden="true">◎</span><div><strong>Biblioteca de exercícios</strong><small>Consulte execução, músculos e alternativas.</small></div><b>Ver →</b></button>
      <article className="upgrade-card"><span>↻</span><div><strong>{periodization ? `${periodization.sessionsToNextWeek} ${periodization.sessionsToNextWeek === 1 ? "sessão qualificada" : "sessões qualificadas"} para a próxima semana` : `Próxima revisão em ${program.daysRemaining} dias`}</strong><p>{program.progressionNote}</p></div></article>
      {program.specialPhase && <details className="methodology-card"><summary>Critérios do programa pós-parto</summary><p>O programa avança por blocos de duas semanas. Liberação, cicatrização e sintomas podem ser registrados, mas permanecem informativos e não bloqueiam o acesso aos treinos.</p><div><a href="https://bjsm.bmj.com/content/59/8/515" target="_blank" rel="noreferrer">Diretriz canadense 2025</a><a href="https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2020/04/physical-activity-and-exercise-during-pregnancy-and-the-postpartum-period" target="_blank" rel="noreferrer">ACOG · exercício pós-parto</a></div></details>}
    </section>
  );
}

function WorkoutPreview({ workout, onBack, onStart }: { workout: GeneratedWorkout; onBack: () => void; onStart: () => void }) {
  const items = [...workout.warmup, ...workout.main, ...workout.cooldown];
  return <section className="screen workout-preview"><header className="preview-header"><button onClick={onBack}>← Programa</button><span>Overview do treino</span></header><div className="preview-hero"><p>PLANO COMPLETO DA SESSÃO</p><h1>{workout.name}</h1><span>{workout.focus} · {items.length} movimentos · cerca de {workout.estimatedMinutes} min</span></div><div className="workout-blocks-overview preview-blocks"><WorkoutBlockOverview title="Aquecimento e mobilidade" items={workout.warmup} block="warmup" /><WorkoutBlockOverview title="Parte principal" items={workout.main} block="main" /><WorkoutBlockOverview title="Encerramento e alongamento" items={workout.cooldown} block="cooldown" /></div><footer className="preview-actions"><button onClick={onBack}>Agora não</button><button className="start" onClick={onStart}>Iniciar treino →</button></footer></section>;
}

function ExerciseDemo({ exerciseId, exerciseName, compact = false }: { exerciseId: string; exerciseName: string; compact?: boolean }) {
  const bundledMedia = exerciseMedia[exerciseId];
  const [remoteGif, setRemoteGif] = useState<string | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [mediaStatus, setMediaStatus] = useState<"loading" | "ready" | "error">("loading");
  useEffect(() => {
    setVideoReady(false);
    setRemoteGif(null);
    setMediaStatus(bundledMedia?.imageUrl && !bundledMedia.videoUrl ? "ready" : "loading");
    if (bundledMedia) return;
    const query = exerciseMediaQueries[exerciseId];
    if (!query) { setMediaStatus("error"); return; }
    const cacheKey = `angels-fit.exercise-media.${exerciseId}`;
    const cached = window.sessionStorage.getItem(cacheKey);
    if (cached) { setRemoteGif(cached); setMediaStatus("ready"); return; }
    const controller = new AbortController();
    fetch(`https://oss.exercisedb.dev/api/v1/exercises/search?search=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        const responsePayload = payload as { data?: Array<{ name?: string; gifUrl?: string }> } | null;
        const wanted = query.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter((token) => !["machine", "exercise", "stretch"].includes(token));
        const ranked = (responsePayload?.data || []).map((item: { name?: string; gifUrl?: string }) => {
          const available = new Set((item.name || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/));
          return { item, coverage: wanted.filter((token) => available.has(token)).length / Math.max(1, wanted.length) };
        }).sort((a: { coverage: number }, b: { coverage: number }) => b.coverage - a.coverage);
        const gifUrl = ranked[0]?.coverage >= 0.75 ? ranked[0].item.gifUrl : null;
        if (gifUrl) { window.sessionStorage.setItem(cacheKey, gifUrl); setRemoteGif(gifUrl); setMediaStatus("ready"); }
        else setMediaStatus("error");
      }).catch(() => setMediaStatus("error"));
    return () => controller.abort();
  }, [bundledMedia, exerciseId, exerciseName]);
  const media = bundledMedia || (remoteGif ? { exerciseName, providerName: exerciseName, videoUrl: null, imageUrl: null, gifUrl: remoteGif } : null);
  if (!media && mediaStatus === "loading") return <div className={`exercise-media-state media-loading${compact ? " compact" : ""}`} role="status"><span /><p>Carregando demonstração…</p></div>;
  if (!media || mediaStatus === "error") return null;
  return <figure className={`exercise-demo${compact ? " compact" : ""}`}>
    <div className="exercise-demo-frame">
      {mediaStatus === "loading" && <div className="media-skeleton" aria-hidden="true" />}
      {(media.gifUrl || media.imageUrl) && <img src={media.gifUrl || media.imageUrl || undefined} alt={media.gifUrl ? `Demonstração em movimento de ${exerciseName}` : `Posição de referência para ${exerciseName}`} loading="lazy" onLoad={() => setMediaStatus("ready")} onError={() => setMediaStatus("error")} />}
      {media.videoUrl && <video className={videoReady ? "ready" : ""} src={media.videoUrl} poster={media.imageUrl || undefined} autoPlay loop muted playsInline preload="metadata" onCanPlay={() => { setVideoReady(true); setMediaStatus("ready"); }} onError={() => setMediaStatus("error")} aria-label={`Demonstração em movimento de ${exerciseName}`} />}
      <span aria-hidden="true">EXECUÇÃO</span>
    </div>
    {!compact && <figcaption>Demonstração ilustrativa em loop · confira as instruções abaixo.</figcaption>}
  </figure>;
}

function Exercises({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState("");
  const [contextFilter, setContextFilter] = useState("Todos");
  const [muscleFilter, setMuscleFilter] = useState("Todos os grupos");
  const [openExercise, setOpenExercise] = useState<string | null>(null);
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  const filtered = exercises.filter((exercise) => {
    const searchable = `${exercise.name} ${exercise.primaryGroup || ""} ${exercise.subgroup || ""} ${exercise.muscleGroups.join(" ")} ${exercise.biomechanicalPattern || ""} ${exercise.equipment}`.toLocaleLowerCase("pt-BR");
    const matchesSearch = !normalizedSearch || searchable.includes(normalizedSearch);
    const matchesContext = contextFilter === "Todos"
      || (contextFilter === "Academia" && exercise.locations.includes("Academia"))
      || (contextFilter === "Casa" && exercise.locations.includes("Em casa"))
      || (contextFilter === "Mobilidade" && ["mobility", "cooldown"].includes(exercise.movement))
      || (contextFilter === "Baixo impacto" && exercise.impact === "baixo");
    const matchesMuscle = muscleFilter === "Todos os grupos" || exercise.primaryGroup === muscleFilter;
    return matchesSearch && matchesContext && matchesMuscle;
  });
  const contextFilters = ["Todos", "Academia", "Casa", "Mobilidade", "Baixo impacto"];
  const resetFilters = () => {
    setSearch("");
    setContextFilter("Todos");
    setMuscleFilter("Todos os grupos");
  };

  return (
    <section className="screen">
      <button className="section-back" onClick={onBack}>← Treinos</button>
      <div className="simple-header"><p>BIBLIOTECA · BASE 5.0</p><h1>{filtered.length} {filtered.length === 1 ? "exercício" : "exercícios"}</h1></div>
      <label className="search-field">
        <span aria-hidden="true">⌕</span>
        <span className="sr-only">Buscar exercício, músculo ou movimento</span>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar exercício, músculo ou movimento" />
        {search && <button aria-label="Limpar busca" onClick={() => setSearch("")}>×</button>}
      </label>
      <p className="filter-section-label">LOCAL E TIPO</p>
      <div className="filter-chips" aria-label="Filtrar por local ou tipo">{contextFilters.map((item) => <button key={item} type="button" aria-pressed={contextFilter === item} className={contextFilter === item ? "active" : ""} onClick={() => setContextFilter(item)}>{item}</button>)}</div>
      <p className="filter-section-label">GRUPO MUSCULAR</p>
      <div className="filter-chips muscle-filter-chips" aria-label="Filtrar por grupo muscular">{["Todos os grupos", ...exerciseMuscleGroups].map((item) => <button key={item} type="button" aria-pressed={muscleFilter === item} className={muscleFilter === item ? "active" : ""} onClick={() => setMuscleFilter(item)}>{item}</button>)}</div>
      <div className="exercise-list">
        {filtered.map((exercise) => {
          const open = openExercise === exercise.id;
          const detailsId = `exercise-${exercise.id}`;
          return (
            <article key={exercise.id} className={open ? "open" : ""}>
              <button className="exercise-trigger" aria-expanded={open} aria-controls={detailsId} onClick={() => setOpenExercise(open ? null : exercise.id)}>
                <span aria-hidden="true">{exercise.movement === "warmup" ? "↗" : exercise.movement === "cooldown" ? "↓" : "●"}</span>
                <div><strong>{exercise.name}</strong><small>{exercise.primaryGroup || exercise.muscleGroups.join(" · ")} · {exercise.equipment}</small></div>
                <b aria-hidden="true">⌄</b>
              </button>
              {open && (
                <div className="exercise-details" id={detailsId}>
                  <ExerciseDemo key={exercise.id} exerciseId={exercise.id} exerciseName={exercise.name} />
                  <div className="exercise-metadata">
                    <span>{exercise.level}</span>
                    {exercise.complexity && <span>Complexidade {exercise.complexity}/5</span>}
                    {exercise.biomechanicalPattern && <span>{exercise.biomechanicalPattern}</span>}
                    {exercise.laterality && <span>{exercise.laterality}</span>}
                  </div>
                  <p><strong>Execução</strong>{exercise.instructions}</p>
                  <p><strong>Erros comuns</strong>{exercise.commonErrors}</p>
                  {exercise.attention && <p className="exercise-attention"><strong>Atenção</strong>{exercise.attention}</p>}
                  <div>{exercise.tags.slice(0, 4).map((tag) => <span key={tag}>{tag.replaceAll("-", " ")}</span>)}</div>
                </div>
              )}
            </article>
          );
        })}
      </div>
      {filtered.length === 0 && <article className="large-empty-state compact-state"><div className="exercise-glyph" aria-hidden="true"><span /></div><h2>Nada encontrado</h2><p>Tente outro nome, grupo muscular ou filtro.</p><button className="reset-filters" onClick={resetFilters}>Limpar filtros</button></article>}
    </section>
  );
}

function buildWeeklySessions(history: WorkoutHistory[]) {
  const now = Date.now();
  return Array.from({ length: 6 }, (_, displayIndex) => {
    const bucket = 5 - displayIndex;
    const count = history.filter((item) => {
      if (!isAttendedTrainingSession(item)) return false;
      const ageDays = (now - new Date(item.completedAt).getTime()) / 86_400_000;
      return ageDays >= bucket * 7 && ageDays < (bucket + 1) * 7;
    }).length;
    return { label: bucket === 0 ? "Agora" : `-${bucket}s`, value: count };
  });
}

function MetricBars({ items, suffix = "", relative = false }: { items: Array<{ label: string; value: number }>; suffix?: string; relative?: boolean }) {
  const max = Math.max(...items.map((item) => item.value), 1);
  const min = relative ? Math.min(...items.map((item) => item.value)) : 0;
  return <div className="metric-bars">{items.map((item, index) => { const height = relative ? 24 + ((item.value - min) / Math.max(max - min, 1)) * 76 : Math.max(item.value > 0 ? 12 : 2, (item.value / max) * 100); return <div key={`${item.label}-${index}`}><span className="bar-track"><i style={{ height: `${height}%` }} /></span><strong>{item.value ? `${formatMetric(item.value, item.value % 1 ? 1 : 0)}${suffix}` : "0"}</strong><small>{item.label}</small></div>; })}</div>;
}

function Progress({ profile, program, history, measurements, setTab, onSaveMeasurement, onDeleteMeasurement, onUpdateHistory, onDeleteHistory }: { profile: Profile; program: GeneratedProgram; history: WorkoutHistory[]; measurements: BodyMeasurement[]; setTab: (tab: AppTab) => void; onSaveMeasurement: (measurement: BodyMeasurement, originalRecordedAt?: string) => void; onDeleteMeasurement: (recordedAt: string) => void; onUpdateHistory: (record: WorkoutHistory) => void; onDeleteHistory: (historyId: string) => void }) {
  const [now] = useState(() => Date.now());
  const [measurementEditor, setMeasurementEditor] = useState<BodyMeasurement | "new" | null>(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const age = calculateAge(profile.birthDate);
  const bmi = calculateBmi(profile.weightKg, profile.heightCm);
  const waistRatio = waistToHeightRatio(profile.waistCm, profile.heightCm);
  const restingEnergy = estimateRestingEnergy(profile.weightKg, profile.heightCm, age, profile.biologicalSex);
  const recentWorkouts = history.filter((item) => isAttendedTrainingSession(item) && now - new Date(item.completedAt).getTime() <= 28 * 86_400_000);
  const attendanceDays = new Set(recentWorkouts.map((item) => localDateKey(new Date(item.completedAt)))).size;
  const effectiveSchedule = resolveEffectiveSchedule(profile.days, program.effectiveDays || 3);
  const monthlyAdherence = calculateAdherence(history, new Date(now), effectiveSchedule);
  const adherence = monthlyAdherence.adherencePercentage;
  const plannedWeekly = Math.max(effectiveSchedule.length, 1);
  const streak = attendanceStreak(history);
  const attendedHistory = history.filter((item) => isAttendedTrainingSession(item));
  const completedHistory = history.filter((item) => normalizedTrainingStatus(item) === "completed");
  const partialHistory = history.filter((item) => ["partial", "interrupted"].includes(normalizedTrainingStatus(item)));
  const weekly = buildWeeklySessions(history);
  const weeklyMuscleVolume = buildWeeklyMuscleVolume(history, program.workouts, new Date(now));
  const weightItems = [...measurements].slice(0, 6).reverse().map((item) => ({ label: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(new Date(item.recordedAt)), value: item.weightKg }));
  const volumeItems = [...attendedHistory].filter((item) => (item.totalVolumeKg || 0) > 0).slice(0, 6).reverse().map((item) => ({ label: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(new Date(item.completedAt)), value: Math.round(item.totalVolumeKg || 0) }));
  const exerciseTrendMap = new Map<string, Array<{ label: string; value: number; repetitions: number }>>();
  for (const workoutRecord of [...attendedHistory].reverse()) {
    for (const exerciseRecord of workoutRecord.exerciseRecords || []) {
      const completedSets = exerciseRecord.sets?.filter((entry) => entry.completed && entry.loadKg > 0) || [];
      const bestSet = completedSets.sort((left, right) => right.loadKg - left.loadKg || right.repetitions - left.repetitions)[0];
      const value = bestSet?.loadKg || exerciseRecord.load || 0;
      if (!value) continue;
      const values = exerciseTrendMap.get(exerciseRecord.exerciseId) || [];
      values.push({ label: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(new Date(workoutRecord.completedAt)), value, repetitions: bestSet?.repetitions || exerciseRecord.repetitions });
      exerciseTrendMap.set(exerciseRecord.exerciseId, values.slice(-6));
    }
  }
  const exerciseTrends = [...exerciseTrendMap.entries()].filter(([, values]) => values.length >= 2).slice(0, 4);
  const complete = Boolean(profile.birthDate && profile.heightCm && profile.weightKg && profile.activityLevel);
  const hasActivity = history.length > 0;
  const activities = [...history]
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 4)
    .map((item) => ({ id: `workout-${item.id}`, historyId: item.id, type: trainingStatusLabel(item), title: item.workoutName, date: item.completedAt, meta: `${item.completedExercises}/${item.totalExercises} movimentos · ${item.durationMinutes} min${item.sessionRpe ? ` · RPE ${item.sessionRpe}` : ""}${item.cardioMinutes ? ` · cardio ${item.cardioMinutes} min ${cardioLabel(item.cardioIntensity).toLocaleLowerCase("pt-BR")}` : ""}${item.symptoms?.length ? " · sintomas registrados" : ""}` }));

  return <section className="screen performance-screen">
    <div className="simple-header"><p>CONSISTÊNCIA + EVOLUÇÃO</p><h1>Progresso</h1></div>
    {!hasActivity && <article className="progress-welcome"><span aria-hidden="true">↗</span><div><strong>Seu progresso começa hoje.</strong><p>Conclua ao menos uma série para registrar automaticamente sua presença e evolução.</p><button onClick={() => setTab("today")}>Ir para Hoje →</button></div></article>}
    <div className="progress-summary"><article><strong>{completedHistory.length}</strong><span>concluídos</span></article><article><strong>{partialHistory.length}</strong><span>parciais</span></article><article><strong>{streak}</strong><span>{streak === 1 ? "dia seguido" : "dias seguidos"}</span></article></div>
    {!complete && <button className="profile-completion-card" onClick={() => setTab("profile")}><span>+</span><div><strong>Acompanhe mais indicadores</strong><small>Adicione medidas corporais para acompanhar também peso, IMC e cintura.</small></div><b>→</b></button>}
    {hasActivity && <article className="adherence-card"><div><p>ASSIDUIDADE · 28 DIAS</p><strong>{adherence}%</strong><span>{attendanceDays} {attendanceDays === 1 ? "dia com presença" : "dias com presença"} · meta de {plannedWeekly}x/semana</span></div><div className="adherence-ring" style={{ background: `conic-gradient(var(--accent) ${adherence * 3.6}deg, var(--surface-3) 0deg)` }}><span>{attendanceDays}</span><small>presenças</small></div></article>}
    <div className="performance-section"><div className="section-heading"><div><p>FREQUÊNCIA</p><h2>Treinos nas últimas 6 semanas</h2></div></div>{attendedHistory.length ? <article className="chart-card"><MetricBars items={weekly} /></article> : <article className="data-empty"><strong>O gráfico será ativado no primeiro treino realizado</strong><p>Treinos pulados e sessões sem séries concluídas não entram nesta conta.</p></article>}</div>
    <div className="performance-section"><div className="section-heading"><div><p>VOLUME SEMANAL</p><h2>Grupos musculares</h2></div><span className="version-badge">últimos 7 dias</span></div>{weeklyMuscleVolume.length ? <div className="muscle-volume-list">{weeklyMuscleVolume.map((item) => <article key={item.muscleGroup} className={`volume-${item.status}`}><div><strong>{item.muscleGroup}</strong><small>{item.completedSets} de {item.plannedSets} séries planejadas</small></div><span><i style={{ width: `${Math.min(100, item.percentage)}%` }} /></span><b>{item.status === "above" ? "acima do plano" : item.status === "target" ? "meta atingida" : `${item.percentage}%`}</b></article>)}</div> : <article className="data-empty"><strong>O controle começa no próximo treino</strong><p>As séries realizadas serão agrupadas por músculo e comparadas ao plano da semana.</p></article>}</div>
    <div className="section-heading"><div><p>INDICADORES PESSOAIS</p><h2>Dados de referência</h2></div></div><div className="performance-kpis"><article><p>IMC</p><strong>{bmi !== null ? formatMetric(bmi) : "—"}</strong><span>{bmiCategory(bmi, age)}</span></article><article><p>Cintura/altura</p><strong>{waistRatio !== null ? formatMetric(waistRatio, 2) : "—"}</strong><span>{waistRatioCategory(waistRatio)}</span></article><article><p>Atividade semanal</p><strong>{profile.weeklyActivityMinutes || 0}</strong><span>minutos informados</span></article><article><p>Gasto em repouso</p><strong>{restingEnergy ? `${restingEnergy}` : "—"}</strong><span>{restingEnergy ? "kcal/dia estimadas" : "sexo biológico opcional"}</span></article></div>
    <div className="performance-section"><div className="section-heading"><div><p>CARGA DE TREINO</p><h2>Volume registrado</h2></div></div>{volumeItems.length ? <article className="chart-card"><MetricBars items={volumeItems} suffix=" kg" /></article> : <article className="data-empty"><strong>Registre carga e repetições</strong><p>O volume aparecerá depois dos primeiros treinos registrados.</p></article>}</div>
    {exerciseTrends.length > 0 && <div className="performance-section"><div className="section-heading"><div><p>EVOLUÇÃO POR EXERCÍCIO</p><h2>Cargas recentes</h2></div></div><div className="exercise-trend-list">{exerciseTrends.map(([exerciseId, values]) => <article key={exerciseId}><header><strong>{exerciseById.get(exerciseId)?.name || exerciseId}</strong><span>{values.at(-1)?.value.toLocaleString("pt-BR")} kg · {values.at(-1)?.repetitions} rep</span></header><MetricBars items={values.map((item) => ({ label: item.label, value: item.value }))} suffix=" kg" relative /></article>)}</div></div>}
    <div className="performance-section"><div className="section-heading measurement-heading"><div><p>COMPOSIÇÃO CORPORAL</p><h2>Tendência de peso</h2></div><button type="button" onClick={() => setMeasurementEditor("new")}>+ Nova medição</button></div>{weightItems.length > 1 ? <article className="chart-card"><MetricBars items={weightItems} suffix=" kg" relative /></article> : <article className="data-empty"><strong>Mais uma medição libera a tendência</strong><p>Registre seu peso em outra data para comparar a evolução.</p></article>}{measurements.length > 0 && <div className="measurement-history">{measurements.slice(0, 5).map((item) => <button type="button" key={item.recordedAt} onClick={() => setMeasurementEditor(item)}><span>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(item.recordedAt))}</span><strong>{formatMetric(item.weightKg)} kg</strong><small>{item.waistCm ? `Cintura ${formatMetric(item.waistCm)} cm` : "Toque para editar"}</small></button>)}</div>}</div>
    <div className="section-heading"><div><p>ATIVIDADE</p><h2>Histórico recente</h2></div><span className="version-badge">últimos 4</span></div>{activities.length ? <div className="activity-list">{activities.map((item) => <button type="button" className="activity-entry" key={item.id} onClick={() => setSelectedWorkoutId(item.historyId)}><span aria-hidden="true">↗</span><div><small>{item.type}</small><strong>{item.title}</strong><p>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.date))} · {item.meta}</p></div><b>Ver detalhes</b></button>)}</div> : <article className="data-empty"><strong>Nenhum treino registrado</strong><p>Os quatro treinos mais recentes aparecerão aqui.</p></article>}
    <details className="methodology-card"><summary>Sobre estas métricas</summary><p>Sessões só aparecem como concluídas quando pelo menos 70% dos movimentos foram realizados. O volume muscular compara as séries feitas nos últimos sete dias com o programa atual.</p><p>As métricas ajudam no acompanhamento pessoal e não substituem avaliação clínica, diagnóstico ou orientação nutricional.</p></details>
    {measurementEditor && <MeasurementEditor measurement={measurementEditor === "new" ? undefined : measurementEditor} onClose={() => setMeasurementEditor(null)} onSave={(measurement, originalRecordedAt) => { onSaveMeasurement(measurement, originalRecordedAt); setMeasurementEditor(null); }} onDelete={measurementEditor === "new" ? undefined : () => { onDeleteMeasurement(measurementEditor.recordedAt); setMeasurementEditor(null); }} />}
    {selectedWorkoutId && history.find((item) => item.id === selectedWorkoutId) && <WorkoutHistoryDetail record={history.find((item) => item.id === selectedWorkoutId)!} onClose={() => setSelectedWorkoutId(null)} onSave={(record) => { onUpdateHistory(record); setSelectedWorkoutId(null); }} onDelete={() => { onDeleteHistory(selectedWorkoutId); setSelectedWorkoutId(null); }} />}
  </section>;
}

function MeasurementEditor({ measurement, onClose, onSave, onDelete }: { measurement?: BodyMeasurement; onClose: () => void; onSave: (measurement: BodyMeasurement, originalRecordedAt?: string) => void; onDelete?: () => void }) {
  const initialDate = measurement ? toLocalDateKey(new Date(measurement.recordedAt)) : toLocalDateKey(new Date());
  const [date, setDate] = useState(initialDate);
  const [weight, setWeight] = useState(measurement ? String(measurement.weightKg).replace(".", ",") : "");
  const [waist, setWaist] = useState(measurement?.waistCm ? String(measurement.waistCm).replace(".", ",") : "");
  const [heartRate, setHeartRate] = useState(measurement?.restingHeartRate ? String(measurement.restingHeartRate) : "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const weightValue = Number.parseFloat(weight.replace(",", "."));
  const canSave = Boolean(date) && Number.isFinite(weightValue) && weightValue >= 25 && weightValue <= 400;
  return <div className="bottom-sheet-backdrop" role="presentation" onClick={onClose}><section className="bottom-sheet measurement-sheet" role="dialog" aria-modal="true" aria-labelledby="measurement-title" onClick={(event) => event.stopPropagation()}><header><div><small>ACOMPANHAMENTO CORPORAL</small><h2 id="measurement-title">{measurement ? "Editar medição" : "Nova medição"}</h2></div><button aria-label="Fechar" onClick={onClose}>×</button></header><div className="measurement-form"><label>Data<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><label>Peso<span><input type="text" inputMode="decimal" value={weight} onChange={(event) => setWeight(event.target.value)} placeholder="Ex.: 68,5" /><b>kg</b></span></label><label>Cintura — opcional<span><input type="text" inputMode="decimal" value={waist} onChange={(event) => setWaist(event.target.value)} placeholder="Ex.: 78" /><b>cm</b></span></label><label>FC de repouso — opcional<span><input type="number" inputMode="numeric" min="30" max="220" value={heartRate} onChange={(event) => setHeartRate(event.target.value)} /><b>bpm</b></span></label></div><button className="sheet-primary" disabled={!canSave} onClick={() => onSave({ recordedAt: new Date(`${date}T12:00:00`).toISOString(), weightKg: weightValue, waistCm: waist ? Number.parseFloat(waist.replace(",", ".")) : undefined, restingHeartRate: heartRate ? Number(heartRate) : undefined }, measurement?.recordedAt)}>Salvar medição</button>{onDelete && !confirmDelete && <button className="sheet-delete" onClick={() => setConfirmDelete(true)}>Excluir esta medição</button>}{onDelete && confirmDelete && <div className="inline-delete-confirm"><p>Excluir definitivamente esta medição?</p><button onClick={() => setConfirmDelete(false)}>Cancelar</button><button onClick={onDelete}>Excluir</button></div>}</section></div>;
}

function recalculateWorkoutRecord(record: WorkoutHistory): WorkoutHistory {
  let totalVolumeKg = 0;
  let estimatedOneRepMax = 0;
  const allRir: number[] = [];
  const exerciseRecords = (record.exerciseRecords || []).map((exerciseRecord) => {
    if (!exerciseRecord.sets?.length) return exerciseRecord;
    const completed = exerciseRecord.sets.filter((entry) => entry.completed);
    const repetitions = completed.map((entry) => entry.repetitions).filter((value) => value > 0);
    const loads = completed.map((entry) => entry.loadKg).filter((value) => value > 0);
    const rir = completed.map((entry) => entry.rir).filter((value): value is number => value !== null && Number.isFinite(value));
    const rests = completed.map((entry) => entry.actualRestSeconds).filter((value): value is number => Number.isFinite(value));
    for (const entry of completed) {
      totalVolumeKg += seriesVolume(entry);
      const estimate = epleyEstimatedOneRepMax(entry.loadKg, entry.repetitions);
      if (estimate) estimatedOneRepMax = Math.max(estimatedOneRepMax, estimate);
    }
    allRir.push(...rir);
    return {
      ...exerciseRecord,
      setsCompleted: completed.length,
      repetitions: repetitions.length ? Math.min(...repetitions) : 0,
      load: loads.length ? Math.max(...loads) : 0,
      rirOrRpe: rir.length ? rir.reduce((sum, value) => sum + value, 0) / rir.length : undefined,
      restTime: rests.length ? Math.round(rests.reduce((sum, value) => sum + value, 0) / rests.length) : exerciseRecord.restTime,
      executionFeedback: completed.length >= exerciseRecord.setsPlanned ? "adequate" as const : completed.length ? "limited" as const : "unknown" as const,
    };
  });
  const completedExercises = exerciseRecords.filter((item) => item.setsCompleted >= item.setsPlanned).length;
  const totalSets = exerciseRecords.reduce((sum, item) => sum + item.setsPlanned, 0);
  const completedSets = exerciseRecords.reduce((sum, item) => sum + item.setsCompleted, 0);
  const ratio = totalSets ? completedSets / totalSets : 0;
  const sessionQualityScore = calculateSessionQuality({
    exercises: exerciseRecords.map((item, index) => ({ priority: item.priority || (index < 2 ? "A" : index < 5 ? "B" : "C"), completed: item.setsCompleted >= item.setsPlanned })),
    effectiveSetsPerformed: completedSets,
    effectiveSetsPrescribed: totalSets,
    painScore: record.painScore,
    symptoms: record.symptoms,
    durationMinutes: record.durationMinutes,
  }).score;
  return {
    ...record,
    exerciseRecords,
    completedExercises,
    totalExercises: exerciseRecords.length,
    completionPercentage: Math.round(ratio * 100),
    totalVolumeKg: Math.round(totalVolumeKg),
    estimatedOneRepMax: Math.round(estimatedOneRepMax * 10) / 10,
    averageRir: allRir.length ? Math.round((allRir.reduce((sum, value) => sum + value, 0) / allRir.length) * 10) / 10 : undefined,
    sessionQualityScore,
    status: qualifySessionCompletion(completedSets, totalSets, sessionQualityScore),
  };
}

function WorkoutHistoryDetail({ record, onClose, onSave, onDelete }: { record: WorkoutHistory; onClose: () => void; onSave: (record: WorkoutHistory) => void; onDelete: () => void }) {
  const [draft, setDraft] = useState(record);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  function updateSet(exerciseIndex: number, seriesIndex: number, values: Partial<SeriesPerformanceRecord>) {
    setDraft((current) => ({ ...current, exerciseRecords: (current.exerciseRecords || []).map((exerciseRecord, currentExerciseIndex) => currentExerciseIndex !== exerciseIndex ? exerciseRecord : { ...exerciseRecord, sets: (exerciseRecord.sets || []).map((entry, currentSeriesIndex) => currentSeriesIndex === seriesIndex ? { ...entry, ...values } : entry) }) }));
  }
  const recalculated = recalculateWorkoutRecord(draft);
  return <div className="bottom-sheet-backdrop history-detail-backdrop" role="presentation" onClick={onClose}><section className="bottom-sheet history-detail-sheet" role="dialog" aria-modal="true" aria-labelledby="history-detail-title" onClick={(event) => event.stopPropagation()}><header><div><small>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" }).format(new Date(record.completedAt))}</small><h2 id="history-detail-title">{record.workoutName}</h2></div><button aria-label="Fechar" onClick={onClose}>×</button></header><div className="history-detail-kpis"><span><strong>{recalculated.totalVolumeKg || 0} kg</strong><small>volume</small></span><span><strong>{recalculated.durationMinutes} min</strong><small>duração</small></span><span><strong>{recalculated.sessionRpe || "—"}</strong><small>RPE</small></span></div><div className="history-exercise-list">{(draft.exerciseRecords || []).map((exerciseRecord, exerciseIndex) => <article key={`${exerciseRecord.exerciseId}-${exerciseIndex}`}><header><div><strong>{exerciseById.get(exerciseRecord.exerciseId)?.name || exerciseRecord.exerciseId}</strong><small>{exerciseRecord.setsCompleted}/{exerciseRecord.setsPlanned} séries · descanso médio {exerciseRecord.restTime}s</small></div>{exerciseRecord.painReported && <span>Dor registrada</span>}</header>{exerciseRecord.sets?.length ? <div className="history-set-list">{exerciseRecord.sets.map((entry, seriesIndex) => <div key={entry.series} className={entry.completed ? "completed" : "skipped"}><b>S{entry.series}</b>{editing && entry.completed ? <><label>Carga<input type="number" inputMode="decimal" min="0" step="0.5" value={entry.loadKg || ""} onChange={(event) => updateSet(exerciseIndex, seriesIndex, { loadKg: Number(event.target.value) })} /></label><label>Rep<input type="number" inputMode="numeric" min="0" value={entry.repetitions || ""} onChange={(event) => updateSet(exerciseIndex, seriesIndex, { repetitions: Number(event.target.value) })} /></label><label>RIR<input type="number" inputMode="numeric" min="0" max="10" value={entry.rir ?? ""} onChange={(event) => updateSet(exerciseIndex, seriesIndex, { rir: event.target.value === "" ? null : Number(event.target.value) })} /></label></> : <span>{seriesPerformanceLabel(entry)}{entry.actualRestSeconds !== undefined ? ` · descanso ${entry.actualRestSeconds}s` : ""}</span>}</div>)}</div> : <p className="legacy-history-note">Registro anterior à atualização: {exerciseRecord.load || 0} kg · {exerciseRecord.repetitions || 0} repetições.</p>}</article>)}</div>{editing ? <div className="history-edit-actions"><button onClick={() => { setDraft(record); setEditing(false); }}>Cancelar</button><button onClick={() => onSave(recalculated)}>Salvar correções</button></div> : <button className="sheet-primary" onClick={() => setEditing(true)}>Corrigir cargas e repetições</button>}{!confirmDelete ? <button className="sheet-delete" onClick={() => setConfirmDelete(true)}>Excluir treino</button> : <div className="inline-delete-confirm"><p>Excluir este treino e seus indicadores?</p><button onClick={() => setConfirmDelete(false)}>Cancelar</button><button onClick={onDelete}>Excluir</button></div>}</section></div>;
}


function playTimerSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = 740;
    gain.gain.setValueAtTime(0.12, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.28);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.3);
  } catch {
    // Audio feedback is optional and never blocks the workout.
  }
}

function AdaptiveWorkoutSession({ session, profile, history, previousWorkout, preferences, onExit, onPersist, onFinish }: { session: ActiveWorkoutSession; profile: Profile; history: WorkoutHistory[]; previousWorkout?: WorkoutHistory; preferences: AppPreferences; onExit: () => void; onPersist: (session: ActiveWorkoutSession) => void; onFinish: (session: ActiveWorkoutSession, status?: "completed" | "partial" | "interrupted") => void }) {
  const normalizedSession = normalizeActiveWorkoutSession(session);
  const passiveReadiness = inferPassiveReadiness(history);
  const [state, setState] = useState(() => normalizedSession.status === "setup" ? beginActiveSession(normalizedSession, Date.now(), previousWorkout, passiveReadiness.level) : normalizedSession);
  const stateRef = useRef(state);
  const onPersistRef = useRef(onPersist);
  const [now, setNow] = useState(() => Date.now());
  const [exitPrompt, setExitPrompt] = useState(false);
  const [endWorkoutPrompt, setEndWorkoutPrompt] = useState(false);
  const [quickAction, setQuickAction] = useState<"substitute" | "pain" | null>(null);
  const [substitutionReason, setSubstitutionReason] = useState<SubstitutionReason>("equipment_unavailable");
  const [selectedAlternative, setSelectedAlternative] = useState("");
  const [painRegion, setPainRegion] = useState("");
  const [painIntensity, setPainIntensity] = useState("0");
  const [painType, setPainType] = useState<"muscular" | "joint" | "nerve" | "unknown">("unknown");
  const [painTiming, setPainTiming] = useState<"during" | "after" | "next_day">("during");
  const [exerciseListOpen, setExerciseListOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(1);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => typeof Notification === "undefined" ? "denied" : Notification.permission);
  const baseItems = [...state.workout.warmup, ...state.workout.main, ...state.workout.cooldown];
  const items = baseItems.map((item) => {
    let adjusted = item;
    const replacement = exercises.find((exercise) => exercise.id === state.exerciseOverrides[item.exercise.id]);
    adjusted = { ...adjusted, sets: state.setOverrides[item.exercise.id] ?? adjusted.sets };
    return replacement ? { ...adjusted, exercise: replacement, note: `${adjusted.note} Substituição registrada nesta sessão.` } : adjusted;
  });
  const current = items[state.currentExerciseIndex];
  const currentSlotId = baseItems[state.currentExerciseIndex]?.exercise.id || current?.exercise.id || "";
  const restRemaining = getRestRemainingSeconds(state, now);
  const elapsed = getElapsedSeconds(state, now);
  const currentSeriesEntries = current && currentSlotId ? seriesPerformances(state, currentSlotId, current.sets) : [];
  const suggestedSeries = currentSeriesEntries.find((entry) => !entry.completed)?.series || Math.max(1, current?.sets || 1);
  const activeSeriesEntry = currentSeriesEntries.find((entry) => entry.series === selectedSeries);
  const trackingMode = current ? exerciseTrackingMode(current.exercise, current.reps) : "strength";
  const unilateral = current ? isUnilateralExercise(current.exercise) : false;
  const previousExerciseRecord = current ? history.flatMap((workoutRecord) => workoutRecord.exerciseRecords || []).find((record) => record.exerciseId === current.exercise.id || record.plannedExerciseId === currentSlotId) : undefined;
  const previousCompletedSets = previousExerciseRecord?.sets?.filter((entry) => entry.completed) || [];
  const previousSet = previousCompletedSets[0];
  const completionProgress = sessionCompletionProgress(state);
  useEffect(() => {
    stateRef.current = state;
    onPersistRef.current = onPersist;
    onPersist(state);
  }, [state, onPersist]);

  useEffect(() => {
    setSelectedSeries(suggestedSeries);
  }, [currentSlotId, suggestedSeries]);

  useEffect(() => {
    if (state.status !== "active" || !currentSlotId || (state.seriesData[currentSlotId] || []).length || !previousExerciseRecord) return;
    const source = previousSet;
    setState((currentState) => patchSeriesPerformance(currentState, currentSlotId, 1, source ? {
      loadKg: source.loadKg ? String(source.loadKg).replace(".", ",") : "",
      repetitions: source.repetitions ? String(source.repetitions) : "",
      rir: source.rir === null || source.rir === undefined ? "" : String(source.rir),
      durationSeconds: source.durationSeconds ? String(source.durationSeconds) : "",
      assistanceKg: source.assistanceKg ? String(source.assistanceKg).replace(".", ",") : "",
      distanceKm: source.distanceKm ? String(source.distanceKm).replace(".", ",") : "",
      side: source.side,
      loadType: source.loadType,
    } : {
      loadKg: previousExerciseRecord.load ? String(previousExerciseRecord.load).replace(".", ",") : "",
      repetitions: previousExerciseRecord.repetitions ? String(previousExerciseRecord.repetitions) : "",
      rir: previousExerciseRecord.rirOrRpe ? String(Math.round(previousExerciseRecord.rirOrRpe * 10) / 10) : "",
    }));
  }, [currentSlotId, previousExerciseRecord, previousSet, state.seriesData, state.status]);

  useEffect(() => {
    if (state.status !== "active") return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [state.status]);

  useEffect(() => {
    if (state.status !== "active" || !preferences.keepAwake) return;
    const navigatorWithWakeLock = navigator as Navigator & { wakeLock?: { request: (type: "screen") => Promise<{ release: () => Promise<void> }> } };
    let wakeLock: { release: () => Promise<void> } | undefined;
    navigatorWithWakeLock.wakeLock?.request("screen").then((lock) => { wakeLock = lock; }).catch(() => undefined);
    return () => { void wakeLock?.release().catch(() => undefined); };
  }, [preferences.keepAwake, state.status]);

  useEffect(() => {
    if (!state.restEndsAt || restRemaining > 0) return;
    if (preferences.sound) playTimerSound();
    void hapticImpact(preferences.vibration);
    if (notificationPermission === "granted" && document.visibilityState === "hidden") {
      void navigator.serviceWorker?.ready.then((registration) => registration.showNotification("Descanso concluído", { body: "Sua próxima série está pronta.", icon: "/icon-192.png", tag: "angelsfit-rest" })).catch(() => undefined);
    }
    setState((currentState) => completeRest(currentState));
  }, [notificationPermission, preferences.sound, preferences.vibration, restRemaining, state.restEndsAt]);

  useEffect(() => {
    const originalTitle = document.title;
    if (restRemaining > 0) document.title = `${Math.floor(restRemaining / 60).toString().padStart(2, "0")}:${(restRemaining % 60).toString().padStart(2, "0")} · Descanso`;
    return () => { document.title = originalTitle; };
  }, [restRemaining]);

  useEffect(() => {
    const handleVisibility = () => { if (document.visibilityState === "hidden") onPersistRef.current(stateRef.current); };
    const handleBack = () => {
      setExitPrompt(true);
      window.history.pushState({ angelsFitSession: true }, "");
    };
    window.history.pushState({ angelsFitSession: true }, "");
    window.addEventListener("popstate", handleBack);
    document.addEventListener("visibilitychange", handleVisibility);
    let removeNativeListener: () => void = () => undefined;
    void registerNativeBackButton(() => setExitPrompt(true)).then((remove) => { removeNativeListener = remove; });
    return () => {
      window.removeEventListener("popstate", handleBack);
      document.removeEventListener("visibilitychange", handleVisibility);
      removeNativeListener();
    };
  }, []);

  function patch(patchValue: Partial<ActiveWorkoutSession>) {
    setState((currentState) => patchActiveSession(currentState, patchValue));
  }

  function updateCurrentSeries(values: Partial<SeriesPerformance>) {
    if (!currentSlotId) return;
    setState((currentState) => patchSeriesPerformance(currentState, currentSlotId, selectedSeries, values));
  }

  async function enableRestNotifications() {
    if (typeof Notification === "undefined") return;
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  }

  function adjustCurrentLoad(delta: number) {
    if (!activeSeriesEntry) return;
    const currentLoad = Number.parseFloat((activeSeriesEntry.loadKg || "0").replace(",", ".")) || 0;
    updateCurrentSeries({ loadKg: String(Math.max(0, Math.round((currentLoad + delta) * 10) / 10)).replace(".", ",") });
  }

  function finishCurrentSeries() {
    if (!current || !currentSlotId) return;
    const entry = seriesPerformances(state, currentSlotId, current.sets).find((item) => item.series === selectedSeries);
    if (!entry) return;
    const mode = exerciseTrackingMode(current.exercise, current.reps);
    const normalizedEntry = mode === "bodyweight" && entry.loadType === "carga" ? { ...entry, loadType: "peso_corporal" as const } : entry;
    setState((currentState) => {
      let next = currentState.activeRestExerciseId ? skipRest(currentState) : currentState;
      next = completeSeriesPerformance(next, currentSlotId, selectedSeries, normalizedEntry);
      next = patchActiveSession(next, {
        loads: { ...next.loads, [currentSlotId]: normalizedEntry.loadKg },
        actualReps: { ...next.actualReps, [currentSlotId]: normalizedEntry.repetitions },
        rir: { ...next.rir, [currentSlotId]: normalizedEntry.rir },
      });
      const followingSeries = selectedSeries + 1;
      if (followingSeries <= current.sets) {
        const following = seriesPerformances(next, currentSlotId, current.sets).find((item) => item.series === followingSeries);
        if (following && !following.completed && !following.loadKg && !following.repetitions && !following.durationSeconds) {
          next = patchSeriesPerformance(next, currentSlotId, followingSeries, {
            loadKg: normalizedEntry.loadKg,
            repetitions: normalizedEntry.repetitions,
            rir: normalizedEntry.rir,
            durationSeconds: normalizedEntry.durationSeconds,
            assistanceKg: normalizedEntry.assistanceKg,
            distanceKm: normalizedEntry.distanceKm,
            side: normalizedEntry.side,
            loadType: normalizedEntry.loadType,
          });
        }
      }
      if (current.rest > 0) {
        next = startRest(next, current.rest);
        next = patchActiveSession(next, { activeRestExerciseId: currentSlotId, activeRestSeries: selectedSeries });
      }
      return next;
    });
    setSelectedSeries(Math.min(current.sets, selectedSeries + 1));
    void hapticImpact(preferences.vibration);
  }

  function reopenCurrentSeries() {
    if (!currentSlotId) return;
    setState((currentState) => {
      let next = currentState.activeRestExerciseId === currentSlotId && currentState.activeRestSeries === selectedSeries ? skipRest(currentState) : currentState;
      next = reopenSeriesPerformance(next, currentSlotId, selectedSeries);
      const rests = next.completedRestSeries[currentSlotId] || [];
      return patchActiveSession(next, { completedRestSeries: { ...next.completedRestSeries, [currentSlotId]: rests.filter((item) => item !== selectedSeries) } });
    });
  }

  function changeSetCount(delta: number) {
    if (!current || !currentSlotId) return;
    const nextCount = Math.min(8, Math.max(1, current.sets + delta));
    setState((currentState) => {
      const next = patchActiveSession(currentState, {
        setOverrides: { ...currentState.setOverrides, [currentSlotId]: nextCount },
        completedSeries: { ...currentState.completedSeries, [currentSlotId]: (currentState.completedSeries[currentSlotId] || []).filter((series) => series <= nextCount) },
        completedRestSeries: { ...currentState.completedRestSeries, [currentSlotId]: (currentState.completedRestSeries[currentSlotId] || []).filter((series) => series <= nextCount) },
        seriesData: { ...currentState.seriesData, [currentSlotId]: (currentState.seriesData[currentSlotId] || []).filter((entry) => entry.series <= nextCount) },
      });
      return currentState.activeRestExerciseId === currentSlotId && Number(currentState.activeRestSeries) > nextCount ? skipRest(next) : next;
    });
    setSelectedSeries((value) => Math.min(nextCount, value));
    void hapticImpact(preferences.vibration);
  }

  function replaceCurrentExercise() {
    if (!current || !currentSlotId || !selectedAlternative) return;
    setState((currentState) => patchActiveSession(currentState, {
      exerciseOverrides: { ...currentState.exerciseOverrides, [currentSlotId]: selectedAlternative },
      substitutions: [...currentState.substitutions, {
        fromExerciseId: currentSlotId,
        toExerciseId: selectedAlternative,
        reason: substitutionReason,
        changedAt: new Date().toISOString(),
      }],
    }));
    setQuickAction(null);
    setSelectedAlternative("");
    void hapticImpact(preferences.vibration);
  }

  function registerPainEvent() {
    if (!current || !currentSlotId || !painRegion || Number(painIntensity) < 1) return;
    const performedExerciseId = current.exercise.id;
    setState((currentState) => patchActiveSession(currentState, {
      painEvents: [...currentState.painEvents, {
        exerciseId: performedExerciseId,
        plannedExerciseId: performedExerciseId === currentSlotId ? undefined : currentSlotId,
        region: painRegion,
        intensity: Number(painIntensity),
        type: painType,
        timing: painTiming,
        recurrence: currentState.painEvents.filter((event) => event.exerciseId === performedExerciseId && event.region.toLocaleLowerCase("pt-BR") === painRegion.toLocaleLowerCase("pt-BR")).length + 1,
        recordedAt: new Date().toISOString(),
      }],
    }));
    setQuickAction(null);
    setPainRegion("");
    setPainIntensity("0");
    void hapticImpact(preferences.vibration);
  }


  if (state.status === "feedback") {
    const reviewSummary = summarizeActiveSession(state);
    const reviewRows = items.map((item, index) => {
      const slotId = baseItems[index]?.exercise.id || item.exercise.id;
      const entries = seriesPerformances(state, slotId, item.sets);
      const completed = entries.filter((entry) => entry.completed);
      const mode = exerciseTrackingMode(item.exercise, item.reps);
      const incompleteData = completed.filter((entry) => !seriesHasTrackingData(mode, entry)).length;
      return { item, index, entries, completed, incompleteData };
    });
    const incompleteRows = reviewRows.filter((row) => row.completed.length < row.item.sets || row.incompleteData > 0).length;
    return (
      <main className="session-shell session-feedback">
        <header className="session-header"><button className="session-close" onClick={() => setState((currentState) => patchActiveSession(currentState, { status: "active", elapsedStartedAt: new Date().toISOString() }))}>← Voltar</button><div><small>REVISÃO FINAL</small><strong>{state.workout.name}</strong></div><span>{Math.round(elapsed / 60)} min</span></header>
        <section className="session-setup-content session-review-content">
           <p className="eyebrow">TREINO CONCLUÍDO</p><h1>{Math.round(elapsed / 60)} min</h1>
           <div className="review-kpis"><article><strong>{completionProgress.completedSeries}/{completionProgress.totalSeries}</strong><span>séries</span></article><article><strong>{reviewSummary.completedExercises}/{reviewSummary.totalExercises}</strong><span>movimentos</span></article><article><strong>{reviewSummary.totalVolumeKg.toLocaleString("pt-BR")} kg</strong><span>volume</span></article></div>
           <button className="review-series-secondary" type="button" onClick={() => setReviewOpen((value) => !value)}>{reviewOpen ? "Ocultar revisão" : `Revisar séries${incompleteRows ? ` · ${incompleteRows} pontos` : ""}`}</button>
           {reviewOpen && <div className="session-review-list">{reviewRows.map(({ item, index, entries, completed, incompleteData }) => <article key={`${item.exercise.id}-${index}`} className={completed.length >= item.sets && !incompleteData ? "complete" : "needs-review"}><header><div><strong>{item.exercise.name}</strong><small>{completed.length}/{item.sets} séries{incompleteData ? ` · ${incompleteData} sem dados` : ""}</small></div><button onClick={() => setState((currentState) => patchActiveSession(currentState, { status: "active", currentExerciseIndex: index, elapsedStartedAt: new Date().toISOString() }))}>Revisar</button></header><div>{entries.map((entry) => <span key={entry.series} className={entry.completed ? "done" : ""}><b>S{entry.series}</b>{seriesPerformanceLabel(entry)}</span>)}</div></article>)}</div>}
          <div className="review-divider"><span>Resposta ao treino · opcional</span></div>
          <div className="readiness-grid"><label>Esforço da sessão (RPE 1-10) · opcional<input type="number" inputMode="numeric" min="1" max="10" value={state.sessionRpe} onChange={(event) => patch({ sessionRpe: event.target.value })} /></label><label>Dor ao terminar (0-10) · opcional<input type="number" inputMode="numeric" min="0" max="10" value={state.painAfter} onChange={(event) => patch({ painAfter: event.target.value })} /></label></div>
          <div className="cardio-plan-comparison"><small>PLANEJADO</small><strong>{state.plannedCardioIntensity === "none" ? "Sem cardio" : `${state.plannedCardioMinutes} min · ${cardioLabel(state.plannedCardioIntensity)}`}</strong></div>
          <div className="cardio-setup-card"><span aria-hidden="true">♥</span><label>Cardio realizado (min)<input type="number" inputMode="numeric" min="1" max="120" disabled={state.cardioIntensity === "none"} value={state.cardioMinutes} onChange={(event) => patch({ cardioMinutes: event.target.value })} /></label><label>Intensidade realizada<select value={state.cardioIntensity} onChange={(event) => { const intensity = event.target.value as CardioIntensity; patch({ cardioIntensity: intensity, cardioMinutes: intensity === "none" ? "" : state.cardioMinutes }); }}><option value="none">Sem cardio hoje</option><option value="light">Leve</option><option value="moderate">Moderada</option><option value="vigorous">Intensa</option></select></label></div>
           {(profile.specialConditions || []).some((condition) => ["postpartum", "cesarean"].includes(condition)) && <><p className="field-title">Sintomas durante ou logo após</p><div className="condition-grid symptom-grid">{postpartumSymptomOptions.map((item) => <button type="button" key={item.id} aria-pressed={state.postSymptoms.includes(item.id)} className={state.postSymptoms.includes(item.id) ? "selected warning" : ""} onClick={() => patch({ postSymptoms: state.postSymptoms.includes(item.id) ? state.postSymptoms.filter((value) => value !== item.id) : [...state.postSymptoms, item.id] })}>{item.label}</button>)}</div></>}
          {state.postSymptoms.length > 0 && <article className="readiness-result readiness-atenção"><strong>Sintomas registrados</strong><p>As informações ficarão visíveis no resumo da sessão.</p></article>}
          <button className="primary-button" onClick={() => onFinish(state)}>Salvar e concluir <span>✓</span></button>
        </section>
      </main>
    );
  }

  if (!current) return <main className="session-shell"><section className="large-empty-state compact-state"><div className="dialog-icon">!</div><h2>Não foi possível abrir este exercício</h2><p>Seu progresso está salvo. Volte à tela Hoje e tente novamente.</p><button className="reset-filters" onClick={onExit}>Voltar para Hoje</button></section></main>;

  const completedRests = state.completedRestSeries[currentSlotId] || [];
  const restOriginIndex = state.activeRestExerciseId ? baseItems.findIndex((item) => item.exercise.id === state.activeRestExerciseId) : -1;
  const restOrigin = restOriginIndex >= 0 ? items[restOriginIndex] : undefined;
  const finishedRestIndex = state.lastRestExerciseId ? baseItems.findIndex((item) => item.exercise.id === state.lastRestExerciseId) : -1;
  const finishedRestOrigin = finishedRestIndex >= 0 ? items[finishedRestIndex] : undefined;
  const lastPainRegion = [...state.painEvents].reverse().find((event) => event.exerciseId === current.exercise.id || event.plannedExerciseId === currentSlotId)?.region || painRegion;
  const rankedAlternatives = rankExerciseSubstitutions({
    current: current.exercise,
    candidates: exercises,
    experience: profile.experience,
    location: profile.location,
    reason: substitutionReason,
    painRegion: substitutionReason === "pain" ? lastPainRegion : "",
    safetyAvoidCodes: detectSafetyCodes(profile),
    previouslyPainfulExerciseIds: history.slice(0, 8).flatMap((workoutRecord) => workoutRecord.exerciseRecords?.filter((record) => record.painReported).map((record) => record.exerciseId) || []),
  }).slice(0, 6);
  const alternatives = rankedAlternatives.map((item) => item.exercise);
  const alternative = alternatives[0];
  const currentPains = state.painEvents.filter((event) => event.exerciseId === current.exercise.id || event.plannedExerciseId === currentSlotId);
  return (
    <main className={`session-shell session-with-end-action workout-font-${preferences.workoutFontSize}`}>
      <header className="session-header"><button className="session-close" onClick={() => setExitPrompt(true)}>Fechar</button><div><small>{state.workout.name}</small><strong>{Math.floor(elapsed / 60).toString().padStart(2, "0")}:{(elapsed % 60).toString().padStart(2, "0")}</strong></div><span>{state.currentExerciseIndex + 1}/{items.length}</span></header>
      <div className="session-progress"><span style={{ width: `${((state.currentExerciseIndex + 1) / items.length) * 100}%` }} /></div>
      <button type="button" className="exercise-list-trigger" onClick={() => setExerciseListOpen(true)}><span><b>{state.currentExerciseIndex + 1} / {items.length}</b>{current.exercise.name}</span><em>Lista ↓</em></button>
      <section className="session-content">
        <p className="eyebrow">{state.currentExerciseIndex < state.workout.warmup.length ? "AQUECIMENTO E MOBILIDADE" : state.currentExerciseIndex >= state.workout.warmup.length + state.workout.main.length ? "ENCERRAMENTO E ALONGAMENTO" : "PARTE PRINCIPAL"}</p>
        <h1>{current.exercise.name}</h1>
        <p className="muscle-line">{current.exercise.muscleGroups.join(" · ")} · {current.exercise.equipment}</p>
        {state.exerciseOverrides[currentSlotId] && <span className="substitution-badge">Exercício substituído nesta sessão</span>}
        <div className="prescription-grid"><div className="sets-control"><small>SÉRIES</small><span><button aria-label="Remover uma série" disabled={current.sets <= 1} onClick={() => changeSetCount(-1)}>−</button><strong>{current.sets}</strong><button aria-label="Adicionar uma série" disabled={current.sets >= 8} onClick={() => changeSetCount(1)}>+</button></span></div><div><small>REPETIÇÕES</small><strong>{current.reps}</strong></div><div><small>DESCANSO</small><strong>{current.rest ? `${current.rest}s` : "—"}</strong></div><div><small>ESFORÇO</small><strong>{current.targetRpe}</strong></div></div>
        {state.currentExerciseIndex >= state.workout.warmup.length && state.currentExerciseIndex < state.workout.warmup.length + state.workout.main.length && <article className="exercise-progression"><small>PRÓXIMA META INDIVIDUAL</small><strong>{current.loadSuggestion}</strong></article>}
        {current.rest > 0 && current.sets > 1 && <div className="rest-progress" aria-label={`${completedRests.length} de ${current.sets - 1} descansos entre séries concluídos`}><small>DESCANSOS ENTRE SÉRIES</small><div>{Array.from({ length: current.sets - 1 }, (_, index) => index + 1).map((series) => <span key={series} className={`${completedRests.includes(series) ? "done" : ""} ${state.activeRestExerciseId === currentSlotId && state.activeRestSeries === series && restRemaining > 0 ? "active" : ""}`} title={`Descanso após a série ${series}`}><b aria-hidden="true">◷</b><em>{series}</em></span>)}</div></div>}
        {previousExerciseRecord && <article className="last-performance-card"><small>ÚLTIMA VEZ</small><strong>{previousCompletedSets.length ? previousCompletedSets.map((entry) => `S${entry.series} ${seriesPerformanceLabel(entry)}`).join(" · ") : `${previousExerciseRecord.load || 0} kg · ${previousExerciseRecord.repetitions || 0} rep`}</strong><span>Os valores da primeira série foram recuperados para você ajustar.</span></article>}
        <div className="series-tracker" aria-label="Acompanhamento por série">
          <div className="series-tabs">{currentSeriesEntries.map((entry) => <button type="button" key={entry.series} aria-pressed={selectedSeries === entry.series} className={`${selectedSeries === entry.series ? "active" : ""} ${entry.completed ? "done" : ""}`} onClick={() => setSelectedSeries(entry.series)}><b>{entry.completed ? "✓" : entry.series}</b><span>{seriesPerformanceLabel(entry)}</span></button>)}</div>
          {activeSeriesEntry && <article className={`series-editor ${activeSeriesEntry.completed ? "completed" : ""}`}>
            <header><div><small>SÉRIE {selectedSeries} DE {current.sets}</small><strong>{activeSeriesEntry.completed ? "Série concluída" : "Registre esta série"}</strong></div>{activeSeriesEntry.completed && <button type="button" onClick={reopenCurrentSeries}>Reabrir</button>}</header>
            {(trackingMode === "strength" || trackingMode === "bodyweight") && <>
              {trackingMode === "bodyweight" && <label className="series-field full-field">Tipo de carga<select value={activeSeriesEntry.loadType === "carga" ? "peso_corporal" : activeSeriesEntry.loadType} onChange={(event) => updateCurrentSeries({ loadType: event.target.value as SeriesPerformance["loadType"] })}><option value="peso_corporal">Peso corporal</option><option value="lastro">Com lastro</option><option value="assistencia">Com assistência</option></select></label>}
              {trackingMode === "strength" && <div className="load-stepper"><span>Ajuste rápido</span><div><button type="button" onClick={() => adjustCurrentLoad(-5)}>−5</button><button type="button" onClick={() => adjustCurrentLoad(-2.5)}>−2,5</button><button type="button" onClick={() => adjustCurrentLoad(2.5)}>+2,5</button><button type="button" onClick={() => adjustCurrentLoad(5)}>+5</button></div></div>}
              <div className="series-fields-grid">
                {(trackingMode === "strength" || activeSeriesEntry.loadType === "lastro") && <label className="series-field">{activeSeriesEntry.loadType === "lastro" ? "Lastro" : "Carga"}<span><input aria-label={`${activeSeriesEntry.loadType === "lastro" ? "Lastro" : "Carga"} da série ${selectedSeries} em quilogramas`} type="number" inputMode="decimal" min="0" step="0.5" value={activeSeriesEntry.loadKg} onChange={(event) => updateCurrentSeries({ loadKg: event.target.value })} placeholder="20" /><b>kg</b></span></label>}
                {trackingMode === "bodyweight" && activeSeriesEntry.loadType === "assistencia" && <label className="series-field">Assistência<span><input aria-label={`Assistência da série ${selectedSeries} em quilogramas`} type="number" inputMode="decimal" min="0" step="0.5" value={activeSeriesEntry.assistanceKg} onChange={(event) => updateCurrentSeries({ assistanceKg: event.target.value })} placeholder="20" /><b>kg</b></span></label>}
                <label className="series-field">Repetições<input aria-label={`Repetições da série ${selectedSeries}`} type="number" inputMode="numeric" min="1" max="999" value={activeSeriesEntry.repetitions} onChange={(event) => updateCurrentSeries({ repetitions: event.target.value })} placeholder={current.reps} /></label>
                <label className="series-field">RIR<input aria-label={`RIR da série ${selectedSeries}`} type="number" inputMode="numeric" min="0" max="10" value={activeSeriesEntry.rir} onChange={(event) => updateCurrentSeries({ rir: event.target.value })} placeholder="3" /></label>
              </div>
            </>}
            {(trackingMode === "timed" || trackingMode === "cardio") && <div className="series-fields-grid"><label className="series-field">Duração<span><input aria-label={`Duração da série ${selectedSeries} em segundos`} type="number" inputMode="numeric" min="1" max="7200" value={activeSeriesEntry.durationSeconds} onChange={(event) => updateCurrentSeries({ durationSeconds: event.target.value })} placeholder="30" /><b>s</b></span></label>{trackingMode === "cardio" && <label className="series-field">Distância<span><input aria-label={`Distância da série ${selectedSeries} em quilômetros`} type="number" inputMode="decimal" min="0" step="0.1" value={activeSeriesEntry.distanceKm} onChange={(event) => updateCurrentSeries({ distanceKm: event.target.value })} placeholder="1,0" /><b>km</b></span></label>}</div>}
            {unilateral && <label className="series-field full-field">Lado<select value={activeSeriesEntry.side} onChange={(event) => updateCurrentSeries({ side: event.target.value as SeriesPerformance["side"] })}><option value="ambos">Ambos os lados</option><option value="direito">Lado direito</option><option value="esquerdo">Lado esquerdo</option></select></label>}
            {!activeSeriesEntry.completed && <button type="button" className="complete-series-button" onClick={() => finishCurrentSeries()}>Concluir série {selectedSeries} de {current.sets} <span>✓</span></button>}
          </article>}
          {currentSeriesEntries.length > 0 && currentSeriesEntries.every((entry) => entry.completed) && <div className="exercise-complete-banner">Exercício concluído ✓</div>}
        </div>
        <ExerciseDemo key={current.exercise.id} exerciseId={current.exercise.id} exerciseName={current.exercise.name} compact />
         <details className="technique-card"><summary>Como executar</summary><p>{current.exercise.instructions}</p><small>Cadência: {current.tempo}</small><p><strong>Orientação:</strong> {current.note}</p></details>
        <details className="technique-card"><summary>Erros e alternativa</summary><p>{current.exercise.commonErrors}</p>{alternative && <small>Alternativa sugerida: {alternative.name}</small>}</details>
        <div className="session-quick-actions"><button onClick={() => { setSelectedAlternative(alternatives[0]?.id || ""); setQuickAction("substitute"); }}>↻ Substituir exercício</button><button onClick={() => setQuickAction("pain")}>! Registrar desconforto</button></div>
        {currentPains.length > 0 && <div className="pain-event-list">{currentPains.map((event) => <span key={event.recordedAt}>{event.region} · {event.intensity}/10</span>)}</div>}
      </section>
       {(restRemaining > 0 || state.restPausedSeconds !== null) && <aside className="session-rest-dock" aria-live="polite"><div><small>DESCANSO</small><strong>{Math.floor(restRemaining / 60).toString().padStart(2, "0")}:{(restRemaining % 60).toString().padStart(2, "0")}</strong><span>{restOrigin?.exercise.name || "Exercício"} · após série {state.activeRestSeries}</span></div><div className="rest-dock-actions"><button type="button" disabled={restRemaining <= 15} onClick={() => setState((currentState) => addRestSeconds(currentState, -15))}>−15</button><button type="button" onClick={() => setState((currentState) => addRestSeconds(currentState, 15))}>+15</button>{state.restPausedSeconds === null ? <button type="button" onClick={() => setState((currentState) => pauseRest(currentState))}>Pausar</button> : <button type="button" onClick={() => setState((currentState) => resumeRest(currentState))}>Retomar</button>}<button type="button" onClick={() => setState((currentState) => skipRest(currentState))}>Pular</button><button type="button" disabled={state.currentExerciseIndex === 0} onClick={() => patch({ currentExerciseIndex: Math.max(0, state.currentExerciseIndex - 1) })}>←</button><button type="button" disabled={state.currentExerciseIndex >= items.length - 1} onClick={() => patch({ currentExerciseIndex: Math.min(items.length - 1, state.currentExerciseIndex + 1) })}>→</button></div>{notificationPermission === "default" && <button type="button" className="rest-notification-enable" onClick={() => { void enableRestNotifications(); }}>Ativar aviso quando o descanso terminar</button>}</aside>}
      {!state.activeRestExerciseId && state.lastRestExerciseId && state.lastRestSeries && <aside className="session-rest-dock rest-finished" aria-live="assertive"><div><small>DESCANSO CONCLUÍDO</small><strong>Pronta para a série {state.lastRestSeries + 1}</strong><span>{finishedRestOrigin?.exercise.name || "Exercício"}</span></div><div className="rest-finished-actions"><button type="button" onClick={() => setState((currentState) => clearRestNotice(currentState))}>Dispensar</button><button type="button" onClick={() => { if (finishedRestIndex >= 0) patch({ currentExerciseIndex: finishedRestIndex, lastRestExerciseId: null, lastRestSeries: null }); }}>Ir para a série</button></div></aside>}
       {!state.activeRestExerciseId && <footer className="session-nav session-nav-with-end"><button type="button" className="end-session-button" onClick={() => setEndWorkoutPrompt(true)}>Encerrar treino <span>{completionProgress.percentage}% feito</span></button><button disabled={state.currentExerciseIndex === 0} onClick={() => patch({ currentExerciseIndex: Math.max(0, state.currentExerciseIndex - 1) })}>← Voltar</button>{state.currentExerciseIndex < items.length - 1 ? <button className="next" onClick={() => patch({ currentExerciseIndex: Math.min(items.length - 1, state.currentExerciseIndex + 1) })}>Próximo →</button> : <div className="finish-session-actions"><button type="button" onClick={() => setState((currentState) => enterFeedback(currentState))}>Feedback · opcional</button><button className="next" onClick={() => onFinish(state)}>Concluir treino ✓</button></div>}</footer>}
       {quickAction === "substitute" && <div className="bottom-sheet-backdrop" role="presentation" onClick={() => setQuickAction(null)}><section className="bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="substitution-title" onClick={(event) => event.stopPropagation()}><header><div><small>AJUSTE INTELIGENTE</small><h2 id="substitution-title">Substituir exercício</h2></div><button aria-label="Fechar" onClick={() => setQuickAction(null)}>×</button></header><p>As opções preservam movimento, músculos, nível, segurança, estímulo e custo de fadiga.</p><label>Motivo<select value={substitutionReason} onChange={(event) => { setSubstitutionReason(event.target.value as SubstitutionReason); setSelectedAlternative(""); }}><option value="equipment_unavailable">Equipamento indisponível</option><option value="pain">Desconforto ou dor</option><option value="technical_difficulty">Dificuldade técnica</option><option value="preference">Preferência pessoal</option><option value="time">Tempo</option><option value="fatigue">Fadiga</option><option value="other">Outro</option></select></label><div className="sheet-options">{rankedAlternatives.length ? rankedAlternatives.map(({ exercise, explanation }) => <button key={exercise.id} aria-pressed={selectedAlternative === exercise.id} onClick={() => setSelectedAlternative(exercise.id)}><strong>{exercise.name}</strong><small>{explanation}</small><small>{exercise.equipment}</small></button>) : <article className="data-empty"><strong>Nenhuma troca segura encontrada</strong><p>Interrompa este movimento e siga apenas quando houver uma opção compatível.</p></article>}</div><button className="sheet-primary" disabled={!selectedAlternative} onClick={replaceCurrentExercise}>Aplicar substituição</button></section></div>}
       {quickAction === "pain" && <div className="bottom-sheet-backdrop" role="presentation" onClick={() => setQuickAction(null)}><section className="bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="pain-title" onClick={(event) => event.stopPropagation()}><header><div><small>SEGURANÇA</small><h2 id="pain-title">Registrar desconforto</h2></div><button aria-label="Fechar" onClick={() => setQuickAction(null)}>×</button></header><p>O registro fica associado a {current.exercise.name}; uma ocorrência leve isolada não bane o movimento.</p><label>Região do corpo<input value={painRegion} onChange={(event) => setPainRegion(event.target.value)} placeholder="Ex.: joelho direito" /></label><label>Tipo<select value={painType} onChange={(event) => setPainType(event.target.value as typeof painType)}><option value="unknown">Não sei informar</option><option value="muscular">Muscular</option><option value="joint">Articular</option><option value="nerve">Choque, formigamento ou irradiação</option></select></label><label>Quando aconteceu<select value={painTiming} onChange={(event) => setPainTiming(event.target.value as typeof painTiming)}><option value="during">Durante</option><option value="after">Logo após</option><option value="next_day">No dia seguinte</option></select></label><label>Intensidade: <strong>{painIntensity}/10</strong><input type="range" min="0" max="10" value={painIntensity} onChange={(event) => setPainIntensity(event.target.value)} /></label><div className="safety-note"><span>!</span><p>Interrompa o exercício em caso de dor aguda, tontura, falta de ar incomum ou piora relevante.</p></div><button className="sheet-primary danger" disabled={!painRegion.trim() || Number(painIntensity) < 1} onClick={registerPainEvent}>Salvar registro</button></section></div>}
       {exerciseListOpen && <div className="bottom-sheet-backdrop" role="presentation" onClick={() => setExerciseListOpen(false)}><section className="bottom-sheet exercise-list-sheet" role="dialog" aria-modal="true" aria-labelledby="exercise-list-title" onClick={(event) => event.stopPropagation()}><header><div><small>SESSÃO</small><h2 id="exercise-list-title">Exercícios</h2></div><button aria-label="Fechar" onClick={() => setExerciseListOpen(false)}>×</button></header><div className="exercise-session-list">{items.map((item, index) => { const slotId = baseItems[index]?.exercise.id || item.exercise.id; const done = seriesPerformances(state, slotId, state.setOverrides[slotId] ?? item.sets).every((entry) => entry.completed); return <button key={`${slotId}-${index}`} className={index === state.currentExerciseIndex ? "current" : ""} onClick={() => { patch({ currentExerciseIndex: index }); setExerciseListOpen(false); }}><span>{done ? "✓" : index === state.currentExerciseIndex ? "→" : "○"}</span><strong>{item.exercise.name}</strong><small>{item.priority || "B"}</small></button>; })}</div></section></div>}
      {exitPrompt && <ConfirmDialog title="Sair do treino?" description="Exercício, séries, carga, repetições e timer já estão salvos." confirmLabel="Salvar e sair" onConfirm={onExit} onCancel={() => setExitPrompt(false)} />}
      {endWorkoutPrompt && <ConfirmDialog title="Encerrar treino agora?" description={completionProgress.moreThanHalf ? `Você concluiu ${completionProgress.percentage}% do treino. A sessão e a presença serão registradas automaticamente.` : completionProgress.completedSeries > 0 ? `Você concluiu ${completionProgress.percentage}% do treino. A sessão parcial contará como presença.` : "Como nenhuma série foi concluída, a sessão será descartada sem registrar presença."} confirmLabel={completionProgress.completedSeries > 0 ? "Encerrar e registrar" : "Descartar sessão"} onConfirm={() => onFinish(state, completionProgress.moreThanHalf ? "completed" : completionProgress.completedSeries > 0 ? "partial" : "interrupted")} onCancel={() => setEndWorkoutPrompt(false)} />}
    </main>
  );
}


function PrescriptionProfileFields({ draft, setDraft, toggleListField }: { draft: Profile; setDraft: (profile: Profile) => void; toggleListField: (field: "secondaryGoals" | "availableEquipment" | "postpartumSymptoms", value: string) => void }) {
  const postpartum = (draft.specialConditions || []).some((item) => ["postpartum", "cesarean"].includes(item));
  return <div className="prescription-profile-fields"><p className="field-title">Objetivos secundários <small>Até dois.</small></p><div className="choice-grid">{goals.filter((goal) => goal !== draft.goal).map((goal) => <button type="button" key={goal} disabled={!(draft.secondaryGoals || []).includes(goal) && (draft.secondaryGoals || []).length >= 2} aria-pressed={(draft.secondaryGoals || []).includes(goal)} className={(draft.secondaryGoals || []).includes(goal) ? "selected" : ""} onClick={() => toggleListField("secondaryGoals", goal)}>{goal}</button>)}</div><p className="field-title">Equipamentos disponíveis</p><div className="condition-grid">{equipmentOptions.map((item) => <button type="button" key={item} aria-pressed={(draft.availableEquipment || []).includes(item)} className={(draft.availableEquipment || []).includes(item) ? "selected" : ""} onClick={() => toggleListField("availableEquipment", item)}>{item}</button>)}</div><div className="metric-form-grid"><label className="field-label">Meses de treino consistente<input type="number" min="0" max="600" value={draft.monthsConsistent ?? ""} onChange={(event) => setDraft({ ...draft, monthsConsistent: event.target.value ? Number(event.target.value) : 0 })} /></label><label className="field-label">Meses sem treinar<input type="number" min="0" max="600" value={draft.monthsSinceTraining ?? ""} onChange={(event) => setDraft({ ...draft, monthsSinceTraining: event.target.value ? Number(event.target.value) : 0 })} /></label><label className="field-label">Sono médio<input type="number" min="0" max="12" step="0.5" value={draft.averageSleepHours || ""} onChange={(event) => setDraft({ ...draft, averageSleepHours: event.target.value ? Number(event.target.value) : undefined })} /></label><label className="field-label">Estresse<select value={draft.stressLevel || ""} onChange={(event) => setDraft({ ...draft, stressLevel: event.target.value })}><option value="">Selecione</option><option>Baixo</option><option>Moderado</option><option>Alto</option></select></label><label className="field-label">Recuperação percebida<select value={draft.recoveryFeeling || ""} onChange={(event) => setDraft({ ...draft, recoveryFeeling: event.target.value })}><option value="">Selecione</option><option>Boa</option><option>Regular</option><option>Ruim</option></select></label></div><label className="field-label">Exercícios preferidos<input value={draft.preferredExercises || ""} onChange={(event) => setDraft({ ...draft, preferredExercises: event.target.value })} placeholder="Separe por vírgulas" /></label><label className="field-label">Exercícios rejeitados<input value={draft.rejectedExercises || ""} onChange={(event) => setDraft({ ...draft, rejectedExercises: event.target.value })} placeholder="Não entrarão na seleção" /></label>{postpartum && <section className="postpartum-profile-card"><p className="field-title">Recuperação pós-parto</p><div className="metric-form-grid"><label className="field-label">Data do parto<input type="date" value={draft.deliveryDate || ""} onChange={(event) => setDraft({ ...draft, deliveryDate: event.target.value })} /></label><label className="field-label">Tipo de parto<select value={draft.deliveryType || ""} onChange={(event) => setDraft({ ...draft, deliveryType: event.target.value })}><option value="">Selecione</option><option>Cesárea</option><option>Vaginal</option></select></label></div><label className="clearance-check"><input type="checkbox" checked={draft.incisionHealed || false} onChange={(event) => setDraft({ ...draft, incisionHealed: event.target.checked })} /><span><strong>Cicatriz fechada e sem sinais de infecção</strong><small>Sem calor, vermelhidão progressiva, secreção ou febre.</small></span></label><p className="field-title">Sintomas atuais</p><div className="condition-grid symptom-grid">{postpartumSymptomOptions.map((item) => <button type="button" key={item.id} aria-pressed={(draft.postpartumSymptoms || []).includes(item.id)} className={(draft.postpartumSymptoms || []).includes(item.id) ? "selected warning" : ""} onClick={() => toggleListField("postpartumSymptoms", item.id)}>{item.label}</button>)}</div></section>}</div>;
}

type ProfileViewProps = { profile: Profile; draft: Profile; setDraft: (profile: Profile) => void; editing: boolean; setEditing: (value: boolean) => void; cancelEditing: () => void; saveProfile: (event?: FormEvent) => void; handlePhoto: (event: ChangeEvent<HTMLInputElement>) => void; toggleDay: (day: string) => void; toggleSpecialCondition: (condition: string) => void; toggleListField: (field: "secondaryGoals" | "availableEquipment" | "postpartumSymptoms", value: string) => void; theme: "dark" | "light"; changeTheme: () => void; exportBackup: () => void; preferences: AppPreferences; changePreference: <K extends keyof AppPreferences>(name: K, value: AppPreferences[K]) => void; toggleRestNotifications: () => void; installed: boolean; iosDevice: boolean; installedAppVersion: string; updateStatus: UpdateStatus; lastUpdateCheck: string | null; updateApplication: () => void };

function InstallationSetting({ installed, iosDevice, canInstall, onInstall }: { installed: boolean; iosDevice: boolean; canInstall: boolean; onInstall: () => void }) {
  if (isNativeApp()) return null;
  const android = typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
  return <section className="installation-setting"><p>INSTALAÇÃO</p><h2>Usar AngelsFit como aplicativo</h2>{installed ? <div className="installation-ready"><span>✓</span><div><strong>Já instalado neste aparelho</strong><small>Abra pelo ícone da tela inicial.</small></div></div> : android ? <><p>No Android, instale pelo Chrome para abrir em tela cheia e manter o acesso rápido.</p>{canInstall ? <button className="primary-button" onClick={onInstall}>Instalar no Android <span>↓</span></button> : <small>Abra o menu ⋮ do Chrome e escolha “Instalar app” ou “Adicionar à tela inicial”.</small>}</> : iosDevice ? <><p>No iPhone, abra no Safari, toque em Compartilhar e escolha “Adicionar à Tela de Início”.</p><a href="/AngelsFit.mobileconfig">Ver instruções para iPhone</a></> : <p>Abra o menu do navegador e escolha a opção para instalar ou adicionar à tela inicial.</p>}<small>Não distribuímos APK de depuração. A instalação usa a versão web oficial e atualizada.</small></section>;
}

function WorkoutFontSizeSetting({ value, onChange }: { value: AppPreferences["workoutFontSize"]; onChange: (value: AppPreferences["workoutFontSize"]) => void }) {
  const options: Array<{ value: AppPreferences["workoutFontSize"]; label: string; sample: string }> = [
    { value: "compact", label: "Pequeno", sample: "A" },
    { value: "comfortable", label: "Padrão", sample: "A" },
    { value: "large", label: "Grande", sample: "A" },
  ];
  return (
    <section className="font-size-setting" aria-labelledby="workout-font-size-title">
      <div className="font-size-setting-header">
        <span className="font-size-setting-icon" aria-hidden="true">Aa</span>
        <div>
          <strong id="workout-font-size-title">Tamanho da fonte</strong>
          <small>Amplia os textos em todo o aplicativo</small>
        </div>
      </div>
      <div className="font-size-options" role="group" aria-label="Tamanho da fonte do aplicativo">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button key={option.value} type="button" aria-pressed={selected} className={selected ? "selected" : ""} onClick={() => onChange(option.value)}>
              <span className={`font-size-option-sample sample-${option.value}`} aria-hidden="true">{option.sample}</span>
              <span>{option.label}</span>
              <i aria-hidden="true">{selected ? "✓" : ""}</i>
            </button>
          );
        })}
      </div>
      <div className={`font-size-preview preview-${value}`} aria-live="polite">
        <span>PRÉVIA DO APLICATIVO</span>
        <strong>Texto mais fácil de enxergar</strong>
        <small>A escolha também vale para os treinos</small>
      </div>
    </section>
  );
}

function ProfileView(props: ProfileViewProps) {
  const { profile, editing, setEditing, theme, changeTheme, exportBackup, preferences, changePreference, installedAppVersion, updateStatus, lastUpdateCheck, updateApplication } = props;
  if (editing) return <ProfileViewBase {...props} />;
  const updateMessage = updateStatus === "checking" ? "Verificando versões e protegendo seus dados…" : updateStatus === "current" ? "Você está usando a versão mais recente." : updateStatus === "available" ? "Nova versão de conteúdo encontrada." : updateStatus === "offline" ? "Sem conexão. Seu treino salvo continua disponível." : updateStatus === "native-required" ? "O contêiner instalado precisa de uma atualização nativa." : updateStatus === "error" ? "A atualização falhou. Seus dados foram preservados." : "Verifique conteúdo e aplicativo sem apagar seus dados.";
  const profileSummary = [profile.goal || "Objetivo ainda não definido", profile.experience || "Nível sendo aprendido"].join(" · ");
  const routineSummary = [profile.activityLevel, profile.weeklyActivityMinutes ? `${profile.weeklyActivityMinutes} min ativos/semana` : ""].filter(Boolean).join(" · ") || "Rotina sendo aprendida";
  const sessionSummary = [profile.duration || "Duração sendo aprendida", profile.location || "Local não definido"].join(" · ");
  return <section className="screen"><div className="profile-hero"><Avatar profile={profile} size="large" /><h1>{profile.name || "Seu perfil"}</h1><p>{profileSummary}</p><button onClick={() => setEditing(true)}>Editar perfil</button></div><div className="profile-facts"><div><small>Dados corporais</small><strong>{profile.heightCm && profile.weightKg ? `${profile.heightCm} cm · ${formatMetric(profile.weightKg)} kg${profile.waistCm ? ` · cintura ${formatMetric(profile.waistCm)} cm` : ""}` : "Adicione medidas se quiser acompanhar peso, IMC e cintura"}</strong></div><div><small>Rotina</small><strong>{routineSummary}</strong></div><div><small>Disponibilidade</small><strong>{profile.days.length ? profile.days.join(" · ") : "Rotina sendo aprendida"}</strong></div><div><small>Sessão ideal</small><strong>{sessionSummary}</strong></div><div><small>Cuidados</small><strong>{(profile.specialConditions || []).length ? specialConditionOptions.filter((item) => profile.specialConditions?.includes(item.id)).map((item) => item.label).join(" · ") : "Nenhum cuidado especial marcado"}</strong></div><div><small>Observações</small><strong>{profile.limitations || "Nenhuma limitação informada"}</strong></div></div><div className="section-heading"><div><p>AJUSTES</p><h2>Experiência do treino</h2></div></div><div className="settings-list"><button onClick={changeTheme}><span>{theme === "dark" ? "☾" : "☀"}</span><div><strong>Aparência</strong><small>{theme === "dark" ? "Tema escuro" : "Tema claro"}</small></div><b>Alterar</b></button><button onClick={() => changePreference("vibration", !preferences.vibration)}><span>≋</span><div><strong>Vibração</strong><small>Feedback ao concluir séries e descanso</small></div><b>{preferences.vibration ? "Ativa" : "Inativa"}</b></button><button onClick={() => changePreference("sound", !preferences.sound)}><span>♪</span><div><strong>Som do timer</strong><small>Aviso opcional ao terminar o descanso</small></div><b>{preferences.sound ? "Ativo" : "Inativo"}</b></button><button onClick={() => changePreference("keepAwake", !preferences.keepAwake)}><span>◉</span><div><strong>Manter tela ligada</strong><small>Durante uma sessão em andamento</small></div><b>{preferences.keepAwake ? "Ativo" : "Inativo"}</b></button><WorkoutFontSizeSetting value={preferences.workoutFontSize} onChange={(value) => changePreference("workoutFontSize", value)} /><button onClick={exportBackup}><span>↓</span><div><strong>Exportar backup</strong><small>Perfil, programa, medições, presenças e histórico</small></div><b>Exportar</b></button></div><section className={`update-card update-${updateStatus}`}><div><p>SOBRE E ATUALIZAÇÃO</p><h2>AngelsFit</h2><span>{updateMessage}</span></div><dl><div><dt>Aplicativo instalado</dt><dd>{installedAppVersion}{isNativeApp() ? " · nativo" : " · web"}</dd></div><div><dt>Conteúdo</dt><dd>{CONTENT_VERSION}</dd></div><div><dt>Schema local</dt><dd>{CURRENT_DATA_SCHEMA_VERSION}</dd></div><div><dt>Compatibilidade mínima</dt><dd>{MINIMUM_SUPPORTED_APP_VERSION}</dd></div><div><dt>Última verificação</dt><dd>{lastUpdateCheck ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(lastUpdateCheck)) : "Ainda não verificado"}</dd></div></dl><button className="primary-button" disabled={updateStatus === "checking"} onClick={updateApplication}>{updateStatus === "checking" ? "Verificando…" : "Atualizar aplicativo"} <span>↻</span></button>{updateStatus === "native-required" && <button className="native-update-link" onClick={() => { void openExternal("https://github.com/MarioSerafimCoder/AngelsFit/releases"); }}>Abrir atualização nativa</button>}</section><p className="app-version">ANGELSFIT · CONTEÚDO {CONTENT_VERSION}</p></section>;
}

function ProfileViewBase({ draft, setDraft, editing, cancelEditing, saveProfile, handlePhoto, toggleDay, toggleSpecialCondition, toggleListField, exportBackup }: ProfileViewProps) {
  if (editing) return <section className="screen profile-edit-screen"><div className="edit-header"><button onClick={cancelEditing}>Cancelar</button><h1>Editar perfil</h1><button className="save-link" onClick={() => saveProfile()}>Salvar</button></div><label className="photo-picker compact-photo"><input type="file" accept="image/*" onChange={handlePhoto} /><Avatar profile={draft} size="large" /><span>Alterar foto</span></label><label className="field-label">Nome<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label><div className="edit-section-title"><span>01</span><div><strong>Dados de desempenho</strong><small>Peso, cintura e frequência de repouso criam novos registros de evolução.</small></div></div><div className="metric-form-grid"><label className="field-label">Data de nascimento<input type="date" value={draft.birthDate || ""} onChange={(event) => setDraft({ ...draft, birthDate: event.target.value })} /></label><label className="field-label">Sexo biológico<select value={draft.biologicalSex || ""} onChange={(event) => setDraft({ ...draft, biologicalSex: event.target.value })}><option value="">Não informar</option><option>Feminino</option><option>Masculino</option></select></label><label className="field-label">Altura (cm)<input inputMode="decimal" type="number" min="100" max="250" value={draft.heightCm || ""} onChange={(event) => setDraft({ ...draft, heightCm: event.target.value ? Number(event.target.value) : undefined })} /></label><label className="field-label">Peso (kg)<input inputMode="decimal" type="number" min="25" max="400" step="0.1" value={draft.weightKg || ""} onChange={(event) => setDraft({ ...draft, weightKg: event.target.value ? Number(event.target.value) : undefined })} /></label><label className="field-label">Cintura (cm)<input inputMode="decimal" type="number" min="40" max="250" step="0.1" value={draft.waistCm || ""} onChange={(event) => setDraft({ ...draft, waistCm: event.target.value ? Number(event.target.value) : undefined })} /></label><label className="field-label">FC de repouso<input inputMode="numeric" type="number" min="30" max="220" value={draft.restingHeartRate || ""} onChange={(event) => setDraft({ ...draft, restingHeartRate: event.target.value ? Number(event.target.value) : undefined })} /></label></div><p className="field-title">Rotina diária</p><div className="choice-grid two-columns">{activityLevels.map((item) => <button type="button" key={item} aria-pressed={draft.activityLevel === item} className={draft.activityLevel === item ? "selected" : ""} onClick={() => setDraft({ ...draft, activityLevel: item })}>{item}</button>)}</div><div className="metric-form-grid"><label className="field-label">Treinos atuais/semana<input inputMode="numeric" type="number" min="0" max="14" value={draft.currentWeeklySessions ?? ""} onChange={(event) => setDraft({ ...draft, currentWeeklySessions: event.target.value ? Number(event.target.value) : undefined })} /></label><label className="field-label">Minutos ativos/semana<input inputMode="numeric" type="number" min="0" max="2000" value={draft.weeklyActivityMinutes ?? ""} onChange={(event) => setDraft({ ...draft, weeklyActivityMinutes: event.target.value ? Number(event.target.value) : undefined })} /></label></div><div className="edit-section-title"><span>02</span><div><strong>Treino e preferências</strong><small>Estas escolhas ajustam o programa gerado.</small></div></div><p className="field-title">Objetivo</p><div className="choice-grid">{goals.map((goal) => <button type="button" key={goal} aria-pressed={draft.goal === goal} className={draft.goal === goal ? "selected" : ""} onClick={() => setDraft({ ...draft, goal })}>{goal}</button>)}</div><p className="field-title">Nível de experiência</p><div className="choice-row">{experiences.map((item) => <button type="button" key={item} aria-pressed={draft.experience === item} className={draft.experience === item ? "selected" : ""} onClick={() => setDraft({ ...draft, experience: item })}>{item}</button>)}</div><p className="field-title">Dias disponíveis</p><div className="days-picker">{weekDays.map((day) => <button type="button" key={day} aria-pressed={draft.days.includes(day)} className={draft.days.includes(day) ? "selected" : ""} onClick={() => toggleDay(day)}>{day}</button>)}</div><p className="field-title">Duração ideal</p><div className="choice-grid two-columns">{durations.map((item) => <button type="button" key={item} aria-pressed={draft.duration === item} className={draft.duration === item ? "selected" : ""} onClick={() => setDraft({ ...draft, duration: item })}>{item}</button>)}</div><p className="field-title">Onde você vai treinar?</p><div className="choice-row">{["Academia", "Em casa", "Ambos"].map((item) => <button type="button" key={item} aria-pressed={draft.location === item} className={draft.location === item ? "selected" : ""} onClick={() => setDraft({ ...draft, location: item })}>{item}</button>)}</div><div className="edit-section-title"><span>03</span><div><strong>Cuidados e segurança</strong><small>Ajude o programa a respeitar seus limites.</small></div></div><div className="condition-grid">{specialConditionOptions.map((item) => <button type="button" key={item.id} aria-pressed={(draft.specialConditions || []).includes(item.id)} className={(draft.specialConditions || []).includes(item.id) ? "selected" : ""} onClick={() => toggleSpecialCondition(item.id)}>{item.label}</button>)}</div><PrescriptionProfileFields draft={draft} setDraft={setDraft} toggleListField={toggleListField} /><label className="field-label">Limitações<textarea rows={4} value={draft.limitations} onChange={(event) => setDraft({ ...draft, limitations: event.target.value })} placeholder="Nenhuma informada" /></label>{(draft.specialConditions || []).some((item) => ["postpartum", "cesarean", "pregnancy", "cardiovascular"].includes(item)) && <label className="clearance-check"><input type="checkbox" checked={draft.medicalClearance || false} onChange={(event) => setDraft({ ...draft, medicalClearance: event.target.checked })} /><span><strong>Tenho liberação profissional para treinar</strong><small>Marque apenas se essa orientação já foi recebida.</small></span></label>}<section className="profile-backup-card"><span aria-hidden="true">↓</span><div><strong>Backup dos seus dados</strong><small>Salve perfil, medições, preferências e histórico antes de trocar de aparelho.</small></div><button type="button" onClick={exportBackup}>Exportar</button></section><button className="primary-button profile-save-cta" onClick={() => saveProfile()}>Salvar alterações <span>✓</span></button></section>;

  return null;
}
