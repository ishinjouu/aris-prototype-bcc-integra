// ============================================================
// ARIS Dashboard – Dummy Data (no backend, no DB)
// All state that needs CRUD is handled via localStorage.
// ============================================================

export type RiskLevel = "High" | "Medium" | "Low";
export type EquipmentType = "Compressor" | "Pump" | "Turbine" | "Heat Exchanger";
export type Area = "Production" | "Ethylene" | "Reformer" | "Utilities";
export type ActionStatus = "Open" | "In Progress" | "Not Started" | "Completed";
export type OperationalStatus = "Normal" | "Warning" | "Emerging Risk" | "Maintenance";

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  area: Area;
  riskLevel: RiskLevel;
  impactScore: number;
  detectedDate: string;
  estRSL: string; // Estimated Remaining Service Life
  healthIndex: number;
  currentVibration: number; // µm
  alarmThreshold: number;   // µm
  trend5Day: number;        // percentage change
  equipmentCriticality: "High" | "Medium" | "Low";
  productionDependency: "High" | "Medium" | "Low";
  estimatedDowntime: string;
  historicalLossExposure: string;
  lastUpdated: string;
  operationalStatus: OperationalStatus;
  production: number; // percentage
  lossRiskEstimation: number; // USD
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

export interface HistoryEntry {
  id: string;
  equipmentId: string;
  equipmentName: string;
  area: Area;
  incidentId: string;
  rootCause: string;
  action: string;
  downtime: string;
  loss: string;
  matchPercentage: number;
  date: string;
  pattern: string;
}

export interface ProductionTrendPoint {
  month: string;
  value: number;
}

// ─── Equipment / Risk Data ───────────────────────────────────
export const equipmentData: Equipment[] = [
  {
    id: "KO-3201",
    name: "KO-3201",
    type: "Compressor",
    area: "Production",
    riskLevel: "High",
    impactScore: 87,
    detectedDate: "May 1, 2026",
    estRSL: "28 hours",
    healthIndex: 87,
    currentVibration: 52,
    alarmThreshold: 60,
    trend5Day: 86,
    equipmentCriticality: "High",
    productionDependency: "High",
    estimatedDowntime: "24 – 32 hours",
    historicalLossExposure: "$1.58 million",
    lastUpdated: "May 1, 2026 08:00",
    operationalStatus: "Warning",
    production: 94,
    lossRiskEstimation: 62000,
  },
  {
    id: "P-1102",
    name: "P-1102",
    type: "Pump",
    area: "Ethylene",
    riskLevel: "Medium",
    impactScore: 65,
    detectedDate: "May 1, 2026",
    estRSL: "24 hours",
    healthIndex: 72,
    currentVibration: 38,
    alarmThreshold: 50,
    trend5Day: 22,
    equipmentCriticality: "Medium",
    productionDependency: "Medium",
    estimatedDowntime: "12 – 18 hours",
    historicalLossExposure: "$0.85 million",
    lastUpdated: "May 1, 2026 08:00",
    operationalStatus: "Emerging Risk",
    production: 88,
    lossRiskEstimation: 38000,
  },
  {
    id: "E-2201",
    name: "E-2201",
    type: "Heat Exchanger",
    area: "Reformer",
    riskLevel: "Medium",
    impactScore: 58,
    detectedDate: "May 1, 2026",
    estRSL: "22 hours",
    healthIndex: 68,
    currentVibration: 29,
    alarmThreshold: 45,
    trend5Day: 14,
    equipmentCriticality: "Medium",
    productionDependency: "Medium",
    estimatedDowntime: "10 – 16 hours",
    historicalLossExposure: "$0.62 million",
    lastUpdated: "May 1, 2026 08:00",
    operationalStatus: "Normal",
    production: 91,
    lossRiskEstimation: 28000,
  },
  {
    id: "T-2301",
    name: "T-2301",
    type: "Compressor",
    area: "Reformer",
    riskLevel: "Medium",
    impactScore: 42,
    detectedDate: "May 1, 2026",
    estRSL: "24 hours",
    healthIndex: 75,
    currentVibration: 21,
    alarmThreshold: 40,
    trend5Day: 8,
    equipmentCriticality: "Low",
    productionDependency: "Medium",
    estimatedDowntime: "8 – 12 hours",
    historicalLossExposure: "$0.41 million",
    lastUpdated: "May 1, 2026 08:00",
    operationalStatus: "Normal",
    production: 96,
    lossRiskEstimation: 18000,
  },
];

// ─── Action Follow-Up (default, overridden by localStorage) ──
export const defaultActionFollowUps: ActionFollowUp[] = [
  {
    id: "ACT-001",
    equipmentId: "KO-3201",
    status: "Open",
    title: "Inspect and service KO-3201 lube-oil cooler",
    description:
      "Perform inspection and cleaning of the lube-oil cooler. Additionally, take a lube-oil sample and overall oil condition.",
    priority: "High",
    recommendedWindow: "Apr 28, 2026",
    estimatedDuration: "4 – 6 Hours",
    assignedTo: "Maintenance Team",
    expectedBenefits: [
      "Prevent unplanned trip",
      "Avoid 24 – 32 hours downtime",
      "Reduce potential loss of $1.58 million",
    ],
    notes:
      "Approved. Please coordinate with maintenance team and ensure lube-oil sampling is included. Update the status after inspection.",
    createdAt: "2026-05-01T08:00:00",
    updatedAt: "2026-05-01T08:00:00",
  },
  {
    id: "ACT-002",
    equipmentId: "P-1102",
    status: "In Progress",
    title: "Vibration analysis and bearing inspection – P-1102",
    description:
      "Conduct detailed vibration spectrum analysis and inspect pump bearings for wear patterns.",
    priority: "Medium",
    recommendedWindow: "Apr 29, 2026",
    estimatedDuration: "2 – 3 Hours",
    assignedTo: "Reliability Team",
    expectedBenefits: [
      "Prevent bearing failure",
      "Avoid 12 – 18 hours downtime",
      "Reduce potential loss of $0.85 million",
    ],
    notes: "",
    createdAt: "2026-05-01T09:00:00",
    updatedAt: "2026-05-01T10:00:00",
  },
  {
    id: "ACT-003",
    equipmentId: "E-2201",
    status: "Not Started",
    title: "Heat exchanger fouling inspection – E-2201",
    description:
      "Perform tube bundle inspection and clean fouling deposits to restore heat transfer efficiency.",
    priority: "Medium",
    recommendedWindow: "Apr 30, 2026",
    estimatedDuration: "6 – 8 Hours",
    assignedTo: "Maintenance Team",
    expectedBenefits: [
      "Restore efficiency",
      "Avoid 10 – 16 hours downtime",
      "Reduce potential loss of $0.62 million",
    ],
    notes: "",
    createdAt: "2026-05-01T09:30:00",
    updatedAt: "2026-05-01T09:30:00",
  },
  {
    id: "ACT-004",
    equipmentId: "T-2301",
    status: "Completed",
    title: "T-2301 compressor seal replacement",
    description: "Replace worn shaft seals and verify alignment post-replacement.",
    priority: "Low",
    recommendedWindow: "Apr 25, 2026",
    estimatedDuration: "3 – 4 Hours",
    assignedTo: "Maintenance Team",
    expectedBenefits: [
      "Prevent gas leakage",
      "Avoid 8 – 12 hours downtime",
      "Reduce potential loss of $0.41 million",
    ],
    notes: "Completed on schedule.",
    createdAt: "2026-04-24T08:00:00",
    updatedAt: "2026-04-25T16:00:00",
  },
  {
    id: "ACT-005",
    equipmentId: "KO-3201",
    status: "Completed",
    title: "KO-3201 routine oil change",
    description: "Routine lube-oil change as per maintenance schedule.",
    priority: "Low",
    recommendedWindow: "Apr 10, 2026",
    estimatedDuration: "2 – 3 Hours",
    assignedTo: "Maintenance Team",
    expectedBenefits: ["Maintain lubrication quality", "Extend equipment life"],
    notes: "Completed on time.",
    createdAt: "2026-04-09T08:00:00",
    updatedAt: "2026-04-10T14:00:00",
  },
  {
    id: "ACT-006",
    equipmentId: "P-1102",
    status: "Completed",
    title: "P-1102 seal flush system check",
    description: "Check and recalibrate seal flush system flow rates.",
    priority: "Medium",
    recommendedWindow: "Apr 15, 2026",
    estimatedDuration: "1 – 2 Hours",
    assignedTo: "Reliability Team",
    expectedBenefits: ["Prevent seal failure", "Extend MTBF"],
    notes: "Flushing flow restored to spec.",
    createdAt: "2026-04-14T10:00:00",
    updatedAt: "2026-04-15T12:00:00",
  },
  {
    id: "ACT-007",
    equipmentId: "E-2201",
    status: "Completed",
    title: "E-2201 pressure drop monitoring",
    description: "Install temporary differential pressure gauges for continuous monitoring.",
    priority: "Low",
    recommendedWindow: "Apr 18, 2026",
    estimatedDuration: "3 – 4 Hours",
    assignedTo: "Instrumentation Team",
    expectedBenefits: ["Early detection of fouling", "Planned maintenance scheduling"],
    notes: "Gauges installed, baseline recorded.",
    createdAt: "2026-04-17T08:00:00",
    updatedAt: "2026-04-18T15:00:00",
  },
];

// ─── Historical Cases ─────────────────────────────────────────
export const historicalCases: HistoryEntry[] = [
  {
    id: "H-001",
    equipmentId: "KO-3201",
    equipmentName: "KO-3102 (Compressor)",
    area: "Production",
    incidentId: "INC-184",
    rootCause: "Water contamination in lube oil",
    action: "Lube-oil cooler inspection & servicing",
    downtime: "32 hours",
    loss: "$1.58 million",
    matchPercentage: 92,
    date: "Jan 15, 2026",
    pattern: "Progressive vibration increase",
  },
  {
    id: "H-002",
    equipmentId: "P-1102",
    equipmentName: "P-1102 (Pump)",
    area: "Ethylene",
    incidentId: "INC-176",
    rootCause: "Bearing wear – inadequate lubrication",
    action: "Bearing replacement & alignment check",
    downtime: "18 hours",
    loss: "$0.72 million",
    matchPercentage: 78,
    date: "Oct 22, 2025",
    pattern: "Intermittent vibration spikes",
  },
  {
    id: "H-003",
    equipmentId: "E-2201",
    equipmentName: "E-2201 (Heat Exchanger)",
    area: "Reformer",
    incidentId: "INC-169",
    rootCause: "Tube fouling – process scale buildup",
    action: "Chemical cleaning of tube bundle",
    downtime: "24 hours",
    loss: "$0.55 million",
    matchPercentage: 85,
    date: "Aug 10, 2025",
    pattern: "Gradual efficiency loss",
  },
  {
    id: "H-004",
    equipmentId: "T-2301",
    equipmentName: "T-2301 (Compressor)",
    area: "Reformer",
    incidentId: "INC-155",
    rootCause: "Seal degradation – high temperature",
    action: "Seal replacement & thermal monitoring",
    downtime: "14 hours",
    loss: "$0.38 million",
    matchPercentage: 71,
    date: "Jun 3, 2025",
    pattern: "Rising seal temperature",
  },
  {
    id: "H-005",
    equipmentId: "KO-3201",
    equipmentName: "KO-3201 (Compressor)",
    area: "Production",
    incidentId: "INC-141",
    rootCause: "Lube oil viscosity degradation",
    action: "Oil change & cooler cleaning",
    downtime: "8 hours",
    loss: "$0.29 million",
    matchPercentage: 65,
    date: "Mar 18, 2025",
    pattern: "Minor vibration fluctuation",
  },
  {
    id: "H-006",
    equipmentId: "P-1102",
    equipmentName: "P-1102 (Pump)",
    area: "Ethylene",
    incidentId: "INC-133",
    rootCause: "Cavitation – suction pressure drop",
    action: "Suction line inspection & valve adjustment",
    downtime: "6 hours",
    loss: "$0.18 million",
    matchPercentage: 58,
    date: "Jan 5, 2025",
    pattern: "High-frequency noise pattern",
  },
];

// ─── Operational Status History ────────────────────────────────
export const operationalStatusHistory: Record<OperationalStatus, number> = {
  Normal: 12,
  Warning: 4,
  "Emerging Risk": 3,
  Maintenance: 2,
};

// ─── Production Trend (monthly) ───────────────────────────────
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

// ─── Operational Status Bar Chart (monthly) ───────────────────
export const statusBarChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  normal:    [3, 2, 3, 2, 3, 3, 2, 3, 3],
  warning:   [1, 1, 0, 2, 1, 0, 1, 1, 1],
  emerging:  [0, 1, 1, 0, 1, 1, 0, 0, 1],
  maintenance:[0, 0, 1, 0, 0, 0, 1, 0, 0],
};

// ─── Plant-level KPIs ─────────────────────────────────────────
export const plantKPIs = {
  healthIndex: 87,
  healthIndexChange: 2,
  criticalAlerts: 3,
  criticalAlertsChange: 1,
  production: 94,
  productionChange: 1.5,
  lossRiskEstimation: 62000,
  lossRiskChange: -18,
};

// ─── AI Brief ────────────────────────────────────────────────
export const aiBrief = {
  insightCount: 1,
  label: "high-priority insight",
  alert: {
    id: "KO-3201",
    label: "Emergency Risk",
    severity: "High" as const,
    description:
      "Abnormal vibration detected on KO-3201. Potential risk of unplanned trip.",
    hoursAgo: 3,
  },
};
