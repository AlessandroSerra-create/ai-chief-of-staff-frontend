"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";

const METRICS_FALLBACK = [
  { label: "Email inviate", value: 47, trend: +12 },
  { label: "Follow-up", value: 23, trend: +5 },
  { label: "Risposte", value: 9, trend: -2 },
  { label: "Riunioni", value: 3, trend: +1 },
];

const KPI_COLS = [
  { label: "Email inviate", key: "Novos e-mails enviados" },
  { label: "Follow-up", key: "Follow-ups enviados" },
  { label: "Risposte", key: "Respostas recebidas" },
  { label: "Riunioni", key: "Reuniões agendadas" },
];

function sumCol(rows: any[], key: string): number {
  return rows.reduce((acc, r) => acc + (parseInt(r[key]) || 0), 0);
}

function buildMetrics(rows: any[]) {
  const filled = rows.filter((r) =>
    KPI_COLS.some(({ key }) => r[key] && r[key].toString().trim() !== "" && r[key].toString().trim() !== "0")
  );
  console.log("Prima riga filled:", JSON.stringify(filled[0]));
  console.log("Ultima riga filled:", JSON.stringify(filled[filled.length - 1]));
  console.log(`Righe con dati: ${filled.length} su ${rows.length} totali`);
  const mid = Math.floor(filled.length / 2);
  const recent = filled.slice(mid);
  const previous = filled.slice(0, mid);
  const primaData = filled[0]?.Data ?? "";
  const ultimaData = filled[filled.length - 1]?.Data ?? "";
  return {
    metrics: KPI_COLS.map(({ label, key }) => ({
      label,
      value: sumCol(filled, key),
      trend: sumCol(recent, key) - sumCol(previous, key),
    })),
    periodLabel: primaData && ultimaData ? `dal ${primaData} al ${ultimaData}` : null,
  };
}


export default function ReportPage() {
  const [domanda, setDomanda] = useState("");
  const [messaggi, setMessaggi] = useState<{ ruolo: "utente" | "ai"; testo: string }[]>([]);
  const [caricamento, setCaricamento] = useState(false);
  const [reportTesto, setReportTesto] = useState<string | null>(null);
  const [reportData, setReportData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(METRICS_FALLBACK);
  const [periodLabel, setPeriodLabel] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      // Report finale
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("fonte", "finale")
        .neq("testo", "Errore")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (data && !error) {
        setReportTesto(data.testo);
        setReportData(data.created_at);
      }

      // KPI reali
      const { data: kpiData } = await supabase
        .from("canonical_data")
        .select("payload")
        .eq("cliente", "aloe-vera-pilot")
        .order("creato_at", { ascending: false })
        .limit(1)
        .single();
      console.log("kpiData:", kpiData);
      if (kpiData?.payload) {
        const rows: any[] = kpiData.payload.KPI?.rows ?? [];
        if (rows.length > 0) {
          const { metrics: m, periodLabel: p } = buildMetrics(rows);
          setMetrics(m);
          if (p) setPeriodLabel(p);
        }
      }

      setLoading(false);
    }
    fetchAll();
  }, []);

  async function inviaMessaggio(e: React.FormEvent) {
    e.preventDefault();
    if (!domanda.trim() || caricamento) return;
    const testo = domanda.trim();
    setMessaggi((prev) => [...prev, { ruolo: "utente", testo }]);
    setDomanda("");
    setCaricamento(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domanda: testo, reportContesto: reportTesto ?? "" }),
      });
      const json = await res.json();
      setMessaggi((prev) => [...prev, { ruolo: "ai", testo: json.risposta ?? "Errore nella risposta." }]);
    } catch {
      setMessaggi((prev) => [...prev, { ruolo: "ai", testo: "Errore di connessione." }]);
    } finally {
      setCaricamento(false);
    }
  }

  const oraBadge = reportData
    ? new Date(reportData).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
    : null;
  const dataHeader = reportData
    ? new Date(reportData).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="space-y-6">
      {/* ── Metriche ── */}
      <div className="space-y-2">
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((m) => {
          const positive = m.trend >= 0;
          return (
            <div
              key={m.label}
              className="bg-white rounded-xl p-5"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            >
              <p className="text-xs text-gray-400 font-medium mb-3">{m.label}</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{m.value}</p>
              <div className="flex items-center gap-1">
                {positive ? (
                  <TrendingUp size={13} className="text-emerald-500" />
                ) : (
                  <TrendingDown size={13} className="text-red-400" />
                )}
                <span
                  className={`text-xs font-medium ${
                    positive ? "text-emerald-500" : "text-red-400"
                  }`}
                >
                  {positive ? "+" : ""}{m.trend} vs periodo prec.
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400">
        {periodLabel ?? "Periodo non disponibile"}
      </p>
      </div>

      {/* ── Sezione centrale ── */}
      <div className="flex gap-5">
        {/* Colonna sinistra 70% */}
        <div className="flex-[7] min-w-0 space-y-4">
          {/* Card report AI */}
          <div
            className="bg-white rounded-xl"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEEEEE]">
              <div>
                <h2 className="font-semibold text-gray-900 text-sm">
                  Ultimo report AI
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {dataHeader ?? "—"}
                </p>
              </div>
              {oraBadge && (
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-medium px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Aggiornato {oraBadge}
                </span>
              )}
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Corpo report */}
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-5/6" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                </div>
              ) : reportTesto ? (
                <div className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none">
                  <ReactMarkdown>{reportTesto}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Nessun report ancora generato
                </p>
              )}

            </div>
          </div>
        </div>

        {/* Colonna destra 30% */}
        <div className="flex-[3] min-w-0">
          <div
            className="bg-white rounded-xl flex flex-col h-full"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          >
            {/* Titolo */}
            <div className="px-5 py-4 border-b border-[#EEEEEE] shrink-0">
              <h2 className="font-semibold text-gray-900 text-sm">
                Conversazione
              </h2>
            </div>

            {/* Messaggi scrollabili */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {messaggi.length === 0 && (
                <p className="text-xs text-gray-300 italic text-center mt-4">
                  Nessun messaggio ancora. Fai una domanda al report.
                </p>
              )}
              {messaggi.map((msg, i) => {
                const isAI = msg.ruolo === "ai";
                return (
                  <div key={i} className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed ${
                        isAI ? "bg-[#F5F6FA] text-gray-700" : "bg-[#EEF1FF] text-[#3B5BF6]"
                      }`}
                    >
                      {isAI ? (
                        <ReactMarkdown
                          components={{
                            p: ({children}) => <p className="text-sm text-gray-700 mb-1 leading-relaxed">{children}</p>,
                            strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                            ul: ({children}) => <ul className="list-disc list-inside text-sm text-gray-700 mb-1">{children}</ul>,
                            li: ({children}) => <li className="mb-0.5">{children}</li>,
                          }}
                        >
                          {msg.testo}
                        </ReactMarkdown>
                      ) : msg.testo}
                    </div>
                  </div>
                );
              })}
              {caricamento && (
                <div className="flex justify-start">
                  <div className="bg-[#F5F6FA] rounded-xl px-4 py-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input fisso in fondo */}
            <form
              onSubmit={inviaMessaggio}
              className="shrink-0 flex items-center gap-3 px-5 py-4 border-t border-[#EEEEEE]"
            >
              <input
                type="text"
                value={domanda}
                onChange={(e) => setDomanda(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); inviaMessaggio(e); } }}
                placeholder="Fai una domanda al report..."
                disabled={caricamento}
                className="flex-1 text-sm bg-[#F5F6FA] rounded-lg px-4 py-2.5 outline-none placeholder-gray-400 text-gray-900 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={caricamento || !domanda.trim()}
                className="flex items-center gap-2 bg-[#3B5BF6] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#2f4de0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={14} />
                Invia
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
