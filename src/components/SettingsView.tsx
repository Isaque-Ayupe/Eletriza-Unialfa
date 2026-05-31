import { Settings, Moon, Sun, CheckCircle } from "lucide-react";

interface SettingsViewProps {
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
}

export default function SettingsView({ theme, onThemeChange }: SettingsViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold uppercase tracking-widest text-[var(--fg)] font-display flex items-center gap-3">
          <Settings className="w-6 h-6" />
          Configurações do Sistema
        </h1>
        <p className="text-xs text-slate-500 max-w-2xl font-mono uppercase tracking-tight">
          Ajuste as preferências de inferência de arquitetura.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-[var(--panel)] border border-[var(--fg)] p-6 shadow-[4px_4px_0_0_var(--fg)]">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--fg)] border-b border-[var(--fg)]/20 pb-3 mb-6">
            Aparência (Interface UI)
          </h2>
          
          <div className="flex flex-col gap-4">
            <label className="text-[10px] uppercase font-bold text-slate-650 font-mono">Modo de Exibição / Tema</label>
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => onThemeChange("light")}
                className={`flex-1 flex flex-col items-center justify-center p-6 border transition-all ${
                  theme === "light" 
                    ? "bg-[var(--fg)] border-[var(--fg)] text-[var(--bg)]" 
                    : "bg-[var(--bg)] border-[var(--fg)]/30 text-[var(--fg)] opacity-70 hover:opacity-100"
                }`}
              >
                <Sun className="w-8 h-8 mb-3" />
                <span className="font-bold uppercase text-xs tracking-wider">Modo Claro</span>
                {theme === "light" && <CheckCircle className="w-4 h-4 mt-2" />}
              </button>

              <button 
                type="button"
                onClick={() => onThemeChange("dark")}
                className={`flex-1 flex flex-col items-center justify-center p-6 border transition-all ${
                  theme === "dark" 
                    ? "bg-[var(--fg)] border-[var(--fg)] text-[var(--bg)]" 
                    : "bg-[var(--bg)] border-[var(--fg)]/30 text-[var(--fg)] opacity-70 hover:opacity-100 hover:bg-black/10"
                }`}
              >
                <Moon className="w-8 h-8 mb-3" />
                <span className="font-bold uppercase text-xs tracking-wider">Modo Escuro</span>
                {theme === "dark" && <CheckCircle className="w-4 h-4 mt-2" />}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[var(--panel)] border border-[var(--fg)] p-6 shadow-[4px_4px_0_0_var(--fg)]">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--fg)] border-b border-[var(--fg)]/20 pb-3 mb-6">
            Preferências de Agentes IA
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-[var(--fg)]/10 bg-[var(--bg)]">
              <div>
                <p className="text-xs font-bold uppercase text-[var(--fg)]">Confirmação de Ações Críticas</p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">Exigir aprovação manual antes da IA alterar parâmetros &gt; 15%</p>
              </div>
              <input type="checkbox" className="w-5 h-5 accent-[var(--fg)]" defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border border-[var(--fg)]/10 bg-[var(--bg)]">
              <div>
                <p className="text-xs font-bold uppercase text-[var(--fg)]">Notificações Sonoras de Telemetria</p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">Emitir bipe curto em anomalias de sensores (Prioridade Crítica)</p>
              </div>
              <input type="checkbox" className="w-5 h-5 accent-[var(--fg)]" />
            </div>
            
            <div className="flex items-center justify-between p-4 border border-[var(--fg)]/10 bg-[var(--bg)]">
              <div>
                <p className="text-xs font-bold uppercase text-[var(--fg)]">Modo Offline (Agentes Locais)</p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">Habilitar rede neural leve local quando sem conexão com API principal</p>
              </div>
              <div className="px-3 py-1 bg-[var(--fg)] text-[var(--bg)] text-[10px] font-bold uppercase tracking-widest font-mono">
                Padrão (LIGADO)
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border border-dashed border-[var(--fg)]/30 text-center bg-[var(--panel)]/50">
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
            EnergiAI Core v1.0.4 — Conectado ao cluster central
          </p>
        </div>
      </div>
    </div>
  );
}
