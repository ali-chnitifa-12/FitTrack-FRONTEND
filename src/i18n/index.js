// src/i18n/index.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import ar from "./locales/ar.json";

const savedLanguage = localStorage.getItem("fittrack_language") || "en";

// Function to update HTML document direction (LTR vs RTL) and lang attribute
export const applyLanguageDirection = (lang) => {
  const isRtl = lang === "ar";
  document.documentElement.dir = isRtl ? "rtl" : "ltr";
  document.documentElement.lang = lang;
};

// Apply saved direction initially
applyLanguageDirection(savedLanguage);

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ar: { translation: ar },
    },
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

// Listen to language changes to update document direction dynamically
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("fittrack_language", lng);
  applyLanguageDirection(lng);
});

export default i18n;
