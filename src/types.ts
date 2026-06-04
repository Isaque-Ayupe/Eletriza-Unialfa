/**
 * types.ts
 * Shared TypeScript types for EnergiAI.
 */

export interface ControlSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface Agent {
  id: string;
  name: string;
  type: 'spending' | 'network';
  status: 'OPTIMIZING' | 'MONITORING' | 'INACTIVE';
  estSavings?: string;
  activeRules?: number;
  failureRisk?: number;
  failureRiskLabel?: string;
  controls: ControlSetting[];
  networkStability?: number[];
  backupStatus?: 'STANDBY' | 'ACTIVE';
}

export interface Zone {
  id: string;
  name: string;
  category: string;
  occupancyLabel: string;
  occupancyValue: number; // e.g. 12
  temp: number;
  tempSet: number;
  humidity: number;
  consumptionLabel: string;
  consumptionValue: number; // e.g. 45 kW
  status: 'INEFFICIENT' | 'OPTIMAL' | 'CRITICAL';
  aiRecommendation: string;
  statusLabel: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'error' | 'warn' | 'info';
  timestamp: string;
  isSimulated?: boolean;
  aiDiagnostic?: string;
  aiResolution?: string;
}

export interface Report {
  id: string;
  reportType: string;
  dateGenerated: string;
  tags: string[];
  fileType: 'PDF' | 'CSV';
  downloadUrl?: string;
}

export interface ErrorSimulationResponse {
  success: boolean;
  alert: Alert;
  aiFeedback?: {
    diagnostic: string;
    actionTaken: string;
    savingsImpact: string;
  };
}
