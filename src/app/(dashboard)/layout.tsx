"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Settings, Search, Bell } from "lucide-react";

// SVG inline per icone non disponibili nella versione installata di lucide-react
function IconChat({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconTask({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function IconDatabase({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
    </svg>
  );
}

const NAV_ITEMS = [
  { icon: IconChat, label: "Chat AI", href: "/chat" },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: IconTask, label: "Task", href: "/task" },
  { icon: IconDatabase, label: "Fonti", href: "/fonti" },
];

const PAGE_TITLES: Record<string, string> = {
  "/chat": "Chat AI",
  "/dashboard": "Dashboard",
  "/task": "Task",
  "/fonti": "Fonti dati",
  "/impostazioni": "Impostazioni",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState(pathname);

  const pageTitle = PAGE_TITLES[active] ?? "Dashboard";

  function navigate(href: string) {
    setActive(href);
    router.push(href);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F6FA]">
      {/* ── COLONNA 1: Sidebar icone ── */}
      <aside className="w-16 bg-white border-r border-[#EEEEEE] flex flex-col items-center py-4 shrink-0">
        {/* Logo */}
        <div className="w-9 h-9 bg-[#3B5BF6] rounded-lg flex items-center justify-center text-white font-bold text-base mb-8 shrink-0">
          C
        </div>

        {/* Nav icons */}
        <nav className="flex flex-col items-center gap-1 flex-1">
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const isActive = active === href;
            return (
              <button
                key={href}
                onClick={() => navigate(href)}
                title={label}
                className={`relative w-full flex items-center justify-center h-11 transition-colors ${
                  isActive ? "bg-[#EEF1FF]" : "hover:bg-gray-50"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-[3px] bg-[#3B5BF6] rounded-r-full" />
                )}
                <Icon className={isActive ? "text-[#3B5BF6]" : "text-gray-400"} />
              </button>
            );
          })}
        </nav>

        {/* Settings + Avatar in fondo */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => navigate("/impostazioni")}
            title="Impostazioni"
            className={`relative w-full flex items-center justify-center h-11 transition-colors ${
              active === "/impostazioni" ? "bg-[#EEF1FF]" : "hover:bg-gray-50"
            }`}
          >
            {active === "/impostazioni" && (
              <span className="absolute left-0 top-0 h-full w-[3px] bg-[#3B5BF6] rounded-r-full" />
            )}
            <Settings
              size={20}
              className={active === "/impostazioni" ? "text-[#3B5BF6]" : "text-gray-400"}
            />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#3B5BF6] flex items-center justify-center text-white text-xs font-semibold">
            AB
          </div>
        </div>
      </aside>

      {/* ── COLONNA 2: Pannello secondario ── */}
      <aside className="w-[280px] bg-white border-r border-[#EEEEEE] flex flex-col shrink-0 overflow-y-auto">
        {/* Avatar + nome cliente */}
        <div className="flex flex-col items-center pt-8 pb-6 px-5 border-b border-[#EEEEEE]">
          <div className="w-16 h-16 rounded-full bg-[#3B5BF6] flex items-center justify-center text-white text-xl font-bold mb-3">
            AB
          </div>
          <p className="font-semibold text-gray-900 text-sm">Aloe Brasil</p>
          <p className="text-xs text-gray-400 mt-0.5">aloe-vera-pilot</p>
        </div>

        {/* Ultimi alert */}
        <div className="px-5 pt-5 pb-4 border-b border-[#EEEEEE]">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Ultimi alert
          </p>
          <div className="space-y-3">
            {[
              { dot: "bg-red-400", text: "KPI non compilati ieri" },
              { dot: "bg-yellow-400", text: "3 follow-up in scadenza" },
              { dot: "bg-blue-400", text: "Nuovo contatto CRM aggiunto" },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${a.dot}`} />
                <p className="text-xs text-gray-600">{a.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Prossimi task */}
        <div className="px-5 pt-5 pb-4 border-b border-[#EEEEEE]">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Prossimi task
          </p>
          <div className="space-y-3">
            {["Chiamare Ricardo — oggi", "Inviare proposta Grupo Verde"].map((t, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-1 w-3 h-3 rounded border border-gray-300 shrink-0" />
                <p className="text-xs text-gray-600">{t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trend settimanale placeholder */}
        <div className="px-5 pt-5 mt-auto pb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Trend settimanale
          </p>
          <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-xs text-gray-400">Trend settimanale</p>
          </div>
        </div>
      </aside>

      {/* ── COLONNA 3: Contenuto principale ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-[#F5F6FA] flex items-center justify-between px-6 shrink-0 border-b border-[#EEEEEE]">
          <h1 className="font-semibold text-gray-900 text-base">{pageTitle}</h1>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors">
              <Search size={17} className="text-gray-400" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors relative">
              <Bell size={17} className="text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-400 rounded-full" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
