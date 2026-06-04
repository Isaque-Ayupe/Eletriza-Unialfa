import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Building2, 
  Cpu, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Brain, 
  Bell, 
  Menu, 
  X,
  PlayCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { Zone, Agent, Alert, Report } from "./types";

import DashboardView from "./components/DashboardView";
import EnvironmentsView from "./components/EnvironmentsView";
import AgentsView from "./components/AgentsView";
import ReportsView from "./components/ReportsView";
import SettingsView from "./components/SettingsView";
import SimulationModal from "./components/SimulationModal";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "environments" | "agents" | "reports" | "settings">("dashboard");
  const [zones, setZones] = useState<Zone[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({
    totalZones: 42,
    optimizationCount: 7,
    currentLoadKw: 342,
    comfortIndex: 92
  });

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Custom Toaster for Simulated Error resolution
  const [toast, setToast] = useState<{ show: boolean; title: string; diagnostic: string } | null>(null);

  // Sync telemetry list
  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/telemetry");
      if (!response.ok) throw new Error("Erro de conexão com o painel.");
      const data = await response.json();
      setZones(data.zones || []);
      setAgents(data.agents || []);
      setAlerts(data.alerts || []);
      setReports(data.reports || []);
      setStats(data.stats || {
        totalZones: 42,
        optimizationCount: 7,
        currentLoadKw: 342,
        comfortIndex: 92
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Não foi possível carregar as informações do sistema.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  // Post new dynamic zone to host backend
  const handleAddZone = async (newZoneData: Omit<Zone, "id" | "statusLabel" | "status" | "aiRecommendation" | "consumptionLabel" | "occupancyLabel">) => {
    setLoading(true);
    try {
      const response = await fetch("/api/zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newZoneData)
      });
      if (!response.ok) throw new Error("Ocorreu um erro ao salvar o novo ambiente.");
      
      // Re-fetch telemetry
      await fetchTelemetry();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateZone = async (id: string, updateData: Omit<Zone, "id" | "statusLabel" | "status" | "aiRecommendation" | "consumptionLabel" | "occupancyLabel">) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/zones/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      });
      if (!response.ok) throw new Error("Ocorreu um erro ao atualizar o ambiente.");
      
      await fetchTelemetry();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteZone = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/zones/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Ocorreu um erro ao excluir o ambiente.");
      
      await fetchTelemetry();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Control hooks
  const handleToggleControl = async (agentId: string, controlId: string, enabled: boolean) => {
    setLoading(true);
    try {
      const response = await fetch("/api/agents/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, controlId, enabled })
      });
      if (!response.ok) throw new Error("Não foi possível alterar as diretrizes do agente.");
      
      // Update locally or refetch
      await fetchTelemetry();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulationSuccess = (feedback: any, alertTitle: string) => {
    // Show local custom diagnostic Toaster
    setToast({
      show: true,
      title: alertTitle,
      diagnostic: feedback.diagnostic
    });
    
    // Auto-hide toast after 8 seconds
    setTimeout(() => {
      setToast(null);
    }, 9000);

    // Dynamic refetch immediately update alerts feed and charts
    fetchTelemetry();
    setActiveTab("dashboard");
  };

  // Manager profile avatar found in mockup pictures
  const managerAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuDUUYHY7MSm13kUQUafYwlq7aDEgksRGsnBi93gcS7tayBVVwTvKGligVWev-jyAf2-g6bwP-IkJCaZaioU8-05JOP2jJpW-4xHL0CpBDrRUMThVZiMrMosLdf0Q0JJgdf0axxGFIqAC6K1Fl6VjIEQ51jOClT4IMQl79WQcDx1AFg6N5uFMBQLiEUWLZhsmEHHhxxgtQ_oK0L9vn3Ph4F2xmoUo5cVSwExKcxjnNHXzS41HNWfYbEH_DA987esZCjkcj-fM4_SJmM";

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex font-sans selection:bg-[var(--fg)]/10 selection:text-[var(--fg)] relative overflow-x-hidden">
      
      {/* 1. Global Custom AI Toast Alert Notification in High Density styling */}
      {toast?.show && (
        <div className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-[100] max-w-sm sm:max-w-md bg-[var(--panel)] border border-[var(--fg)] p-5 shadow-[4px_4px_0_0_var(--fg)] animate-slide-in">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 text-[var(--fg)]">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h4 className="text-xs uppercase font-extrabold tracking-wider font-display">Simulador IA Ativo</h4>
            </div>
            <button 
              type="button" 
              onClick={() => setToast(null)}
              className="p-0.5 rounded text-slate-500 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <h5 className="font-bold text-xs text-[var(--fg)] mb-1.5">{toast.title}</h5>
          <p className="text-[11px] text-[var(--fg)] leading-normal bg-[var(--bg)]/45 p-3 border border-[var(--fg)]/20">
            <strong>Análise (Gemini):</strong> {toast.diagnostic}
          </p>
        </div>
      )}

      {/* 2. Persistent Sidebar Navigation (Desktop) */}
      <nav className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[var(--bg)] border-r border-[var(--fg)] z-40 py-6">
        
        {/* Branding header in brutalist style */}
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-5 h-5 bg-[var(--fg)]"></div>
          <span className="text-[15px] font-bold text-[var(--fg)] uppercase tracking-widest font-display">EnergiAI</span>
        </div>

        {/* Manager User Profile Card */}
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3 p-3 border border-[var(--fg)] bg-[var(--panel)]">
            <div className="w-10 h-10 rounded-none overflow-hidden border border-[var(--fg)]">
              <img 
                referrerPolicy="no-referrer"
                src={managerAvatar} 
                alt="Manager Headshot" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-headline font-bold text-xs text-[var(--fg)] truncate">Unialfa Energy</h3>
              <p className="font-sans text-[10px] text-slate-500">Gestor predial</p>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <ul className="flex-1 px-3 space-y-1 text-sm font-bold uppercase tracking-wider">
          <li>
            <button
              type="button"
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center px-4 py-2.5 transition-all gap-3 ${
                activeTab === "dashboard"
                  ? "bg-[var(--fg)] text-[var(--bg)]"
                  : "text-[var(--fg)] opacity-50 hover:opacity-100 hover:bg-[#D4D3D0]"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-[11px]">Painel Geral</span>
            </button>
          </li>
          
          <li>
            <button
              type="button"
              onClick={() => setActiveTab("environments")}
              className={`w-full flex items-center px-4 py-2.5 transition-all gap-3 ${
                activeTab === "environments"
                  ? "bg-[var(--fg)] text-[var(--bg)]"
                  : "text-[var(--fg)] opacity-50 hover:opacity-100 hover:bg-[#D4D3D0]"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span className="text-[11px]">Ambientes</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              onClick={() => setActiveTab("agents")}
              className={`w-full flex items-center px-4 py-2.5 transition-all gap-3 ${
                activeTab === "agents"
                  ? "bg-[var(--fg)] text-[var(--bg)]"
                  : "text-[var(--fg)] opacity-50 hover:opacity-100 hover:bg-[#D4D3D0]"
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span className="text-[11px]">Agentes IA</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              onClick={() => setActiveTab("reports")}
              className={`w-full flex items-center px-4 py-2.5 transition-all gap-3 ${
                activeTab === "reports"
                  ? "bg-[var(--fg)] text-[var(--bg)]"
                  : "text-[var(--fg)] opacity-50 hover:opacity-100 hover:bg-[#D4D3D0]"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-[11px]">Relatórios</span>
            </button>
          </li>
          
          <li>
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center px-4 py-2.5 transition-all gap-3 ${
                activeTab === "settings"
                  ? "bg-[var(--fg)] text-[var(--bg)]"
                  : "text-[var(--fg)] opacity-50 hover:opacity-100 hover:bg-[#D4D3D0]"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="text-[11px]">Configurações</span>
            </button>
          </li>
        </ul>

        {/* Bottom CTA & Options */}
        <div className="mt-auto p-4 border-t border-[var(--fg)] border-opacity-10">
          <button 
            type="button"
            onClick={() => setShowSimulateModal(true)}
            className="w-full flex items-center justify-between p-2.5 border border-red-300 bg-red-50 hover:bg-red-600 hover:text-white group transition-all text-red-700 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 group-hover:text-white" />
              <span className="text-[10px] uppercase font-bold tracking-wider">
                Simular Anomalia
              </span>
            </div>
            <PlayCircle className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:text-white" />
          </button>
          <p className="text-[9px] text-slate-500 mt-2 font-mono text-center">
            Testar respostas da Inteligência Artificial
          </p>
        </div>

      </nav>

      {/* 4. Responsive Header (Mobile) */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 h-14 w-full bg-[var(--bg)] border-b border-[var(--fg)]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[var(--fg)]"></div>
          <span className="text-sm font-black tracking-widest text-[var(--fg)] font-display">EnergiAI</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowSimulateModal(true)}
            className="p-1 px-2 border border-red-500 text-red-600 bg-red-50 font-bold text-[10px] uppercase"
            title="Simular Anomalia"
          >
            SYS_ERR
          </button>
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[var(--fg)] hover:text-black transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* 5. Mobile Drawer Overlay Navigation */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40 pt-14 flex justify-end animate-fade-in">
          <div className="w-64 bg-[var(--bg)] h-full p-6 border-l border-[var(--fg)] flex flex-col justify-between">
            <div className="space-y-6">
              {/* User overview */}
              <div className="flex items-center gap-3 pb-4 border-b border-[var(--fg)]/10">
                <img 
                  referrerPolicy="no-referrer"
                  src={managerAvatar} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-none border border-[var(--fg)]"
                />
                <div>
                  <h4 className="text-[var(--fg)] font-bold text-xs">Unialfa Energy</h4>
                  <p className="text-[10px] text-slate-500">Gestor de Instalações</p>
                </div>
              </div>

              {/* Navigation list */}
              <ul className="space-y-2 text-xs font-bold uppercase tracking-wider">
                <li>
                  <button
                    type="button"
                    onClick={() => { setActiveTab("dashboard"); setSidebarOpen(false); }}
                    className={`w-full text-left px-4 py-2 rounded-none transition ${activeTab === "dashboard" ? 'bg-[var(--fg)] text-white' : 'text-[var(--fg)]'}`}
                  >
                    Painel Geral
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => { setActiveTab("environments"); setSidebarOpen(false); }}
                    className={`w-full text-left px-4 py-2 rounded-none transition ${activeTab === "environments" ? 'bg-[var(--fg)] text-white' : 'text-[var(--fg)]'}`}
                  >
                    Ambientes prediais
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => { setActiveTab("agents"); setSidebarOpen(false); }}
                    className={`w-full text-left px-4 py-2 rounded-none transition ${activeTab === "agents" ? 'bg-[var(--fg)] text-white' : 'text-[var(--fg)]'}`}
                  >
                    Agentes IA
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => { setActiveTab("reports"); setSidebarOpen(false); }}
                    className={`w-full text-left px-4 py-2 rounded-none transition ${activeTab === "reports" ? 'bg-[var(--fg)] text-white' : 'text-[var(--fg)]'}`}
                  >
                    Relatórios
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }}
                    className={`w-full text-left px-4 py-2 rounded-none transition ${activeTab === "settings" ? 'bg-[var(--fg)] text-white' : 'text-[var(--fg)]'}`}
                  >
                    Configurações
                  </button>
                </li>
              </ul>
            </div>

            {/* Simulated Error CTA */}
            <div className="space-y-3 pt-4 border-t border-[var(--fg)]/10">
              <button
                type="button"
                onClick={() => { setShowSimulateModal(true); setSidebarOpen(false); }}
                className="w-full flex items-center justify-between p-2.5 border border-red-300 bg-red-50 hover:bg-red-600 hover:text-white group transition-all text-red-700 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 group-hover:text-white" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    Simular Anomalia
                  </span>
                </div>
                <PlayCircle className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Main Scrollable Content Container */}
      <div className="flex-1 flex flex-col md:ml-64 relative min-h-screen">
        <main className="flex-1 p-5 sm:p-8 pt-20 md:pt-8 pb-10 flex flex-col">
          {errorMsg ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-sm border border-[var(--fg)] p-6 bg-[var(--panel)] shadow-[2px_2px_0_0_var(--fg)]">
                <p className="text-red-650 font-bold mb-2">Conexão Off-line</p>
                <p className="text-xs text-slate-550 mb-4">{errorMsg}</p>
                <button 
                  type="button" 
                  onClick={fetchTelemetry}
                  className="px-4 py-2 bg-[var(--fg)] text-[var(--bg)] text-xs font-bold uppercase transition"
                >
                  Tentar Sincronizar
                </button>
              </div>
            </div>
          ) : (
            /* Render Active View Tab */
            <div className="flex-1">
              {activeTab === "dashboard" && (
                <DashboardView
                  zones={zones}
                  agents={agents}
                  alerts={alerts}
                  stats={stats}
                  onSimulateClick={() => setShowSimulateModal(true)}
                  onRefresh={fetchTelemetry}
                  loading={loading}
                />
              )}
              
              {activeTab === "environments" && (
                <EnvironmentsView
                  zones={zones}
                  stats={stats}
                  onAddZone={handleAddZone}
                  onUpdateZone={handleUpdateZone}
                  onDeleteZone={handleDeleteZone}
                  loading={loading}
                />
              )}

              {activeTab === "agents" && (
                <AgentsView
                  agents={agents}
                  onToggleControl={handleToggleControl}
                  loading={loading}
                />
              )}

              {activeTab === "reports" && (
                <ReportsView
                  reports={reports}
                  stats={stats}
                />
              )}

              {activeTab === "settings" && (
                <SettingsView 
                  theme={document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'}
                  onThemeChange={(theme) => {
                    if (theme === 'dark') {
                      document.documentElement.setAttribute('data-theme', 'dark');
                    } else {
                      document.documentElement.removeAttribute('data-theme');
                    }
                  }}
                />
              )}
            </div>
          )}
        </main>

        {/* Footer Bar designed carefully from theme template */}
        <footer className="h-8 border-t border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)] flex items-center px-4 text-[9px] font-mono justify-between mt-auto">
          <div className="flex space-x-4">
            <span>EnergiAI@MICROGRID:~# status</span>
            <span className="opacity-55">ESTAVEL_V2</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span> TELEMETRIA ATIVA
            </span>
            <span>LATENCIA: 14ms</span>
          </div>
        </footer>
      </div>

      {/* 7. Bottom Navigation Bar (Mobile Helper) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center h-16 bg-[var(--bg)] border-t border-[var(--fg)] px-4">
        <button
          type="button"
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center justify-center p-2.5 ${activeTab === "dashboard" ? 'text-black font-extrabold scale-105' : 'text-[var(--fg)] opacity-55'}`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] uppercase tracking-tighter font-bold">Painel</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("environments")}
          className={`flex flex-col items-center justify-center p-2.5 ${activeTab === "environments" ? 'text-black font-extrabold scale-105' : 'text-[var(--fg)] opacity-55'}`}
        >
          <Building2 className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] uppercase tracking-tighter font-bold">Ambientes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("agents")}
          className={`flex flex-col items-center justify-center p-2.5 ${activeTab === "agents" ? 'text-black font-extrabold scale-105' : 'text-[var(--fg)] opacity-55'}`}
        >
          <Cpu className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] uppercase tracking-tighter font-bold">Agentes IA</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reports")}
          className={`flex flex-col items-center justify-center p-2.5 ${activeTab === "reports" ? 'text-black font-extrabold scale-105' : 'text-[var(--fg)] opacity-55'}`}
        >
          <BarChart3 className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] uppercase tracking-tighter font-bold">Relatórios</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`flex flex-col items-center justify-center p-2.5 ${activeTab === "settings" ? 'text-black font-extrabold scale-105' : 'text-[var(--fg)] opacity-55'}`}
        >
          <Settings className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] uppercase tracking-tighter font-bold">Ajustes</span>
        </button>
      </nav>

      {/* 8. Simulation Modal Trigger */}
      <SimulationModal
        isOpen={showSimulateModal}
        onClose={() => setShowSimulateModal(false)}
        zones={zones}
        onSimulationSuccess={handleSimulationSuccess}
      />

    </div>
  );
}
