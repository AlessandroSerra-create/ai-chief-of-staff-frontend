const FONTI = [
  {
    nome: "Google Sheet",
    stato: "Attivo",
    sinc: "Ultima lettura: 2 min fa",
    dettaglio: "KPI + CRM + BRA + ARG",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    nome: "Gmail",
    stato: "Attivo",
    sinc: "Ultima lettura: 8 min fa",
    dettaglio: "3 email nuove rilevate",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" />
      </svg>
    ),
  },
  {
    nome: "WhatsApp",
    stato: "In attesa",
    sinc: "Export manuale richiesto",
    dettaglio: "Ultimo import: 3 giorni fa",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    nome: "Webmais ERP",
    stato: "In attesa",
    sinc: "Integrazione Fase 2",
    dettaglio: "Nessuna connessione attiva",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
      </svg>
    ),
  },
];

const STATO_STYLE: Record<string, string> = {
  Attivo: "bg-emerald-50 text-emerald-600",
  Errore: "bg-red-50 text-red-500",
  "In attesa": "bg-amber-50 text-amber-600",
};

const STATO_DOT: Record<string, string> = {
  Attivo: "bg-emerald-500",
  Errore: "bg-red-400",
  "In attesa": "bg-amber-400",
};

const REPORT_ROWS = [
  { data: "01/04/2026", ora: "14:00", stato: "Generato", dim: "4.2 KB" },
  { data: "31/03/2026", ora: "14:00", stato: "Generato", dim: "3.9 KB" },
  { data: "30/03/2026", ora: "14:00", stato: "Errore", dim: "—" },
  { data: "29/03/2026", ora: "14:00", stato: "Generato", dim: "4.1 KB" },
  { data: "28/03/2026", ora: "14:00", stato: "Generato", dim: "3.7 KB" },
];

export default function FontiPage() {
  return (
    <div className="space-y-8">
      {/* ── Sezione 1: Fonti dati ── */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Fonti dati</h2>
        <div className="grid grid-cols-2 gap-4">
          {FONTI.map((f) => (
            <div
              key={f.nome}
              className="bg-white rounded-xl p-5"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F5F6FA] flex items-center justify-center text-gray-500">
                    {f.icon}
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{f.nome}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${STATO_STYLE[f.stato]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${STATO_DOT[f.stato]}`} />
                  {f.stato}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-1">{f.sinc}</p>
              <p className="text-xs text-gray-400">{f.dettaglio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sezione 2: Archivio report ── */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Archivio report</h2>
        <div
          className="bg-white rounded-xl overflow-hidden"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F6FA]">
                {["Data", "Ora", "Stato", "Dimensione", "Azione"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REPORT_ROWS.map((row, i) => {
                const isError = row.stato === "Errore";
                return (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}>
                    <td className="px-6 py-3.5 text-xs font-medium text-gray-700">{row.data}</td>
                    <td className="px-6 py-3.5 text-xs text-gray-500">{row.ora}</td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                          isError ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isError ? "bg-red-400" : "bg-emerald-500"}`} />
                        {row.stato}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-gray-500">{row.dim}</td>
                    <td className="px-6 py-3.5">
                      {!isError ? (
                        <button className="text-xs text-[#3B5BF6] font-medium hover:underline">
                          Visualizza
                        </button>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
