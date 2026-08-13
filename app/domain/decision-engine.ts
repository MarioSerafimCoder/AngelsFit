import type { AdaptiveDecision, ConfidenceLevel, FatigueTrend, PainTrend, PerformanceTrend } from "./types.ts";

export type DecisionSignals = {
  affectedEntity: string;
  source: AdaptiveDecision["source"];
  performance: PerformanceTrend;
  fatigue: FatigueTrend;
  pain: PainTrend;
  confidence: ConfidenceLevel;
  cooldownActive?: boolean;
};

export function decideAdaptiveAction(signals: DecisionSignals): AdaptiveDecision {
  const base = { confidence: signals.confidence, source: signals.source, affectedEntity: signals.affectedEntity } as const;
  if (signals.pain === "recurring" || signals.pain === "worsening") return { ...base, action: "safety_adjustment", score: 20, loop: "fast", reasons: ["Não progredimos porque houve dor recorrente associada a esta entidade."] };
  if (signals.confidence === "low") return { ...base, action: "maintain", score: 48, loop: "fast", reasons: ["Mantivemos de forma conservadora porque a confiança ainda é baixa."] };
  if (signals.performance === "declining" && signals.fatigue === "high") return { ...base, action: "recover", score: 25, loop: "medium", reasons: ["O desempenho caiu enquanto a fadiga aumentou; priorizamos recuperação."] };
  if (signals.performance === "declining") return { ...base, action: "investigate", score: 42, loop: "medium", reasons: ["O desempenho caiu sem fadiga alta confirmada; vamos investigar antes de reduzir."] };
  if (signals.performance === "plateau" && signals.fatigue !== "high") return { ...base, action: "investigate", score: 55, loop: "medium", reasons: ["O platô apareceu em múltiplas exposições com recuperação aceitável."] };
  if (signals.cooldownActive) return { ...base, action: "maintain", score: 60, loop: "medium", reasons: ["Mantivemos a prescrição durante o período de observação após a última mudança."] };
  if (signals.performance === "improving" && ["low", "normal"].includes(signals.fatigue)) return { ...base, action: "progress", score: 82, loop: "fast", reasons: ["A performance melhorou em exposições repetidas sem sinais de fadiga alta."] };
  return { ...base, action: "maintain", score: signals.fatigue === "low" ? 68 : 60, loop: "fast", reasons: [signals.fatigue === "low" ? "A resposta está estável e há margem para considerar um pequeno aumento de estímulo após confirmação." : "A performance e a fadiga permanecem em uma faixa estável."] };
}

