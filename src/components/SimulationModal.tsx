import React, { useState, FormEvent } from "react";
import { X, Play, Loader2, Sparkles, AlertCircle, CheckCircle, Info } from "lucide-react";
import { Zone, ErrorSimulationResponse } from "../types";

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  zones: Zone[];
  onSimulationSuccess: (feedback: ErrorSimulationResponse["aiFeedback"], alertTitle: string) => void;
}

export default function SimulationModal({ isOpen, onClose, zones, onSimulationSuccess }: SimulationModalProps) {
  const [anomalyType, setAnomalyType] = useState("Sobrecarga de HVAC - Temperatura Crítica");
  const [zoneId, setZoneId] = useState(zones[0]?.id || "");
  const [severity, setSeverity] = useState<"low" | "medium" | "high" | "critical">("high");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<ErrorSimulationResponse["aiFeedback"] | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setFeedback(null);

    try {
      const response = await fetch("/api/error-simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anomalyType,
          zoneId,
          severity,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar simulação para o servidor.");
      }

      const data: ErrorSimulationResponse = await response.json();
      if (data.success && data.aiFeedback) {
        setFeedback(data.aiFeedback);
        const selectedZone = zones.find(z => z.id === zoneId)?.name || "Instalação Geral";
        onSimulationSuccess(data.aiFeedback, `Simulação: ${anomalyType} em ${selectedZone}`);
      } else {
        throw new Error("Resposta inválida do servidor de simulação.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Erro de conexão com o back-end.");
    } finally {
      setLoading(false);
    }
  };

  const anomalies = [
    "Sobrecarga de HVAC - Temperatura Crítica",
    "Surto de Consumo Elétrico",
    "Falha de Sensor Térmico",
    "Luzes Ativas Fora de Horário (Desperdício)",
    "Pico de Umidade em Sala de Servidores",
    "Fator de Potência Crítico nos Transformadores"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none">
      <div className="relative w-full max-w-xl overflow-hidden bg-[var(--panel)] border-2 border-[var(--fg)] shadow-[4px_4px_0_0_var(--fg)] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--fg)]">
          <div className="flex items-center gap-3">
            <Play className="w-5 h-5 text-[var(--fg)] fill-[var(--fg)]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--fg)] font-mono">Simular Problema de Telemetria</h2>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 border border-[var(--fg)] text-[var(--fg)] hover:bg-[var(--bg)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {!feedback ? (
            <form id="sim-form" onSubmit={handleSubmit} className="space-y-5">
              
              {/* Informative text */}
              <p className="text-xs text-slate-700 leading-relaxed font-mono">
                Este simulador transmite um sinal de telemetria irregular ao back-end ativo. 
                Os dados de telemetria serão analisados em tempo real pelo agente EnergiAI para produzir diagnósticos estruturados e ações corretivas coordenadas.
              </p>

              {/* Anomaly selection */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-650 mb-2 font-mono">
                  Modelo de Anomalia
                </label>
                <select
                  value={anomalyType}
                  onChange={(e) => setAnomalyType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[var(--fg)] bg-[var(--panel)] text-[var(--fg)] focus:outline-none cursor-pointer text-xs font-mono"
                >
                  {anomalies.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              {/* Zone selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-650 mb-2 font-mono">
                    Zona Alvo
                  </label>
                  <select
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[var(--fg)] bg-[var(--panel)] text-[var(--fg)] focus:outline-none cursor-pointer text-xs font-mono"
                  >
                    {zones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Severity */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-650 mb-2 font-mono">
                    Gravidade
                  </label>
                  <div className="grid grid-cols-4 gap-2 h-[38px]">
                    {(["baixa", "média", "alta", "crítica"] as const).map((sev) => {
                      // Map state keys
                      let englishSev: "low" | "medium" | "high" | "critical" = "high";
                      if (sev === "baixa") englishSev = "low";
                      if (sev === "média") englishSev = "medium";
                      if (sev === "alta") englishSev = "high";
                      if (sev === "crítica") englishSev = "critical";

                      return (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => setSeverity(englishSev)}
                          className={`text-[9px] uppercase font-bold border transition-all flex items-center justify-center font-mono ${
                            severity === englishSev
                              ? "bg-[var(--fg)] border-[var(--fg)] text-white"
                              : "bg-[var(--panel)] border-[var(--fg)]/30 text-slate-600 hover:bg-[var(--bg)]"
                          }`}
                        >
                          {sev}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-650 mb-2 font-mono">
                  Observações Adicionais (Opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Manutenção temporária do chiller principal obstruindo o fluxo de refrigeração."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-[var(--fg)] bg-[var(--bg)]/20 text-[var(--fg)] placeholder-slate-400 focus:outline-none text-xs font-mono resize-none"
                />
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-300 text-red-700 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </form>
          ) : (
            /* Result Screen */
            <div className="space-y-6 animate-fade-in font-sans">
              <div className="flex flex-col items-center text-center p-4 bg-green-50 border border-green-300">
                <CheckCircle className="w-10 h-10 text-green-700 mb-3" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--fg)]">Anomalia Registrada com Sucesso!</h3>
                <p className="text-xs text-slate-600 mt-1">A telemetria foi enviada e o registro de alertas ativos no servidor foi atualizado.</p>
              </div>

              <div className="space-y-4 font-sans">
                <div className="bg-[var(--bg)]/30 p-4 border border-[var(--fg)]/20">
                  <div className="flex items-center gap-2 mb-2 text-[var(--fg)] text-xs uppercase font-bold font-mono">
                    <Sparkles className="w-4 h-4 text-purple-700" />
                    <span>Diagnóstico de Incidente - EnergiAI</span>
                  </div>
                  <p className="text-xs text-slate-805 leading-relaxed">
                    {feedback.diagnostic}
                  </p>
                </div>

                <div className="bg-[var(--bg)]/30 p-4 border border-[var(--fg)]/20">
                  <div className="flex items-center gap-2 mb-2 text-[var(--fg)] text-xs uppercase font-bold font-mono">
                    <Info className="w-4 h-4" />
                    <span>Ação de Mitigação Coordenada</span>
                  </div>
                  <p className="text-xs text-slate-805 leading-relaxed">
                    {feedback.actionTaken}
                  </p>
                </div>

                <div className="bg-green-50 p-4 border border-green-300">
                  <div className="flex items-center gap-2 mb-1 text-green-800 text-xs uppercase font-bold font-mono">
                    <span>Efeito Esperado no Balanço de Carga</span>
                  </div>
                  <p className="text-xs text-green-900 font-medium leading-relaxed font-mono">
                    {feedback.savingsImpact}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--fg)] bg-[var(--bg)]/30">
          {!feedback ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border border-[var(--fg)] text-[var(--fg)] bg-[var(--panel)] hover:bg-[var(--bg)] transition-colors text-xs font-bold uppercase tracking-wide font-mono"
              >
                Cancelar
              </button>
              <button
                form="sim-form"
                type="submit"
                disabled={loading}
                className="px-5 py-2 border border-[var(--fg)] bg-[var(--fg)] text-white hover:bg-[var(--fg)]/90 transition-colors font-bold text-xs uppercase tracking-wide flex items-center gap-2 disabled:opacity-50 font-mono"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Enviar Carga de Telemetria</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-[var(--fg)] bg-[var(--fg)] text-white hover:bg-[var(--fg)]/90 transition-all text-xs font-bold font-mono uppercase"
            >
              Concluído
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
