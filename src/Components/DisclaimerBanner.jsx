// src/Components/DisclaimerBanner.jsx
import React, { useState } from "react";
import { AlertTriangle, X, Info } from "lucide-react";

export default function DisclaimerBanner({ 
  variant = "warning", 
  dismissible = true,
  className = "" 
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const isInfo = variant === "info";

  return (
    <div
      className={`relative flex items-start gap-3 p-3.5 rounded-xl border text-sm transition-all ${
        isInfo
          ? "bg-blue-500/10 border-blue-500/30 text-blue-200"
          : "bg-amber-500/10 border-amber-500/30 text-amber-200"
      } ${className}`}
      role="alert"
    >
      <div className="shrink-0 mt-0.5">
        {isInfo ? (
          <Info className="w-5 h-5 text-blue-400" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-amber-400" />
        )}
      </div>
      <div className="flex-1 text-xs sm:text-sm leading-relaxed">
        <span className="font-semibold text-white mr-1.5">Not Medical Advice:</span>
        FitTrack provides educational nutrition and fitness estimates powered by AI. This is not medical, dietary, or healthcare advice. Always consult a physician or registered dietitian before starting any aggressive diet or workout program.
      </div>
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 p-1 rounded-md hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          aria-label="Dismiss disclaimer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
