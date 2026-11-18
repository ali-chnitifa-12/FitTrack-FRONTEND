// src/pages/Subscription.jsx
import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Sparkles, Shield, Zap, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { PLANS } from "../config/plans";
import api from "../Utils/axios";
import toast from "react-hot-toast";
import analytics from "../Utils/analytics";

export default function Subscription() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [billingPeriod, setBillingPeriod] = useState("monthly"); // monthly | annual
  const [currency, setCurrency] = useState("usd"); // usd | mad

  // Waitlist Modal State
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState(user?.email || "");
  const [waitlistName, setWaitlistName] = useState(user?.name || "");
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  const isSubscribed = user?.isSubscribed === true || (user?.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > new Date());

  const handleSubscribe = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/payment/create-subscription", {}, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned.");
      }
    } catch (err) {
      console.error("Subscription Error:", err);
      setError(err.response?.data?.error || "Failed to initiate subscription. Please try again.");
      setLoading(false);
    }
  };

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    if (!waitlistEmail) return;

    setWaitlistSubmitting(true);
    try {
      const res = await api.post("/waitlist", {
        email: waitlistEmail,
        name: waitlistName,
        source: "pricing_page",
      });
      toast.success(res.data.message || "You're on the early-access list!");
      setWaitlistSuccess(true);
    } catch (err) {
      console.error("Waitlist error:", err);
      toast.error(err.response?.data?.error || "Failed to join waitlist.");
    } finally {
      setWaitlistSubmitting(false);
    }
  };

  const freePlan = PLANS.FREE;
  const proPlan = PLANS.PREMIUM;

  const proPrice = billingPeriod === "monthly"
    ? (currency === "usd" ? `$${proPlan.priceMonthly.usd}/mo` : `${proPlan.priceMonthly.mad} MAD/mo`)
    : (currency === "usd" ? `$${proPlan.priceAnnual.usd}/yr` : `${proPlan.priceAnnual.mad} MAD/yr`);

  return (
    <div className="min-h-screen bg-black text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Simple, Transparent Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Level up your fitness with <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">FitTrack Pro</span>
          </h1>
          <p className="text-base text-gray-400">
            Enjoy full app access forever on our generous free tier, or upgrade to Pro for 50 daily AI food scans and personalized meal coaching.
          </p>

          {/* Controls: Billing Period & Currency */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {/* Monthly / Annual Toggle */}
            <div className="bg-gray-900 border border-gray-800 p-1 rounded-2xl flex items-center">
              <button
                type="button"
                onClick={() => setBillingPeriod("monthly")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  billingPeriod === "monthly" ? "bg-green-500 text-black shadow-md" : "text-gray-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingPeriod("annual")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingPeriod === "annual" ? "bg-green-500 text-black shadow-md" : "text-gray-400 hover:text-white"
                }`}
              >
                Annual <span className="text-[10px] bg-teal-400 text-black px-1.5 py-0.5 rounded-md font-extrabold">Save 30%</span>
              </button>
            </div>

            {/* Currency Toggle */}
            <div className="bg-gray-900 border border-gray-800 p-1 rounded-2xl flex items-center">
              <button
                type="button"
                onClick={() => setCurrency("usd")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currency === "usd" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency("mad")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currency === "mad" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                MAD (DH)
              </button>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* FREE TIER CARD */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-8 flex flex-col justify-between hover:border-gray-700 transition-all">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white">{freePlan.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">{freePlan.tagline}</p>
                </div>
                {!isSubscribed && (
                  <span className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full font-bold">
                    Active Plan
                  </span>
                )}
              </div>

              <div className="border-b border-gray-800 pb-6">
                <div className="text-4xl font-black text-white">$0</div>
                <span className="text-xs text-gray-400">Free forever • No credit card required</span>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Features Included</span>
                <ul className="space-y-2.5">
                  {freePlan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      {feat.included ? (
                        <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                      )}
                      <span className={feat.included ? "text-gray-300" : "text-gray-600"}>
                        {feat.name}
                        {feat.detail && (
                          <span className="ml-1.5 text-[11px] text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded">
                            {feat.detail}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="button"
                disabled
                className="w-full py-3.5 rounded-2xl bg-gray-800 text-gray-400 font-bold text-sm cursor-default"
              >
                {!isSubscribed ? "Current Plan" : "Downgrade to Free"}
              </button>
            </div>
          </div>

          {/* PRO TIER CARD */}
          <div className="bg-gradient-to-br from-green-500/10 via-gray-900 to-gray-900 border-2 border-green-500/50 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {/* Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-green-400 to-teal-400 text-black font-extrabold text-[11px] uppercase tracking-wider py-1.5 px-4 rounded-bl-2xl shadow-md">
              FitTrack Pro
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  {proPlan.name}
                  <Zap className="w-5 h-5 text-green-400 fill-green-400" />
                </h3>
                <p className="text-xs text-gray-400 mt-1">{proPlan.tagline}</p>
              </div>

              <div className="border-b border-gray-800 pb-6">
                <div className="text-4xl font-black text-white">{proPrice}</div>
                <span className="text-xs text-green-400 font-medium">
                  Cancel anytime • High-quota AI food scanner
                </span>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Everything in Free, plus:</span>
                <ul className="space-y-2.5">
                  {proPlan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-white">
                        {feat.name}
                        {feat.detail && (
                          <span className="ml-1.5 text-[11px] text-teal-300 font-bold bg-teal-500/20 px-2 py-0.5 rounded">
                            {feat.detail}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8 space-y-3">
              {isSubscribed ? (
                <div className="p-4 rounded-2xl bg-green-500/20 border border-green-500/40 text-center text-sm font-bold text-green-300 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" /> FitTrack Pro Active
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-green-400 to-teal-400 hover:opacity-90 text-black font-extrabold text-sm shadow-xl shadow-green-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? "Redirecting to Checkout..." : "Upgrade to Pro"}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowWaitlist(true)}
                    className="w-full py-2 text-xs font-medium text-gray-400 hover:text-green-400 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" /> Or join the Early-Access Pro Waitlist
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Security & Guarantee Box */}
        <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-gray-900/40 border border-gray-800 flex items-center justify-center gap-6 flex-wrap text-xs text-gray-400 text-center">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span>Encrypted Checkout (256-bit SSL)</span>
          </div>
          <div>•</div>
          <div>Cancel Anytime with 1 Click</div>
          <div>•</div>
          <div>Supports Moroccan & International Cards</div>
        </div>
      </div>

      {/* Early Access Waitlist Modal */}
      <AnimatePresence>
        {showWaitlist && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-teal-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setShowWaitlist(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
                aria-label="Close waitlist modal"
              >
                ✕
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Join the Pro Waitlist</h3>
                  <p className="text-xs text-gray-400">Get early-bird pricing and priority features.</p>
                </div>
              </div>

              {waitlistSuccess ? (
                <div className="p-4 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 text-sm text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-teal-400" />
                  <p className="font-bold">You're on the list!</p>
                  <p className="text-xs text-gray-300">We will notify you the moment early-access discounts open.</p>
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Your Name</label>
                    <input
                      type="text"
                      value={waitlistName}
                      onChange={(e) => setWaitlistName(e.target.value)}
                      placeholder="Your name"
                      className="w-full p-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full p-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={waitlistSubmitting}
                    className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-xs shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50"
                  >
                    {waitlistSubmitting ? "Joining..." : "Reserve My Spot"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
