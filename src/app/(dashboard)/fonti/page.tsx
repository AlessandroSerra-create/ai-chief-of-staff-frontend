"use client";

import { useState } from "react";

type StatoFonte = "Attivo" | "In attesa" | "Errore";

interface Fonte {
  id: string;
  nome: string;
  stato: StatoFonte;
  errore?: string;
  dettaglio: React.ReactNode;
  icon: React.ReactNode;
}

function IconSheet() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" />
    </svg>
  );
}

function IconDB() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
    </svg>
  );
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

const FONTI: Fonte[] = [
  {
    id: "gsheet",
    nome: "Google Sheet",
    stato: "Attivo",
    icon: <IconSheet />,
    dettaglio: (
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Documenti collegati</p>
        <div className="space-y-2">
          {[
            { nome: "KPI + CRM — Pamela", fogli: ["KPI", "CRM", "BRA", "ARG"] },
            { nome: "Documento 2", fogli: ["—"] },
            { nome: "Documento 3", fogli: ["—"] },
          ].map((doc) => (
            <div key={doc.nome} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
              <p className="text-sm text-gray-700 font-medium">{doc.nome}</p>
              <div className="flex gap-1 flex-wrap justify-end">
                {doc.fogli.map((f) => (
                  <span key={f} className="text-xs bg-[#EEF1FF] text-[#3B5BF6] px-2 py-0.5 rounded-full font-medium">{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "gmail",
    nome: "Gmail",
    stato: "Attivo",
    icon: <IconMail />,
    dettaglio: (
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Caselle collegate</p>
        <div className="space-y-2">
          {[
            "serra@sorellebrasil.com",
            "producao@sorellebrasil.com",
            "incardona@sorellebrasil.com",
            "dscottini@sorellebrasil.com",
            "vendas@sorellebrasil.com",
            "gilvolpato@sorellebrasil.com",
            "j.werlich@sorellebrasil.com",
            "qualidade@sorellebrasil.com",
            "pcp@sorellebrasil.com",
            "lucac@sorellebrasil.com",
            "financeiro@sorellebrasil.com",
            "laboratorio@sorellebrasil.com",
            "sorelle@sorellebrasil.com",
            "u.garanhani@sorellebrasil.com",
            "valerio@sorellebrasil.com",
            "compras@sorellebrasil.com",
          ].map((email) => (
            <div key={email} className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
              <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
              <p className="text-sm text-gray-700">{email}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "webmais",
    nome: "Webmais ERP",
    stato: "In attesa",
    icon: <IconDB />,
    dettaglio: (
      <div className="space-y-2">
        <p className="text-sm text-gray-500">Integrazione prevista nella Fase 2 del progetto.</p>
        <p className="text-xs text-gray-400">Nessuna connessione attiva al momento.</p>
      </div>
    ),
  },
];

const STATO_STYLE: Record<StatoFonte, string> = {
  Attivo:      "bg-emerald-50 text-emerald-600",
  Errore:      "bg-red-50 text-red-500",
  "In attesa": "bg-amber-50 text-amber-600",
};

const STATO_DOT: Record<StatoFonte, string> = {
  Attivo:      "bg-emerald-500",
  Errore:      "bg-red-400",
  "In attesa": "bg-amber-400",
};

export default function FontiPage() {
  const [aperta, setAperta] = useState<string | null>(null);

  function toggle(id: string) {
    setAperta((prev) => (prev === id ? null : id));
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-base font-semibold text-gray-900 mb-2">Fonti dati</h2>

      {FONTI.map((f) => {
        const isOpen = aperta === f.id;
        return (
          <div
            key={f.id}
            className="bg-white rounded-xl overflow-hidden transition-all"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          >
            <button
              onClick={() => toggle(f.id)}
              className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F5F6FA] flex items-center justify-center text-gray-500 shrink-0">
                  {f.icon}
                </div>
                <p className="font-semibold text-gray-900 text-sm">{f.nome}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${STATO_STYLE[f.stato]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${STATO_DOT[f.stato]}`} />
                  {f.stato}
                </span>
                <IconChevron open={isOpen} />
              </div>
            </button>

            {f.errore && (
              <div className="mx-5 mb-3 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-xs text-red-500 font-medium">⚠ {f.errore}</p>
              </div>
            )}

            {isOpen && (
              <div className="px-5 pb-5 border-t border-[#EEEEEE] pt-4">
                {f.dettaglio}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
