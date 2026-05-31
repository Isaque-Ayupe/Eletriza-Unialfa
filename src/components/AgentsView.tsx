import { Sparkles, Brain, Shield, Info, BatteryCharging, Zap, Gauge, ServerCrash, Smartphone, Activity } from "lucide-react";
import { Agent } from "../types";

interface AgentsViewProps {
  agents: Agent[];
  onToggleControl: (agentId: string, controlId: string, enabled: boolean) => Promise<void>;
  loading: boolean;
}

export default function AgentsView({ agents, onToggleControl, loading }: AgentsViewProps) {
  const spendingAgent = agents.find(a => a.id === "agent-spending") || {
    status: "OPTIMIZING",
    estSavings: "15.4%",
    activeRules: 12,
    controls: []
  };

  const resilienceAgent = agents.find(a => a.id === "agent-resilience") || {
    status: "MONITORING",
    failureRisk: 12,
    failureRiskLabel: "Low/Moderate",
    controls: [],
    networkStability: [60, 75, 65, 85, 70, 95, 90, 99.9],
    backupStatus: "STANDBY"
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)] mb-1 font-sans uppercase">Gerenciamento de Agentes de IA</h1>
        <p className="text-slate-750 text-xs font-mono max-w-xl leading-relaxed">
          Configure e supervisione loops independentes de automação. Estes agentes automáticos respondem a eventos em tempo real para maximizar as margens de economia de energia.
        </p>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Agent 1: Spending Control Agent */}
        <div className="bg-[var(--panel)] border border-[var(--fg)] p-6 flex flex-col gap-6 relative overflow-hidden shadow-[4px_4px_0_0_var(--fg)]">
          
          {/* Header */}
          <div className="flex justify-between items-start z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border border-[var(--fg)] bg-[var(--bg)] flex items-center justify-center text-[var(--fg)]">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm uppercase tracking-wide text-[var(--fg)]">Agente Regulador de Gasto</h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                  <span className="text-[10px] text-green-700 font-bold uppercase tracking-wider font-mono">
                    {spendingAgent.status === "OPTIMIZING" ? "OTIMIZANDO" : spendingAgent.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-700 leading-relaxed font-sans">
            Este módulo inteligente otimiza configurações térmicas e de iluminação programada com base em previsões de ocupação. É totalmente autônomo, atualizando setpoints de climatização a cada 5 minutos.
          </p>

          {/* Core Monthly Stats */}
          <div className="z-10 grid grid-cols-2 gap-4">
            <div className="bg-[var(--bg)]/40 p-4 border border-[var(--fg)]/15">
              <p className="text-[9px] text-slate-500 mb-1 uppercase tracking-wider font-bold font-mono">Economia Mensal Estimada</p>
              <p className="text-2xl font-black text-[var(--fg)]">{spendingAgent.estSavings}</p>
            </div>
            <div className="bg-[var(--bg)]/40 p-4 border border-[var(--fg)]/15">
              <p className="text-[9px] text-slate-500 mb-1 uppercase tracking-wider font-bold font-mono">Regras de Telemetria Ativas</p>
              <p className="text-2xl font-black text-[var(--fg)]">{spendingAgent.activeRules}</p>
            </div>
          </div>

          {/* Control Toggles */}
          <div className="z-10 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--fg)] pb-2 border-b border-[var(--fg)]/10 mb-2 font-mono">
              Diretrizes de Otimização
            </h3>
            
            {spendingAgent.controls?.map((ctrl) => {
              // On-the-fly translations for names and descriptions
              let displayCtrlName = ctrl.name;
              let displayCtrlDesc = ctrl.description;

              if (ctrl.name === "HVAC Automated Throttling") {
                displayCtrlName = "Ajuste Automatizado de HVAC";
              } else if (ctrl.name === "Adaptive Corridor Lighting") {
                displayCtrlName = "Iluminação de Corredor Adaptativa";
              } else if (ctrl.name === "Server Room Economy Offset") {
                displayCtrlName = "Compensação de Economia de TI";
              }

              if (ctrl.description === "Let Gemini throttle HVAC cooling levels under 15% occupancy") {
                displayCtrlDesc = "Permitir ao EnergiAI reduzir resfriamento sob baixa ocupação (< 15%)";
              } else if (ctrl.description === "De-energize corridors during 18:00-06:00 unless motion is detected") {
                displayCtrlDesc = "Desligar corredores das 18h às 6h caso nenhum movimento seja ativado";
              } else if (ctrl.description === "Safely adjust IT room baseline setpoint by +0.5C on idle loads") {
                displayCtrlDesc = "Ajustar em +0.5°C o setpoint da sala de TI em horários de baixa carga";
              }

              return (
                <div key={ctrl.id} className="flex items-center justify-between bg-[var(--bg)]/20 p-3.5 border border-[var(--fg)]/10 transition-all hover:bg-[var(--bg)]/35">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--fg)]">{displayCtrlName}</h4>
                    <p className="text-[10px] text-slate-655 font-mono mt-0.5">{displayCtrlDesc}</p>
                  </div>
                  
                  {/* Custom input toggle switch */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => onToggleControl("agent-spending", ctrl.id, !ctrl.enabled)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-[var(--fg)] transition-colors duration-200 ease-in-out focus:outline-none ${
                      ctrl.enabled ? 'bg-[var(--fg)]' : 'bg-[var(--bg)]'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-[var(--panel)] shadow ring-0 transition duration-200 ease-in-out ${
                        ctrl.enabled ? 'translate-x-[20px]' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

        </div>

        {/* Agent 2: Network Resilience Agent */}
        <div className="bg-[var(--panel)] border border-[var(--fg)] p-6 flex flex-col gap-6 relative overflow-hidden shadow-[4px_4px_0_0_var(--fg)]">
          
          {/* Header */}
          <div className="flex justify-between items-start z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border border-[var(--fg)] bg-[var(--bg)] flex items-center justify-center text-[var(--fg)]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm uppercase tracking-wide text-[var(--fg)]">Agente de Resiliência de Rede</h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                  <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider font-mono">
                    {resilienceAgent.status === "MONITORING" ? "MONITORANDO" : resilienceAgent.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Failure prediction ring */}
          <div className="z-10 bg-[var(--bg)]/40 p-4 border border-[var(--fg)]/15 flex items-center justify-between">
            <div className="max-w-[70%]">
              <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold mb-1 font-mono">
                Risco de Queda Previsto (24h)
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-amber-700">{resilienceAgent.failureRisk}%</p>
                <span className="text-[10px] text-slate-600 font-mono">Risco Baixo/Moderado</span>
              </div>
            </div>
            
            {/* Visual indicator ring */}
            <div className="w-12 h-12 rounded-full border-4 border-slate-300 relative flex items-center justify-center">
              <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(245, 158, 11, 0.05)" strokeWidth="4" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="var(--fg)" strokeWidth="4" strokeDasharray={`${resilienceAgent.failureRisk}, 100`} />
              </svg>
              <BatteryCharging className="w-4 h-4 text-[var(--fg)]" />
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-705 leading-relaxed font-sans">
            Monitora continuamente filtros de salas limpas, desvios harmônicos de fator de potência e redes elétricas para evitar blefautes. O alívio de carga automático é acionado ao atingir 70% de risco.
          </p>

          {/* Network stability custom columns list */}
          <div className="z-10 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--fg)] pb-2 border-b border-[var(--fg)]/10 mb-2 font-mono">
              Métricas de Estabilidade da Rede
            </h3>
            
            <div className="bg-[var(--bg)]/30 p-4 border border-[var(--fg)]/15 space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-mono uppercase text-[9px] font-bold">Coeficiente de estabilidade do barramento</span>
                <span className="font-bold text-[var(--fg)]">99.9% Excelente</span>
              </div>
              
              {/* Stability bars */}
              <div className="h-10 w-full flex items-end gap-1 px-1 border-b border-[var(--fg)]">
                {resilienceAgent.networkStability?.map((value, idx) => (
                  <div 
                    key={idx}
                    className="w-full bg-[var(--fg)]/85 hover:bg-[var(--fg)] transition-all"
                    style={{ height: `${value}%` }}
                    title={`Estabilidade: ${value}%`}
                  />
                ))}
              </div>
            </div>

            {/* Backup Systems state tracker */}
            {resilienceAgent.controls?.map((ctrl) => {
              // Translate controls values
              let displayCtrlName = ctrl.name;
              let displayCtrlDesc = ctrl.description;

              if (ctrl.name === "Harmonic Offset Compensation") {
                displayCtrlName = "Compensação de Desvios Harmônicos";
              } else if (ctrl.name === "Capacitor Bank Active Dampening") {
                displayCtrlName = "Amortecimento Ativo de Bancos de Capacitores";
              } else if (ctrl.name === "Microgrid Loop Islanding") {
                displayCtrlName = "Ilhamento Mecânico da Microrrede";
              }

              if (ctrl.description === "Dynamic harmonics attenuation to filter offset sine waves") {
                displayCtrlDesc = "Atenuação de harmônicas para purificar o fator de potência";
              } else if (ctrl.description === "Counteractive capacitive loads to maintain active grids") {
                displayCtrlDesc = "Gerar cargas capacitivas protetivas para reter a energia ativa";
              } else if (ctrl.description === "Isolate key grids physically from primary substation under sag risk") {
                displayCtrlDesc = "Isolar fisicamente circuitos cruciais da subestação se houver sobretensão";
              }

              return (
                <div key={ctrl.id} className="flex items-center justify-between bg-[var(--bg)]/20 p-3.5 border border-[var(--fg)]/10 transition-all hover:bg-[var(--bg)]/35">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--fg)]">{displayCtrlName}</h4>
                    <p className="text-[10px] text-slate-655 font-mono mt-0.5">{displayCtrlDesc}</p>
                  </div>
                  
                  {/* Custom input toggle switch */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => onToggleControl("agent-resilience", ctrl.id, !ctrl.enabled)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-[var(--fg)] transition-colors duration-200 ease-in-out focus:outline-none ${
                      ctrl.enabled ? 'bg-[var(--fg)]' : 'bg-[var(--bg)]'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-[var(--panel)] shadow ring-0 transition duration-200 ease-in-out ${
                        ctrl.enabled ? 'translate-x-[20px]' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
