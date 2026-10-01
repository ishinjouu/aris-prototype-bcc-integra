"use client";

import { useState } from "react";
import { X, AlertTriangle, CheckCircle, Calendar, Clock, Users } from "lucide-react";
import type { Equipment, ActionFollowUp } from "@/data/equipment";
import { upsertActionFollowUp } from "@/lib/localStorage";

interface Props {
  open: boolean;
  onClose: () => void;
  equipment: Equipment;
  action: ActionFollowUp;
  onConfirm: (updated: ActionFollowUp) => void;
}

export default function ApproveSidebar({ open, onClose, equipment, action, onConfirm }: Props) {
  const [notes, setNotes] = useState(action.notes);
  const [submitted, setSubmitted] = useState(false);

  function handleConfirm() {
    const updated: ActionFollowUp = {
      ...action,
      status: "In Progress",
      notes,
      updatedAt: new Date().toISOString(),
    };
    upsertActionFollowUp(updated);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onConfirm(updated);
      onClose();
    }, 1200);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl
          transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Approve Action</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Review the AI recommendation and provide approval to create a maintenance action.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors ml-3 flex-shrink-0"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Equipment banner */}
          <div className="flex items-start justify-between bg-gray-50 rounded-xl p-3 border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle size={15} className="text-red-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{equipment.id} – {equipment.type}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Area {equipment.area} &nbsp;|&nbsp; Type {equipment.type} &nbsp;|&nbsp; Critical Equipment
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[11px] text-gray-500">Operational Impact Score</p>
              <p className="text-xl font-bold text-gray-900">
                {equipment.impactScore}
                <span className="text-sm font-normal text-gray-400">/100</span>
              </p>
              <span className="badge-high text-[10px] px-2 py-0.5 rounded-full font-semibold">
                {equipment.riskLevel}
              </span>
            </div>
          </div>

          {/* Section 1: Action Details */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">1. Action Details</p>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-gray-500 mb-1 block">Action Title</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700">
                  {action.title}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block">Priority</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 flex items-center gap-1">
                    <span className="text-red-500">↑</span> {action.priority}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block">Recommended Window</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 flex items-center gap-1">
                    <Calendar size={11} className="text-gray-400" /> {action.recommendedWindow}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-gray-500 mb-1 block">Description</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 leading-relaxed">
                  {action.description}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block">Estimated Duration</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 flex items-center gap-1">
                    <Clock size={11} className="text-gray-400" /> {action.estimatedDuration}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block">Assigned To</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 flex items-center gap-1">
                    <Users size={11} className="text-gray-400" /> {action.assignedTo}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Expected Benefit */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">2. Expected Benefit</p>
            <div className="space-y-1.5">
              {action.expectedBenefits.map((b) => (
                <label key={b} className="flex items-center gap-2 text-xs text-gray-700">
                  <input
                    type="checkbox"
                    defaultChecked
                    readOnly
                    className="w-3.5 h-3.5 rounded text-blue-600 accent-blue-600"
                  />
                  {b}
                </label>
              ))}
            </div>
          </div>

          {/* Section 3: Notes */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">3. Approval Notes (Optional)</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Add approval notes..."
            />
            <p className="text-[10px] text-gray-400 text-right mt-0.5">{notes.length}/500</p>
          </div>

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5 flex gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-[9px] font-bold">i</span>
            </div>
            <p className="text-[11px] text-blue-700 leading-relaxed">
              Once approved, a maintenance action will be created and assigned to the selected team.
              The progress can be monitored in the Action Follow-Up section.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={submitted}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${submitted
                  ? "bg-green-500 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                }`}
            >
              {submitted ? (
                <>
                  <CheckCircle size={15} /> Approved!
                </>
              ) : (
                "Confirm Approval"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
