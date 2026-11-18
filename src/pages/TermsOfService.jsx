import PageHeading from "../Components/PageHeading.jsx";
// src/pages/TermsOfService.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertCircle, HeartPulse } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="fit-page fit-page-reading fit-container">
      <div className="fit-panel space-y-6">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to FitTrack
        </Link>

        {/* Header */}
        <div className="space-y-3 border-b border-gray-800 pb-6">
          <PageHeading title="Terms of Service" description="Last updated November 2026" />
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>
              <strong>Notice:</strong> This template document is prepared for launch readiness. It reflects our terms and health disclaimers, but is undergoing final formal legal review.
            </span>
          </div>
        </div>

        {/* Important Health Disclaimer Box */}
        <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-2">
          <div className="flex items-center gap-2 text-red-400 font-bold text-base">
            <HeartPulse className="w-5 h-5" />
            <span>CRITICAL MEDICAL & HEALTH DISCLAIMER</span>
          </div>
          <p className="text-sm text-red-200/90 leading-relaxed">
            FitTrack is an informational fitness and dietary tracking platform. It is <strong>NOT a medical device</strong> and does not provide medical diagnosis, treatment, or professional healthcare advice. All calorie counts, macronutrient ratios, and AI food scan estimates are approximations. If you have an eating disorder, chronic illness, are pregnant, or under medical supervision, consult a certified physician before altering your diet or physical activity.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm sm:text-base leading-relaxed text-gray-300">
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By creating an account or accessing the FitTrack platform, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you must discontinue use immediately.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">2. Age Requirements & Minors</h2>
            <p>
              You must be at least 13 years of age to use FitTrack. For users aged 13 to 17:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
              <li>Weight loss deficit targets are strictly disabled on FitTrack for minors to promote safe adolescent development.</li>
              <li>Calorie recommendations are locked to maintenance or positive growth energy levels.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">3. User Responsibilities & AI Accuracy</h2>
            <p>
              FitTrack utilizes machine learning models (OpenAI) to estimate nutritional values from photographs. You acknowledge and accept that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
              <li>Computer vision estimates may misidentify food items, ingredients, allergens, or serving volumes.</li>
              <li>You are responsible for reviewing and correcting any AI-suggested values before saving them to your nutrition diary.</li>
              <li>FitTrack is not liable for allergic reactions or health outcomes resulting from reliance on AI estimates.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">4. Subscriptions & Freemium Policy</h2>
            <p>
              FitTrack offers free access with fair daily usage quotas (e.g., 3 AI food scans/day, 10 AI coach messages/day). Premium plans expand quotas and unlock additional features. Payments are billed on a recurring monthly or annual basis until canceled.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">5. Termination</h2>
            <p>
              You may terminate your account at any time using the account deletion feature. We reserve the right to suspend accounts that abuse API quotas or attempt unauthorized security exploits.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
