"use client";

import Link from "next/link";
import { getRiskStack, getActionFollowUpCounts } from "@/data/equipment";
import { useState, useEffect } from "react";
import { BrainCircuit } from "lucide-react";

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
  "CA/PA EXECUTION","MONITORING RESULT","NEW REGISTERED",
  "RCA PROCESS","RISK CANCELED","RISK CLOSED",
];

export default function AISummaryPage() {
  const [riskStack, setRiskStack] = useState<any[]>([]);
  const [actionCounts, setActionCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const stack = getRiskStack().sort(
      (a: any, b: any) => (LEVEL_ORDER[a.level] ?? 9) - (LEVEL_ORDER[b.level] ?? 9)
    );
    setRiskStack(stack);
    setActionCounts(getActionFollowUpCounts());
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-4">

        {/* Header */}
        <div className="flex items-center gap-2">
          <BrainCircuit size={18} className="text-gray-400" />
          <h1 className="text-base font-semibold text-gray-800">AI Risk Analysis</h1>
        </div>

        {/* Risk Stack */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              AI Prioritized Risk Stack
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-[11px] text-gray-400">
                  <th className="text-left py-3 px-4 font-semibold">Equipment</th>
                  <th className="text-left py-3 px-4 font-semibold">Plant</th>
                  <th className="text-left py-3 px-4 font-semibold">Risk Case</th>
                  <th className="text-left py-3 px-4 font-semibold">Impact</th>
                  <th className="text-center py-3 px-4 font-semibold">Score</th>
                  <th className="text-center py-3 px-4 font-semibold">Level</th>
                  <th className="text-right py-3 px-4 font-semibold">Pot. Loss</th>
                  <th className="text-center py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {riskStack.map((risk) => (
                  <tr key={risk.tagNumber} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-gray-800">{risk.tagNumber}</td>
                    <td className="py-3 px-4 text-gray-400">{risk.plant}</td>
                    <td className="py-3 px-4 text-gray-600 max-w-xs">
                      <div className="line-clamp-2 text-xs">{risk.riskCase}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">{risk.impact}</td>
                    <td className="py-3 px-4 text-center font-semibold text-gray-700">{risk.riskScore}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${RISK_BADGE[risk.level] ?? "bg-gray-100 text-gray-600"}`}>
                        {risk.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-amber-600 text-xs">${risk.potentialLossMUSD}M</td>
                    <td className="py-3 px-4 text-center">
                      <Link
                        href={`/ai-summary/${risk.tagNumber}`}
                        className="text-[11px] font-medium text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Validate / Modify
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Follow-Up */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Action Follow-Up Status</p>
          <div className="grid grid-cols-3 gap-2">
            {ACTION_STATUSES.map((status) => (
              <div key={status} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-700">
                <span className="font-medium">{status}</span>
                <span className={`min-w-[1.5rem] text-center rounded-md px-1.5 py-0.5 text-[11px] font-bold ${ACTION_COUNT_PILL[status] ?? "bg-gray-100 text-gray-700"}`}>
                  {actionCounts[status] ?? 0}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
