"use client";

import { useEffect, useState } from "react";

const USERS = [
  { id: "exec",  label: "Executive",       initial: "E", color: "bg-violet-600" },
  { id: "mon",   label: "Monitoring Team", initial: "M", color: "bg-emerald-600" },
];

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
];

const YEARS = ["2024", "2025", "2026"];

export default function NavbarClient() {
  const now = new Date();
  const [time, setTime] = useState(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
  const [activeUser, setActiveUser] = useState(USERS[0]);
  const [userOpen, setUserOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState(MONTHS[now.getMonth()]);
  const [filterYear, setFilterYear]   = useState(String(now.getFullYear()));

  // Realtime clock
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 flex-shrink-0 z-50">
      <div className="px-4 h-12 flex items-center justify-between gap-4">

        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-7 flex-shrink-0">
          <span className="text-base font-bold text-gray-800 tracking-tight">ARIS</span>
          <div className="flex items-center gap-5">
            <a href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Dashboard
            </a>
            <a href="/ai-summary" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              AI Summary
            </a>
          </div>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-4">

          {/* Month + Year filter */}
          <div className="flex items-center gap-1.5">
            <select
              value={filterMonth}
              onChange={e => setFilterMonth(e.target.value)}
              className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-gray-300"
            >
              {MONTHS.map(m => <option key={m}>{m}</option>)}
            </select>
            <select
              value={filterYear}
              onChange={e => setFilterYear(e.target.value)}
              className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-gray-300"
            >
              {YEARS.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-gray-200" />

          {/* Live timestamp */}
          <div className="text-xs font-mono text-gray-500 tabular-nums w-20 text-right">
            {time}
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-gray-200" />

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserOpen(v => !v)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors"
            >
              <span className={`w-6 h-6 rounded-full ${activeUser.color} text-white text-xs flex items-center justify-center font-bold`}>
                {activeUser.initial}
              </span>
              <span>{activeUser.label}</span>
              <span className="text-gray-400 text-xs">▾</span>
            </button>

            {userOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                <p className="px-3 pt-1.5 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Switch Profile</p>
                {USERS.map(u => (
                  <button
                    key={u.id}
                    onClick={() => { setActiveUser(u); setUserOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${activeUser.id === u.id ? "bg-gray-50 font-semibold" : ""}`}
                  >
                    <span className={`w-5 h-5 rounded-full ${u.color} text-white text-xs flex items-center justify-center font-bold`}>
                      {u.initial}
                    </span>
                    {u.label}
                    {activeUser.id === u.id && <span className="ml-auto text-emerald-500 text-xs">✓</span>}
                  </button>
                ))}
                <hr className="my-1 border-gray-100" />
                <a href="#" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">Settings</a>
                <a href="#" className="block px-3 py-2 text-sm text-rose-500 hover:bg-gray-50">Logout</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
