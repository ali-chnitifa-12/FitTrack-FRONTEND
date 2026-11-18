// src/Utils/analytics.js
/**
 * Privacy-Friendly Analytics & Telemetry Dispatcher
 * Works with Plausible, PostHog, or console in development.
 * Never collects or transmits PII (passwords, emails, health biometrics).
 */

class AnalyticsService {
  constructor() {
    this.enabled = typeof window !== "undefined" && navigator.doNotTrack !== "1";
    this.domain = import.meta.env.VITE_ANALYTICS_DOMAIN || "fiitnesstracking.vercel.app";
  }

  /**
   * Log an event
   * @param {string} eventName - Standard event name
   * @param {Object} props - Non-PII properties
   */
  track(eventName, props = {}) {
    if (!this.enabled) return;

    // 1. Plausible Analytics integration (if script is present)
    if (window.plausible) {
      window.plausible(eventName, { props });
      return;
    }

    // 2. PostHog integration (if script is present)
    if (window.posthog) {
      window.posthog.capture(eventName, props);
      return;
    }

    // 3. Fallback dev logger
    if (import.meta.env.DEV) {
      console.log(`📊 [Analytics Event]: ${eventName}`, props);
    }
  }

  // Pre-defined key events
  trackSignup(method = "password") {
    this.track("signup", { method });
  }

  trackOnboardingCompleted(goal) {
    this.track("onboarding_completed", { goal });
  }

  trackMealLogged(source = "manual") {
    this.track("meal_logged", { source });
  }

  trackScanUsed() {
    this.track("scan_used");
  }

  trackLimitReached(limitType) {
    this.track("limit_reached", { limitType });
  }

  trackUpgradeClicked(source = "banner") {
    this.track("upgrade_clicked", { source });
  }

  /**
   * Capture exceptions for Sentry (if configured)
   */
  captureException(error, context = {}) {
    if (window.Sentry) {
      window.Sentry.captureException(error, { extra: context });
    } else if (import.meta.env.DEV) {
      console.error("🚨 [Sentry Captured Error]:", error, context);
    }
  }
}

export const analytics = new AnalyticsService();
export default analytics;
