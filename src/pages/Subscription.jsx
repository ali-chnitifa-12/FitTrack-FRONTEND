import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import api from "../Utils/axios";

export default function Subscription() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/payment/create-subscription", {}, {
        headers: { Authorization: `Bearer ${user.token}` },
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

  const isSubscribed = user?.isSubscribed === true || (user?.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > new Date());

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full bg-gray-900 border border-green-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        {/* Left Side: Plan Comparison */}
        <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/40 px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
              {isSubscribed ? "You have Premium" : "Free Tier Active"}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            FitTrack <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">Plans</span>
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            FitTrack is free forever with generous daily quotas. Upgrade anytime for power-user AI capacity.
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-gray-800/40 rounded-xl border border-gray-800 flex items-start gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <p className="text-white text-sm font-semibold">Free Tier (Included Always)</p>
                <p className="text-gray-400 text-xs">
                  Full Dashboard, Routine tracker, Calorie/Macro calculator, 3 AI Food Scans/day, and 10 AI Coach chats/day.
                </p>
              </div>
            </div>

            <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30 flex items-start gap-3">
              <span className="text-green-400 text-lg">⚡</span>
              <div>
                <p className="text-green-400 text-sm font-semibold">Premium Member Perks</p>
                <p className="text-gray-300 text-xs">
                  50 AI Food Scans/day, 100 AI Coach chats/day, personalized 7-day meal plans, and deep progress analytics.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Pricing / Action */}
        <div className="w-full md:w-96 p-8 md:p-12 bg-gray-800/30 flex flex-col justify-center items-center text-center">
          <div className="mb-6">
            <span className="text-5xl font-bold text-white">$6</span>
            <span className="text-gray-400 ml-2 text-sm">/month</span>
            <p className="text-xs text-gray-500 mt-1">Billed monthly • Cancel anytime</p>
          </div>

          {error && (
            <div className="bg-red-900/40 border border-red-500 text-red-400 p-3 rounded-xl mb-6 text-sm w-full">
              {error}
            </div>
          )}

          {isSubscribed ? (
            <div className="w-full p-4 bg-green-500/20 border border-green-500/40 rounded-xl text-green-400 text-sm font-semibold">
              🎉 Your Premium subscription is active!
            </div>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-black font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/50 transform hover:scale-[1.02] flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Preparing checkout...</span>
                </>
              ) : (
                <span>Upgrade to Premium</span>
              )}
            </button>
          )}

          <p className="mt-6 text-xs text-gray-600 leading-relaxed">
            By subscribing, you agree to our Terms of Service and Privacy Policy. Secure processing via Stripe.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
