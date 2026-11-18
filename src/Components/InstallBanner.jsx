import { useEffect, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { Download, X } from "lucide-react";

const iosDismissalKey = "ios-install-dismissed";

export default function InstallBanner() {
  const [prompt, setPrompt] = useState(null);
  const [iosVisible, setIosVisible] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)");
    const isInstalled = () => standalone.matches || navigator.standalone === true;
    const capturePrompt = (event) => {
      if (isInstalled()) return;
      event.preventDefault();
      setPrompt(event);
    };
    const hideBanners = () => {
      setPrompt(null);
      setIosVisible(false);
    };
    const handleDisplayMode = () => {
      if (isInstalled()) hideBanners();
    };

    window.addEventListener("beforeinstallprompt", capturePrompt);
    window.addEventListener("appinstalled", hideBanners);
    standalone.addEventListener("change", handleDisplayMode);

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
      || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const timer = isIos && !isInstalled() && !localStorage.getItem(iosDismissalKey)
      ? window.setTimeout(() => {
          if (!isInstalled()) setIosVisible(true);
        }, 3000)
      : undefined;

    return () => {
      window.removeEventListener("beforeinstallprompt", capturePrompt);
      window.removeEventListener("appinstalled", hideBanners);
      standalone.removeEventListener("change", handleDisplayMode);
      window.clearTimeout(timer);
    };
  }, []);

  const install = async () => {
    if (!prompt) return;
    setPrompt(null);
    try {
      await prompt.prompt();
    } catch (error) {
      console.warn("FitTrack install prompt could not open", error);
    }
  };

  const dismiss = () => {
    if (iosVisible && !prompt) {
      localStorage.setItem(iosDismissalKey, "1");
      setIosVisible(false);
    } else {
      setPrompt(null);
    }
  };

  return (
    <AnimatePresence>
      {(prompt || iosVisible) && (
        <Motion.aside
          aria-label="Install FitTrack"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 right-4 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-2xl border border-green-500/40 bg-gray-900 p-4 shadow-2xl shadow-green-500/10"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-teal-500">
            <Download size={18} className="text-black" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">Install FitTrack</p>
            <p className="text-xs text-gray-400">
              {prompt ? "Add FitTrack to your home screen." : (
                <>In Safari, tap <strong className="text-white">Share</strong>, then <strong className="text-white">Add to Home Screen</strong>.</>
              )}
            </p>
          </div>
          {prompt && (
            <button type="button" onClick={install} className="min-h-10 shrink-0 rounded-lg bg-green-500 px-3 text-xs font-bold text-black transition-colors hover:bg-green-400">
              Install
            </button>
          )}
          <button type="button" aria-label="Dismiss install banner" onClick={dismiss} className="flex size-10 shrink-0 items-center justify-center text-gray-400 transition-colors hover:text-white">
            <X size={16} aria-hidden="true" />
          </button>
        </Motion.aside>
      )}
    </AnimatePresence>
  );
}
