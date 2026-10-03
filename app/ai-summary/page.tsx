"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  AlertTriangle,
  Clock,
  ChevronRight,
  Filter,
} from "lucide-react";
import { equipmentData, getRiskStack } from "@/data/equipment";
import type { Equipment, RiskStackItem } from "@/data/equipment";
import RiskMatrixChart from "@/components/charts/RiskMatrixChart";

const RISK_BADGE: Record<string, string> = {
  HIGH: "bg-rose-100 text-rose-700 border border-rose-200",
  MEDIUM: "bg-amber-100 text-amber-700 border border-amber-200",
  LOW: "bg-emerald-100 text-emerald-700 border border-emerald-200",
};

const LEVEL_ORDER: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

// const tabList = ["Active Risks", "In-Progress", "Historical Log"] as const;
const tabList = ["Active Risks", "Historical Log"] as const;
type Tab = (typeof tabList)[number];

const IN_PROGRESS_STATUSES = [
  "CA/PA EXECUTION",
  "MONITORING RESULT",
  "NEW REGISTERED",
  "RCA PROCESS",
];
const HISTORICAL_STATUSES = ["RISK CANCELED", "RISK CLOSED"];

function filterByTab(data: RiskStackItem[], tab: Tab): RiskStackItem[] {
  // if (tab === "In-Progress") {
  //   return data.filter((r) => IN_PROGRESS_STATUSES.includes(r.overallStatus));
  // }
  if (tab === "Historical Log") {
    return data.filter((r) => HISTORICAL_STATUSES.includes(r.overallStatus));
  }
  return data;
}

function stackToEquipment(items: RiskStackItem[]): Equipment[] {
  const byTag = new Map<string, Equipment>();
  for (const item of items) {
    const existing = equipmentData.find((e) => e.id === item.tagNumber);
    if (existing && !byTag.has(item.tagNumber)) {
      byTag.set(item.tagNumber, existing);
    }
  }
  return Array.from(byTag.values());
}

export default function AISummaryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Active Risks");
  const [areaFilter, setAreaFilter] = useState("All Areas");

  const riskStack = useMemo(
    () =>
      getRiskStack().sort(
        (a, b) => (LEVEL_ORDER[a.level] ?? 9) - (LEVEL_ORDER[b.level] ?? 9)
      ),
    []
  );

  const areaOptions = useMemo(() => {
    const plants = Array.from(new Set(riskStack.map((r) => r.plant).filter(Boolean)));
    return ["All Areas", ...plants];
  }, [riskStack]);

  const filtered = filterByTab(riskStack, activeTab).filter(
    (r) => areaFilter === "All Areas" || r.plant === areaFilter
  );

  const highItems = riskStack.filter((r) => r.level === "HIGH");
  const mediumItems = riskStack.filter((r) => r.level === "MEDIUM");
  const criticalCount = highItems.length;
  const pendingApproval = highItems.length + mediumItems.length;
  const matrixEquipment =
    areaFilter === "All Areas"
      ? stackToEquipment(riskStack)
      : stackToEquipment(riskStack.filter((r) => r.plant === areaFilter));

  const inProgressCount = riskStack.filter((r) =>
    IN_PROGRESS_STATUSES.includes(r.overallStatus)
  ).length;

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3 p-3 md:p-4 overflow-hidden">

      <div className="flex-shrink-0 flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-blue-600">AI Summary</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">{activeTab}</span>
      </div>

      <div className="flex-shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-3">

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit size={15} className="text-blue-600" />
            <h2 className="text-sm font-semibold text-gray-800">AI Executive Summary</h2>
          </div>

          <div className="flex gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <BrainCircuit size={22} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-700 leading-relaxed">
                Kilang saat ini memiliki{" "}
                <span className="font-semibold text-red-600">
                  {criticalCount} peralatan berisiko TINGGI
                </span>
                {highItems[0] ? ` (${highItems[0].tagNumber})` : ""} dan{" "}
                <span className="font-semibold text-yellow-600">
                  {mediumItems.length} peralatan berisiko SEDANG
                </span>
                .
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                Sumber data sama dengan AI Risk Stack di dashboard.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-red-50 rounded-xl p-2.5 border border-red-100">
              <div className="flex items-center gap-1 mb-1">
                <AlertTriangle size={12} className="text-red-500" />
                <span className="text-[10px] text-red-600 font-medium">Critical Alerts</span>
              </div>
              <p className="text-xl font-bold text-red-600">{criticalCount}</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-2.5 border border-yellow-100">
              <div className="flex items-center gap-1 mb-1">
                <AlertTriangle size={12} className="text-yellow-500" />
                <span className="text-[10px] text-yellow-600 font-medium">Pending</span>
              </div>
              <p className="text-xl font-bold text-yellow-600">{pendingApproval}</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-2.5 border border-orange-100">
              <div className="flex items-center gap-1 mb-1">
                <Clock size={12} className="text-orange-500" />
                <span className="text-[10px] text-orange-600 font-medium">Stack Items</span>
              </div>
              <p className="text-xl font-bold text-orange-600">{riskStack.length}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BrainCircuit size={15} className="text-blue-600" />
              <h2 className="text-sm font-semibold text-gray-800">Global Risk Matrix</h2>
            </div>
            <div className="flex flex-wrap gap-1">
              {areaOptions.slice(1).map((area) => (
                <button
                  key={area}
                  onClick={() => setAreaFilter(areaFilter === area ? "All Areas" : area)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors
                    ${
                      areaFilter === area
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                    }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
          <div className="h-44">
            <RiskMatrixChart equipment={matrixEquipment} />
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 card p-4 flex flex-col">
        <div className="flex-shrink-0 flex items-center gap-1 mb-3 border-b border-gray-100 pb-2">
          {tabList.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${activeTab === tab ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              {tab}
              {tab === "Active Risks" && (
                <span className="ml-1.5 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                  {riskStack.length}
                </span>
              )}
              {/* {tab === "In-Progress" && (
                <span className="ml-1.5 bg-yellow-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                  {inProgressCount}
                </span>
              )} */}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <Filter size={12} className="text-gray-400" />
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              {areaOptions.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="text-left py-2 pr-4 font-medium">Rank</th>
                <th className="text-left py-2 pr-4 font-medium">Equipment</th>
                <th className="text-left py-2 pr-4 font-medium">Plant</th>
                <th className="text-left py-2 pr-4 font-medium">Risk Case</th>
                <th className="text-left py-2 pr-4 font-medium">Impact</th>
                <th className="text-center py-2 pr-4 font-medium">Score</th>
                <th className="text-center py-2 pr-4 font-medium">Level</th>
                <th className="text-right py-2 pr-4 font-medium">Pot. Loss</th>
                <th className="text-left py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-sm text-gray-400">
                    No equipment matching current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((risk, i) => (
                  <tr
                    key={`${risk.tagNumber}-${risk.riskCase}-${i}`}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-2.5 pr-4 text-gray-500 text-xs">{i + 1}</td>
                    <td className="py-2.5 pr-4">
                      <Link
                        href={`/ai-summary/${risk.tagNumber}`}
                        className="font-semibold text-gray-800 text-xs hover:text-blue-600 transition-colors"
                      >
                        {risk.tagNumber}
                      </Link>
                      <p className="text-[10px] text-gray-500">{risk.eqType || "Equipment"}</p>
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-gray-600">{risk.plant}</td>
                    <td className="py-2.5 pr-4 text-xs text-gray-600">
                      <div className="line-clamp-2 max-w-xs">{risk.riskCase}</div>
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-gray-600">
                      <div className="line-clamp-2 max-w-[10rem]">{risk.impact}</div>
                    </td>
                    <td className="py-2.5 pr-4 text-center font-semibold text-gray-700 text-xs">
                      {risk.riskScore}
                    </td>
                    <td className="py-2.5 pr-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${RISK_BADGE[risk.level] ?? "bg-gray-100 text-gray-600"}`}
                      >
                        {risk.level}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-right font-semibold text-amber-600 text-xs">
                      ${risk.potentialLossMUSD}M
                    </td>
                    <td className="py-2.5">
                      <Link href={`/ai-summary/${risk.tagNumber}`} className="btn-primary text-xs">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
