"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  AlertTriangle,
  Clock,
  ChevronRight,
  Filter,
} from "lucide-react";
import { equipmentData } from "@/data/equipment";
import type { Equipment } from "@/data/equipment";
import RiskMatrixChart from "@/components/charts/RiskMatrixChart";

const riskBadge: Record<string, string> = {
  High: "badge-high",
  Medium: "badge-medium",
  Low: "badge-low",
};

const tabList = ["Active Risks", "In-Progress", "Historical Log"] as const;
type Tab = (typeof tabList)[number];

const areaOptions = ["All Areas", "Ethylene", "Reformer", "Production", "Utilities"];

function filterByTab(data: Equipment[], tab: Tab): Equipment[] {
  if (tab === "Active Risks") return data.filter((e) => e.riskLevel !== "Low");
  if (tab === "In-Progress")
    return data.filter(
      (e) => e.operationalStatus === "Warning" || e.operationalStatus === "Emerging Risk"
    );
  return data;
}

export default function AISummaryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Active Risks");
  const [areaFilter, setAreaFilter] = useState("All Areas");

  const filtered = filterByTab(equipmentData, activeTab).filter(
    (e) => areaFilter === "All Areas" || e.area === areaFilter
  );

  const criticalCount = equipmentData.filter((e) => e.riskLevel === "High").length;
  const pendingApproval = equipmentData.filter((e) => e.riskLevel !== "Low").length - 1;
  const maxRSL = equipmentData.reduce(
    (max, e) => (parseInt(e.estRSL) > max ? parseInt(e.estRSL) : max),
    0
  );

  return (
    /* Full-height, no outer scroll — inner panels scroll independently */
    <div className="flex-1 min-h-0 flex flex-col gap-3 p-3 md:p-4 overflow-hidden">

      {/* Breadcrumb */}
      <div className="flex-shrink-0 flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-blue-600">AI Summary</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">Active Risks</span>
      </div>

      {/* ── Top row: Executive Summary | Risk Matrix ── */}
      <div className="flex-shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-3">

        {/* AI Executive Summary */}
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
                <span className="font-semibold text-red-600">1 peralatan berisiko TINGGI</span>{" "}
                (KO-3201) dan{" "}
                <span className="font-semibold text-yellow-600">2 peralatan berisiko SEDANG</span>.
                Diperlukan tindakan segera dalam{" "}
                <span className="font-semibold text-orange-600">16 jam</span>.
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                Area Reformer berisiko paling tinggi.
              </p>
            </div>
          </div>

          {/* KPI Cards */}
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
                <span className="text-[10px] text-orange-600 font-medium">Resolve In</span>
              </div>
              <p className="text-xl font-bold text-orange-600">
                {maxRSL}
                <span className="text-xs font-normal ml-0.5">h</span>
              </p>
            </div>
          </div>
        </div>

        {/* Global Risk Matrix */}
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
            <RiskMatrixChart
              equipment={
                areaFilter === "All Areas"
                  ? equipmentData
                  : equipmentData.filter((e) => e.area === areaFilter)
              }
            />
          </div>
        </div>
      </div>

      {/* ── Risk Table card — flex-1, table scrolls inside ── */}
      <div className="flex-1 min-h-0 card p-4 flex flex-col">
        {/* Tabs + filter */}
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
                  {equipmentData.filter((e) => e.riskLevel !== "Low").length}
                </span>
              )}
              {tab === "In-Progress" && (
                <span className="ml-1.5 bg-yellow-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                  {equipmentData.filter((e) => e.operationalStatus === "Warning").length}
                </span>
              )}
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

        {/* Scrollable table */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="text-left py-2 pr-4 font-medium">Rank</th>
                <th className="text-left py-2 pr-4 font-medium">Equipment ↕</th>
                <th className="text-left py-2 pr-4 font-medium">Area</th>
                <th className="text-left py-2 pr-4 font-medium">Detected Date</th>
                <th className="text-left py-2 pr-4 font-medium">Risk Level</th>
                <th className="text-left py-2 pr-4 font-medium">Impact Score</th>
                <th className="text-left py-2 pr-4 font-medium">Est. RSL</th>
                <th className="text-left py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-sm text-gray-400">
                    No equipment matching current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((eq, i) => (
                  <tr
                    key={eq.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-2.5 pr-4 text-gray-500 text-xs">{i + 1}</td>
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs flex-shrink-0
                            ${eq.riskLevel === "High" ? "bg-red-100" : "bg-yellow-100"}`}
                        >
                          ⚙️
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-xs">{eq.id}</p>
                          <p className="text-[10px] text-gray-500">{eq.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-gray-600">{eq.area}</td>
                    <td className="py-2.5 pr-4 text-xs text-gray-600">{eq.detectedDate}</td>
                    <td className="py-2.5 pr-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${riskBadge[eq.riskLevel]}`}
                      >
                        {eq.riskLevel}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-xs font-semibold text-gray-800">
                      {eq.impactScore}
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-gray-600">{eq.estRSL}</td>
                    <td className="py-2.5">
                      {eq.riskLevel === "High" ? (
                        <Link href={`/ai-summary/${eq.id}`} className="btn-primary text-xs">
                          View Details
                        </Link>
                      ) : (
                        <button className="btn-secondary text-xs">Pending Analysis</button>
                      )}
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