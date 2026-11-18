import PageHeading from "../Components/PageHeading.jsx";
// src/pages/PrivacyPolicy.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function PrivacyPolicy() {
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
          <PageHeading title="Privacy Policy" description="Last updated November 2026" />
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>
              <strong>Notice:</strong> This template document is prepared for launch readiness. It reflects our privacy architecture and data controls, but is undergoing final formal legal review for full Moroccan Law 09-08 (CNDP) and GDPR compliance.
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm sm:text-base leading-relaxed text-gray-300">
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">1. Introduction</h2>
            <p>
              FitTrack ("we", "our", or "us") respects your privacy. This Privacy Policy describes how we collect, use, store, and share your personal and health-related fitness data when you use the FitTrack web application.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">2. Data We Collect</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
              <li><strong className="text-gray-200">Account Data:</strong> Name, email address, hashed password, and subscription status.</li>
              <li><strong className="text-gray-200">Biometric & Fitness Metrics:</strong> Age, biological gender, height, current weight, target weight, activity level, and fitness goals.</li>
              <li><strong className="text-gray-200">Dietary & Nutrition Data:</strong> Daily meals, calories, macronutrients (protein, carbs, fat), barcode scans, and photos submitted to the AI Food Scanner.</li>
              <li><strong className="text-gray-200">Technical Logs:</strong> Device type, browser headers, and error logs (IP addresses are strictly rate-limited and never logged alongside sensitive information).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">3. How We Use Your Data</h2>
            <p>We process your data strictly to provide and improve FitTrack services:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
              <li>Calculating your basal metabolic rate (BMR), total daily energy expenditure (TDEE), and macro targets.</li>
              <li>Analyzing food photos using OpenAI Vision API to estimate meal portions and nutrition.</li>
              <li>Tracking your workout progress, challenges, and fitness streaks over time.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">4. Third-Party Subprocessors</h2>
            <p>
              We share data with external processors only when necessary to fulfill our core services:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
              <li><strong className="text-gray-200">OpenAI:</strong> Process food images and AI Coach queries. No personal identifiers (such as your email or real name) are passed to OpenAI.</li>
              <li><strong className="text-gray-200">Open Food Facts:</strong> Public barcode and food search lookup (no personal user data transmitted).</li>
              <li><strong className="text-gray-200">Cloud & Database Hosting:</strong> Encrypted databases and secure APIs.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">5. Your Rights (Moroccan Law 09-08 & GDPR)</h2>
            <p>
              Regardless of where you reside, FitTrack grants you full autonomy over your data:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
              <li><strong className="text-gray-200">Data Portability (Export):</strong> You can export a full copy of all your recorded nutrition, workout, and account data in JSON format directly from your profile settings (<code className="text-green-400">/api/auth/export-data</code>).</li>
              <li><strong className="text-gray-200">Right to Erasure (Delete Account):</strong> You can permanently delete your account and all associated logs at any time (<code className="text-green-400">/api/auth/delete-account</code>). Deletion is irreversible.</li>
              <li><strong className="text-gray-200">Rectification:</strong> You can edit or delete any meal log, weight entry, or goal at any time.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">6. Contact & Data Protection Officer</h2>
            <p>
              For data requests, privacy inquiries, or CNDP compliance questions, reach out to us at:
            </p>
            <p className="text-green-400 font-medium">privacy@fittrack.app (or contact support in the app)</p>
          </section>
        </div>
      </div>
    </div>
  );
}
