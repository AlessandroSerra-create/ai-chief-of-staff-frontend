"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Lingua } from "./i18n";

type LinguaContextType = {
  lingua: Lingua;
  setLingua: (l: Lingua) => void;
};

const LinguaContext = createContext<LinguaContextType>({
  lingua: "it",
  setLingua: () => {},
});

export function LinguaProvider({ children }: { children: ReactNode }) {
  const [lingua, setLingua] = useState<Lingua>("it");
  return (
    <LinguaContext.Provider value={{ lingua, setLingua }}>
      {children}
    </LinguaContext.Provider>
  );
}

export function useLingua() {
  return useContext(LinguaContext);
}
