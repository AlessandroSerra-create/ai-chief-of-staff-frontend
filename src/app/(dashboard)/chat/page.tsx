"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Plus, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";

type Messaggio = { ruolo: "utente" | "ai"; testo: string };
type Conversazione = { id: string; titolo: string; created_at: string };

export default function ChatPage() {
  const [conversazioni, setConversazioni] = useState<Conversazione[]>([]);
  const [convAttiva, setConvAttiva] = useState<string | null>(null);
  const [messaggi, setMessaggi] = useState<Messaggio[]>([]);
  const [domanda, setDomanda] = useState("");
  const [caricamento, setCaricamento] = useState(false);
  const [reportTesto, setReportTesto] = useState<string | null>(null);
  const [reportData, setReportData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchReport() {
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
      setLoading(false);
    }
    fetchReport();
    caricaConversazioni();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messaggi, caricamento]);

  async function caricaConversazioni() {
    const { data } = await supabase
      .from("conversazioni")
      .select("id, titolo, created_at")
      .eq("cliente", "aloe-vera-pilot")
      .order("created_at", { ascending: false })
      .limit(30);
    if (data) setConversazioni(data);
  }

  async function apriConversazione(id: string) {
    const { data } = await supabase
      .from("conversazioni")
      .select("messaggi")
      .eq("id", id)
      .single();
    if (data) {
      setMessaggi(data.messaggi ?? []);
      setConvAttiva(id);
    }
  }

  async function nuovaConversazione() {
    setMessaggi([]);
    setConvAttiva(null);
  }

  async function salvaConversazione(msgs: Messaggio[], id: string | null): Promise<string> {
    const titolo = msgs[0]?.testo.slice(0, 50) ?? "Nuova conversazione";
    if (id) {
      await supabase
        .from("conversazioni")
        .update({ messaggi: msgs })
        .eq("id", id);
      return id;
    } else {
      const { data } = await supabase
        .from("conversazioni")
        .insert({ cliente: "aloe-vera-pilot", titolo, messaggi: msgs })
        .select("id")
        .single();
      await caricaConversazioni();
      return data?.id ?? "";
    }
  }

  async function inviaMessaggio(e: React.FormEvent) {
    e.preventDefault();
    if (!domanda.trim() || caricamento) return;
    const testo = domanda.trim();
    const nuoviMsg: Messaggio[] = [...messaggi, { ruolo: "utente", testo }];
    setMessaggi(nuoviMsg);
    setDomanda("");
    setCaricamento(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domanda: testo, reportContesto: reportTesto ?? "" }),
      });
      const json = await res.json();
      const risposta = json.risposta ?? "Errore nella risposta.";
      const msgFinali: Messaggio[] = [...nuoviMsg, { ruolo: "ai", testo: risposta }];
      setMessaggi(msgFinali);
      const newId = await salvaConversazione(msgFinali, convAttiva);
      if (!convAttiva) setConvAttiva(newId);
    } catch {
      setMessaggi((prev) => [...prev, { ruolo: "ai", testo: "Errore di connessione." }]);
    } finally {
      setCaricamento(false);
    }
  }

  const oraBadge = reportData
    ? new Date(reportData).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className="flex h-full -m-6 overflow-hidden">

      {/* Sidebar storico */}
      <aside className="w-64 bg-white border-r border-[#EEEEEE] flex flex-col shrink-0">
        <div className="p-4 border-b border-[#EEEEEE]">
          <button
            onClick={nuovaConversazione}
            className="w-full flex items-center justify-center gap-2 bg-[#3B5BF6] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#2f4de0] transition-colors"
          >
            <Plus size={14} />
            Nuova conversazione
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {conversazioni.length === 0 ? (
            <p className="text-xs text-gray-400 text-center mt-8 px-4">Nessuna conversazione salvata</p>
          ) : (
            conversazioni.map((c) => {
              const isAttiva = convAttiva === c.id;
              const data = new Date(c.created_at).toLocaleDateString("it-IT", { day: "2-digit", month: "short" });
              return (
                <button
                  key={c.id}
                  onClick={() => apriConversazione(c.id)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-2.5 transition-colors ${
                    isAttiva ? "bg-[#EEF1FF]" : "hover:bg-gray-50"
                  }`}
                >
                  <MessageSquare size={13} className={`mt-0.5 shrink-0 ${isAttiva ? "text-[#3B5BF6]" : "text-gray-400"}`} />
                  <div className="min-w-0">
                    <p className={`text-xs font-medium truncate ${isAttiva ? "text-[#3B5BF6]" : "text-gray-700"}`}>
                      {c.titolo}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{data}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Area chat */}
      <div className="flex flex-col flex-1 bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEEEEE] shrink-0">
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">AI Chief of Staff</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {loading ? "Caricamento contesto..." : reportTesto ? "Report caricato — pronto a rispondere" : "Nessun report disponibile"}
            </p>
          </div>
          {oraBadge && (
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-medium px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Report {oraBadge}
            </span>
          )}
        </div>

        {/* Messaggi */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {messaggi.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-12 h-12 bg-[#EEF1FF] rounded-full flex items-center justify-center mb-4">
                <Send size={20} className="text-[#3B5BF6]" />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">Chiedimi qualsiasi cosa</p>
              <p className="text-xs text-gray-400 max-w-sm">
                Ho accesso all&apos;ultimo report aziendale con dati KPI, CRM, prospect e comunicazioni email.
              </p>
            </div>
          )}
          {messaggi.map((msg, i) => {
            const isAI = msg.ruolo === "ai";
            return (
              <div key={i} className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[70%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  isAI ? "bg-[#F5F6FA] text-gray-700" : "bg-[#EEF1FF] text-[#3B5BF6]"
                }`}>
                  {isAI ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="text-sm text-gray-700 mb-1 leading-relaxed">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc list-inside text-sm text-gray-700 mb-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside text-sm text-gray-700 mb-1">{children}</ol>,
                        li: ({ children }) => <li className="mb-0.5">{children}</li>,
                      }}
                    >
                      {msg.testo}
                    </ReactMarkdown>
                  ) : (
                    msg.testo
                  )}
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

        {/* Input */}
        <form
          onSubmit={inviaMessaggio}
          className="shrink-0 flex items-center gap-3 px-6 py-4 border-t border-[#EEEEEE]"
        >
          <input
            type="text"
            value={domanda}
            onChange={(e) => setDomanda(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                inviaMessaggio(e as any);
              }
            }}
            placeholder="Scrivi un messaggio..."
            disabled={caricamento}
            className="flex-1 text-sm bg-[#F5F6FA] rounded-lg px-4 py-2.5 outline-none placeholder-gray-400 text-gray-900 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={caricamento || !domanda.trim()}
            className="flex items-center gap-2 bg-[#3B5BF6] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#2f4de0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={14} />
            Invia
          </button>
        </form>
      </div>
    </div>
  );
}
