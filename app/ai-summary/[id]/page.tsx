"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ArrowLeft,
  Activity,
  AlertTriangle,
  BrainCircuit,
  CheckCircle,
  X,
} from "lucide-react";
import { equipmentData, historicalCases } from "@/data/equipment";
import type { Equipment, ActionFollowUp } from "@/data/equipment";
import { getActionFollowUps, upsertActionFollowUp } from "@/lib/localStorage";
import ParameterTrendChart from "@/components/charts/ParameterTrendChart";
import ApproveSidebar from "@/components/ApproveSidebar";
import ModifySidebar from "@/components/ModifySidebar";

function generateVibrationHistory(current: number): number[] {
  const base = current - 20;
  return [
    +(base + 2).toFixed(1),
    +(base + 5).toFixed(1),
    +(base + 9).toFixed(1),
    +(base + 13).toFixed(1),
    +(base + 17).toFixed(1),
    current,
  ];
}

const riskBadge: Record<string, string> = {
  High: "badge-high",
  Medium: "badge-medium",
  Low: "badge-low",
};

export default function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const equipment: Equipment | undefined = equipmentData.find((e) => e.id === id);

  const [action, setAction] = useState<ActionFollowUp | null>(null);
  const [approveOpen, setApproveOpen] = useState(false);
  const [modifyOpen, setModifyOpen] = useState(false);
  const [rejectDone, setRejectDone] = useState(false);

  useEffect(() => {
    const all = getActionFollowUps();
    const found = all.find((a) => a.equipmentId === id) ?? null;
    setAction(found);
  }, [id]);

  if (!equipment) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
        <AlertTriangle size={40} className="text-yellow-400" />
        <p className="text-gray-600 font-medium">Equipment &quot;{id}&quot; not found.</p>
        <Link href="/ai-summary" className="btn-primary">Back to AI Summary</Link>
      </div>
    );
  }

  const historicalCase = historicalCases.find((h) => h.equipmentId === id);
  const vibrationHistory = generateVibrationHistory(equipment.currentVibration);

  function handleReject() {
    if (!action) return;
    const updated: ActionFollowUp = {
      ...action,
      status: "Not Started",
      notes: "Rejected – pending review.",
      updatedAt: new Date().toISOString(),
    };
    upsertActionFollowUp(updated);
    setAction(updated);
    setRejectDone(true);
    setTimeout(() => setRejectDone(false), 2000);
  }

  return (
    <>
      {action && (
        <>
          <ApproveSidebar
            open={approveOpen}
            onClose={() => setApproveOpen(false)}
            equipment={equipment}
            action={action}
            onConfirm={(updated) => setAction(updated)}
          />
          <ModifySidebar
            open={modifyOpen}
            onClose={() => setModifyOpen(false)}
            equipment={equipment}
            action={action}
            onConfirm={(updated) => setAction(updated)}
          />
        </>
      )}

      {/* Full-height, no outer scroll */}
      <div className="flex-1 min-h-0 flex flex-col gap-3 p-3 md:p-4 overflow-hidden">

        {/* Breadcrumb */}
        <div className="flex-shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Link href="/ai-summary" className="hover:text-blue-600">AI Summary</Link>
            <ChevronRight size={12} />
            <span className="text-gray-700 font-medium">{id}</span>
          </div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={13} /> Back
          </button>
        </div>

        {/* ── Row 1: 4-card strip (fixed height) ── */}
        <div className="flex-shrink-0 grid grid-cols-2 xl:grid-cols-4 gap-3">

          {/* Operational Impact Score */}
          <div className="card p-3 flex flex-col gap-2">
            <p className="text-[11px] text-gray-500">Operational Impact Score</p>
            <div className="flex items-end gap-1.5">
              <span className="text-2xl font-bold text-gray-900">{equipment.impactScore}</span>
              <span className="text-xs text-gray-400 mb-0.5">/100</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold mb-0.5 ${riskBadge[equipment.riskLevel]}`}>
                {equipment.riskLevel}
              </span>
            </div>
            <p className="text-[10px] text-gray-400">Last Update: {equipment.lastUpdated}</p>
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-2 flex gap-1.5">
              <AlertTriangle size={12} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold text-gray-800">
                  {equipment.id} – {equipment.type}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-3 leading-relaxed">
                  Abnormal vibration trend detected over the last 5 days. Increasing trend
                  indicates higher risk of failure.
                </p>
              </div>
            </div>
          </div>

          {/* Parameter Trend */}
          <div className="card p-3 flex flex-col">
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <p className="text-[11px] font-semibold text-gray-700">Parameter Trend</p>
              <div className="flex gap-1">
                <button className="text-[10px] px-1.5 py-0.5 bg-blue-600 text-white rounded">
                  Vibration
                </button>
                <button className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded hover:bg-gray-200 transition-colors">
                  7 Days
                </button>
              </div>
            </div>
            <div className="flex-1" style={{ minHeight: 0, height: "100px" }}>
              <ParameterTrendChart
                vibrationValues={vibrationHistory}
                alarmThreshold={equipment.alarmThreshold}
              />
            </div>
          </div>

          {/* Key Information */}
          <div className="card p-3 flex flex-col gap-0 min-h-0">
            <p className="text-[11px] font-semibold text-gray-700 mb-2 flex-shrink-0">
              Key Information
            </p>
            <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 text-[11px] pr-0.5">
              {[
                ["Vibration", `${equipment.currentVibration} µm`],
                ["Alarm Threshold", `${equipment.alarmThreshold} µm`],
                ["5-Day Trend", `↑ +${equipment.trend5Day}%`],
                ["Criticality", equipment.equipmentCriticality],
                ["Prod. Dependency", equipment.productionDependency],
                ["Est. Downtime", equipment.estimatedDowntime],
                ["Loss Exposure", equipment.historicalLossExposure],
                ["Last Updated", equipment.lastUpdated],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-2">
                  <span className="text-gray-500 flex-shrink-0">{label}</span>
                  <span
                    className={`font-medium text-right ${
                      label === "5-Day Trend" ? "text-red-500" : "text-gray-800"
                    }`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Metrics */}
          <div className="card p-3">
            <p className="text-[11px] font-semibold text-gray-700 mb-2">Operational Metrics</p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-[10px] text-gray-400">Vibration</p>
                <p className="text-lg font-bold text-gray-900 leading-tight">
                  {equipment.currentVibration}
                  <span className="text-[10px] font-normal text-gray-400"> µm</span>
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-[10px] text-gray-400">Alarm</p>
                <p className="text-lg font-bold text-gray-900 leading-tight">
                  {equipment.alarmThreshold}
                  <span className="text-[10px] font-normal text-gray-400"> µm</span>
                </p>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-2">
              <p className="text-[10px] text-gray-400 mb-1.5">Downtime Estimate</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-[10px] text-gray-400">Daytime</p>
                  <p className="text-xs font-bold text-gray-900">24 ms</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-[10px] text-gray-400">Downtime</p>
                  <p className="text-xs font-bold text-gray-900">{equipment.estimatedDowntime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2: Root Cause | Recommended Action — flex-1, each scrolls ── */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-3">

          {/* AI Root Cause Analysis */}
          <div className="card p-4 flex flex-col min-h-0">
            <div className="flex-shrink-0 flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BrainCircuit size={14} className="text-blue-600" />
                <h3 className="text-xs font-semibold text-gray-800">AI Root Cause Analysis</h3>
              </div>
              <button className="text-[10px] text-blue-600 font-medium border border-blue-200 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                View Logic
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 pr-0.5">
              {/* Most Likely Causes */}
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-lg border ${
                      i === 0 ? "bg-orange-50 border-orange-100" : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    <p
                      className={`text-[10px] font-semibold mb-0.5 ${
                        i === 0 ? "text-orange-600" : "text-gray-500"
                      }`}
                    >
                      Most Likely Cause
                    </p>
                    <p className="text-[11px] text-gray-700 font-medium">
                      Lube-oil water contamination + Bearing degradation
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                      Based on similar vibration patterns from historical evidence, water
                      contamination in the lube oil may have degraded the bearing.
                    </p>
                  </div>
                ))}
              </div>

              {/* Historical Evidence */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-semibold text-blue-700">
                    Most Similar Case
                  </p>
                  <button className="text-[10px] text-blue-600 hover:underline">More</button>
                </div>
                {historicalCase ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-gray-800">
                        #{historicalCase.incidentId}
                      </span>
                      <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">
                        {historicalCase.matchPercentage}% Match
                      </span>
                    </div>
                    <div className="space-y-1 text-[11px]">
                      {[
                        ["Equipment", historicalCase.equipmentName],
                        ["Pattern", historicalCase.pattern],
                        ["Root Cause", historicalCase.rootCause],
                        ["Action", historicalCase.action],
                        ["Downtime", historicalCase.downtime],
                        ["Loss", historicalCase.loss],
                      ].map(([label, value]) => (
                        <div key={label} className="flex gap-2">
                          <span className="text-gray-400 w-16 flex-shrink-0">{label}</span>
                          <span className="text-gray-700 font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No similar historical case found.</p>
                )}
              </div>
            </div>
          </div>

          {/* AI Recommended Action */}
          <div className="card p-4 flex flex-col min-h-0">
            <div className="flex-shrink-0 flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BrainCircuit size={14} className="text-blue-600" />
                <h3 className="text-xs font-semibold text-gray-800">AI Recommended Action</h3>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-lg font-semibold ${riskBadge[equipment.riskLevel]}`}>
                Priority: {equipment.riskLevel} ↑
              </span>
            </div>

            {action ? (
              <div className="flex-1 min-h-0 flex flex-col min-h-0">
                {/* Scrollable content */}
                <div className="flex-1 min-h-0 overflow-y-auto pr-0.5 space-y-3">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <p className="text-xs font-semibold text-gray-800 mb-1">{action.title}</p>
                    <p className="text-[11px] text-gray-600 leading-relaxed mb-3">
                      {action.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <p className="text-[10px] text-gray-400">Recommended Window</p>
                        <p className="font-medium text-gray-800">Within 24 Hours</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">Est. Duration</p>
                        <p className="font-medium text-gray-800">{action.estimatedDuration}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] text-gray-400">Assigned To</p>
                        <p className="font-medium text-gray-800">{action.assignedTo}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-gray-600 mb-1.5">
                      Expected Benefit
                    </p>
                    <div className="space-y-1">
                      {action.expectedBenefits.map((b) => (
                        <div key={b} className="flex items-center gap-1.5 text-[11px] text-gray-700">
                          <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action buttons – always visible at bottom */}
                <div className="flex-shrink-0 flex gap-2 pt-3 border-t border-gray-100 mt-2">
                  <button
                    onClick={handleReject}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                      ${rejectDone
                        ? "bg-gray-200 text-gray-500"
                        : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
                      }`}
                  >
                    <X size={12} />
                    {rejectDone ? "Rejected" : "Reject"}
                  </button>
                  <button
                    onClick={() => setModifyOpen(true)}
                    className="flex-1 btn-secondary text-xs"
                  >
                    Modify
                  </button>
                  <button
                    onClick={() => setApproveOpen(true)}
                    className="flex-1 btn-primary text-xs"
                  >
                    Approve Action
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-3">
                <Activity size={30} className="text-gray-300" />
                <p className="text-sm text-gray-400">No recommended action found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
