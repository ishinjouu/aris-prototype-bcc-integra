"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  History,
  Search,
  Filter,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  Trash2,
  Plus,
} from "lucide-react";
import { historicalCases } from "@/data/equipment";
import type { ActionFollowUp } from "@/data/equipment";
import { getActionFollowUps, upsertActionFollowUp, deleteActionFollowUp } from "@/lib/localStorage";

const statusStyle: Record<string, string> = {
  Open: "bg-blue-50 text-blue-700 border border-blue-200",
  "In Progress": "bg-yellow-50 text-yellow-700 border border-yellow-200",
  "Not Started": "bg-gray-50 text-gray-500 border border-gray-200",
  Completed: "bg-green-50 text-green-700 border border-green-200",
};

const statusIcon: Record<string, React.ReactNode> = {
  Open: <AlertTriangle size={11} />,
  "In Progress": <Clock size={11} />,
  "Not Started": <Clock size={11} />,
  Completed: <CheckCircle size={11} />,
};

type ActiveTab = "actions" | "history";

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("actions");
  const [actions, setActions] = useState<ActionFollowUp[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    setActions(getActionFollowUps());
  }, []);

  function handleStatusChange(id: string, status: ActionFollowUp["status"]) {
    const item = actions.find((a) => a.id === id);
    if (!item) return;
    setActions(upsertActionFollowUp({ ...item, status }));
  }

  function handleDelete(id: string) {
    setActions(deleteActionFollowUp(id));
  }

  function startEdit(action: ActionFollowUp) {
    setEditingId(action.id);
    setEditNotes(action.notes);
  }

  function saveEdit(id: string) {
    const item = actions.find((a) => a.id === id);
    if (!item) return;
    setActions(upsertActionFollowUp({ ...item, notes: editNotes }));
    setEditingId(null);
  }

  const filteredActions = actions.filter((a) => {
    const matchSearch =
      search === "" ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.equipmentId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredHistory = historicalCases.filter(
    (h) =>
      search === "" ||
      h.equipmentName.toLowerCase().includes(search.toLowerCase()) ||
      h.incidentId.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    Open: actions.filter((a) => a.status === "Open").length,
    "In Progress": actions.filter((a) => a.status === "In Progress").length,
    "Not Started": actions.filter((a) => a.status === "Not Started").length,
    Completed: actions.filter((a) => a.status === "Completed").length,
  };

  return (
    /* Full-height, no outer scroll */
    <div className="flex-1 min-h-0 flex flex-col gap-3 p-3 md:p-4 overflow-hidden">

      {/* Breadcrumb */}
      <div className="flex-shrink-0 flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-blue-600">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">History</span>
      </div>

      {/* Summary Cards — fixed, no scroll */}
      <div className="flex-shrink-0 grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["Open", "In Progress", "Not Started", "Completed"] as const).map((s) => (
          <button
            key={s}
            onClick={() => { setActiveTab("actions"); setStatusFilter(s); }}
            className={`card p-3 text-left hover:shadow-md transition-all group
              ${statusFilter === s && activeTab === "actions" ? "ring-2 ring-blue-400" : ""}`}
          >
            <div className="flex items-center gap-1 mb-1.5">
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 ${statusStyle[s]}`}
              >
                {statusIcon[s]} {s}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {counts[s]}
            </p>
            <p className="text-[10px] text-gray-400">action items</p>
          </button>
        ))}
      </div>

      {/* Main Card — flex-1, table scrolls inside */}
      <div className="flex-1 min-h-0 card p-4 flex flex-col">
        {/* Tabs + Search toolbar */}
        <div className="flex-shrink-0 flex flex-wrap items-center gap-2 mb-3">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("actions")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                ${activeTab === "actions" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              Action Follow-UP
              <span className="ml-1.5 text-[10px] opacity-70">({actions.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                ${activeTab === "history" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              Historical Log
              <span className="ml-1.5 text-[10px] opacity-70">({historicalCases.length})</span>
            </button>
          </div>

          <div className="ml-auto flex gap-2">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 w-36"
              />
            </div>
            {activeTab === "actions" && (
              <div className="relative">
                <Filter size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-6 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  {["All", "Open", "In Progress", "Not Started", "Completed"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable table area */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">

          {/* ── Actions Table ── */}
          {activeTab === "actions" && (
            filteredActions.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-3">
                <History size={32} className="text-gray-200" />
                <p className="text-sm text-gray-400">No action items found.</p>
              </div>
            ) : (
              <table className="w-full text-xs min-w-[700px]">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="text-gray-400 border-b border-gray-100">
                    <th className="text-left py-2 pr-3 font-medium">Equipment</th>
                    <th className="text-left py-2 pr-3 font-medium">Action Title</th>
                    <th className="text-left py-2 pr-3 font-medium">Priority</th>
                    <th className="text-left py-2 pr-3 font-medium">Status</th>
                    <th className="text-left py-2 pr-3 font-medium">Window</th>
                    <th className="text-left py-2 pr-3 font-medium">Assigned To</th>
                    <th className="text-left py-2 pr-3 font-medium">Notes</th>
                    <th className="text-left py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActions.map((action) => (
                    <tr
                      key={action.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-2.5 pr-3">
                        <Link
                          href={`/ai-summary/${action.equipmentId}`}
                          className="font-semibold text-gray-800 hover:text-blue-600"
                        >
                          {action.equipmentId}
                        </Link>
                      </td>
                      <td className="py-2.5 pr-3 max-w-[160px]">
                        <p className="truncate text-gray-700">{action.title}</p>
                      </td>
                      <td className="py-2.5 pr-3">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold
                            ${action.priority === "High" ? "badge-high"
                              : action.priority === "Medium" ? "badge-medium"
                              : "badge-low"}`}
                        >
                          {action.priority}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3">
                        <select
                          value={action.status}
                          onChange={(e) =>
                            handleStatusChange(action.id, e.target.value as ActionFollowUp["status"])
                          }
                          className={`text-[10px] px-2 py-1 rounded-lg border font-medium focus:outline-none cursor-pointer ${statusStyle[action.status]}`}
                        >
                          {["Open", "In Progress", "Not Started", "Completed"].map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2.5 pr-3 text-gray-600 whitespace-nowrap">
                        {action.recommendedWindow}
                      </td>
                      <td className="py-2.5 pr-3 text-gray-600 whitespace-nowrap">
                        {action.assignedTo}
                      </td>
                      <td className="py-2.5 pr-3 max-w-[140px]">
                        {editingId === action.id ? (
                          <div className="flex gap-1">
                            <input
                              type="text"
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              className="flex-1 text-[10px] border border-blue-300 rounded px-1.5 py-1 focus:outline-none"
                            />
                            <button
                              onClick={() => saveEdit(action.id)}
                              className="text-[10px] text-green-600 font-semibold hover:text-green-800"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(action)}
                            className="text-gray-500 hover:text-blue-600 text-left transition-colors w-full"
                            title={action.notes || "Click to add notes"}
                          >
                            {action.notes ? (
                              <span className="truncate block max-w-[130px]">{action.notes}</span>
                            ) : (
                              <span className="flex items-center gap-1 text-gray-300">
                                <Plus size={11} /> Add note
                              </span>
                            )}
                          </button>
                        )}
                      </td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/ai-summary/${action.equipmentId}`}
                            className="text-[10px] text-blue-600 hover:text-blue-800 font-medium px-1.5 py-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleDelete(action.id)}
                            className="p-1 text-gray-300 hover:text-red-500 transition-colors rounded"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

          {/* ── Historical Log Table ── */}
          {activeTab === "history" && (
            <table className="w-full text-xs min-w-[700px]">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="text-gray-400 border-b border-gray-100">
                  <th className="text-left py-2 pr-3 font-medium">Incident ID</th>
                  <th className="text-left py-2 pr-3 font-medium">Equipment</th>
                  <th className="text-left py-2 pr-3 font-medium">Area</th>
                  <th className="text-left py-2 pr-3 font-medium">Root Cause</th>
                  <th className="text-left py-2 pr-3 font-medium">Action Taken</th>
                  <th className="text-left py-2 pr-3 font-medium">Downtime</th>
                  <th className="text-left py-2 pr-3 font-medium">Loss</th>
                  <th className="text-left py-2 pr-3 font-medium">Match %</th>
                  <th className="text-left py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((h) => (
                  <tr
                    key={h.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-2.5 pr-3 font-semibold text-gray-800">#{h.incidentId}</td>
                    <td className="py-2.5 pr-3">
                      <Link
                        href={`/ai-summary/${h.equipmentId}`}
                        className="text-gray-700 hover:text-blue-600"
                      >
                        {h.equipmentName}
                      </Link>
                    </td>
                    <td className="py-2.5 pr-3 text-gray-600">{h.area}</td>
                    <td className="py-2.5 pr-3 text-gray-600 max-w-[140px]">
                      <span className="truncate block">{h.rootCause}</span>
                    </td>
                    <td className="py-2.5 pr-3 text-gray-600 max-w-[140px]">
                      <span className="truncate block">{h.action}</span>
                    </td>
                    <td className="py-2.5 pr-3 font-medium text-gray-800 whitespace-nowrap">
                      {h.downtime}
                    </td>
                    <td className="py-2.5 pr-3 font-medium text-red-600 whitespace-nowrap">
                      {h.loss}
                    </td>
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-10 h-1.5 bg-gray-100 rounded-full">
                          <div
                            className="h-1.5 rounded-full bg-green-400"
                            style={{ width: `${h.matchPercentage}%` }}
                          />
                        </div>
                        <span className="font-semibold text-green-600">{h.matchPercentage}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-gray-500 whitespace-nowrap">{h.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
