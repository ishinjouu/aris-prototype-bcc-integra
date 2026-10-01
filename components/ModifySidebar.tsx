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

const PRIORITY_OPTIONS = ["High", "Medium", "Low"] as const;
const TEAM_OPTIONS = ["Maintenance Team", "Reliability Team", "Instrumentation Team", "Operations Team"] as const;
const DURATION_OPTIONS = ["1 – 2 Hours", "2 – 3 Hours", "3 – 4 Hours", "4 – 6 Hours", "6 – 8 Hours", "8+ Hours"] as const;

export default function ModifySidebar({ open, onClose, equipment, action, onConfirm }: Props) {
  const [title, setTitle] = useState(action.title);
  const [description, setDescription] = useState(action.description);
  const [priority, setPriority] = useState<typeof PRIORITY_OPTIONS[number]>(
    action.priority as typeof PRIORITY_OPTIONS[number]
  );
  const [window_, setWindow_] = useState(action.recommendedWindow);
  const [assignedTo, setAssignedTo] = useState(action.assignedTo);
  const [duration, setDuration] = useState(action.estimatedDuration);
  const [benefits, setBenefits] = useState<string[]>(action.expectedBenefits);
  const [otherBenefit, setOtherBenefit] = useState("");
  const [notes, setNotes] = useState(action.notes);
  const [submitted, setSubmitted] = useState(false);

  function toggleBenefit(b: string) {
    setBenefits((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  }

  function handleConfirm() {
    const allBenefits = otherBenefit.trim()
      ? [...benefits, otherBenefit.trim()]
      : benefits;
    const updated: ActionFollowUp = {
      ...action,
      title,
      description,
      priority,
      recommendedWindow: window_,
      assignedTo,
      estimatedDuration: duration,
      expectedBenefits: allBenefits,
      notes,
      status: "In Progress",
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

  const allDefaultBenefits = [
    "Prevent unplanned trip",
    "Avoid 24 – 32 hours downtime",
    "Reduce potential loss of $1.58 million",
  ];

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
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-2xl bg-white shadow-2xl
          transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Modify Action</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Adjust the AI recommendation based on field condition or additional insights.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors ml-3 flex-shrink-0"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-5">
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
                  {equipment.impactScore}<span className="text-sm text-gray-400">/100</span>
                </p>
                <span className="badge-high text-[10px] px-2 py-0.5 rounded-full font-semibold">
                  {equipment.riskLevel}
                </span>
              </div>
            </div>

            {/* Section 1: Modify Action Details */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-3">1. Modify Action Details</p>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block">Action Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block">Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={500}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <p className="text-[10px] text-gray-400 text-right">{description.length}/500</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-500 mb-1 block">Priority *</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as typeof PRIORITY_OPTIONS[number])}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      {PRIORITY_OPTIONS.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-500 mb-1 block">Recommended Window *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={window_}
                        onChange={(e) => setWindow_(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs pr-8 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <Calendar size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-500 mb-1 block">Assigned To *</label>
                    <select
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      {TEAM_OPTIONS.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-500 mb-1 block">Estimated Duration *</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      {DURATION_OPTIONS.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Expected Benefits */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">2. Expected Benefit</p>
              <div className="space-y-1.5">
                {allDefaultBenefits.map((b) => (
                  <label key={b} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={benefits.includes(b)}
                      onChange={() => toggleBenefit(b)}
                      className="w-3.5 h-3.5 rounded accent-blue-600"
                    />
                    {b}
                  </label>
                ))}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={otherBenefit.trim().length > 0}
                    readOnly
                    className="w-3.5 h-3.5 rounded accent-blue-600"
                  />
                  <input
                    type="text"
                    value={otherBenefit}
                    onChange={(e) => setOtherBenefit(e.target.value)}
                    placeholder="Enter additional benefit ..."
                    className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Notes */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">3. Approval Notes (Optional)</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={500}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Add field condition notes or additional context..."
              />
              <p className="text-[10px] text-gray-400 text-right">{notes.length}/500</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
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
                  <><CheckCircle size={15} /> Saved!</>
                ) : (
                  "Confirm Approval"
                )}
              </button>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold text-gray-700 mb-3">Modified Recommendation Preview</p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3 sticky top-4">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={13} className="text-red-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">{title}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Priority: {priority} ↑</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3 space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={12} className="text-gray-400" />
                  <span>Scheduled Date: {window_}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-gray-400" />
                  <span>Estimated Duration: {duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={12} className="text-gray-400" />
                  <span>Assigned To: {assignedTo}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <p className="text-[11px] font-medium text-gray-700 mb-1.5">Expected Benefit</p>
                {benefits.map((b) => (
                  <div key={b} className="flex items-center gap-1.5 mb-1">
                    <CheckCircle size={11} className="text-green-500 flex-shrink-0" />
                    <span className="text-[11px] text-gray-600">{b}</span>
                  </div>
                ))}
                {otherBenefit.trim() && (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle size={11} className="text-green-500 flex-shrink-0" />
                    <span className="text-[11px] text-gray-600">{otherBenefit}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
