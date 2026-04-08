"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLingua } from "@/lib/lingua-context";
import { t } from "@/lib/i18n";

const FOCUS_TAGS = [
  "Pipeline commerciale",
  "KPI attività giornaliere",
  "Prospect BRA",
  "Prospect ARG",
  "Alert compilazione dati",
  "Analisi email",
];

const FREQUENZE = [
  { label: "Ogni ora", consigliato: true },
  { label: "Ogni 3 ore", consigliato: false },
  { label: "Una volta al giorno", consigliato: false },
];

const DEFAULT_FOCUS = ["Pipeline commerciale", "KPI attività giornaliere", "Prospect BRA"];

export default function ImpostazioniPage() {
  const [focus, setFocus]           = useState<string[]>(DEFAULT_FOCUS);
  const [istruzione, setIstruzione] = useState("");
  const [frequenza, setFrequenza]   = useState("Ogni ora");
  const [salvato, setSalvato]       = useState(false);
  const [salvando, setSalvando]     = useState(false);
  const { lingua } = useLingua();

  useEffect(() => {
    async function caricaConfig() {
      const { data } = await supabase
        .from("configurazioni")
        .select("*")
        .eq("cliente", "aloe-vera-pilot")
        .single();
      if (data) {
        if (data.focus?.length) setFocus(data.focus);
        if (data.istruzione_custom) setIstruzione(data.istruzione_custom);
        if (data.frequenza) setFrequenza(data.frequenza);
      }
    }
    caricaConfig();
  }, []);

  function toggleFocus(tag: string) {
    setFocus((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function salvaConfigurazione() {
    setSalvando(true);
    await supabase.from("configurazioni").upsert({
      cliente: "aloe-vera-pilot",
      focus,
      istruzione_custom: istruzione,
      frequenza,
      aggiornato_at: new Date().toISOString(),
    }, { onConflict: "cliente" });
    setSalvando(false);
    setSalvato(true);
    setTimeout(() => setSalvato(false), 2000);
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div className="bg-white rounded-xl p-6" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">{t(lingua, "azienda")}</h2>
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-medium px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            {t(lingua, "attivo")}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <p className="text-xs text-gray-400 w-20">{t(lingua, "nome")}</p>
            <p className="text-sm font-semibold text-gray-900">Sorelle Industria e Comercio LTDA</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs text-gray-400 w-20">{t(lingua, "settore")}</p>
            <p className="text-sm text-gray-600">Aloe vera / Prodotti</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <h2 className="text-sm font-semibold text-gray-900 mb-1">{t(lingua, "focusReport")}</h2>
        <p className="text-xs text-gray-400 mb-5">
          {t(lingua, "focusDesc")}
        </p>
        <div className="flex flex-wrap gap-2">
          {FOCUS_TAGS.map((tag) => {
            const active = focus.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleFocus(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                  active
                    ? "bg-[#3B5BF6] text-white border-[#3B5BF6]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <label className="block text-sm font-semibold text-gray-900 mb-1">
          {t(lingua, "istruzioneCustom")}
        </label>
        <p className="text-xs text-gray-400 mb-4">
          {t(lingua, "istruzioneDesc")}
        </p>
        <textarea
          rows={4}
          value={istruzione}
          onChange={(e) => setIstruzione(e.target.value)}
          placeholder="Es. Concentrati sui prospect argentini e segnala qualsiasi calo nelle email inviate negli ultimi 3 giorni..."
          className="w-full text-sm text-gray-900 placeholder-gray-300 bg-transparent outline-none resize-none border-b border-gray-200 pb-2 focus:border-[#3B5BF6] transition-colors"
        />
      </div>

      <div className="bg-white rounded-xl p-6" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <h2 className="text-sm font-semibold text-gray-900 mb-4">{t(lingua, "frequenzaReport")}</h2>
        <div className="flex gap-3">
          {FREQUENZE.map((f) => {
            const active = frequenza === f.label;
            return (
              <button
                key={f.label}
                onClick={() => setFrequenza(f.label)}
                className={`flex-1 rounded-xl px-4 py-4 text-left transition-colors border-2 ${
                  active ? "border-[#3B5BF6] bg-[#EEF1FF]" : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <p className={`text-sm font-semibold ${active ? "text-[#3B5BF6]" : "text-gray-700"}`}>
                  {f.label}
                </p>
                {f.consigliato && (
                  <p className={`text-xs mt-0.5 ${active ? "text-[#3B5BF6] opacity-70" : "text-gray-400"}`}>
                    {t(lingua, "consigliato")}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <button
          onClick={salvaConfigurazione}
          disabled={salvando}
          className={`w-full h-12 font-semibold rounded-lg transition-colors text-sm ${
            salvato
              ? "bg-emerald-500 text-white"
              : "bg-[#3B5BF6] text-white hover:bg-[#2f4de0] disabled:opacity-60"
          }`}
        >
          {salvato ? t(lingua, "salvato") : salvando ? t(lingua, "salvando") : t(lingua, "salva")}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">
          {t(lingua, "modificheApplicate")}
        </p>
      </div>
    </div>
  );
}
