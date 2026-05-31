import React, { useState } from "react";
import { CalendarRange, Download, BarChart2, Brain, Sparkles, FileText, ArrowUpRight, TrendingUp, Check } from "lucide-react";
import { Report } from "../types";

interface ReportsViewProps {
  reports: Report[];
}

export default function ReportsView({ reports }: ReportsViewProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = (rep: Report) => {
    setDownloadingId(rep.id);
    setTimeout(() => {
      setDownloadingId(null);
    }, 1500);
  };

  // Planned vs Actual energy spending mock data (comparative bars calculations)
  const chartData = [
    { week: "W1", planned: 60, actual: 65, actValue: "6.5k", plnValue: "6.0k" },
    { week: "W2", planned: 65, actual: 55, actValue: "5.5k", plnValue: "6.5k" },
    { week: "W3", planned: 70, actual: 80, actValue: "8.0k", plnValue: "7.0k" },
    { week: "W4", planned: 75, actual: 95, actValue: "9.5k", plnValue: "7.5k", isPeakExceeded: true },
    { week: "W5", planned: 60, actual: 45, actValue: "4.5k", plnValue: "6.0k" },
    { week: "W6", planned: 65, actual: 50, actValue: "5.0k", plnValue: "6.5k" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)] mb-1 font-sans uppercase">Relatórios e Previsões</h1>
          <p className="text-slate-700 text-xs font-mono">Análises econômicas de otimização de energia e diagnósticos preditivos.</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="border border-[var(--fg)] bg-[var(--panel)] px-4 py-2 text-xs font-mono font-bold uppercase transition-colors hover:bg-[var(--bg)] text-[var(--fg)] flex items-center gap-1.5">
            <CalendarRange className="w-3.5 h-3.5" />
            <span>Últimos 30 Dias</span>
          </button>
          <button type="button" className="border border-[var(--fg)] bg-[var(--panel)] px-4 py-2 text-xs font-mono font-bold uppercase hover:bg-[var(--bg)] transition-colors text-[var(--fg)] flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Dados</span>
          </button>
        </div>
      </div>

      {/* Top Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Total Consumption */}
        <div className="bg-[var(--panel)] border border-[var(--fg)] p-6 relative overflow-hidden shadow-[4px_4px_0_0_var(--fg)] group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs text-slate-500 mb-1 font-mono uppercase font-bold">Consumo Total</p>
              <h3 className="text-3xl font-black text-[var(--fg)]">14.250 <span className="text-sm text-slate-500 font-mono font-normal">kWh</span></h3>
            </div>
            <div className="w-8 h-8 border border-[var(--fg)] bg-[var(--bg)] flex items-center justify-center font-mono text-[10px] font-bold text-[var(--fg)]">
              kW
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm relative z-10">
            <span className="text-red-750 font-bold flex items-center gap-1 bg-red-50 border border-red-200 px-2 py-0.5 text-xs">
              <TrendingUp className="w-3 h-3" />
              +5.2%
            </span>
            <span className="text-slate-500 text-xs font-mono">em rel. ao mês anterior</span>
          </div>
        </div>

        {/* Card 2: AI Estimated Savings */}
        <div className="bg-[var(--panel)] border border-[var(--fg)] p-6 relative overflow-hidden shadow-[4px_4px_0_0_var(--fg)] group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs text-slate-500 mb-1 font-mono uppercase font-bold">Economia Estimada por IA</p>
              <h3 className="text-3xl font-black text-[var(--fg)]">R$ 3.420</h3>
            </div>
            <div className="w-8 h-8 border border-[var(--fg)] bg-[var(--bg)] flex items-center justify-center text-[var(--fg)]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm relative z-10">
            <span className="text-green-755 font-bold border border-green-300 bg-green-50 px-2 py-0.5 text-xs text-[var(--fg)] font-mono">
              OTIMIZADO
            </span>
            <span className="text-slate-500 text-xs font-mono">Índices de estimativa em tempo real</span>
          </div>
        </div>

        {/* Card 3: Thermal Comfort Index */}
        <div className="bg-[var(--panel)] border border-[var(--fg)] p-6 relative overflow-hidden shadow-[4px_4px_0_0_var(--fg)] group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs text-slate-500 mb-1 font-mono uppercase font-bold">Índice Médio de Conforto Térmico</p>
              <h3 className="text-3xl font-black text-[var(--fg)]">92%</h3>
            </div>
            <div className="w-8 h-8 border border-[var(--fg)] bg-[var(--bg)] flex items-center justify-center font-mono text-[10px] font-bold text-[var(--fg)]">
              PMV
            </div>
          </div>
          <div className="w-full bg-[var(--bg)] border border-[var(--fg)]/20 h-3 mt-2 relative z-10">
            <div className="bg-[var(--fg)] h-full" style={{ width: "92%" }}></div>
          </div>
        </div>

      </div>

      {/* Main Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Planned vs Actual comparative bar chart */}
        <div className="bg-[var(--panel)] border border-[var(--fg)] p-6 lg:col-span-2 flex flex-col min-h-[400px] shadow-[4px_4px_0_0_var(--fg)]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--fg)] flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[var(--fg)]" />
                <span>Gastos Planejados vs Reais</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-mono">Comparação entre o orçamento semanal previsto de energia e os gastos na prática.</p>
            </div>
            
            <div className="flex gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-[var(--bg)] border border-[var(--fg)]/40"></div>
                <span className="text-slate-600 font-bold uppercase tracking-tighter text-[10px]">Planejado</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-[var(--fg)]"></div>
                <span className="text-[var(--fg)] font-bold uppercase tracking-tighter text-[10px]">Real</span>
              </div>
            </div>
          </div>

          {/* Double Bar chart visualization */}
          <div className="flex-1 flex items-end pt-10 pb-4 relative border-b border-[var(--fg)]/20">
            
            {/* Grid helper lines */}
            <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pb-8 pointer-events-none">
              <div className="w-full border-t border-[var(--fg)]/10 relative"><span className="absolute -top-3.5 left-0 text-[9px] text-slate-500 font-mono">10k</span></div>
              <div className="w-full border-t border-[var(--fg)]/10 relative"><span className="absolute -top-3.5 left-0 text-[9px] text-slate-500 font-mono">7.5k</span></div>
              <div className="w-full border-t border-[var(--fg)]/10 relative"><span className="absolute -top-3.5 left-0 text-[9px] text-slate-500 font-mono">5k</span></div>
              <div className="w-full border-t border-[var(--fg)]/10 relative"><span className="absolute -top-3.5 left-0 text-[9px] text-slate-500 font-mono">2.5k</span></div>
              <div className="w-full relative"><span className="absolute -top-3 left-0 text-[10px] text-slate-500 font-mono">0</span></div>
            </div>

            {/* Bars drawing */}
            <div className="flex-1 flex justify-around items-end z-10 h-full ml-10">
              {chartData.map((d, index) => (
                <div key={index} className="flex flex-col items-center gap-2 w-full max-w-[50px] group cursor-default relative">
                  <div className="flex gap-1.5 items-end justify-center w-full h-[190px] relative">
                    
                    {/* Planned Bar */}
                    <div 
                      className="w-1/3 bg-[var(--bg)] border border-[var(--fg)]/40 rounded-t-none transition-all duration-500 ease-out" 
                      style={{ height: `${d.planned}%` }}
                    />
                    
                    {/* Actual Bar */}
                    <div 
                      className={`w-1/3 rounded-t-none border transition-all duration-500 ease-out ${
                        d.isPeakExceeded 
                          ? 'bg-red-650 border-[var(--fg)]' 
                          : 'bg-[var(--fg)] border-[var(--fg)]'
                      }`} 
                      style={{ height: `${d.actual}%` }}
                    />

                    {/* Popover tooltip on hover */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[var(--fg)] text-white px-3 py-1.5 rounded-none text-[10px] border border-[var(--fg)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20 font-mono">
                      <span>Real:</span> <strong className="text-green-300">{d.actValue}</strong> / <span>Plan:</span> {d.plnValue}
                    </div>

                  </div>
                  
                  {/* Label */}
                  <span className="text-[10px] font-semibold text-slate-500 mt-1 font-mono">{d.week.replace("W", "Sem ")}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Forecast AI List */}
        <div className="bg-[var(--panel)] border border-[var(--fg)] flex flex-col overflow-hidden shadow-[4px_4px_0_0_var(--fg)]">
          <div className="p-5 border-b border-[var(--fg)] bg-[var(--bg)]/30 flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--fg)] flex items-center gap-2">
              <Brain className="w-4 h-4 text-[var(--fg)]" />
              <span>Previsão de 30 Dias da IA</span>
            </h2>
            <span className="px-2 py-0.5 bg-[var(--fg)] text-white text-[9px] font-bold uppercase font-mono">Ativo</span>
          </div>

          <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto justify-between">
            <p className="text-xs text-slate-600 leading-relaxed">Previsões inteligentes com base em sazonalidades históricas de carga, calendários de feriados acadêmicos e ventos locais.</p>
            
            {/* Forecast item 1 */}
            <div className="p-3.5 bg-[var(--bg)]/20 border border-[var(--fg)]/15 hover:border-[var(--fg)]/30 transition-all">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-xs font-bold text-[var(--fg)]">
                  <span>Otimização de Ciclo HVAC</span>
                </h4>
                <span className="text-xs font-bold text-green-700 font-mono">-12% Regulado</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-normal font-sans">
                Queda de temperatura externa prevista para a próxima semana no campus. Limitaremos chillers em 15%.
              </p>
            </div>

            {/* Forecast item 2 */}
            <div className="p-3.5 bg-[var(--bg)]/20 border border-[var(--fg)]/15 hover:border-[var(--fg)]/30 transition-all">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-xs font-bold text-[var(--fg)]">
                  <span>Férias Universitárias</span>
                </h4>
                <span className="text-xs font-bold text-amber-700 font-mono">Alerta de Pico</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-normal font-sans">
                Carga base continua alta no prédio central vazia durante o recesso. Redução remota sugerida.
              </p>
            </div>

            {/* Visual accuracy index */}
            <div className="pt-4 border-t border-[var(--fg)]/10">
              <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-mono uppercase font-bold">
                <span>Precisão do Modelo</span>
                <span className="text-[var(--fg)] font-bold">89%</span>
              </div>
              <div className="w-full bg-[var(--bg)] h-3 border border-[var(--fg)]/20 overflow-hidden">
                <div 
                  className="bg-[var(--fg)] h-full" 
                  style={{ width: "89%" }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Generated Reports Table */}
        <div className="bg-[var(--panel)] border border-[var(--fg)] lg:col-span-3 shadow-[4px_4px_0_0_var(--fg)]">
          <div className="p-5 border-b border-[var(--fg)] flex justify-between items-center bg-[var(--bg)]/15">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--fg)] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[var(--fg)]" />
              <span>Relatórios de Atividades Gerados</span>
            </h2>
            <button type="button" className="text-xs font-bold text-[var(--fg)] hover:underline font-mono uppercase">Ver Arquivo</button>
          </div>

          <div className="p-2">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[9px] font-bold uppercase tracking-wider text-slate-550 font-mono border-b border-[var(--fg)]/10">
              <div className="col-span-5 md:col-span-4 max-w-full">Tipo de Relatório</div>
              <div className="hidden md:block col-span-3">Data de Geração</div>
              <div className="col-span-4 md:col-span-3">Tags / Formato</div>
              <div className="col-span-3 md:col-span-2 text-right">Download</div>
            </div>

            {/* List Rows */}
            {reports.map((rep) => {
              // Translate reports types on the fly
              let displayReportType = rep.reportType;
              if (rep.reportType === "Campus HVAC Load Synthesis") {
                displayReportType = "Síntese de Carga de Climatização do Campus";
              } else if (rep.reportType === "Bimonthly Peak Diagnostics") {
                displayReportType = "Diagnóstico Bimestral de Picos de Demanda";
              } else if (rep.reportType === "Server Room Harmonic Audit") {
                displayReportType = "Auditoria Harmônica da Sala de TI/Servidores";
              }

              return (
                <div 
                  key={rep.id} 
                  className="grid grid-cols-12 gap-4 px-4 py-3.5 items-center border-t border-[var(--fg)]/10 hover:bg-[var(--bg)]/20 transition-colors group cursor-default"
                >
                  {/* Type */}
                  <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-[var(--bg)]/50 border border-[var(--fg)]/10 text-[var(--fg)] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[var(--fg)] truncate">{displayReportType}</p>
                      <p className="text-[9px] text-slate-500 md:hidden mt-0.5 font-mono">{rep.dateGenerated}</p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="hidden md:flex col-span-3 text-xs text-slate-600 font-mono">
                    {rep.dateGenerated}
                  </div>

                  {/* Status/Format */}
                  <div className="col-span-4 md:col-span-3 flex gap-2">
                    {rep.tags.map((tg, idx) => {
                      let displayTag = tg;
                      if (tg === "Economy") displayTag = "Economia";
                      if (tg === "Peak Load") displayTag = "Carga de Pico";
                      if (tg === "Harmonics") displayTag = "Harmônicas";
                      return (
                        <span key={idx} className="px-2 py-0.5 text-[9px] font-bold font-mono border border-[var(--fg)]/15 bg-[var(--bg)]/30 text-slate-700 uppercase">
                          {displayTag}
                        </span>
                      );
                    })}
                    <span className="px-2 py-0.5 text-[9px] font-bold font-mono bg-[var(--fg)] text-white uppercase hidden sm:inline-block">
                      {rep.fileType}
                    </span>
                  </div>

                  {/* Download CTA */}
                  <div className="col-span-3 md:col-span-2 text-right">
                    <button 
                      type="button" 
                      className="p-1 px-2 border border-[var(--fg)]/25 bg-[var(--panel)] text-slate-700 hover:text-[var(--fg)] hover:bg-[var(--bg)] transition-colors flex items-center justify-center w-8 h-8 ml-auto font-mono text-xs uppercase"
                      onClick={() => handleDownload(rep)}
                      title={`Download ${rep.fileType}`}
                    >
                      {downloadingId === rep.id ? (
                        <Check className="w-3.5 h-3.5 text-green-700" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
