"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Settings } from "lucide-react";

function IconChat({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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
  { icon: IconDatabase, label: "Fonti", href: "/fonti" },
];

const PAGE_TITLES: Record<string, string> = {
  "/chat": "Chat AI",
  "/dashboard": "Dashboard",
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
      <aside className="w-16 bg-white border-r border-[#EEEEEE] flex flex-col items-center py-4 shrink-0">
        <div className="w-9 h-9 bg-[#3B5BF6] rounded-lg flex items-center justify-center text-white font-bold text-base mb-8 shrink-0">
          C
        </div>
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
            SC
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-[#F5F6FA] flex items-center px-6 shrink-0 border-b border-[#EEEEEE]">
          <h1 className="font-semibold text-gray-900 text-base">{pageTitle}</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
