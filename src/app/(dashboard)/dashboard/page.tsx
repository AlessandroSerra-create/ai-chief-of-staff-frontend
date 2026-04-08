"use client";

import { useState, useEffect, useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "@/lib/supabase";

// ── Types ──────────────────────────────────────────────
type TimeFilter = "Oggi" | "7 giorni" | "14 giorni" | "30 giorni" | "Tot";
type Tab = "KPI" | "CRM";

const TIME_FILTERS: TimeFilter[] = ["Oggi", "7 giorni", "14 giorni", "30 giorni", "Tot"];
const DAYS_MAP: Record<TimeFilter, number | null> = {
  "Oggi": 0, "7 giorni": 6, "14 giorni": 13, "30 giorni": 29, "Tot": null,
};

function parseRowDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.trim() === "") return null;
  const parts = dateStr.trim().split("/");
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts;
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

function filterRows(rows: any[], period: TimeFilter): any[] {
  const days = DAYS_MAP[period];
  if (days === null) return rows;
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days);
  return rows.filter((r) => {
    const d = parseRowDate(r.Data);
    return d && d >= start && d <= now;
  });
}

// ── KPI helpers ────────────────────────────────────────
const KPI_COLS = [
  { label: "Email inviate", key: "Novos e-mails enviados" },
  { label: "Follow-up",     key: "Follow-ups enviados" },
  { label: "Risposte",      key: "Respostas recebidas" },
  { label: "Riunioni",      key: "Reuniões agendadas" },
];

function sumCol(rows: any[], key: string): number {
  return rows.reduce((acc, r) => acc + (parseInt(r[key]) || 0), 0);
}

function buildMetrics(rows: any[]) {
  const filled = rows.filter((r: any) =>
    KPI_COLS.some(({ key }) => r[key] && r[key].toString().trim() !== "" && r[key].toString().trim() !== "0")
  );

  if (filled.length === 0) {
    return KPI_COLS.map(({ label }) => ({ label, value: 0, trend: 0 }));
  }

  const mid = Math.floor(filled.length / 2);
  const recent = filled.slice(mid);
  const previous = filled.slice(0, mid);

  return KPI_COLS.map(({ label, key }) => ({
    label,
    value: sumCol(filled, key),
    trend: sumCol(recent, key) - sumCol(previous, key),
  }));
}

function buildDetailRows(rows: any[]) {
  const withData = rows.filter((r: any) =>
    r.Data && r.Data.toString().trim() !== "" &&
    KPI_COLS.some(({ key }) => r[key] !== undefined && r[key] !== null && r[key].toString().trim() !== "")
  );
  return withData.slice(-14).reverse();
}

// ── Helpers UI ─────────────────────────────────────────
const CRM_BADGE: Record<string, string> = {
  Attivo:   "bg-emerald-50 text-emerald-600",
  Proposta: "bg-[#EEF1FF] text-[#3B5BF6]",
  Freddo:   "bg-gray-100 text-gray-500",
};

const PROSPECT_BADGE: Record<string, string> = {
  Novo:       "bg-[#EEF1FF] text-[#3B5BF6]",
  Contattato: "bg-emerald-50 text-emerald-600",
};

// ── Component ──────────────────────────────────────────
export default function DashboardPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("30 giorni");
  const [tab, setTab]               = useState<Tab>("KPI");
  const [allKpiRows, setAllKpiRows] = useState<any[]>([]);
  const [crmRows, setCrmRows]       = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from("canonical_data")
        .select("payload")
        .eq("cliente", "aloe-vera-pilot")
        .is("fonte", null)
        .order("creato_at", { ascending: false })
        .limit(1)
        .single();

      console.log("canonical_data payload:", data?.payload);

      if (data?.payload) {
        const p = data.payload;
        setAllKpiRows(p.KPI?.rows ?? []);
        setCrmRows(p.CRM?.rows ?? []);
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered   = useMemo(() => filterRows(allKpiRows, timeFilter), [allKpiRows, timeFilter]);
  const metrics    = useMemo(() => buildMetrics(filtered), [filtered]);
  const detailRows = useMemo(() => buildDetailRows(filtered), [filtered]);

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-1 bg-white rounded-lg p-1" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          {TIME_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                timeFilter === f ? "bg-[#3B5BF6] text-white" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab navigation ── */}
      <div className="flex gap-6 border-b border-[#EEEEEE]">
        {(["KPI", "CRM"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              tab === t ? "text-[#3B5BF6]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {t}
            {tab === t && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#3B5BF6] rounded-full" />}
          </button>
        ))}
      </div>

      {/* ── TAB: KPI ── */}
      {tab === "KPI" && (
        <div className="space-y-5">
          {/* Metric cards */}
          <div className="grid grid-cols-4 gap-4">
            {metrics.map((m) => {
              const positive = m.trend >= 0;
              return (
                <div key={m.label} className="bg-white rounded-xl p-5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <p className="text-xs text-gray-400 font-medium mb-3">{m.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {loading ? <span className="animate-pulse text-gray-200">—</span> : m.value}
                  </p>
                  <div className="flex items-center gap-1">
                    {positive ? <TrendingUp size={13} className="text-emerald-500" /> : <TrendingDown size={13} className="text-red-400" />}
                    <span className={`text-xs font-medium ${positive ? "text-emerald-500" : "text-red-400"}`}>
                      {positive ? "+" : ""}{m.trend} vs periodo prec.
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabella dettaglio giornaliero */}
          <div className="bg-white rounded-xl overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div className="px-6 py-4 border-b border-[#EEEEEE]">
              <h2 className="font-semibold text-gray-900 text-sm">Dettaglio giornaliero</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F6FA]">
                  {["Data", "Email", "Follow-up", "Risposte", "Stato"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-6 text-xs text-gray-300 text-center">Caricamento...</td></tr>
                ) : detailRows.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-6 text-xs text-gray-300 text-center">Nessun dato disponibile</td></tr>
                ) : detailRows.map((row, i) => {
                  const val = (k: string) => row[k]?.toString().trim() ?? "";
                  const email    = val("Novos e-mails enviados");
                  const followup = val("Follow-ups enviados");
                  const risposte = val("Respostas recebidas");
                  const tuttiVuoti = ["Novos e-mails enviados", "Follow-ups enviados", "Respostas recebidas", "Reuniões agendadas"].every(
                    (col) => !row[col] || row[col].toString().trim() === ""
                  );
                  const ok = !tuttiVuoti;
                  const display = (v: string) => (v === "" ? "0" : v);
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}>
                      <td className="px-6 py-3.5 text-xs font-medium text-gray-700">{row.Data}</td>
                      <td className="px-6 py-3.5 text-xs text-gray-600">{display(email)}</td>
                      <td className="px-6 py-3.5 text-xs text-gray-600">{display(followup)}</td>
                      <td className="px-6 py-3.5 text-xs text-gray-600">{display(risposte)}</td>
                      <td className="px-6 py-3.5">
                        {ok ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-xs font-medium px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />Compilato
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-500 text-xs font-medium px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />Non compilato
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB: CRM ── */}
      {tab === "CRM" && (
        <div className="bg-white rounded-xl overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div className="px-6 py-4 border-b border-[#EEEEEE]">
            <h2 className="font-semibold text-gray-900 text-sm">Aziende CRM</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F6FA]">
                {["Azienda", "Ultima nota", "Ultimo contatto"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3} className="px-6 py-6 text-xs text-gray-300 text-center">Caricamento...</td></tr>
              ) : crmRows.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-6 text-xs text-gray-300 text-center">Nessun dato CRM</td></tr>
              ) : crmRows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}>
                  <td className="px-6 py-3.5 text-xs font-semibold text-gray-800">{row["Nome da empresa"] ?? "—"}</td>
                  <td className="px-6 py-3.5 text-xs text-gray-500 max-w-[240px] truncate">{row["Atualizações"] ?? "—"}</td>
                  <td className="px-6 py-3.5 text-xs text-gray-400">{row["Data do contato"] ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
