// src/Components/LanguageSwitcher.jsx
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown, Check } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "fr", label: "Français", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
];

export default function LanguageSwitcher({ className = "" }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 min-h-11 px-3 py-1.5 rounded-xl bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700/60 text-gray-200 text-xs font-medium transition-colors shadow-sm"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Select language"
      >
        <Globe className="w-3.5 h-3.5 text-green-400" />
        <span className="inline">{currentLang.label}</span>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {open && (
        <div
          className="fit-language-options absolute end-0 mt-2 w-36 rounded-2xl bg-gray-900 border border-gray-700/80 shadow-2xl z-50 overflow-hidden py-1"
          role="menu"
        >
          {LANGUAGES.map((lang) => {
            const isSelected = i18n.language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                  isSelected
                    ? "bg-green-500/15 text-green-400 font-bold"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                role="menuitem"
              >
                <div className="flex items-center gap-2">
                  <span>{lang.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-green-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
