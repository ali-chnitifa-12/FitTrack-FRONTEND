import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../Utils/axios';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    if (!user || !user.isAdmin) return;
    
    try {
      setLoading(true);
      const response = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${user.token}` }
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

  const handleDeleteUser = async (targetId, currentName) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${currentName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/admin/users/${targetId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setSuccessMsg(`User ${currentName} successfully deleted.`);
      setUsersList(prev => prev.filter(u => u.id !== targetId));
      
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
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="w-full flex-1 p-6 lg:p-12 text-gray-200 mt-8 mb-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900 border border-green-500/30 rounded-3xl p-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400 mb-2">
              Admin Control Panel
            </h1>
            <p className="text-gray-400">Manage FitTrack users and platform data.</p>
          </div>
          
          <div className="bg-gray-800/80 px-6 py-3 rounded-xl border border-gray-700 mt-4 md:mt-0 flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.7)]" />
            <span className="text-gray-300 font-semibold uppercase tracking-wider">Root Access</span>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-red-900/40 border border-red-500 text-red-300 px-4 py-3 rounded-xl mb-6 shadow-lg text-center"
            >
              {error}
            </motion.div>
          )}
          
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
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
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-900 text-gray-400 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold border-b border-gray-800">User ID</th>
                    <th className="p-4 font-semibold border-b border-gray-800">Name</th>
                    <th className="p-4 font-semibold border-b border-gray-800">Email Address</th>
                    <th className="p-4 font-semibold border-b border-gray-800">Joined Date</th>
                    <th className="p-4 font-semibold border-b border-gray-800">Status</th>
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
                        <td className="p-4 text-gray-400">{new Date(usr.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          {usr.isAdmin ? (
                            <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded-md border border-red-500/30 uppercase tracking-wider">
                              Admin
                            </span>
                          ) : (
                            <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-md border border-green-500/30 uppercase tracking-wider">
                              Member
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button 
                            disabled={usr.isAdmin && usr.id === user.id} // Cannot delete self
                            onClick={() => handleDeleteUser(usr.id, usr.name)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                              usr.isAdmin && usr.id === user.id
                              ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                              : 'bg-red-900/50 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/50 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]'
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
