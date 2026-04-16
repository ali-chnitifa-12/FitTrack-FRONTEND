import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../Utils/axios';

export default function Subscription() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post('/payment/create-subscription', {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error("Subscription Error:", err);
      setError(err.response?.data?.error || "Failed to initiate subscription. Please try again.");
      setLoading(false);
    }
  };

  const isTrialActive = user?.trialEndsAt && new Date(user.trialEndsAt) > new Date();
  const trialDaysLeft = user?.trialEndsAt 
    ? Math.max(0, Math.ceil((new Date(user.trialEndsAt) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full bg-gray-900 border border-green-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        {/* Left Side: Info */}
        <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-800">
          <h1 className="text-4xl font-bold text-white mb-6">
            Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">Premium Access</span>
          </h1>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-green-500/10 p-2 rounded-lg text-green-500">Ô£ô</div>
              <p className="text-gray-300">Unlimited access to all FitTrack tools including AI Food Scanner and AI Coach.</p>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-green-500/10 p-2 rounded-lg text-green-500">Ô£ô</div>
              <p className="text-gray-300">Detailed analytics and progress tracking for your fitness journey.</p>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-green-500/10 p-2 rounded-lg text-green-500">Ô£ô</div>
              <p className="text-gray-300">Personalized nutrition plans and expert workout routines.</p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gray-800/50 rounded-2xl border border-gray-700">
            {isTrialActive ? (
              <div className="text-center">
                <p className="text-green-400 font-bold mb-1">Trial Active</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">
                  {trialDaysLeft} Days Remaining
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-red-400 font-bold mb-1">Trial Expired</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">
                  Subscription required to continue
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Pricing */}
        <div className="w-full md:w-96 p-8 md:p-12 bg-gray-800/30 flex flex-col justify-center items-center text-center">
          <div className="mb-8">
            <span className="text-5xl font-bold text-white">$6</span>
            <span className="text-gray-500 ml-2">/month</span>
          </div>

          <p className="text-gray-400 mb-8 text-sm">
            Cancel anytime. No hidden fees. Secure checkout via Stripe.
          </p>

          {error && (
            <div className="bg-red-900/40 border border-red-500 text-red-400 p-3 rounded-xl mb-6 text-sm w-full">
              {error}
            </div>
          )}

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-black font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/50 transform hover:scale-[1.02] flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Go Premium Now</span>
            )}
          </button>

          <p className="mt-6 text-xs text-gray-600">
            By subscribing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
