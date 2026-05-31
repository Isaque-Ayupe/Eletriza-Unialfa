import { useState } from "react";
import { Activity, Shield, Thermometer, Droplets, Sun, AlertTriangle, Info, CheckCircle, Brain, RefreshCw, Zap } from "lucide-react";
import { Zone, Agent, Alert } from "../types";

interface DashboardViewProps {
  zones: Zone[];
  agents: Agent[];
  alerts: Alert[];
  stats: {
    totalZones: number;
    optimizationCount: number;
    currentLoadKw: number;
    comfortIndex: number;
  };
  onSimulateClick: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export default function DashboardView({ zones, agents, alerts, stats, onSimulateClick, onRefresh, loading }: DashboardViewProps) {
  const [chartRange, setChartRange] = useState<"live" | "day" | "week">("live");

  const chartPaths = {
    live: "M0,150 L100,120 L200,140 L300,80 L400,90 L500,40 L600,110 L700,90 L800,130 L900,60 L1000,70",
    day: "M0,180 L142,160 L285,120 L428,140 L571,110 L714,130 L857,110 L1000,70",
    week: "M0,130 L166,160 L333,140 L500,90 L666,50 L833,110 L1000,70"
  };

  const chartXLabels = {
    live: ["08:00", "09:00", "10:00", "11:00", "12:00", "Agora"],
    day: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "Hoje"],
    week: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
  };

  const currentPath = chartPaths[chartRange];
  const currentLabels = chartXLabels[chartRange];

  // Find Agent Details
  const spendingAgent = agents.find(a => a.id === "agent-spending") || { status: "OFFLINE", activeRules: 0, estSavings: "0%" };
  const resilienceAgent = agents.find(a => a.id === "agent-resilience") || { status: "OFFLINE", failureRisk: 12, failureRiskLabel: "Low/Moderate" };

  // Calculate environmental averages
  const avgTemp = zones.length > 0 ? (zones.reduce((sum, z) => sum + z.temp, 0) / zones.length).toFixed(1) : "22.4";
  const avgHumidity = zones.length > 0 ? Math.round(zones.reduce((sum, z) => sum + z.humidity, 0) / zones.length) : 45;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)] mb-1 font-sans uppercase">Visão Geral do Sistema</h1>
          <p className="text-slate-700 text-xs font-mono">Consumo de energia em tempo real e rastreamento de otimização por agente de IA.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="p-2 border border-[var(--fg)] bg-[var(--panel)] text-[var(--fg)] hover:bg-[var(--bg)] transition-colors"
            title="Sincronizar telemetria"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="flex items-center gap-3 bg-[var(--panel)] px-4 py-2 border border-[var(--fg)] shadow-[2px_2px_0_0_var(--fg)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-650 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-650"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--fg)]">Sistema Online</span>
            <span className="text-xs text-slate-500 font-mono ml-2 border-l border-[var(--fg)]/10 pl-2">Sincronização: Ativa</span>
          </div>
        </div>
      </div>

      {/* High-Level Metrics Grid (Bento Grid Row 1) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1: Building Health */}
        <div className="bg-[var(--panel)] border border-[var(--fg)] p-6 relative overflow-hidden shadow-[2px_2px_0_0_var(--fg)] group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] transform translate-x-4 -translate-y-4">
            <Shield className="w-32 h-32 text-black" />
          </div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs text-slate-550 font-bold uppercase tracking-wide mb-1">Saúde do Prédio</p>
              <h3 className="text-3xl font-bold text-[var(--fg)]">98%</h3>
            </div>
            <div className="w-8 h-8 bg-[var(--fg)] flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[10px] text-[var(--fg)] bg-green-50 inline-flex px-2 py-1 border border-green-300 font-bold tracking-tight uppercase">
            ● Estado Excelente
          </span>
        </div>

        {/* Metric 2: Current Load */}
        <div className="bg-[var(--panel)] border border-[var(--fg)] p-6 relative overflow-hidden shadow-[2px_2px_0_0_var(--fg)] group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs text-slate-550 font-bold uppercase tracking-wide mb-1">Carga Atual</p>
              <h3 className="text-3xl font-bold text-[var(--fg)]">
                {stats.currentLoadKw} <span className="text-sm font-normal">kW</span>
              </h3>
            </div>
            <div className="w-8 h-8 bg-[var(--fg)] flex items-center justify-center text-white">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="w-full bg-[var(--bg)] h-3 border border-[var(--fg)] mb-2 overflow-hidden">
            <div className="bg-[var(--fg)] h-full w-[45%]"></div>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">45% de pico de capacidade</p>
        </div>

        {/* Metric 3: Savings this Month */}
        <div className="bg-[var(--panel)] border border-[var(--fg)] p-6 relative overflow-hidden shadow-[2px_2px_0_0_var(--fg)] group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs text-slate-550 font-bold uppercase tracking-wide mb-1">Economia do Mês</p>
              <h3 className="text-3xl font-bold text-[var(--fg)]">R$ 4.2k</h3>
            </div>
            <div className="w-8 h-8 bg-green-700 flex items-center justify-center text-white font-bold text-xs">
              R$
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 border border-green-300 font-bold">
              ↓ 12.5%
            </span>
            <span className="text-xs text-slate-500 font-mono">vs mês anterior</span>
          </div>
        </div>

      </div>

      {/* Main Chart & Agent Status Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time Energy Area Chart */}
        <div className="lg:col-span-2 bg-[var(--panel)] border border-[var(--fg)] p-6 flex flex-col h-[400px] shadow-[2px_2px_0_0_var(--fg)]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--fg)]">Histórico de Consumo de Energia</h2>
              <p className="text-xs text-slate-500 font-mono">Consumo ativo em tempo real em quilowatts</p>
            </div>
            <div className="flex gap-1 bg-[var(--bg)] p-1 border border-[var(--fg)]">
              <button 
                type="button" 
                onClick={() => setChartRange("live")}
                className={`px-3 py-1 text-[10px] uppercase font-bold transition-all ${chartRange === 'live' ? 'bg-[var(--fg)] text-[var(--bg)]' : 'text-[var(--fg)] opacity-60 hover:opacity-100'}`}
              >Ao Vivo</button>
              <button 
                type="button" 
                onClick={() => setChartRange("day")}
                className={`px-3 py-1 text-[10px] uppercase font-bold transition-all ${chartRange === 'day' ? 'bg-[var(--fg)] text-[var(--bg)]' : 'text-[var(--fg)] opacity-60 hover:opacity-100'}`}
              >Dia</button>
              <button 
                type="button" 
                onClick={() => setChartRange("week")}
                className={`px-3 py-1 text-[10px] uppercase font-bold transition-all ${chartRange === 'week' ? 'bg-[var(--fg)] text-[var(--bg)]' : 'text-[var(--fg)] opacity-60 hover:opacity-100'}`}
              >Semana</button>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="flex-1 relative w-full mt-4">
            {/* Grid background lines */}
            <div className="absolute inset-0 flex flex-col justify-between pt-2 pb-6">
              <div className="border-t border-[var(--fg)]/10 w-full"></div>
              <div className="border-t border-[var(--fg)]/10 w-full"></div>
              <div className="border-t border-[var(--fg)]/10 w-full"></div>
              <div className="border-t border-[var(--fg)]/10 w-full"></div>
              <div className="border-t border-[var(--fg)]/10 w-full"></div>
            </div>

            {/* Y axis */}
            <div className="absolute left-0 inset-y-0 flex flex-col justify-between pt-2 pb-6 text-[10px] text-slate-500 font-mono">
              <span>500</span>
              <span>400</span>
              <span>300</span>
              <span>200</span>
              <span>100</span>
            </div>

            {/* SVG Graph drawing */}
            <svg className="w-full h-[calc(100%-24px)] absolute bottom-[24px] left-8 overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 200">
              <defs>
                <linearGradient id="chart-sub-gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--fg)" stopOpacity="0.12"></stop>
                  <stop offset="100%" stopColor="var(--fg)" stopOpacity="0.0"></stop>
                </linearGradient>
              </defs>

              {/* Shaded Area under the line */}
              <path d={`${currentPath} L1000,200 L0,200 Z`} fill="url(#chart-sub-gradient)"></path>

              {/* Glowing Trendline */}
              <path 
                d={currentPath} 
                fill="none" 
                stroke="var(--fg)" 
                strokeWidth="2.5" 
              ></path>

              {/* Forecast helper path */}
              {chartRange === 'live' && (
                <path d="M1000,70 L1100,90 L1200,85" fill="none" stroke="#a0b4c4" strokeDasharray="4,4" strokeWidth="1.5" opacity="0.6"></path>
              )}

              {/* Real-time focal node */}
              <circle cx="1000" cy="70" r="4" fill="var(--bg)" stroke="var(--fg)" strokeWidth="2.5"></circle>
            </svg>

            {/* X labels */}
            <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-slate-500 font-mono">
              {currentLabels.map((lbl, idx) => (
                <span key={idx} className={idx === currentLabels.length - 1 ? "text-[var(--fg)] font-bold" : ""}>{lbl}</span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Optimization Agents column */}
        <div className="flex flex-col gap-6">
          
          {/* Spending Control Agent */}
          <div className="bg-[var(--panel)] border border-[var(--fg)] p-5 relative overflow-hidden flex-1 flex flex-col justify-between shadow-[2px_2px_0_0_var(--fg)]">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-[var(--fg)] flex items-center justify-center text-white">
                  <Brain className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-bold text-[var(--fg)] text-xs uppercase">Agente Regulador de Gasto</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${spendingAgent.status === "OPTIMIZING" ? 'bg-green-600 animate-pulse' : 'bg-slate-400'}`}></span>
                    <span className="text-[9px] uppercase font-bold text-slate-600">{spendingAgent.status === "OPTIMIZING" ? "OTIMIZANDO" : spendingAgent.status}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                Controlando ar condicionado e programando intervalos de iluminação em espaços vazios ou parcialmente ocupados.
              </p>
            </div>
            <div className="bg-[var(--bg)] p-3 border border-[var(--fg)]">
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-600 mb-1">
                <span>Estado Central do Sistema</span>
                <span className="font-bold text-[var(--fg)]">{spendingAgent.activeRules} Regras Ativas</span>
              </div>
              <p className="text-[10px] font-bold text-[var(--fg)]">Cargas estáticas de base reduzidas para a margem de {spendingAgent.estSavings}.</p>
            </div>
          </div>

          {/* Network Resilience Agent */}
          <div className="bg-[var(--panel)] border border-[var(--fg)] p-5 relative overflow-hidden flex-1 flex flex-col justify-between shadow-[2px_2px_0_0_var(--fg)]">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-[var(--fg)] flex items-center justify-center text-white">
                  <Activity className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-bold text-[var(--fg)] text-xs uppercase">Agente de Resiliência de Rede</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                    <span className="text-[9px] uppercase font-bold text-slate-605">{resilienceAgent.status === "MONITORING" ? "MONITORANDO" : resilienceAgent.status}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                Inspecionando picos de carga de microrrede, calculando a estabilidade de tensão para anular harmônicas.
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] border-t border-[var(--fg)]/10 pt-3 font-mono">
              <span className="text-slate-600">Índice de Estabilidade da Rede</span>
              <span className="text-green-705 font-bold">99.9% Excelente</span>
            </div>
          </div>

        </div>

      </div>

      {/* Grid Row 3: Environment conditions & Live logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Environment Conditions panel */}
        <div className="bg-[var(--panel)] border border-[var(--fg)] p-6 shadow-[2px_2px_0_0_var(--fg)]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--fg)] mb-4 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-[var(--fg)]" />
            <span>Condições das Instalações</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            
            {/* Avg Temp */}
            <div className="bg-[var(--bg)]/50 p-4 border border-[var(--fg)] flex flex-col justify-center items-center text-center">
              <Thermometer className="w-5 h-5 text-[var(--fg)] mb-2" />
              <p className="text-[10px] uppercase font-bold text-slate-600 mb-1">Temperatura Média</p>
              <p className="text-2xl font-bold text-[var(--fg)]">{avgTemp}°C</p>
              <p className="text-[9px] font-mono text-slate-500 mt-1">Faixa Desejada: 22.0°C</p>
            </div>

            {/* Avg Humidity */}
            <div className="bg-[var(--bg)]/50 p-4 border border-[var(--fg)] flex flex-col justify-center items-center text-center">
              <Droplets className="w-5 h-5 text-[var(--fg)] mb-2" />
              <p className="text-[10px] uppercase font-bold text-slate-600 mb-1">Umidade Média</p>
              <p className="text-2xl font-bold text-[var(--fg)]">{avgHumidity}%</p>
              <p className="text-[9px] font-mono text-slate-500 mt-1">Recomendado: 45-55%</p>
            </div>

            {/* Outdoor Weather Gauge */}
            <div className="col-span-2 bg-[var(--bg)]/50 p-3 border border-[var(--fg)] flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-[var(--fg)]" />
                <span className="text-slate-600">Índice Térmico Externo</span>
              </div>
              <span className="font-bold text-[var(--fg)]">31.0°C (Ensolarado / Quente)</span>
            </div>

          </div>
        </div>

        {/* Live Active Alerts with Simulation highlight */}
        <div className="bg-[var(--panel)] border border-[var(--fg)] p-6 flex flex-col justify-between shadow-[2px_2px_0_0_var(--fg)]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--fg)] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-650" />
              <span>Anomalias de Telemetria / Alertas Ativos</span>
            </h3>
            <span className="bg-red-100 border border-red-300 text-red-700 px-2 py-0.5 text-[9px] font-bold uppercase tracking-tighter">
              {alerts.length} Ocorrências
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[220px] pr-2 font-sans">
            {alerts.slice(0, 5).map((al) => (
              <div
                key={al.id}
                className={`p-3 border transition-all ${
                  al.isSimulated
                    ? 'bg-purple-10 border-purple-300'
                    : al.type === 'error'
                    ? 'bg-red-10 border-red-300'
                    : 'bg-[var(--bg)]/35 border-[var(--fg)]/30'
                } flex gap-3 items-start`}
              >
                <div className="mt-0.5 shrink-0">
                  {al.isSimulated ? (
                    <Brain className="w-4 h-4 text-purple-600" />
                  ) : al.type === 'error' ? (
                    <AlertTriangle className="w-4 h-4 text-red-650" />
                  ) : (
                    <Info className="w-4 h-4 text-slate-700" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-4">
                    <h4 className="text-xs font-bold text-[var(--fg)] truncate">{al.title}</h4>
                    {al.isSimulated && (
                      <span className="text-[8px] uppercase font-black tracking-widest bg-purple-100 border border-purple-300 text-purple-700 px-1.5 py-0.5">
                        MOCK
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-700 leading-normal mt-1">{al.description}</p>
                  
                  {al.aiDiagnostic && (
                    <div className="mt-2.5 pt-2 border-t border-[var(--fg)]/10 text-[10px] text-[var(--fg)] leading-normal bg-[var(--panel)]/50 p-2 border border-[var(--fg)]/10">
                      <strong className="text-purple-700 block mb-0.5 font-mono">🤖 Análise de Resolução Gemini AI:</strong>
                      {al.aiDiagnostic}
                    </div>
                  )}
                  
                  <span className="text-[9px] text-slate-400 font-mono mt-2 block">{al.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Simulate scenarios anchor */}
          <button
            type="button"
            onClick={onSimulateClick}
            className="w-full mt-4 py-2 border border-[var(--fg)] bg-[var(--panel)] text-[var(--fg)] font-bold hover:bg-[var(--bg)] text-[10px] uppercase tracking-wide flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Gerar Falha do Simulador de Carga</span>
          </button>
        </div>

      </div>

    </div>
  );
}
