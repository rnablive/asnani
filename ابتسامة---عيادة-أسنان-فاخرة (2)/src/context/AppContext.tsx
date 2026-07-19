/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, TranslationSet } from "./translations";
import { extraTranslations, ExtraTranslationKey } from "./extraTranslations";

interface AppContextType {
  locale: string;
  isEmergency: boolean;
  setIsEmergency: (val: boolean) => void;
  isExperienceMode: boolean;
  setIsExperienceMode: (val: boolean) => void;
  setLocale: (locale: string) => void;
  t: (key: keyof TranslationSet | ExtraTranslationKey) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<string>(() => {
    return localStorage.getItem("smile_clinic_locale") || "ar";
  });
  const [isEmergency, setIsEmergency] = useState<boolean>(false);
  const [isExperienceMode, setIsExperienceMode] = useState<boolean>(() => {
    return localStorage.getItem("smile_clinic_experience_mode") === "true";
  });

  // Set html attributes based on current language
  useEffect(() => {
    const dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
    localStorage.setItem("smile_clinic_locale", locale);
  }, [locale]);

  useEffect(() => {
    localStorage.setItem("smile_clinic_experience_mode", String(isExperienceMode));
    if (isExperienceMode) {
      document.documentElement.classList.add("experience-mode");
    } else {
      document.documentElement.classList.remove("experience-mode");
    }
  }, [isExperienceMode]);

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
  };

  const t = (key: keyof TranslationSet | ExtraTranslationKey): string => {
    // Try translationSet first
    const translationSet = translations[locale] || translations["ar"];
    if (key in translationSet) {
      return (translationSet as any)[key] || (translations["ar"] as any)[key] || String(key);
    }
    // Try extraTranslations next
    const extraSet = extraTranslations[locale] || extraTranslations["ar"];
    if (key in extraSet) {
      return (extraSet as any)[key] || (extraTranslations["ar"] as any)[key] || String(key);
    }
    return String(key);
  };

  return (
    <AppContext.Provider value={{ locale, isEmergency, setIsEmergency, isExperienceMode, setIsExperienceMode, setLocale, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppContextProvider");
  }
  return context;
}
