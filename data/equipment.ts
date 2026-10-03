// ============================================================
// ARIS Dashboard – Data Integration (JSON + Computed)
// Formula-based calculations per specification
// Filtered to 5 target equipment only
// ============================================================

import incidentDbRaw from "./Incident Database raw.json";
import equipmentPerfRaw from "./Equipment Performance raw- RCA2 KO-3201.json";
import productionRaw from "./Production Data raw- RCA2 KO-3201.json";

export type RiskLevel = "High" | "Medium" | "Low";
export type EquipmentType = "Compressor" | "Pump" | "Turbine" | "Heat Exchanger" | "Blower";
export type Area = "Production" | "Ethylene" | "Reformer" | "Utilities" | "ZCU" | "OPP" | "ARP" | "NUP";
export type ActionStatus = "Open" | "In Progress" | "Not Started" | "Completed";
export type OperationalStatus = "Normal" | "Warning" | "Emerging Risk" | "Maintenance";

// Target equipment to filter
const TARGET_EQUIPMENT = ["KO-3201", "BL-5702", "PU-2101B", "HE-3301", "PM-4405B"];

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  area: Area;
  riskLevel: RiskLevel;
  impactScore: number;
  detectedDate: string;
  estRSL: string;
  healthIndex: number;
  currentVibration: number;
  alarmThreshold: number;
  trend5Day: number;
  equipmentCriticality: "High" | "Medium" | "Low";
  productionDependency: "High" | "Medium" | "Low";
  estimatedDowntime: string;
  historicalLossExposure: string;
  lastUpdated: string;
  operationalStatus: OperationalStatus;
  production: number;
  lossRiskEstimation: number;
}

export interface ActionFollowUp {
  id: string;
  equipmentId: string;
  status: ActionStatus;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  recommendedWindow: string;
  estimatedDuration: string;
  assignedTo: string;
  expectedBenefits: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductionTrendPoint {
  month: string;
  value: number;
}

export interface IncidentRecord {
  serialNo: number;
  mtoNo: string;
  arNo: string;
  plant: string;
  tagNumber: string;
  eqClass: string;
  dateOfOccur: string;
  riskTitle: string;
  highestImpact: string;
  preRisk: string;
  riskScore: number;
  pic: string;
  overallStatus: string;
  discipline: string;
  eqType: string;
  component: string;
  fMechanism: string;
  downtimeHrs: number;
  actualLossKUSD: number;
  potentialLossKUSD: number;
  totalLossKUSD: number;
  rcaDueDate: string;
  monthYear: string;
}

export interface EquipmentPerformanceRow {
  week: number;
  date: string;
  deRadialVibration: number;
  lubeOilWaterContent: number;
  lubeOilSupplyPress: number;
  bearingMetalTemp: number;
  healthStatus: string;
}

export interface ProductionDataRow {
  timestamp: string;
  ko3201Feed: number;
  ko3201Disp: number;
  ko3201Vib: number;
  ko3201Temp: number;
  ko3201Amp: number;
  plantRate: number;
  runStatus: string;
}

// ─── Parse JSON Data with Filtering ───────────────────────────
function parseIncidentDatabase(): IncidentRecord[] {
  const records: IncidentRecord[] = [];
  const data = Array.isArray(incidentDbRaw) ? incidentDbRaw : [];
  
  for (let i = 2; i < data.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row: any = data[i];
    // const row: any = data[i];
    if (!row || row["EQUIPMENT RELATED RISK — INCIDENT DATABASE (RCA & CAPA/PAA)"] === null) continue;
    
    const tagNumber = row["Unnamed: 4"] || "";
    
    // Filter: only include target equipment
    if (!TARGET_EQUIPMENT.includes(tagNumber)) continue;
    
    records.push({
      serialNo: row["EQUIPMENT RELATED RISK — INCIDENT DATABASE (RCA & CAPA/PAA)"] || i - 2,
      mtoNo: row["Unnamed: 1"] || "",
      arNo: row["Unnamed: 2"] || "",
      plant: row["Unnamed: 3"] || "",
      tagNumber: tagNumber,
      eqClass: row["Unnamed: 5"] || "",
      dateOfOccur: row["Unnamed: 6"] || "",
      riskTitle: row["Unnamed: 7"] || "",
      highestImpact: row["Unnamed: 8"] || "",
      preRisk: row["Unnamed: 9"] || "",
      riskScore: row["Unnamed: 10"] || 0,
      pic: row["Unnamed: 11"] || "",
      overallStatus: row["Unnamed: 12"] || "",
      discipline: row["Unnamed: 13"] || "",
      eqType: row["Unnamed: 14"] || "",
      component: row["Unnamed: 15"] || "",
      fMechanism: row["Unnamed: 16"] || "",
      downtimeHrs: row["Unnamed: 17"] || 0,
      actualLossKUSD: row["Unnamed: 18"] || 0,
      potentialLossKUSD: row["Unnamed: 19"] || 0,
      totalLossKUSD: row["Unnamed: 20"] || 0,
      rcaDueDate: row["Unnamed: 21"] || "",
      monthYear: row["Unnamed: 22"] || "",
    });
  }
  
  return records;
}

function parseEquipmentPerformance(): EquipmentPerformanceRow[] {
  const data = Array.isArray(equipmentPerfRaw) ? equipmentPerfRaw : [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((row: any) => ({
    week: row.Week,
    date: row.Date,
    deRadialVibration: row["DE Radial Vibration\n(micron)"] || 0,
    lubeOilWaterContent: row["Lube Oil Water Content\n(ppm)"] || 0,
    lubeOilSupplyPress: row["Lube Oil Supply Press\n(barg)"] || 0,
    bearingMetalTemp: row["Bearing Metal Temp\n(°C)"] || 0,
    healthStatus: row["Health Status"] || "",
  }));
}

function parseProductionData(): ProductionDataRow[] {
  const data = Array.isArray(productionRaw) ? productionRaw : [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((row: any) => ({
    timestamp: row.Timestamp,
    ko3201Feed: row.KO3201_FEED || 0,
    ko3201Disp: row.KO3201_DISP || 0,
    ko3201Vib: row.KO3201_VIB || 0,
    ko3201Temp: row.KO3201_TEMP || 0,
    ko3201Amp: row.KO3201_AMP || 0,
    plantRate: row.PLANT_RATE || 0,
    runStatus: row.RUN_STATUS || "",
  }));
}

const parsedIncidents = parseIncidentDatabase();
const parsedEquipPerf = parseEquipmentPerformance();
const parsedProduction = parseProductionData();

// ==========================================
// 1. HEADER KPI METRICS
// ==========================================

/**
 * Total Historical Losses ($M)
 * Source: Incident Database (5 target equipment) -> SUM(Total Loss (k US$)) / 1000
 */
export function calculateHistoricalLosses(): string {
  const sumKUSD = parsedIncidents.reduce((acc, row) => acc + (row.totalLossKUSD || 0), 0);
  return (sumKUSD / 1000).toFixed(1);
}

/**
 * Active Exposure for Target Asset KO-3201 ($M)
 * Source: Incident Database (KO-3201 only) -> SUM(Total Loss (k US$)) / 1000
 */
export function calculateActiveExposure(tagNumber: string = "KO-3201"): string {
  const sumKUSD = parsedIncidents
    .filter(row => row.tagNumber === tagNumber)
    .reduce((acc, row) => acc + (row.totalLossKUSD || 0), 0);
  return (sumKUSD / 1000).toFixed(2);
}

/**
 * Total Downtime Hours (5 target equipment)
 * Source: Incident Database -> SUM(Downtime (hrs))
 */
export function calculateTotalDowntime(): string {
  const sumHours = parsedIncidents.reduce((acc, row) => acc + (row.downtimeHrs || 0), 0);
  return sumHours.toLocaleString('en-US', { minimumFractionDigits: 1 });
}

/**
 * Energy & Carbon Avoidance Proxy
 * Source: Production Data (Avg Amp) & Equipment Performance (Avoided Flaring)
 */
export function calculateEnergyAndCarbon(downtimeHours: number = 32.0) {
  const runningRows = parsedProduction.filter(row => row.runStatus === 'ON');
  const avgAmp = runningRows.length > 0 
    ? runningRows.reduce((acc, row) => acc + row.ko3201Amp, 0) / runningRows.length
    : 129.2;
  
  const avoidedCO2e = downtimeHours * 38.75;
  
  return {
    amp: avgAmp.toFixed(1),
    co2e: Math.round(avoidedCO2e).toLocaleString('en-US')
  };
}

// ==========================================
// 2. AI PRIORITIZED RISK STACK
// ==========================================

/**
 * Get Top 5 Risks from 5 target equipment sorted by Risk Score DESC
 */
export type StackRiskLevel = "HIGH" | "MEDIUM" | "LOW";

export interface RiskStackItem {
  tagNumber: string;
  plant: string;
  riskCase: string;
  impact: string;
  riskScore: number;
  potentialLossMUSD: string;
  level: StackRiskLevel;
  dateOfOccur: string;
  overallStatus: string;
  eqType: string;
}

const CLASS_TO_LEVEL: Record<string, StackRiskLevel> = {
  A: "HIGH",
  B: "MEDIUM",
  C: "LOW",
};

function mapEqClassToLevel(eqClass: string): StackRiskLevel {
  return CLASS_TO_LEVEL[eqClass] || "MEDIUM";
}

function stackLevelToRiskLevel(level: StackRiskLevel): RiskLevel {
  if (level === "HIGH") return "High";
  if (level === "LOW") return "Low";
  return "Medium";
}

function mapEqType(eqType: string): EquipmentType {
  const known: EquipmentType[] = ["Compressor", "Pump", "Turbine", "Heat Exchanger", "Blower"];
  return (known.find((t) => t.toLowerCase() === eqType.toLowerCase()) ?? "Compressor");
}

function mapOperationalStatus(overallStatus: string): OperationalStatus {
  const status = overallStatus.toUpperCase();
  if (status.includes("CLOSED")) return "Normal";
  if (status.includes("CANCELED") || status.includes("CANCELLED")) return "Maintenance";
  if (status.includes("NEW")) return "Emerging Risk";
  return "Warning";
}

function incidentToEquipment(row: IncidentRecord): Equipment {
  const level = mapEqClassToLevel(row.eqClass);
  return {
    id: row.tagNumber,
    name: row.riskTitle || row.tagNumber,
    type: mapEqType(row.eqType),
    area: (row.plant as Area) || "Production",
    riskLevel: stackLevelToRiskLevel(level),
    impactScore: row.riskScore || 0,
    detectedDate: row.dateOfOccur || "—",
    estRSL: `${row.downtimeHrs || 16} hrs`,
    healthIndex: Math.max(0, 100 - (row.riskScore || 0)),
    currentVibration: 71.67,
    alarmThreshold: 45,
    trend5Day: 18,
    equipmentCriticality: stackLevelToRiskLevel(level),
    productionDependency: stackLevelToRiskLevel(level),
    estimatedDowntime: `${row.downtimeHrs || 16} hrs`,
    historicalLossExposure: `$${((row.totalLossKUSD || 0) / 1000).toFixed(2)}M`,
    lastUpdated: row.dateOfOccur || "—",
    operationalStatus: mapOperationalStatus(row.overallStatus),
    production: 0,
    lossRiskEstimation: (row.potentialLossKUSD || 0) / 1000,
  };
}

/**
 * Get Top 5 Risks from 5 target equipment sorted by Risk Score DESC
 */
export function getRiskStack(): RiskStackItem[] {
  return [...parsedIncidents]
    .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
    .slice(0, 5)
    .map((row) => ({
      tagNumber: row.tagNumber,
      plant: row.plant,
      riskCase: row.riskTitle,
      impact: row.highestImpact,
      riskScore: row.riskScore,
      potentialLossMUSD: (row.potentialLossKUSD / 1000).toFixed(2),
      level: mapEqClassToLevel(row.eqClass),
      dateOfOccur: row.dateOfOccur || "—",
      overallStatus: row.overallStatus || "",
      eqType: row.eqType || "",
    }));
}

/** Unique target equipment, keeping the highest-score incident per tag. */
function buildEquipmentData(): Equipment[] {
  const byTag = new Map<string, IncidentRecord>();
  for (const row of parsedIncidents) {
    const prev = byTag.get(row.tagNumber);
    if (!prev || (row.riskScore || 0) > (prev.riskScore || 0)) {
      byTag.set(row.tagNumber, row);
    }
  }
  return Array.from(byTag.values()).map(incidentToEquipment);
}

// ==========================================
// 3. EARLY WARNING TELEMETRY
// ==========================================

export function getCriticalTelemetry() {
  const row = parsedEquipPerf[parsedEquipPerf.length - 1];
  if (!row) {
    return {
      vibration: { value: "71.67", status: "TRIP" },
      waterContent: { value: "1,372.8", status: "TRIP" },
      bearingTemp: { value: "107.1", status: "TRIP" },
      oilPress: { value: "1.12", status: "TRIP" }
    };
  }
  
  return {
    vibration: {
      value: row.deRadialVibration.toFixed(2),
      status: row.deRadialVibration >= 75 ? 'TRIP' : row.deRadialVibration >= 45 ? 'ALARM' : 'NORMAL'
    },
    waterContent: {
      value: row.lubeOilWaterContent.toFixed(1),
      status: row.lubeOilWaterContent >= 1500 ? 'TRIP' : row.lubeOilWaterContent >= 500 ? 'ALARM' : 'NORMAL'
    },
    bearingTemp: {
      value: row.bearingMetalTemp.toFixed(1),
      status: row.bearingMetalTemp >= 110 ? 'TRIP' : row.bearingMetalTemp >= 95 ? 'ALARM' : 'NORMAL'
    },
    oilPress: {
      value: row.lubeOilSupplyPress.toFixed(2),
      status: row.lubeOilSupplyPress <= 1.1 ? 'TRIP' : row.lubeOilSupplyPress <= 1.4 ? 'ALARM' : 'NORMAL'
    }
  };
}

// ==========================================
// 4. ACTION FOLLOW-UP STATUS AGGREGATION
// ==========================================

/**
 * Get Action Follow-Up counts from 5 target equipment
 * Source: Incident Database (5 equipment) -> GROUP BY Overall Status -> COUNT()
 */
export function getActionFollowUpCounts() {
  const statusMap: Record<string, number> = {};
  
  parsedIncidents.forEach(row => {
    const status = row.overallStatus;
    statusMap[status] = (statusMap[status] || 0) + 1;
  });
  
  return statusMap;
}

// ─── Legacy Data (backward compatibility) ──────────────────────
export const equipmentData: Equipment[] = buildEquipmentData();
export const defaultActionFollowUps: ActionFollowUp[] = [];
// export const historicalCases: any[] = [];
export interface HistoricalCase {
  equipmentId: string;
  incidentId: string;
  matchPercentage: number;
  equipmentName: string;
  pattern: string;
  rootCause: string;
  action: string;
  downtime: string;
  loss: string;
}

export const historicalCases: HistoricalCase[] = [];
export const operationalStatusHistory: Record<OperationalStatus, number> = {
  Normal: 12,
  Warning: 4,
  "Emerging Risk": 3,
  Maintenance: 2,
};
export const productionTrendData: ProductionTrendPoint[] = [
  { month: "Jan", value: 91 },
  { month: "Feb", value: 88 },
  { month: "Mar", value: 93 },
  { month: "Apr", value: 85 },
  { month: "May", value: 90 },
  { month: "Jun", value: 87 },
  { month: "Jul", value: 94 },
  { month: "Aug", value: 89 },
  { month: "Sep", value: 94 },
];
export const statusBarChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  normal:    [3, 2, 3, 2, 3, 3, 2, 3, 3],
  warning:   [1, 1, 0, 2, 1, 0, 1, 1, 1],
  emerging:  [0, 1, 1, 0, 1, 1, 0, 0, 1],
  maintenance:[0, 0, 1, 0, 0, 0, 1, 0, 0],
};

export const aiBrief = {
  insightCount: 1,
  label: "high-priority insight",
  alert: {
    id: "KO-3201",
    label: "Emergency Risk",
    severity: "High" as const,
    description: "DE Radial Vibration 71.67 µm (Alarm 45 µm, Trip 75 µm) with Lube Oil Water Content 1,372.8 ppm",
    hoursAgo: 3,
    telemetry: {
      deRadialVibration: 71.67,
      lubeOilWaterContent: 1372.8,
      bearingMetalTemp: 107.1,
      lubeOilSupplyPress: 1.12,
    },
    references: {
      ar: "AR-2026-ZCU-0142",
      mto: "MTO-2026-ZCU-0058",
    },
  },
};

// Export target equipment list for reference
export { TARGET_EQUIPMENT };