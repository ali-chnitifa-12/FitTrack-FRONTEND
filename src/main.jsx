import React from "react";
import ReactDOM from "react-dom/client";
import { init as initPlausible } from "@plausible-analytics/tracker";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import "./index.css";
import "./i18n/index.js";

const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
if (import.meta.env.PROD && window.location.hostname === plausibleDomain && navigator.doNotTrack !== "1") {
  initPlausible({ domain: plausibleDomain });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// Register PWA Service Worker
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("PWA Service Worker active:", reg.scope))
      .catch((err) => console.error("Service worker registration error:", err));
  });
}
