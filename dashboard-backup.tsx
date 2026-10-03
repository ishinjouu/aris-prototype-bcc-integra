"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  DollarSign,
  AlertCircle,
  Clock,
  RefreshCw,
  Zap,
  BrainCircuit,
} from "lucide-react";
import AIAvatar, { type AvatarSkin } from "@/components/AIAvatar";
import {
  productionTrendData,
  calculateHistoricalLosses,
  calculateActiveExposure,
  calculateTotalDowntime,
  calculateEnergyAndCarbon,
  getRiskStack,
  getActionFollowUpCounts,
} from "@/data/equipment";
import ProductionTrendChart from "@/components/charts/ProductionTrendChart";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const SKINS: AvatarSkin[] = ["orb", "robot", "ghost"];
const SKIN_LABELS: Record<AvatarSkin, string> = { orb: "Orb", robot: "Robot", ghost: "Ghost" };
const LEVEL_ORDER: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

const RISK_BADGE: Record<string, string> = {
  HIGH:   "bg-rose-100 text-rose-700 border border-rose-200",
  MEDIUM: "bg-amber-100 text-amber-700 border border-amber-200",
  LOW:    "bg-emerald-100 text-emerald-700 border border-emerald-200",
};

const ACTION_COUNT_PILL: Record<string, string> = {
  "CA/PA EXECUTION":   "bg-amber-100  text-amber-800",
  "MONITORING RESULT": "bg-violet-100 text-violet-800",
  "NEW REGISTERED":    "bg-sky-100    text-sky-800",
  "RCA PROCESS":       "bg-blue-100   text-blue-800",
  "RISK CANCELED":     "bg-rose-100   text-rose-800",
  "RISK CLOSED":       "bg-emerald-100 text-emerald-800",
};

const ACTION_STATUSES = [
  "CA/PA EXECUTION",
  "MONITORING RESULT",
  "NEW REGISTERED",
  "RCA PROCESS",
  "RISK CANCELED",
  "RISK CLOSED",
];

export default function DashboardPage() {
  const [skin, setSkin] = useState<AvatarSkin>("orb");
  // const [kpiMetrics, setKpiMetrics] = useState({
  //   historicalLosses: "–",
  //   activeExposure: "–",
  //   totalDowntime: "–",
  //   energy: { amp: "–", co2e: "–" },
  // });
  // const [riskStack, setRiskStack] = useState<any[]>([]);
  // const [actionCounts, setActionCounts] = useState<Record<string, number>>({});

  // useEffect(() => {
  //   setKpiMetrics({
  //     historicalLosses: calculateHistoricalLosses(),
  //     activeExposure:   calculateActiveExposure("KO-3201"),
  //     totalDowntime:    calculateTotalDowntime(),
  //     energy:           calculateEnergyAndCarbon(32.0),
  //   });
  //   const stack = getRiskStack().sort(
  //     (a, b) => (LEVEL_ORDER[a.level] ?? 9) - (LEVEL_ORDER[b.level] ?? 9)
  //   );
  //   setRiskStack(stack);
  //   setActionCounts(getActionFollowUpCounts());
  // }, []);
  const kpiMetrics = useMemo(() => ({
    historicalLosses: calculateHistoricalLosses(),
    activeExposure:   calculateActiveExposure("KO-3201"),
    totalDowntime:    calculateTotalDowntime(),
    energy:           calculateEnergyAndCarbon(32.0),
  }), []);
  const riskStack = useMemo(
    () => getRiskStack().sort(
      (a, b) => (LEVEL_ORDER[a.level] ?? 9) - (LEVEL_ORDER[b.level] ?? 9)
    ),
    []
  );
  const actionCounts = useMemo(() => getActionFollowUpCounts(), []);

  const severityCounts = {
    HIGH:   riskStack.filter(r => r.level === "HIGH").length,
    MEDIUM: riskStack.filter(r => r.level === "MEDIUM").length,
    LOW:    riskStack.filter(r => r.level === "LOW").length,
  };

  // Bar chart data for severity
  const severityChartData = {
    labels: ["High", "Medium", "Low"],
    datasets: [{
      data: [severityCounts.HIGH, severityCounts.MEDIUM, severityCounts.LOW],
      backgroundColor: ["#fb7185", "#fbbf24", "#34d399"],
      borderRadius: 6,
      borderSkipped: false,
    }],
  };
  const severityChartOptions: ChartOptions<"bar"> = {
  // const severityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 }, color: "#9ca3af" } },
      y: { grid: { color: "#f3f4f6" }, ticks: { stepSize: 1, font: { size: 11 }, color: "#9ca3af" } },
    },
  };

  return (
    <div
      className="flex-1 min-h-0 grid grid-cols-12 gap-3 p-4 bg-gray-50 overflow-hidden"
      style={{ gridTemplateRows: "1fr auto" }}
    >

      {/* ══ AI BRIEF — Col 1–3 ══ */}
      <div className="col-span-12 lg:col-span-3 lg:row-start-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col min-h-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <BrainCircuit size={14} className="text-gray-400" />
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">AI Brief</span>
          </div>
          <Link
            href="/ai-summary"
            className="text-[11px] font-medium text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg transition-colors"
          >
            See More →
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {riskStack.map((risk) => (
            <Link
              key={risk.tagNumber}
              href={`/ai-summary/${risk.tagNumber}`}
              className="block rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs space-y-1.5 hover:border-gray-300 hover:bg-white transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-gray-800">{risk.tagNumber}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${RISK_BADGE[risk.level] ?? "bg-gray-100 text-gray-600"}`}>
                  {risk.level}
                </span>
              </div>
              <p className="text-gray-600 line-clamp-2 leading-relaxed">{risk.riskCase}</p>
              <p className="text-gray-400 text-[10px]">{risk.impact}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ══ PLANT OPERATIONAL HEALTH — Col 4–9 ══ */}
      <div className="col-span-12 lg:col-span-6 lg:row-start-1 bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3 min-h-0 overflow-hidden">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 flex-shrink-0">
          Plant Operational Health
        </p>

        {/* KPI 4-box */}
        <div className="grid grid-cols-4 gap-2 flex-shrink-0">
          {[
            { label: "Historical Losses", value: `$${kpiMetrics.historicalLosses}M`, icon: DollarSign,  color: "text-emerald-500" },
            { label: "Active Exposure",   value: `$${kpiMetrics.activeExposure}M`,   icon: AlertCircle, color: "text-amber-500"   },
            { label: "Total Downtime",    value: `${kpiMetrics.totalDowntime} hrs`,  icon: Clock,       color: "text-slate-400"   },
            { label: "Energy Avoidance",  value: `${kpiMetrics.energy.co2e} CO₂e`,  icon: Zap,         color: "text-sky-400"     },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <Icon size={12} className={color} />
                <span className="truncate">{label}</span>
              </div>
              <p className="text-sm font-bold text-gray-800">{value}</p>
            </div>
          ))}
        </div>

        {/* AI Risk Stack table */}
        <div className="flex-1 min-h-0 flex flex-col border-t border-gray-100 pt-2 overflow-hidden">
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">AI Risk Stack</p>
            <Link
              href="/ai-summary"
              className="text-[11px] font-medium text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg transition-colors"
            >
              See All →
            </Link>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-white">
                <tr className="text-[11px] text-gray-400 border-b border-gray-100">
                  <th className="text-left py-2 px-2 font-semibold">Equipment</th>
                  <th className="text-left py-2 px-2 font-semibold">Plant</th>
                  <th className="text-left py-2 px-2 font-semibold">Risk Case</th>
                  <th className="text-left py-2 px-2 font-semibold">Impact</th>
                  <th className="text-center py-2 px-2 font-semibold">Score</th>
                  <th className="text-center py-2 px-2 font-semibold">Level</th>
                  <th className="text-right py-2 px-2 font-semibold">Pot. Loss</th>
                </tr>
              </thead>
              <tbody>
                {riskStack.map((risk) => (
                  <tr key={risk.tagNumber} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2 px-2">
                      <Link href={`/ai-summary/${risk.tagNumber}`} className="font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                        {risk.tagNumber}
                      </Link>
                    </td>
                    <td className="py-2 px-2 text-gray-400">{risk.plant}</td>
                    <td className="py-2 px-2 text-gray-600"><div className="line-clamp-2">{risk.riskCase}</div></td>
                    <td className="py-2 px-2 text-gray-600"><div className="line-clamp-2">{risk.impact}</div></td>
                    <td className="py-2 px-2 text-center font-semibold text-gray-700">{risk.riskScore}</td>
                    <td className="py-2 px-2 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${RISK_BADGE[risk.level] ?? "bg-gray-100 text-gray-600"}`}>
                        {risk.level}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-right font-semibold text-amber-600">${risk.potentialLossMUSD}M</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ══ MONITOR — Col 10–12, spans 2 rows ══ */}
      <div className="col-span-12 lg:col-span-3 lg:row-span-2 lg:row-start-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col min-h-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 flex-shrink-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Monitor</p>
          <button
            onClick={() => setSkin(prev => SKINS[(SKINS.indexOf(prev) + 1) % SKINS.length])}
            className="text-[11px] text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
          >
            <RefreshCw size={11} />
            {SKIN_LABELS[skin]}
          </button>
        </div>

        {/* Avatar */}
        <div className="flex-shrink-0 flex items-center justify-center py-5 bg-gray-50 border-b border-gray-100">
          <AIAvatar status="critical" size="sm" skin={skin} />
        </div>

        {/* Action Follow-Up — fills remaining space */}
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-2 space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Action Follow-Up</p>
          {ACTION_STATUSES.map((status) => (
            <div
              key={status}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-700"
            >
              <span className="font-medium">{status}</span>
              <span className={`min-w-[1.5rem] text-center rounded-md px-1.5 py-0.5 text-[11px] font-bold ${ACTION_COUNT_PILL[status] ?? "bg-gray-100 text-gray-700"}`}>
                {actionCounts[status] ?? 0}
              </span>
            </div>
          ))}
        </div>

        {/* View Analysis pinned to bottom */}
        <div className="flex-shrink-0 px-4 pb-4 pt-2 border-t border-gray-100">
          <Link
            href="/ai-summary"
            className="block w-full text-center bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
          >
            View Analysis
          </Link>
        </div>
      </div>

      {/* ══ PRODUCTION TREND — Col 1–3, Row 2 ══ */}
      <div className="col-span-12 lg:col-span-3 lg:row-start-2 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Production Trend</p>
          <select className="text-[11px] border border-gray-200 rounded-md px-2 py-1 text-gray-500 bg-white focus:outline-none">
            <option>2026</option>
            <option>2025</option>
          </select>
        </div>
        <div className="h-32">
          <ProductionTrendChart data={productionTrendData} />
        </div>
      </div>

      {/* ══ OPERATIONAL STATUS HISTORY — Col 4–9, Row 2 ══ */}
      <div className="col-span-12 lg:col-span-6 lg:row-start-2 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Operational Status History</p>
        <div className="flex gap-4 h-36">
          {/* 3 stacked cards */}
          <div className="flex flex-col gap-2 w-44 flex-shrink-0">
            {[
              { label: "High",   count: severityCounts.HIGH,   bg: "bg-rose-50",    border: "border-rose-100",    dot: "bg-rose-400",    num: "text-rose-700"    },
              { label: "Medium", count: severityCounts.MEDIUM, bg: "bg-amber-50",   border: "border-amber-100",   dot: "bg-amber-400",   num: "text-amber-700"   },
              { label: "Low",    count: severityCounts.LOW,    bg: "bg-emerald-50", border: "border-emerald-100", dot: "bg-emerald-400", num: "text-emerald-700" },
            ].map(({ label, count, bg, border, dot, num }) => (
              <div key={label} className={`flex-1 rounded-lg border ${bg} ${border} px-3 flex items-center gap-3`}>
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot}`} />
                <span className="text-xs text-gray-500 flex-1">{label}</span>
                <span className={`text-lg font-bold ${num}`}>{count}</span>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div className="flex-1 min-w-0">
            {/* <Bar data={severityChartData} options={severityChartOptions as any} /> */}
            <Bar data={severityChartData} options={severityChartOptions} />
          </div>
        </div>
      </div>

    </div>
  );
}