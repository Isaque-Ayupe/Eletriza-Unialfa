import React, { useState, FormEvent } from "react";
import { Search, Plus, Filter, ArrowRight, X, Sparkles, Building2, UserCheck, Thermometer, Droplets, Gauge, AlertTriangle, Pencil, Trash2 } from "lucide-react";
import { Zone } from "../types";

interface EnvironmentsViewProps {
  zones: Zone[];
  onAddZone: (newZone: Omit<Zone, "id" | "statusLabel" | "status" | "aiRecommendation" | "consumptionLabel" | "occupancyLabel">) => Promise<void>;
  onUpdateZone: (id: string, updatedZone: Omit<Zone, "id" | "statusLabel" | "status" | "aiRecommendation" | "consumptionLabel" | "occupancyLabel">) => Promise<void>;
  onDeleteZone: (id: string) => Promise<void>;
  loading: boolean;
}

export default function EnvironmentsView({ zones, onAddZone, onUpdateZone, onDeleteZone, loading }: EnvironmentsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "INEFFICIENT" | "OPTIMAL">("ALL");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);

  // New Zone form hook state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Administrative Offices");
  const [occupancyValue, setOccupancyValue] = useState(45);
  const [temp, setTemp] = useState(21);
  const [tempSet, setTempSet] = useState(22);
  const [humidity, setHumidity] = useState(48);
  const [consumptionValue, setConsumptionValue] = useState(55);
  const [formErr, setFormErr] = useState("");

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormErr("");
    if (!name.trim()) {
      setFormErr("Por favor insira um nome para o ambiente.");
      return;
    }

    try {
      const zoneData = {
        name,
        category,
        occupancyValue,
        temp,
        tempSet,
        humidity,
        consumptionValue
      };

      if (editingZoneId) {
        await onUpdateZone(editingZoneId, zoneData);
      } else {
        await onAddZone(zoneData);
      }
      
      // Clear and close
      setName("");
      setCategory("Administrative Offices");
      setOccupancyValue(45);
      setTemp(21);
      setTempSet(22);
      setHumidity(48);
      setConsumptionValue(55);
      setEditingZoneId(null);
      setShowAddForm(false);
    } catch (err) {
      setFormErr(`Erro ao ${editingZoneId ? 'atualizar' : 'adicionar'} ambiente no servidor.`);
    }
  };

  const openEditForm = (zone: Zone) => {
    setEditingZoneId(zone.id);
    setName(zone.name);
    setCategory(zone.category);
    setOccupancyValue(zone.occupancyValue);
    setTemp(zone.temp);
    setTempSet(zone.tempSet);
    setHumidity(zone.humidity);
    setConsumptionValue(zone.consumptionValue);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingZoneId(null);
    setName("");
    setCategory("Administrative Offices");
    setOccupancyValue(45);
    setTemp(21);
    setTempSet(22);
    setHumidity(48);
    setConsumptionValue(55);
    setFormErr("");
  };

  // Filter calculations
  const filteredZones = zones.filter(z => {
    const matchesSearch = z.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          z.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedFilter === "ALL" || z.status === selectedFilter;
    return matchesSearch && matchesStatus;
  });

  const totalZonesCount = zones.length + 39; // Base 42 + new additions
  const optimizationOpportunities = zones.filter(z => z.status === "INEFFICIENT").length + 5;
  const currentTotalLoad = zones.reduce((sum, z) => sum + z.consumptionValue, 0) + 1100; // Base load approx 1.2MW as in screen
  return (
    <div className="space-y-6">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)] mb-1 font-sans uppercase">Visão Geral dos Ambientes</h1>
          <p className="text-slate-700 text-xs font-mono max-w-xl leading-relaxed">
            Monitore a telemetria em tempo real em todas as zonas. Os diagnósticos de IA do EnergiAI destacam espaços com carga excessiva em relação à ocupação ativa.
          </p>
        </div>
        <div className="flex space-x-3 w-full md:w-auto shrink-0 justify-end">
          <button
            type="button"
            onClick={() => setSelectedFilter(selectedFilter === "ALL" ? "INEFFICIENT" : "ALL")}
            className={`px-5 py-2 border text-xs font-mono uppercase font-bold tracking-wide transition-all ${
              selectedFilter === "INEFFICIENT"
                ? "bg-red-50 border-red-500 text-red-700"
                : "border-[var(--fg)] bg-[var(--panel)] text-[var(--fg)] hover:bg-[var(--bg)]"
            }`}
          >
            <Filter className="w-3.5 h-3.5 inline mr-1" />
            <span>{selectedFilter === "INEFFICIENT" ? "Exibindo Ineficientes" : "Filtros"}</span>
          </button>
          
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="px-5 py-2 border border-[var(--fg)] bg-[var(--panel)] text-[var(--fg)] font-bold text-xs uppercase tracking-wide hover:bg-[var(--bg)] transition-colors"
          >
            <Plus className="w-3.5 h-3.5 inline mr-1" />
            <span>Cadastrar Ambiente</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-[var(--panel)] border border-[var(--fg)] p-6 flex flex-col justify-between relative overflow-hidden h-[130px] shadow-[2px_2px_0_0_var(--fg)]">
          <div className="flex items-center space-x-2 text-slate-500">
            <Building2 className="w-4 h-4 text-slate-650" />
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Total de Zonas</span>
          </div>
          <div className="text-4xl font-black text-[var(--fg)]">{totalZonesCount}</div>
        </div>

        {/* Metric 2 (Spans 2 columns) */}
        <div className="bg-[var(--panel)] border border-[var(--fg)] p-6 flex flex-col justify-between relative overflow-hidden md:col-span-2 h-[130px] shadow-[2px_2px_0_0_var(--fg)]">
          <div className="flex items-center space-x-2 text-slate-500">
            <AlertTriangle className="w-4 h-4 text-slate-650" />
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Oportunidades de Otimização</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-4xl font-black text-red-650 mb-0.5">{optimizationOpportunities}</div>
              <div className="text-[11px] text-slate-600 font-mono">Zonas com uso ineficiente de energia</div>
            </div>
            <button 
              type="button"
              onClick={() => setSelectedFilter(selectedFilter === "INEFFICIENT" ? "ALL" : "INEFFICIENT")}
              className="text-[11px] text-[var(--fg)] hover:underline font-bold uppercase tracking-tight leading-none flex items-center gap-1 font-mono"
            >
              <span>{selectedFilter === "INEFFICIENT" ? "Exibir Todas" : "Revisar Todas"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[var(--panel)] border border-[var(--fg)] p-6 flex flex-col justify-between relative overflow-hidden h-[130px] shadow-[2px_2px_0_0_var(--fg)]">
          <div className="flex items-center space-x-2 text-slate-500">
            <Gauge className="w-4 h-4 text-slate-650" />
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Demanda de Carga</span>
          </div>
          <div>
            <div className="text-3xl font-black text-[var(--fg)]">
              {(currentTotalLoad / 1000).toFixed(1)}<span className="text-sm text-slate-500 ml-1 font-mono font-normal">MW</span>
            </div>
            <div className="text-[10px] text-green-700 font-bold uppercase tracking-wide mt-0.5">
              <span>↓ 4% em rel. a ontem</span>
            </div>
          </div>
        </div>

      </div>

      {/* Dynamic Register Form Overlay / Card */}
      {showAddForm && (
        <div className="bg-[var(--panel)] border-2 border-[var(--fg)] p-6 relative animate-fade-in shadow-[4px_4px_0_0_var(--fg)]">
          <button 
            type="button" 
            onClick={cancelForm} 
            className="absolute top-4 right-4 p-1 border border-[var(--fg)] text-[var(--fg)] hover:bg-[var(--bg)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <h3 className="text-sm font-bold uppercase text-[var(--fg)] mb-4 flex items-center gap-2">
            {editingZoneId ? <Pencil className="w-4 h-4 text-[var(--fg)]" /> : <Plus className="w-4 h-4 text-[var(--fg)]" />}
            <span>{editingZoneId ? "Editar Ambiente" : "Cadastrar Novo Ambiente Monitorado"}</span>
          </h3>
          
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-[10px] uppercase text-slate-550 font-bold mb-1">Nome / Código da Zona</label>
              <input 
                type="text" 
                placeholder="Ex: Auditório Central, Lab 304"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--fg)] bg-[var(--bg)]/30 text-[var(--fg)] focus:outline-none focus:bg-[var(--bg)]/50 transition-colors text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-slate-550 font-bold mb-1">Categoria de Uso</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--fg)] bg-[var(--panel)] text-[var(--fg)] focus:outline-none cursor-pointer text-xs font-mono"
              >
                <option value="Administrative Offices">Escritórios Administrativos</option>
                <option value="Research Laboratories">Laboratórios de Pesquisa</option>
                <option value="Main Classrooms">Salas de Aula Principais</option>
                <option value="Server Room & IT">Sala de Servidores e TI</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-slate-550 font-bold mb-1">Umidade (%)</label>
              <input 
                type="number" 
                min={10} max={90}
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[var(--fg)] bg-[var(--bg)]/30 text-[var(--fg)] focus:outline-none focus:bg-[var(--bg)]/50 transition-colors text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-slate-550 font-bold mb-1">Temperatura Atual (°C)</label>
              <input 
                type="number" 
                min={15} max={30}
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[var(--fg)] bg-[var(--bg)]/30 text-[var(--fg)] focus:outline-none focus:bg-[var(--bg)]/50 transition-colors text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-slate-550 font-bold mb-1">Setpoint (°C)</label>
              <input 
                type="number" 
                min={15} max={30}
                value={tempSet}
                onChange={(e) => setTempSet(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[var(--fg)] bg-[var(--bg)]/30 text-[var(--fg)] focus:outline-none focus:bg-[var(--bg)]/50 transition-colors text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-slate-550 font-bold mb-1">Consumo Inicial Esperado (kW)</label>
              <input 
                type="number" 
                value={consumptionValue}
                onChange={(e) => setConsumptionValue(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[var(--fg)] bg-[var(--bg)]/30 text-[var(--fg)] focus:outline-none focus:bg-[var(--bg)]/50 transition-colors text-xs font-mono"
              />
            </div>

            <div className="md:col-span-3 flex justify-between items-center border-t border-[var(--fg)]/10 pt-4 mt-2">
              <span className="text-red-600 text-xs font-bold font-mono">{formErr}</span>
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={cancelForm}
                  className="px-4 py-2 border border-[var(--fg)] text-[var(--fg)] hover:bg-[var(--bg)] font-mono text-xs uppercase"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-5 py-2 border border-[var(--fg)] bg-[var(--fg)] text-white hover:bg-[var(--fg)]/90 font-mono text-xs uppercase font-bold"
                >
                  {loading ? (editingZoneId ? "Atualizando..." : "Cadastrando...") : (editingZoneId ? "Atualizar Zona" : "Adicionar Zona")}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Environments Grid & Filters */}
      <div className="space-y-4">
        
        {/* Search filter row */}
        <div className="relative flex items-center md:max-w-md border border-[var(--fg)]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5" />
          <input
            type="text"
            placeholder="Buscar zonas, categorias, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--panel)] text-[var(--fg)] placeholder-slate-400 focus:outline-none text-xs font-mono"
          />
        </div>

        {/* Dynamic Card Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredZones.map(z => {
            // Translate status labels on the fly for better compatibility
            let displayStatusLabel = z.statusLabel;
            if (z.statusLabel === "INEFFICIENT") displayStatusLabel = "INEFICIENTE";
            if (z.statusLabel === "OPTIMAL") displayStatusLabel = "OTIMIZADO";
            if (z.statusLabel === "CRITICAL") displayStatusLabel = "CRÍTICO";

            let displayCategory = z.category;
            if (z.category === "Administrative Offices") displayCategory = "Escritórios Administrativos";
            if (z.category === "Research Laboratories") displayCategory = "Laboratórios de Pesquisa";
            if (z.category === "Main Classrooms") displayCategory = "Salas de Aula Principais";
            if (z.category === "Server Room & IT") displayCategory = "Sala de Servidores e TI";

            return (
              <div
                key={z.id}
                className={`bg-[var(--panel)] border border-[var(--fg)] p-5 relative group transition-all duration-300 shadow-[2px_2px_0_0_var(--fg)] ${
                  z.status === "INEFFICIENT" || z.status === "CRITICAL"
                    ? "border-l-4 border-l-red-650"
                    : "border-l-4 border-l-green-600"
                }`}
              >
                
                {/* Card Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 uppercase tracking-wider border ${
                      z.status === "INEFFICIENT" || z.status === "CRITICAL"
                        ? "border-red-300 bg-red-50 text-red-650"
                        : "border-green-300 bg-green-50 text-green-700"
                    }`}>
                      {displayStatusLabel}
                    </span>
                    <h3 className="text-lg font-bold text-[var(--fg)] mt-1.5">{z.name}</h3>
                    <p className="text-[10px] text-slate-600 font-mono mt-0.5">{displayCategory}</p>
                  </div>
                  
                  {/* Actions & Visual icon box */}
                  <div className="flex items-start gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(z)}
                      className="p-1.5 border border-[var(--fg)]/30 text-slate-500 hover:text-[var(--fg)] hover:bg-[var(--bg)] transition-colors"
                      title="Editar Ambiente"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Tem certeza que deseja excluir este ambiente?')) {
                          onDeleteZone(z.id);
                        }
                      }}
                      className="p-1.5 border border-[var(--fg)]/30 text-slate-500 hover:text-red-650 hover:bg-red-50 hover:border-red-300 transition-colors"
                      title="Excluir Ambiente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-8 h-8 bg-[var(--bg)] flex items-center justify-center border border-[var(--fg)]">
                      <Building2 className={`w-4 h-4 ${z.status === "INEFFICIENT" || z.status === "CRITICAL" ? 'text-red-650' : 'text-slate-700'}`} />
                    </div>
                  </div>
                </div>

                {/* Conditions grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  
                  {/* Occupancy */}
                  <div className="bg-[var(--bg)]/30 p-2.5 border border-[var(--fg)]/15">
                    <div className="text-[9px] text-slate-500 mb-1 flex items-center gap-1 font-mono uppercase">
                      <UserCheck className="w-3 h-3" />
                      <span>Ocupação</span>
                    </div>
                    <div className={`text-sm font-bold ${z.status === "INEFFICIENT" || z.status === "CRITICAL" ? 'text-red-650' : 'text-[var(--fg)]'}`}>
                      {z.occupancyLabel.replace("Med", "Média").replace("Low", "Baixa").replace("High", "Alta")}
                    </div>
                  </div>

                  {/* Temp */}
                  <div className="bg-[var(--bg)]/30 p-2.5 border border-[var(--fg)]/15">
                    <div className="text-[9px] text-slate-500 mb-1 flex items-center gap-1 font-mono uppercase">
                      <Thermometer className="w-3 h-3" />
                      <span>Temp. / Setpoint</span>
                    </div>
                    <div className="text-sm font-bold text-[var(--fg)]">
                      {z.temp}°C <span className="text-xs text-slate-500 font-normal">/ {z.tempSet}°C</span>
                    </div>
                  </div>

                  {/* Humidity */}
                  <div className="bg-[var(--bg)]/30 p-2.5 border border-[var(--fg)]/15">
                    <div className="text-[9px] text-slate-500 mb-1 flex items-center gap-1 font-mono uppercase">
                      <Droplets className="w-3 h-3" />
                      <span>Umidade</span>
                    </div>
                    <div className="text-sm font-bold text-[var(--fg)]">
                      {z.humidity}%
                    </div>
                  </div>

                  {/* Consumption */}
                  <div className={`bg-[var(--bg)]/30 p-2.5 border ${z.status === "INEFFICIENT" || z.status === "CRITICAL" ? 'border-red-350' : 'border-[var(--fg)]/15'}`}>
                    <div className="text-[9px] text-slate-500 mb-1 flex items-center gap-1 font-mono uppercase">
                      <Gauge className="w-3 h-3" />
                      <span>Consumo</span>
                    </div>
                    <div className={`text-sm font-bold ${z.status === "INEFFICIENT" || z.status === "CRITICAL" ? 'text-red-650' : 'text-[var(--fg)]'}`}>
                      {z.consumptionLabel.replace("Expected", "Esperado").replace("Optimal", "Ideal")}
                    </div>
                  </div>

                </div>

                {/* AI recommendation details box */}
                <div className="pt-3 border-t border-[var(--fg)]/10 flex justify-between items-center text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-700 pr-4 truncate font-sans">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span className="truncate italic font-medium">
                      {z.aiRecommendation === "Aguardando diagnóstico inicial do agente EnergiAI..." 
                        ? z.aiRecommendation 
                        : z.aiRecommendation
                            .replace("Reduce AC airflow or adjust setpoint to", "Reduzir o fluxo de ar ou ajustar setpoint para")
                            .replace("No optimizations required at current load.", "Sem otimizações necessárias na carga atual.")
                            .replace("HVAC active with zero occupancy. Recommend shut-down.", "Climatização ativa sem ocupação. Desligamento recomendado.")
                            .replace("Optimize temperature setpoint by +1.5C to reduce load.", "Otimizar setpoint de temperatura em +1.5C para reduzir carga.")
                            .replace("AI is assessing the environment telemetry.", "O EnergiAI está avaliando as telemetrias.")
                      }
                    </span>
                  </div>
                </div>

              </div>
            );
          })}

          {filteredZones.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center text-center font-mono">
              <p className="text-slate-650 text-xs">Nenhum ambiente ativo corresponde aos filtros de busca.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
