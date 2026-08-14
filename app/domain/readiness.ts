import type { TrainingHistoryLike } from "../training-intelligence.ts";
import { isPoorRecovery, normalizeRecovery24h } from "./recovery.ts";
import type { ReadinessLevel } from "./types.ts";

export type OptionalReadinessData = {
  sleepHours?: number;
  energy?: number;
  stress?: number;
  pain?: number;
  symptoms?: string[];
};

export type PassiveReadiness = {
  level: ReadinessLevel;
  score: number | null;
  signalsUsed: number;
  reasons: string[];
};

function finite(value: unknown): value is number { return typeof value === "number" && Number.isFinite(value); }

export function inferPassiveReadiness(history: TrainingHistoryLike[], optional: OptionalReadinessData = {}, now = new Date()): PassiveReadiness {
  const recent = history.filter((item) => ["completed", "partial", "interrupted", "repeated", undefined].includes(item.status)).slice(0, 5);
  const penalties: number[] = [];
  const reasons: string[] = [];
  const last = recent[0];
  if (last) {
    const recovery = normalizeRecovery24h(last.recovery24h);
    if (recovery) {
      penalties.push(recovery === "very_fatigued" ? 1 : recovery === "worse" ? 0.7 : recovery === "better" ? -0.15 : 0);
      if (isPoorRecovery(recovery)) reasons.push("A recuperação de 24 horas recente ficou abaixo do habitual.");
    }
    if (finite(last.sessionRpe)) penalties.push(last.sessionRpe >= 9 ? 0.8 : last.sessionRpe >= 8 ? 0.4 : 0);
    if (finite(last.averageRir)) penalties.push(last.averageRir <= 0 ? 0.7 : last.averageRir <= 1 ? 0.35 : 0);
    if (finite(last.painScore)) penalties.push(last.painScore >= 7 ? 1 : last.painScore >= 4 ? 0.65 : last.painScore > 0 ? 0.15 : 0);
    if (last.symptoms?.length) penalties.push(Math.min(1, last.symptoms.length * 0.3));
    const gapDays = Math.max(0, Math.floor((now.getTime() - new Date(last.completedAt).getTime()) / 86_400_000));
    if (gapDays >= 15) { penalties.push(0.55); reasons.push("A pausa recente pede uma sessão de retorno mais conservadora."); }
    else if (gapDays >= 8) penalties.push(0.25);
  }
  const recentDeclines = recent.slice(0, 3).filter((item) => (item.exerciseRecords || []).some((record) => record.setsCompleted < Math.max(1, record.setsPlanned))).length;
  if (recentDeclines >= 2) { penalties.push(0.45); reasons.push("A conclusão das séries caiu em mais de uma sessão recente."); }
  if (finite(optional.sleepHours)) penalties.push(optional.sleepHours < 6 ? 0.6 : optional.sleepHours < 7 ? 0.25 : 0);
  if (finite(optional.energy)) penalties.push(optional.energy <= 2 ? 0.65 : optional.energy === 3 ? 0.2 : 0);
  if (finite(optional.stress)) penalties.push(optional.stress >= 4 ? 0.55 : optional.stress === 3 ? 0.2 : 0);
  if (finite(optional.pain)) penalties.push(optional.pain >= 7 ? 1 : optional.pain >= 4 ? 0.65 : optional.pain > 0 ? 0.15 : 0);
  if (optional.symptoms?.length) penalties.push(Math.min(1, optional.symptoms.length * 0.3));

  if (!penalties.length) return { level: "unknown", score: null, signalsUsed: 0, reasons: ["Sem dados recentes suficientes; o treino segue normalmente."] };
  const averagePenalty = penalties.reduce((sum, value) => sum + value, 0) / penalties.length;
  const score = Math.round(Math.max(0, Math.min(1, 1 - averagePenalty)) * 100);
  const level: ReadinessLevel = score >= 78 ? "high" : score >= 48 ? "normal" : "low";
  if (!reasons.length) reasons.push(level === "high" ? "Os sinais recentes indicam boa prontidão." : level === "normal" ? "Os sinais recentes permitem manter o treino planejado." : "Múltiplos sinais recentes recomendam reduzir fadiga.");
  return { level, score, signalsUsed: penalties.length, reasons };
}

