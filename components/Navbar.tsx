"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Calendar } from "lucide-react";
import Sidebar from "./Sidebar";

const navLinks = [
  { label: "Dashboard", href: "/" },
  { label: "AI Summary", href: "/ai-summary" },
  { label: "History", href: "/history" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hh} : ${mm} : ${ss} WIB`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="font-semibold text-gray-800 hidden sm:block">ARIS</span>
            </div>
            {/* Burger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Clock */}
          <div className="text-sm font-mono text-gray-600 font-medium">
            {time}
          </div>
        </div>

        {/* Nav tabs + date */}
        <div className="flex items-center justify-between px-4 py-1.5">
          <nav className="flex items-center gap-1">
            {navLinks.map(({ label, href }) => {
              const active =
                href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(href);
              return (
                <Link
                  key={label}
                  href={href}
                  className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all duration-150
                    ${
                      active
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Calendar size={14} />
            <span>{dateStr}</span>
          </div>
        </div>
      </header>
    </>
  );
}
