import PageHeading from "../Components/PageHeading.jsx";
import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../Utils/axios";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchUsers = async () => {
    if (!user || !user.isAdmin) return;

    try {
      setLoading(true);
      const response = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsersList(response.data.users || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err.response?.data?.error || "Failed to load users data.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSubscription = async (targetId, shouldSubscribe) => {
    try {
      await api.patch(
        `/admin/users/${targetId}/subscription`,
        { isSubscribed: shouldSubscribe, days: 30 },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setSuccessMsg(`User #${targetId} subscription ${shouldSubscribe ? "granted (30 days)" : "revoked"}.`);
      setUsersList((prev) =>
        prev.map((u) =>
          u.id === targetId
            ? { ...u, isSubscribed: shouldSubscribe, subscriptionExpiresAt: shouldSubscribe ? new Date(Date.now() + 30 * 86400000) : null }
            : u
        )
      );

      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Subscription update failed:", err);
      setError(err.response?.data?.error || "Failed to update subscription.");
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleDeleteUser = async (targetId, currentName) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${currentName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/admin/users/${targetId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setSuccessMsg(`User ${currentName} successfully deleted.`);
      setUsersList((prev) => prev.filter((u) => u.id !== targetId));

      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Deletion failed:", err);
      setError(err.response?.data?.error || "Failed to delete user.");
      setTimeout(() => setError(null), 4000);
    }
  };

  // Extra frontend protection layer
  if (!user || user.isAdmin !== true) {
    return <Navigate to="/dashboard" replace />;
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="fit-page fit-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="fit-panel"
      >
        <PageHeading title="Admin dashboard" description="Manage user accounts and subscriptions." />

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-900/40 border border-red-500 text-red-300 px-4 py-3 rounded-xl mb-6 shadow-lg text-center"
            >
              {error}
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-900/40 border border-green-500 text-green-300 px-4 py-3 rounded-xl mb-6 shadow-lg text-center"
            >
              {successMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="bg-gray-950/50 rounded-2xl overflow-hidden border border-gray-800">
            <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Users table">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-900 text-gray-400 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold border-b border-gray-800">User ID</th>
                    <th className="p-4 font-semibold border-b border-gray-800">Name</th>
                    <th className="p-4 font-semibold border-b border-gray-800">Email Address</th>
                    <th className="p-4 font-semibold border-b border-gray-800">Plan Tier</th>
                    <th className="p-4 font-semibold border-b border-gray-800">Role</th>
                    <th className="p-4 font-semibold border-b border-gray-800 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {usersList.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500">No users found on the platform.</td>
                    </tr>
                  ) : (
                    usersList.map((usr) => (
                      <motion.tr variants={itemVariants} key={usr.id} className="hover:bg-gray-800/40 transition-colors">
                        <td className="p-4 text-xs font-mono text-gray-500">#{usr.id}</td>
                        <td className="p-4 font-medium text-gray-200">{usr.name}</td>
                        <td className="p-4 text-teal-400/80">{usr.email}</td>
                        <td className="p-4">
                          {usr.isSubscribed ? (
                            <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2.5 py-1 rounded-md border border-green-500/30 uppercase tracking-wider">
                              FitTrack Pro ⚡
                            </span>
                          ) : (
                            <span className="bg-gray-800 text-gray-400 text-xs font-medium px-2 py-1 rounded-md border border-gray-700 uppercase">
                              Free Tier
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          {usr.isAdmin ? (
                            <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded-md border border-red-500/30 uppercase tracking-wider">
                              Admin
                            </span>
                          ) : (
                            <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2 py-1 rounded-md border border-blue-500/30 uppercase tracking-wider">
                              Member
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleToggleSubscription(usr.id, !usr.isSubscribed)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              usr.isSubscribed
                                ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 border border-amber-500/40"
                                : "bg-green-500/20 text-green-300 hover:bg-green-500/40 border border-green-500/40"
                            }`}
                          >
                            {usr.isSubscribed ? "Revoke Pro" : "Grant 30d Pro"}
                          </button>
                          <button
                            disabled={usr.isAdmin && usr.id === user.id}
                            onClick={() => handleDeleteUser(usr.id, usr.name)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              usr.isAdmin && usr.id === user.id
                                ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                                : "bg-red-900/50 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/50"
                            }`}
                          >
                            Delete
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-900 p-4 border-t border-gray-800 text-gray-400 text-sm flex justify-between">
              <span>Total Active Accounts: <strong className="text-white">{usersList.length}</strong></span>
              <span>Secure Admin Session Active</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
