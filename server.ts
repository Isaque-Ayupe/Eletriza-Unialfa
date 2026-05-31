import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { Zone, Agent, Alert, Report, ErrorSimulationRequest } from "./src/types";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data structures
let zonesList: Zone[] = [
  {
    id: "zone-1",
    name: "Admin Block A",
    category: "Administrative Offices",
    occupancyLabel: "Low (12%)",
    occupancyValue: 12,
    temp: 21,
    tempSet: 20,
    humidity: 45,
    consumptionLabel: "High (45kW)",
    consumptionValue: 45,
    status: "INEFFICIENT",
    aiRecommendation: "Reduce HVAC load — zone is mostly empty.",
    statusLabel: "Inefficient Use"
  },
  {
    id: "zone-2",
    name: "Lab Complex C",
    category: "Research Laboratories",
    occupancyLabel: "Med (65%)",
    occupancyValue: 65,
    temp: 22,
    tempSet: 22,
    humidity: 50,
    consumptionLabel: "Expected (78kW)",
    consumptionValue: 78,
    status: "OPTIMAL",
    aiRecommendation: "Schedule matches occupancy. Maintaining optimal setpoint.",
    statusLabel: "Optimal"
  },
  {
    id: "zone-3",
    name: "Lecture Hall 101",
    category: "Main Classrooms",
    occupancyLabel: "High (95%)",
    occupancyValue: 95,
    temp: 20,
    tempSet: 20,
    humidity: 55,
    consumptionLabel: "Expected (60kW)",
    consumptionValue: 60,
    status: "OPTIMAL",
    aiRecommendation: "Class in progress. Ventilation operating at standard high-occupancy mode.",
    statusLabel: "Optimal"
  }
];

let agentsList: Agent[] = [
  {
    id: "agent-spending",
    name: "Spending Control Agent",
    type: "spending",
    status: "OPTIMIZING",
    estSavings: "15.4%",
    activeRules: 12,
    controls: [
      { id: "ctrl-ac", name: "Automated AC Adjustment", description: "Modulate based on occupancy & outside temp", enabled: true },
      { id: "ctrl-lights", name: "Dynamic Lighting Schedules", description: "Sync with academic/operational calendar", enabled: true },
      { id: "ctrl-economy", name: "Max Economy Mode", description: "Prioritize savings over strict thermal comfort", enabled: false }
    ]
  },
  {
    id: "agent-resilience",
    name: "Network Resilience Agent",
    type: "network",
    status: "MONITORING",
    failureRisk: 12,
    failureRiskLabel: "Low/Moderate",
    controls: [
      { id: "ctrl-backup", name: "Intelligent Generator Dispatch", description: "Pre-empt power sag with backup launch", enabled: true },
      { id: "ctrl-microgrid", name: "Microgrid Peak Shaving", description: "Switch to battery during critical campus peaks", enabled: false }
    ],
    networkStability: [60, 75, 65, 85, 70, 95, 90, 99.9],
    backupStatus: "STANDBY"
  }
];

let alertsList: Alert[] = [
  {
    id: "alert-1",
    title: "Spike Detected: Lab 3",
    description: "Unusual consumption pattern detected outside academic calendar hours.",
    type: "error",
    timestamp: "10 mins ago",
    isSimulated: false,
    aiDiagnostic: "High load detected inside the cleanroom. Possibly cleanroom HVAC ventilation stuck at 100% duty cycle while lab is unoccupied.",
    aiResolution: "Command sent to throttle cleanroom fan speeds to occupied level after 18:00."
  },
  {
    id: "alert-2",
    title: "Maintenance Suggested: AHU-2",
    description: "AC Unit B on Floor 2 showing decreased efficiency indices.",
    type: "info",
    timestamp: "2 hours ago",
    isSimulated: false,
    aiDiagnostic: "Coil temperature gradient indicates filter throttling. Energy efficiency index dropped by 8%.",
    aiResolution: "Maintenance ticket scheduled for routine air filter replacement."
  }
];

let reportsList: Report[] = [
  { id: "rep-1", reportType: "Managerial Overview", dateGenerated: "Oct 24, 2023 • 08:00 AM", tags: ["Monthly"], fileType: "PDF" },
  { id: "rep-2", reportType: "Consumption Details", dateGenerated: "Oct 20, 2023 • 14:30 PM", tags: ["Weekly"], fileType: "CSV" },
  { id: "rep-3", reportType: "Savings & Cost Reduction", dateGenerated: "Oct 15, 2023 • 09:15 AM", tags: ["Simulation"], fileType: "PDF" }
];

// Lazy load Gemini AI
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiInstance;
}

// 1. Health API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. Fetch all telemetry and system states
app.get("/api/telemetry", (req, res) => {
  res.json({
    zones: zonesList,
    agents: agentsList,
    alerts: alertsList,
    reports: reportsList,
    stats: {
      totalZones: zonesList.length + 39, // Base 42 as in mockup
      optimizationCount: alertsList.filter(a => a.type === "error" || a.type === "warn").length + 5,
      currentLoadKw: zonesList.reduce((acc, z) => acc + z.consumptionValue, 0) + 250, // Base calculation + dummy base load
      comfortIndex: 92
    }
  });
});

// 3. Register a new zone dynamically
app.post("/api/zones", (req, res) => {
  const { name, category, occupancyValue, temp, tempSet, humidity, consumptionValue } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: "Missing required fields: name, category" });
  }

  const id = `zone-${Date.now()}`;
  const occupancyLabel = occupancyValue < 20 ? `Low (${occupancyValue}%)` : occupancyValue < 75 ? `Med (${occupancyValue}%)` : `High (${occupancyValue}%)`;
  const consumptionLabel = consumptionValue > 60 ? `High (${consumptionValue}kW)` : `Expected (${consumptionValue}kW)`;
  const isOptimal = Math.abs(temp - tempSet) <= 1 && occupancyValue > 15;

  const newZone: Zone = {
    id,
    name,
    category,
    occupancyLabel,
    occupancyValue: Number(occupancyValue) || 0,
    temp: Number(temp) || 22,
    tempSet: Number(tempSet) || 22,
    humidity: Number(humidity) || 50,
    consumptionLabel,
    consumptionValue: Number(consumptionValue) || 45,
    status: isOptimal ? "OPTIMAL" : "INEFFICIENT",
    aiRecommendation: isOptimal 
      ? "Operating within range. Maintaining smart schedule."
      : "Adjust setpoint to match thermal load — possible waste.",
    statusLabel: isOptimal ? "Optimal" : "Inefficient Use"
  };

  zonesList.push(newZone);
  res.status(201).json({ success: true, zone: newZone });
});

// Update an existing zone dynamically
app.put("/api/zones/:id", (req, res) => {
  const zoneId = req.params.id;
  const { name, category, occupancyValue, temp, tempSet, humidity, consumptionValue } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: "Missing required fields: name, category" });
  }

  const zoneIndex = zonesList.findIndex(z => z.id === zoneId);
  if (zoneIndex === -1) {
    return res.status(404).json({ error: "Zone not found" });
  }

  const occupancyLabel = occupancyValue < 20 ? `Low (${occupancyValue}%)` : occupancyValue < 75 ? `Med (${occupancyValue}%)` : `High (${occupancyValue}%)`;
  const consumptionLabel = consumptionValue > 60 ? `High (${consumptionValue}kW)` : `Expected (${consumptionValue}kW)`;
  const isOptimal = Math.abs(temp - tempSet) <= 1 && occupancyValue > 15;

  const updatedZone: Zone = {
    ...zonesList[zoneIndex],
    name,
    category,
    occupancyLabel,
    occupancyValue: Number(occupancyValue) || 0,
    temp: Number(temp) || 22,
    tempSet: Number(tempSet) || 22,
    humidity: Number(humidity) || 50,
    consumptionLabel,
    consumptionValue: Number(consumptionValue) || 45,
    status: isOptimal ? "OPTIMAL" : "INEFFICIENT",
    aiRecommendation: isOptimal 
      ? "Operating within range. Maintaining smart schedule."
      : "Adjust setpoint to match thermal load — possible waste.",
    statusLabel: isOptimal ? "Optimal" : "Inefficient Use"
  };

  zonesList[zoneIndex] = updatedZone;
  res.status(200).json({ success: true, zone: updatedZone });
});

app.delete("/api/zones/:id", (req, res) => {
  const zoneId = req.params.id;
  const zoneIndex = zonesList.findIndex(z => z.id === zoneId);
  if (zoneIndex !== -1) {
    zonesList.splice(zoneIndex, 1);
  }
  res.status(200).json({ success: true });
});

// 4. Update Agent Settings / Toggles
app.post("/api/agents/toggle", (req, res) => {
  const { agentId, controlId, enabled } = req.body;
  const agent = agentsList.find(a => a.id === agentId);
  if (!agent) {
    return res.status(404).json({ error: "Agent not found" });
  }

  const ctrl = agent.controls.find(c => c.id === controlId);
  if (!ctrl) {
    return res.status(404).json({ error: "Control setting not found" });
  }

  ctrl.enabled = enabled;
  
  // Dynamic rules calculation
  if (agentId === "agent-spending") {
    agent.activeRules = agent.controls.filter(c => c.enabled).length * 4;
    agent.estSavings = agent.controls.find(c => c.id === "ctrl-economy")?.enabled ? "21.6%" : "15.4%";
    agent.status = agent.controls.some(c => c.enabled) ? "OPTIMIZING" : "INACTIVE";
  } else if (agentId === "agent-resilience") {
    agent.backupStatus = agent.controls.find(c => c.id === "ctrl-backup")?.enabled ? "STANDBY" : "ACTIVE";
    agent.status = agent.controls.some(c => c.enabled) ? "MONITORING" : "INACTIVE";
  }

  res.json({ success: true, agent });
});

// 5. Simulate Scenario (or Generate System Error)
app.post("/api/error-simulation", async (req, res) => {
  const { anomalyType, zoneId, severity, notes } = req.body as ErrorSimulationRequest;
  
  if (!anomalyType || !zoneId) {
    return res.status(400).json({ error: "Faltando parâmetros: anomalyType ou zoneId" });
  }

  const zone = zonesList.find(z => z.id === zoneId) || { name: "Zona Campus Geral", category: "Serviços Gerais" };

  const alertId = `sim-alert-${Date.now()}`;
  let alertTitle = `Simulação: ${anomalyType} detectado`;
  let alertDesc = `Comportamento anômalo na instalação ${zone.name} (${zone.category}). severity: ${severity}.`;
  
  let defaultDiagnostic = "Simulação de Anomalia de telemetria geral. Os parâmetros estão fora das metas ambientais aceitáveis, gerando desperdício e potencial desgaste do equipamento.";
  let defaultResolution = "Ajuste preventivo realizado via agente EnergiAI. Redução de ganho de damper e monitoramento térmico ativo.";
  let defaultImpact = "Aumento esperado de 15% na economia ao conter a quebra sazonal.";

  const aiClient = getGeminiClient();
  let usedAi = false;
  let aiData = { diagnostic: defaultDiagnostic, actionTaken: defaultResolution, savingsImpact: defaultImpact };

  if (aiClient) {
    try {
      const prompt = `Analise a seguinte simulação de erro/anomalia em um prédio inteligente e gere:
1. Um diagnóstico de engenharia detalhado (em português).
2. Uma resolução/ação imediata recomendada ou executada automaticamente pelo agente de IA (em português).
3. O impacto estimado de consumo de energia ou economia (em português).

Parâmetros da simulação:
- Tipo de anomalia: ${anomalyType}
- Zona climatizada: ${zone.name} (${zone.category})
- Severidade: ${severity}
- Notas adicionais: ${notes || "Nenhuma"}

Retorne a resposta EXCLUSIVAMENTE em formato JSON com esses campos:
{
  "diagnostic": "...",
  "actionTaken": "...",
  "savingsImpact": "..."
}`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              diagnostic: { type: Type.STRING },
              actionTaken: { type: Type.STRING },
              savingsImpact: { type: Type.STRING }
            },
            required: ["diagnostic", "actionTaken", "savingsImpact"]
          }
        }
      });

      if (response && response.text) {
        const result = JSON.parse(response.text.trim());
        aiData = result;
        usedAi = true;
      }
    } catch (e) {
      console.error("Erro ao chamar o Gemini API:", e);
      // Fallback to rich preconfigured options depending on selection
    }
  }

  if (!usedAi) {
    // Generate specialized fallback simulations
    if (anomalyType.includes("AC") || anomalyType.includes("HVAC")) {
      aiData.diagnostic = `Superaquecimento ou sobrecarga no fan coil principal do ${zone.name}. A taxa de ocupação não justifica a demanda extrema medida.`;
      aiData.actionTaken = `Comando automático de modulação de válvula fracionária enviado. Redução de vazão de água gelada em 30%.`;
      aiData.savingsImpact = `Economia de contenção de pico estimada em 12kW imediatamente.`;
    } else if (anomalyType.includes("Iluminação") || anomalyType.includes("Luz")) {
      aiData.diagnostic = `Luzes de emergência e salas operacionais do ${zone.name} permanecem 100% ativas fora de hora, com zero movimentação registrada pelo sensor de ocupação.`;
      aiData.actionTaken = `Agente disparou override forçando ciclo noturno em 10% da potência de iluminação.`;
      aiData.savingsImpact = `Redução contínua de 4.5kW de consumo contínuo.`;
    } else {
      aiData.diagnostic = `Aumento inesperado detectado no perfil de consumo elétrico de suporte elétrico em ${zone.name}.`;
      aiData.actionTaken = `Instanciado ciclo de mitigação de carga secundária e relatórios emitidos para equipe técnica.`;
      aiData.savingsImpact = `Estabilização do sistema principal para evitar sobrecarga sob risco de fator de potência.`;
    }
  }

  // Define new alert
  const newAlert: Alert = {
    id: alertId,
    title: alertTitle,
    description: alertDesc,
    type: severity === "critical" || severity === "high" ? "error" : "warn",
    timestamp: "Just now",
    isSimulated: true,
    aiDiagnostic: aiData.diagnostic,
    aiResolution: aiData.actionTaken
  };

  // Add the alert to our list
  alertsList.unshift(newAlert);

  // If there's a corresponding zone, make it "CRITICAL" or "INEFFICIENT"
  const targetZoneIndex = zonesList.findIndex(z => z.id === zoneId);
  if (targetZoneIndex !== -1) {
    zonesList[targetZoneIndex].status = severity === "critical" || severity === "high" ? "CRITICAL" : "INEFFICIENT";
    zonesList[targetZoneIndex].statusLabel = severity === "critical" || severity === "high" ? "Critical Error" : "Inefficient Use";
    zonesList[targetZoneIndex].consumptionLabel = `Alert (${zonesList[targetZoneIndex].consumptionValue + 30}kW)`;
    zonesList[targetZoneIndex].consumptionValue += 30; // Simulate consumption surge!
    zonesList[targetZoneIndex].aiRecommendation = `AI Rec: ${aiData.actionTaken}`;
  }

  res.status(200).json({
    success: true,
    alert: newAlert,
    aiFeedback: aiData
  });
});

// Vite Middleware for Development / Static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[EnergiAI Backend] Rodando em http://localhost:${PORT}`);
  });
}

startServer();
