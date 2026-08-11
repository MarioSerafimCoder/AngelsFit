import {
  isValidActiveSession,
  isValidCheckIns,
  isValidHistory,
  isValidMeasurements,
  isValidProfile,
} from "./data-repository.ts";

export const BACKUP_FORMAT_VERSION = 9;
export const MAX_BACKUP_FILE_SIZE = 10 * 1024 * 1024;

const COMPATIBLE_APP_NAMES = new Set(["AngelsFit", "Angels Fit", "BrasaFit", "FitLocal"]);
const WORKOUT_FONT_SIZES = new Set(["compact", "comfortable", "large"]);

export type BackupPreferences = {
  sound: boolean;
  vibration: boolean;
  keepAwake: boolean;
  restNotifications: boolean;
  workoutFontSize: "compact" | "comfortable" | "large";
};

export type ParsedBackup = {
  app: string;
  version: number;
  exportedAt: string;
  profile: unknown;
  history: unknown[];
  measurements: unknown[];
  checkIns: unknown[];
  activeSession: unknown | null;
  settings?: {
    theme: "dark" | "light";
    preferences: BackupPreferences;
  };
};

export class BackupValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BackupValidationError";
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidPreferences(value: unknown): value is BackupPreferences {
  if (!isObject(value)) return false;
  return typeof value.sound === "boolean"
    && typeof value.vibration === "boolean"
    && typeof value.keepAwake === "boolean"
    && (value.restNotifications === undefined || typeof value.restNotifications === "boolean")
    && typeof value.workoutFontSize === "string"
    && WORKOUT_FONT_SIZES.has(value.workoutFontSize);
}

export function parseBackupJson(raw: string): ParsedBackup {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new BackupValidationError("O arquivo selecionado não contém um backup válido.");
  }

  if (!isObject(value)) throw new BackupValidationError("O arquivo selecionado não contém um backup válido.");
  if (typeof value.app !== "string" || !COMPATIBLE_APP_NAMES.has(value.app)) {
    throw new BackupValidationError("Este arquivo não foi criado pelo AngelsFit.");
  }
  if (!Number.isInteger(value.version) || (value.version as number) < 1) {
    throw new BackupValidationError("Não foi possível identificar a versão deste backup.");
  }
  if ((value.version as number) > BACKUP_FORMAT_VERSION) {
    throw new BackupValidationError("Este backup foi criado por uma versão mais nova. Atualize o AngelsFit e tente novamente.");
  }
  if (typeof value.exportedAt !== "string" || !Number.isFinite(Date.parse(value.exportedAt))) {
    throw new BackupValidationError("A data de criação do backup é inválida.");
  }

  const history = value.history;
  const measurements = value.measurements ?? [];
  const checkIns = value.checkIns ?? [];
  const activeSession = value.activeSession ?? null;

  if (!isValidProfile(value.profile)
    || !isValidHistory(history)
    || !isValidMeasurements(measurements)
    || !isValidCheckIns(checkIns)
    || (activeSession !== null && !isValidActiveSession(activeSession))) {
    throw new BackupValidationError("O backup está incompleto ou contém dados inválidos.");
  }

  let settings: ParsedBackup["settings"];
  if (value.settings !== undefined) {
    if (!isObject(value.settings)
      || (value.settings.theme !== "dark" && value.settings.theme !== "light")
      || !isValidPreferences(value.settings.preferences)) {
      throw new BackupValidationError("As preferências salvas neste backup são inválidas.");
    }
    settings = { theme: value.settings.theme, preferences: { ...value.settings.preferences, restNotifications: Boolean(value.settings.preferences.restNotifications) } as BackupPreferences };
  }

  return {
    app: value.app,
    version: value.version as number,
    exportedAt: value.exportedAt,
    profile: value.profile,
    history: history as unknown[],
    measurements: measurements as unknown[],
    checkIns: checkIns as unknown[],
    activeSession,
    settings,
  };
}
