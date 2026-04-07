"use client";

import { useState, useCallback } from "react";

/* ───────────────────── types ───────────────────── */

interface TeamMember {
  nome: string;
  ruolo: string;
  email: string;
}

interface OnboardingData {
  empresa: {
    nome: string;
    settore: string;
    partitaIva: string;
    indirizzo: string;
    sito: string;
  };
  googleSheets: {
    url: string;
    fogli: string;
    frequenzaSync: string;
  };
  gmail: {
    email: string;
    etichette: string;
    filtri: string;
  };
  erpFtp: {
    tipo: "ERP" | "FTP";
    host: string;
    porta: string;
    utente: string;
    percorso: string;
  };
  equipe: TeamMember[];
  preferenzeIA: {
    lingua: string;
    frequenzaReport: string;
    areeFocus: string[];
    istruzioni: string;
  };
}

/* ───────────────────── constants ───────────────────── */

const STEPS = [
  { key: "empresa", label: "Empresa" },
  { key: "sheets", label: "Google Sheets" },
  { key: "gmail", label: "Gmail" },
  { key: "erp", label: "ERP / FTP" },
  { key: "equipe", label: "Equipe" },
  { key: "ia", label: "Preferenze IA" },
  { key: "review", label: "Revisione" },
] as const;

const AREE_FOCUS = [
  "Pipeline commerciale",
  "KPI attività giornaliere",
  "Prospect",
  "Alert compilazione dati",
  "Analisi email",
  "Conversazioni WhatsApp",
  "Report finanziari",
  "Gestione inventario",
];

const FREQUENZE_REPORT = ["Ogni ora", "Ogni 3 ore", "Una volta al giorno", "Settimanale"];

const LINGUE = ["Italiano", "Portoghese", "Inglese", "Spagnolo"];

const INITIAL_DATA: OnboardingData = {
  empresa: { nome: "", settore: "", partitaIva: "", indirizzo: "", sito: "" },
  googleSheets: { url: "", fogli: "", frequenzaSync: "Ogni ora" },
  gmail: { email: "", etichette: "", filtri: "" },
  erpFtp: { tipo: "ERP", host: "", porta: "", utente: "", percorso: "" },
  equipe: [{ nome: "", ruolo: "", email: "" }],
  preferenzeIA: {
    lingua: "Italiano",
    frequenzaReport: "Ogni ora",
    areeFocus: ["Pipeline commerciale", "KPI attività giornaliere"],
    istruzioni: "",
  },
};

/* ───────────────────── YAML generator ───────────────────── */

function toYaml(data: OnboardingData): string {
  const lines: string[] = ["# AI Chief of Staff — Configurazione Cliente", ""];

  lines.push("empresa:");
  lines.push(`  nome: "${data.empresa.nome}"`);
  lines.push(`  settore: "${data.empresa.settore}"`);
  lines.push(`  partita_iva: "${data.empresa.partitaIva}"`);
  lines.push(`  indirizzo: "${data.empresa.indirizzo}"`);
  lines.push(`  sito: "${data.empresa.sito}"`);

  lines.push("");
  lines.push("google_sheets:");
  lines.push(`  url: "${data.googleSheets.url}"`);
  lines.push(`  fogli: "${data.googleSheets.fogli}"`);
  lines.push(`  frequenza_sync: "${data.googleSheets.frequenzaSync}"`);

  lines.push("");
  lines.push("gmail:");
  lines.push(`  email: "${data.gmail.email}"`);
  lines.push(`  etichette: "${data.gmail.etichette}"`);
  lines.push(`  filtri: "${data.gmail.filtri}"`);

  lines.push("");
  lines.push("erp_ftp:");
  lines.push(`  tipo: "${data.erpFtp.tipo}"`);
  lines.push(`  host: "${data.erpFtp.host}"`);
  lines.push(`  porta: "${data.erpFtp.porta}"`);
  lines.push(`  utente: "${data.erpFtp.utente}"`);
  lines.push(`  percorso: "${data.erpFtp.percorso}"`);

  lines.push("");
  lines.push("equipe:");
  data.equipe.forEach((m) => {
    lines.push(`  - nome: "${m.nome}"`);
    lines.push(`    ruolo: "${m.ruolo}"`);
    lines.push(`    email: "${m.email}"`);
  });

  lines.push("");
  lines.push("preferenze_ia:");
  lines.push(`  lingua: "${data.preferenzeIA.lingua}"`);
  lines.push(`  frequenza_report: "${data.preferenzeIA.frequenzaReport}"`);
  lines.push("  aree_focus:");
  data.preferenzeIA.areeFocus.forEach((a) => {
    lines.push(`    - "${a}"`);
  });
  if (data.preferenzeIA.istruzioni) {
    lines.push(`  istruzioni: "${data.preferenzeIA.istruzioni}"`);
  }

  return lines.join("\n");
}

/* ───────────────────── reusable field components ───────────────────── */

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm text-gray-900 placeholder-gray-300 bg-[#F5F6FA] rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#3B5BF6]/30 transition-all"
      />
    </div>
  );
}

/* ───────────────────── step components ───────────────────── */

function StepEmpresa({
  data,
  update,
}: {
  data: OnboardingData["empresa"];
  update: (d: Partial<OnboardingData["empresa"]>) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Nome azienda" value={data.nome} onChange={(v) => update({ nome: v })} placeholder="Aloe Brasil Ltda" />
      <Field label="Settore" value={data.settore} onChange={(v) => update({ settore: v })} placeholder="Cosmetici / Aloe vera" />
      <Field label="Partita IVA / CNPJ" value={data.partitaIva} onChange={(v) => update({ partitaIva: v })} placeholder="12.345.678/0001-00" />
      <Field label="Indirizzo" value={data.indirizzo} onChange={(v) => update({ indirizzo: v })} placeholder="Via Roma 1, Milano" />
      <Field label="Sito web" value={data.sito} onChange={(v) => update({ sito: v })} placeholder="https://aloebrasil.com" type="url" />
    </div>
  );
}

function StepSheets({
  data,
  update,
}: {
  data: OnboardingData["googleSheets"];
  update: (d: Partial<OnboardingData["googleSheets"]>) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="URL dello Spreadsheet" value={data.url} onChange={(v) => update({ url: v })} placeholder="https://docs.google.com/spreadsheets/d/..." type="url" />
      <Field label="Nomi dei fogli (separati da virgola)" value={data.fogli} onChange={(v) => update({ fogli: v })} placeholder="KPI, Pipeline, Contatti" />
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">Frequenza di sincronizzazione</label>
        <div className="flex gap-2 flex-wrap">
          {["Ogni ora", "Ogni 3 ore", "Una volta al giorno"].map((f) => (
            <button
              key={f}
              onClick={() => update({ frequenzaSync: f })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                data.frequenzaSync === f
                  ? "bg-[#3B5BF6] text-white border-[#3B5BF6]"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepGmail({
  data,
  update,
}: {
  data: OnboardingData["gmail"];
  update: (d: Partial<OnboardingData["gmail"]>) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Indirizzo email" value={data.email} onChange={(v) => update({ email: v })} placeholder="nome@azienda.com" type="email" />
      <Field label="Etichette da monitorare (separate da virgola)" value={data.etichette} onChange={(v) => update({ etichette: v })} placeholder="Clienti, Fornitori, Urgente" />
      <Field label="Filtri aggiuntivi" value={data.filtri} onChange={(v) => update({ filtri: v })} placeholder="from:@cliente.com OR subject:preventivo" />
    </div>
  );
}

function StepErpFtp({
  data,
  update,
}: {
  data: OnboardingData["erpFtp"];
  update: (d: Partial<OnboardingData["erpFtp"]>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">Tipo di connessione</label>
        <div className="flex gap-3">
          {(["ERP", "FTP"] as const).map((t) => (
            <button
              key={t}
              onClick={() => update({ tipo: t })}
              className={`flex-1 rounded-xl px-4 py-3.5 text-center transition-colors border-2 ${
                data.tipo === t ? "border-[#3B5BF6] bg-[#EEF1FF]" : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
              <span className={`text-sm font-semibold ${data.tipo === t ? "text-[#3B5BF6]" : "text-gray-700"}`}>{t}</span>
            </button>
          ))}
        </div>
      </div>
      <Field label="Host" value={data.host} onChange={(v) => update({ host: v })} placeholder="erp.azienda.com" />
      <Field label="Porta" value={data.porta} onChange={(v) => update({ porta: v })} placeholder="443" />
      <Field label="Utente" value={data.utente} onChange={(v) => update({ utente: v })} placeholder="api_user" />
      <Field label="Percorso / Endpoint" value={data.percorso} onChange={(v) => update({ percorso: v })} placeholder="/api/v1/data o /export/daily" />
    </div>
  );
}

function StepEquipe({
  data,
  update,
}: {
  data: TeamMember[];
  update: (members: TeamMember[]) => void;
}) {
  const updateMember = (i: number, field: keyof TeamMember, value: string) => {
    const next = [...data];
    next[i] = { ...next[i], [field]: value };
    update(next);
  };

  const addMember = () => update([...data, { nome: "", ruolo: "", email: "" }]);

  const removeMember = (i: number) => {
    if (data.length <= 1) return;
    update(data.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-4">
      {data.map((m, i) => (
        <div key={i} className="bg-[#F5F6FA] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Membro {i + 1}</span>
            {data.length > 1 && (
              <button onClick={() => removeMember(i)} className="text-xs text-red-400 hover:text-red-600 transition-colors">
                Rimuovi
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Nome</label>
              <input
                value={m.nome}
                onChange={(e) => updateMember(i, "nome", e.target.value)}
                placeholder="Mario Rossi"
                className="w-full text-sm text-gray-900 placeholder-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3B5BF6]/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Ruolo</label>
              <input
                value={m.ruolo}
                onChange={(e) => updateMember(i, "ruolo", e.target.value)}
                placeholder="Sales Manager"
                className="w-full text-sm text-gray-900 placeholder-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3B5BF6]/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={m.email}
                onChange={(e) => updateMember(i, "email", e.target.value)}
                placeholder="mario@azienda.com"
                className="w-full text-sm text-gray-900 placeholder-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3B5BF6]/30 transition-all"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addMember}
        className="w-full py-2.5 rounded-lg border-2 border-dashed border-gray-200 text-sm font-medium text-gray-400 hover:border-[#3B5BF6] hover:text-[#3B5BF6] transition-colors"
      >
        + Aggiungi membro
      </button>
    </div>
  );
}

function StepPreferenzeIA({
  data,
  update,
}: {
  data: OnboardingData["preferenzeIA"];
  update: (d: Partial<OnboardingData["preferenzeIA"]>) => void;
}) {
  const toggleArea = (area: string) => {
    const next = data.areeFocus.includes(area)
      ? data.areeFocus.filter((a) => a !== area)
      : [...data.areeFocus, area];
    update({ areeFocus: next });
  };

  return (
    <div className="space-y-5">
      {/* Lingua */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">Lingua dei report</label>
        <div className="flex gap-2 flex-wrap">
          {LINGUE.map((l) => (
            <button
              key={l}
              onClick={() => update({ lingua: l })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                data.lingua === l
                  ? "bg-[#3B5BF6] text-white border-[#3B5BF6]"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Frequenza */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">Frequenza report</label>
        <div className="flex gap-2 flex-wrap">
          {FREQUENZE_REPORT.map((f) => (
            <button
              key={f}
              onClick={() => update({ frequenzaReport: f })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                data.frequenzaReport === f
                  ? "bg-[#3B5BF6] text-white border-[#3B5BF6]"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Aree focus */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Aree di focus</label>
        <p className="text-xs text-gray-400 mb-3">Seleziona le aree che il sistema deve monitorare</p>
        <div className="flex flex-wrap gap-2">
          {AREE_FOCUS.map((a) => {
            const active = data.areeFocus.includes(a);
            return (
              <button
                key={a}
                onClick={() => toggleArea(a)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                  active
                    ? "bg-[#3B5BF6] text-white border-[#3B5BF6]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>

      {/* Istruzioni custom */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Istruzioni personalizzate</label>
        <textarea
          rows={3}
          value={data.istruzioni}
          onChange={(e) => update({ istruzioni: e.target.value })}
          placeholder="Es. Concentrati sui prospect argentini e segnala cali nelle email inviate..."
          className="w-full text-sm text-gray-900 placeholder-gray-300 bg-[#F5F6FA] rounded-lg px-4 py-2.5 outline-none resize-none focus:ring-2 focus:ring-[#3B5BF6]/30 transition-all"
        />
      </div>
    </div>
  );
}

/* ───────────────────── review step ───────────────────── */

function SummaryRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-1.5">
      <span className="text-xs text-gray-400 w-36 shrink-0">{label}</span>
      <span className="text-sm text-gray-700">{value}</span>
    </div>
  );
}

function StepRevisione({ data }: { data: OnboardingData }) {
  const [copiato, setCopiato] = useState(false);
  const yaml = toYaml(data);

  const copyYaml = useCallback(async () => {
    await navigator.clipboard.writeText(yaml);
    setCopiato(true);
    setTimeout(() => setCopiato(false), 2000);
  }, [yaml]);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="space-y-4">
        <div className="bg-[#F5F6FA] rounded-xl p-4">
          <h4 className="text-xs font-semibold text-gray-500 mb-2">Empresa</h4>
          <SummaryRow label="Nome" value={data.empresa.nome} />
          <SummaryRow label="Settore" value={data.empresa.settore} />
          <SummaryRow label="P.IVA / CNPJ" value={data.empresa.partitaIva} />
          <SummaryRow label="Indirizzo" value={data.empresa.indirizzo} />
          <SummaryRow label="Sito" value={data.empresa.sito} />
        </div>

        <div className="bg-[#F5F6FA] rounded-xl p-4">
          <h4 className="text-xs font-semibold text-gray-500 mb-2">Integrazioni</h4>
          <SummaryRow label="Google Sheets" value={data.googleSheets.url || "Non configurato"} />
          <SummaryRow label="Gmail" value={data.gmail.email || "Non configurato"} />
          <SummaryRow label={data.erpFtp.tipo} value={data.erpFtp.host || "Non configurato"} />
        </div>

        <div className="bg-[#F5F6FA] rounded-xl p-4">
          <h4 className="text-xs font-semibold text-gray-500 mb-2">Equipe</h4>
          {data.equipe
            .filter((m) => m.nome)
            .map((m, i) => (
              <SummaryRow key={i} label={m.ruolo || "Membro"} value={`${m.nome} — ${m.email}`} />
            ))}
          {!data.equipe.some((m) => m.nome) && (
            <p className="text-xs text-gray-400">Nessun membro aggiunto</p>
          )}
        </div>

        <div className="bg-[#F5F6FA] rounded-xl p-4">
          <h4 className="text-xs font-semibold text-gray-500 mb-2">Preferenze IA</h4>
          <SummaryRow label="Lingua" value={data.preferenzeIA.lingua} />
          <SummaryRow label="Frequenza" value={data.preferenzeIA.frequenzaReport} />
          <SummaryRow label="Focus" value={data.preferenzeIA.areeFocus.join(", ")} />
          {data.preferenzeIA.istruzioni && (
            <SummaryRow label="Istruzioni" value={data.preferenzeIA.istruzioni} />
          )}
        </div>
      </div>

      {/* YAML output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold text-gray-500">Configurazione YAML</h4>
          <button
            onClick={copyYaml}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              copiato
                ? "bg-emerald-500 text-white"
                : "bg-[#3B5BF6] text-white hover:bg-[#2f4de0]"
            }`}
          >
            {copiato ? "Copiato!" : "Copia YAML"}
          </button>
        </div>
        <pre className="bg-gray-900 text-gray-100 rounded-xl p-5 text-xs leading-relaxed overflow-x-auto">
          {yaml}
        </pre>
      </div>
    </div>
  );
}

/* ───────────────────── step descriptions ───────────────────── */

const STEP_META: Record<string, { title: string; subtitle: string }> = {
  empresa:  { title: "Dati azienda",           subtitle: "Informazioni principali sulla tua azienda" },
  sheets:   { title: "Google Sheets",           subtitle: "Collega i tuoi fogli di calcolo per importare KPI e dati" },
  gmail:    { title: "Gmail",                   subtitle: "Configura il monitoraggio email" },
  erp:      { title: "ERP / FTP",               subtitle: "Connetti il tuo gestionale o server FTP" },
  equipe:   { title: "Il tuo team",             subtitle: "Aggiungi i membri del team che riceveranno i report" },
  ia:       { title: "Preferenze IA",           subtitle: "Personalizza il comportamento dell'assistente" },
  review:   { title: "Revisione",              subtitle: "Controlla i dati e genera la configurazione" },
};

/* ───────────────────── main page ───────────────────── */

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);

  const currentKey = STEPS[step].key;
  const meta = STEP_META[currentKey];

  /* updaters */
  const updateEmpresa = (d: Partial<OnboardingData["empresa"]>) =>
    setData((prev) => ({ ...prev, empresa: { ...prev.empresa, ...d } }));

  const updateSheets = (d: Partial<OnboardingData["googleSheets"]>) =>
    setData((prev) => ({ ...prev, googleSheets: { ...prev.googleSheets, ...d } }));

  const updateGmail = (d: Partial<OnboardingData["gmail"]>) =>
    setData((prev) => ({ ...prev, gmail: { ...prev.gmail, ...d } }));

  const updateErp = (d: Partial<OnboardingData["erpFtp"]>) =>
    setData((prev) => ({ ...prev, erpFtp: { ...prev.erpFtp, ...d } }));

  const updateEquipe = (members: TeamMember[]) =>
    setData((prev) => ({ ...prev, equipe: members }));

  const updateIA = (d: Partial<OnboardingData["preferenzeIA"]>) =>
    setData((prev) => ({ ...prev, preferenzeIA: { ...prev.preferenzeIA, ...d } }));

  /* render current step */
  function renderStep() {
    switch (currentKey) {
      case "empresa": return <StepEmpresa data={data.empresa} update={updateEmpresa} />;
      case "sheets":  return <StepSheets data={data.googleSheets} update={updateSheets} />;
      case "gmail":   return <StepGmail data={data.gmail} update={updateGmail} />;
      case "erp":     return <StepErpFtp data={data.erpFtp} update={updateErp} />;
      case "equipe":  return <StepEquipe data={data.equipe} update={updateEquipe} />;
      case "ia":      return <StepPreferenzeIA data={data.preferenzeIA} update={updateIA} />;
      case "review":  return <StepRevisione data={data} />;
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* ── Header ── */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">AI Chief of Staff</h1>
          <p className="text-sm text-gray-400">Configurazione iniziale</p>
        </div>

        {/* ── Progress bar ── */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setStep(i)}
              className="flex-1 group relative"
            >
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  i < step
                    ? "bg-[#3B5BF6]"
                    : i === step
                    ? "bg-[#3B5BF6]"
                    : "bg-gray-200"
                }`}
              />
              <span
                className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium whitespace-nowrap transition-colors ${
                  i <= step ? "text-[#3B5BF6]" : "text-gray-300"
                }`}
              >
                {s.label}
              </span>
            </button>
          ))}
        </div>

        {/* ── Card ── */}
        <div className="bg-white rounded-xl p-6 mt-10" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          {/* Step header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#EEF1FF] text-[#3B5BF6] text-xs font-bold">
                {step + 1}
              </span>
              <h2 className="text-sm font-semibold text-gray-900">{meta.title}</h2>
            </div>
            <p className="text-xs text-gray-400 ml-8">{meta.subtitle}</p>
          </div>

          {/* Step content */}
          {renderStep()}
        </div>

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-0 disabled:pointer-events-none"
          >
            Indietro
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-[#3B5BF6] text-white hover:bg-[#2f4de0] transition-colors"
            >
              Avanti
            </button>
          ) : (
            <button
              onClick={() => {
                /* future: save to backend */
                alert("Configurazione completata!");
              }}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
            >
              Completa setup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
