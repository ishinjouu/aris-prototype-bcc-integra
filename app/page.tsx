"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  BrainCircuit,
  ChevronRight,
  AlertCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import AIAvatar, { type AvatarSkin } from "@/components/AIAvatar";
import {
  equipmentData,
  plantKPIs,
  aiBrief,
  productionTrendData,
  operationalStatusHistory,
  statusBarChartData,
} from "@/data/equipment";
import { getActionFollowUps } from "@/lib/localStorage";
import type { ActionFollowUp } from "@/data/equipment";
import ProductionTrendChart from "@/components/charts/ProductionTrendChart";
import StatusBarChart from "@/components/charts/StatusBarChart";

const statusColor: Record<string, string> = {
  Normal:          "bg-green-500",
  Warning:         "bg-yellow-400",
  "Emerging Risk": "bg-orange-400",
  Maintenance:     "bg-blue-400",
};

const riskBadge: Record<string, string> = {
  High:   "badge-high",
  Medium: "badge-medium",
  Low:    "badge-low",
};

// Available skins cycle
const SKINS: AvatarSkin[] = ["orb", "robot", "ghost"];
const SKIN_LABELS: Record<AvatarSkin, string> = {
  orb:   "Orb",
  robot: "Robot",
  ghost: "Ghost",
};

export default function DashboardPage() {
  const [actions, setActions]   = useState<ActionFollowUp[]>([]);
  const [skin, setSkin]         = useState<AvatarSkin>("orb");

  useEffect(() => { setActions(getActionFollowUps()); }, []);

  const countByStatus = (s: string) => actions.filter((a) => a.status === s).length;

  const statusGroups = [
    { label: "Open",        count: countByStatus("Open"),        style: "bg-blue-600"   },
    { label: "In Progress", count: countByStatus("In Progress"), style: "bg-yellow-500" },
    { label: "Not Started", count: countByStatus("Not Started"), style: "bg-gray-400"   },
    { label: "Completed",   count: countByStatus("Completed"),   style: "bg-green-600"  },
  ];

  const avatarStatus = equipmentData.some((e) => e.riskLevel === "High")
    ? "critical"
    : equipmentData.some((e) => e.riskLevel === "Medium")
    ? "warning"
    : "normal";

  const statusLabel = avatarStatus === "critical"
    ? "⚠ Critical Risk"
    : avatarStatus === "warning"
    ? "⚡ Warning"
    : "✓ All Normal";

  function cycleSkin() {
    setSkin((prev) => {
      const idx = SKINS.indexOf(prev);
      return SKINS[(idx + 1) % SKINS.length];
    });
  }

  return (
    /*
     * Single grid: 12 cols, 2 explicit rows.
     * Left (col-3) and center (col-6) each span row-1 only.
     * Right (col-3) spans row-1 AND row-2 (row-span-2) → fills full height.
     * Row 2 left (col-3) = Production Trend, center (col-6) = Status History.
     */
    <div className="flex-1 min-h-0 grid grid-cols-12 grid-rows-[1fr_auto] gap-2.5 p-3 md:p-4 overflow-hidden"
      style={{ gridTemplateRows: "1fr auto" }}
    >

      {/* ── AI Brief — row 1, col 1-3 ── */}
      <div className="col-span-12 lg:col-span-3 lg:row-start-1 card p-3 flex flex-col gap-2 min-h-0 overflow-hidden">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <BrainCircuit size={12} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-800">AI Brief</p>
            <p className="text-[10px] text-gray-500">{aiBrief.insightCount} {aiBrief.label}</p>
          </div>
        </div>

        <div className="flex-shrink-0 bg-red-50 border border-red-200 rounded-lg p-2.5">
          <div className="flex items-start gap-2">
            <AlertTriangle size={12} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-gray-800">
                  {aiBrief.alert.id} – Emergency Risk
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded badge-high font-semibold">
                  {aiBrief.alert.severity}
                </span>
              </div>
              <p className="text-[10px] text-gray-600 mt-0.5 line-clamp-2">
                {aiBrief.alert.description}
              </p>
              <div className="flex items-center gap-1 mt-1 text-gray-400">
                <Clock size={9} />
                <span className="text-[10px]">{aiBrief.alert.hoursAgo} Hours Ago</span>
              </div>
            </div>
          </div>
          <Link
            href="/ai-summary/KO-3201"
            className="mt-1.5 text-[10px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-0.5"
          >
            View Details <ChevronRight size={9} />
          </Link>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-0.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-gray-50 rounded-lg border border-gray-100 animate-pulse" />
          ))}
        </div>
      </div>

      {/* ── Plant Operational Health — row 1, col 4-9 ── */}
      <div className="col-span-12 lg:col-span-6 lg:row-start-1 card p-3 flex flex-col gap-2.5 min-h-0 overflow-hidden">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 flex-shrink-0">
          Plant Operational Health
        </p>

        {/* KPI boxes */}
        <div className="grid grid-cols-4 gap-2 flex-shrink-0">
          {[
            { icon: <Activity size={11} className="text-blue-500" />,   label: "Health Index",   value: `${plantKPIs.healthIndex}/100`, change: `↑ +${plantKPIs.healthIndexChange}%`,   changeColor: "text-green-600", accent: "border-blue-200 bg-blue-50/50"   },
            { icon: <AlertCircle size={11} className="text-red-500" />,  label: "Critical Alerts",value: `${plantKPIs.criticalAlerts}`,  change: `↑ +${plantKPIs.criticalAlertsChange}`, changeColor: "text-red-500",   accent: "border-red-200 bg-red-50/50"     },
            { icon: <TrendingUp size={11} className="text-green-500" />, label: "Production",     value: `${plantKPIs.production}%`,    change: `↑ +${plantKPIs.productionChange}%`,  changeColor: "text-green-600", accent: "border-green-200 bg-green-50/50" },
            { icon: <DollarSign size={11} className="text-orange-500" />,label: "Loss Risk",      value: `$${(plantKPIs.lossRiskEstimation/1000).toFixed(0)}K`, change: `↓ ${plantKPIs.lossRiskChange}%`, changeColor: "text-green-600", accent: "border-orange-200 bg-orange-50/50" },
          ].map(({ icon, label, value, change, changeColor, accent }) => (
            <div key={label} className={`rounded-lg border p-2 flex flex-col gap-0.5 ${accent}`}>
              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                {icon}<span className="truncate">{label}</span>
              </div>
              <p className="text-base font-bold text-gray-900 leading-tight">{value}</p>
              <p className={`text-[10px] font-medium ${changeColor}`}>{change}</p>
            </div>
          ))}
        </div>

        {/* AI Risk Stack — scrollable */}
        <div className="flex-1 min-h-0 flex flex-col border-t border-gray-100 pt-2 overflow-hidden">
          <div className="flex items-center justify-between mb-1 flex-shrink-0">
            <div className="flex items-center gap-1">
              <BrainCircuit size={12} className="text-blue-600" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                AI Prioritize Risk Stack
              </span>
            </div>
            <Link href="/ai-summary" className="text-[10px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-0.5">
              See All <ChevronRight size={9} />
            </Link>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="text-gray-400 border-b border-gray-100">
                  <th className="text-left py-1 pr-3 font-medium w-7">#</th>
                  <th className="text-left py-1 pr-3 font-medium">Equipment</th>
                  <th className="text-left py-1 pr-3 font-medium">Risk</th>
                  <th className="text-left py-1 font-medium">Impact</th>
                </tr>
              </thead>
              <tbody>
                {equipmentData.map((eq, i) => (
                  <tr key={eq.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-1 pr-3 text-gray-400 text-[11px]">{i + 1}</td>
                    <td className="py-1 pr-3">
                      <Link href={`/ai-summary/${eq.id}`} className="font-medium text-gray-800 hover:text-blue-600 text-[11px]">{eq.id}</Link>
                    </td>
                    <td className="py-1 pr-3">
                      <span className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${riskBadge[eq.riskLevel]}`}>{eq.riskLevel}</span>
                    </td>
                    <td className="py-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-10 h-1 bg-gray-100 rounded-full">
                          <div className={`h-1 rounded-full ${eq.riskLevel === "High" ? "bg-red-500" : eq.riskLevel === "Medium" ? "bg-yellow-400" : "bg-green-400"}`} style={{ width: `${eq.impactScore}%` }} />
                        </div>
                        <span className="text-[11px] font-medium text-gray-700">{eq.impactScore}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Right column — row-span-2, col 10-12 ── fills both rows */}
      {/*
        Structure: flex-col, no gap.
        - Single outer card fills the full column height (flex-1 min-h-0)
        - Inside: [title+avatar] fixed, [pills] flex-1 scrollable, [action follow-up] mt-auto pinned to bottom
        This way there is never an empty gap — pills stretch to consume all leftover space.
      */}
      <div className="col-span-12 lg:col-span-3 lg:row-span-2 lg:row-start-1 min-h-0 overflow-hidden flex flex-col">
        <div className="flex-1 min-h-0 card p-3 flex flex-col gap-0 overflow-hidden">

          {/* ── Early Warning header ── */}
          <div className="flex items-center justify-between flex-shrink-0 mb-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Early Warning &amp; Problem Tank
            </p>
            <button
              onClick={cycleSkin}
              title={`Switch skin (${SKIN_LABELS[skin]})`}
              className="flex items-center gap-1 text-[9px] text-gray-400 hover:text-blue-600 px-1.5 py-0.5 rounded-md hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-300"
            >
              <RefreshCw size={9} />
              {SKIN_LABELS[skin]}
            </button>
          </div>

          {/* ── AI Avatar zone (fixed height) ── */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center py-3 bg-gradient-to-b from-slate-50 to-blue-50 rounded-xl border border-blue-100">
            <AIAvatar status={avatarStatus} size="sm" skin={skin} />
            <p className="text-[9px] font-semibold text-gray-500 mt-1">
              {statusLabel}
            </p>
          </div>

          {/* ── Status pills — flex-1 fills ALL remaining space before Action Follow-Up ── */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-1 mt-2 mb-2 pr-0.5">
            {equipmentData.map((eq) => (
              <div key={eq.id} className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusColor[eq.operationalStatus]}`} />
                <span className="text-[11px] font-medium text-gray-700">{eq.id}</span>
                <span className="ml-auto text-[10px] text-gray-400 truncate">{eq.operationalStatus}</span>
              </div>
            ))}
          </div>

          {/* ── Divider ── */}
          <div className="flex-shrink-0 border-t border-gray-100 mb-2" />

          {/* ── Action Follow-Up — pinned to bottom, flex-shrink-0 ── */}
          <div className="flex-shrink-0 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                Action Follow-UP
              </p>
              <Link href="/history" className="text-[10px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-0.5">
                See More <ChevronRight size={9} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-1">
              {statusGroups.map(({ label, count, style }) => (
                <div key={label} className="flex items-center gap-1.5 px-1.5 py-1 hover:bg-gray-50 rounded-lg transition-colors cursor-default">
                  <span className={`w-5 h-5 rounded-md ${style} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0`}>{count}</span>
                  <span className="text-[10px] text-gray-600 leading-tight">{label}</span>
                </div>
              ))}
            </div>

            <Link
              href="/ai-summary"
              className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[10px] font-semibold transition-all shadow-sm"
            >
              <BrainCircuit size={11} />
              View Analysis &amp; Recommendation
            </Link>
          </div>
        </div>
      </div>

      {/* ── Production Trend — row 2, col 1-3 ── */}
      <div className="col-span-12 lg:col-span-3 lg:row-start-2 card p-3">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Production Trend
          </p>
          <select className="text-[9px] border border-gray-200 rounded px-1.5 py-0.5 text-gray-600 bg-white focus:outline-none">
            <option>2026</option>
            <option>2025</option>
          </select>
        </div>
        <div className="h-28">
          <ProductionTrendChart data={productionTrendData} />
        </div>
      </div>

      {/* ── Operational Status History — row 2, col 4-9 ── */}
      <div className="col-span-12 lg:col-span-6 lg:row-start-2 card p-3">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Operational Status History
          </p>
          <Link href="/history" className="text-[10px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-0.5">
            See More <ChevronRight size={9} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            {Object.entries(operationalStatusHistory).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusColor[status]}`} />
                <span className="text-[10px] text-gray-600 flex-1">{status}</span>
                <span className="text-[10px] font-semibold text-gray-800">{count}</span>
              </div>
            ))}
          </div>
          <div className="h-28">
            <StatusBarChart data={statusBarChartData} />
          </div>
        </div>
      </div>
    </div>
  );
}
