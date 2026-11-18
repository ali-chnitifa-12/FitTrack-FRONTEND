// src/Components/DataPrivacySettings.jsx
import React, { useState, useContext } from "react";
import { Download, Trash2, ShieldCheck, AlertTriangle } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../Utils/axios";
import toast from "react-hot-toast";

export default function DataPrivacySettings() {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [exporting, setExporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleExportData = async () => {
    setExporting(true);
    try {
      const response = await api.get("/auth/export-data", {
        responseType: "blob",
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      // Create download link for blob
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/json" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `fittrack-data-${user?.id || "export"}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Data export downloaded successfully!");
    } catch (err) {
      console.error("Export error:", err);
      toast.error(err.response?.data?.message || "Failed to export data. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm.");
      return;
    }

    setDeleting(true);
    try {
      await api.delete("/auth/delete-account", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      toast.success("Your account and all data have been permanently deleted.");
      setShowDeleteModal(false);
      logout();
      navigate("/register");
    } catch (err) {
      console.error("Delete account error:", err);
      toast.error(err.response?.data?.message || "Failed to delete account. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <div className="bg-gray-800/40 rounded-2xl p-5 border border-gray-700/60 mt-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h4 className="text-white font-semibold text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            Privacy & Data Control (GDPR / Moroccan Law 09-08)
          </h4>
          <p className="text-xs text-gray-400 mt-0.5">
            You own your fitness and nutrition data. Download your full archive or permanently erase your account at any time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportData}
            disabled={exporting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-green-400" />
            {exporting ? t("common.loading") : t("legal.exportData")}
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {t("legal.deleteAccount")}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-red-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-xl bg-red-500/10">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Permanently Delete Account?</h3>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">
              This action is <strong className="text-white">permanent and irreversible</strong>. All your logged meals, workout history, custom targets, and account credentials will be erased immediately from our servers.
            </p>

            <div className="space-y-2">
              <label htmlFor="confirmDeleteInput" className="text-xs text-gray-400">
                Type <strong className="text-white font-mono">DELETE</strong> in all caps to confirm:
              </label>
              <input
                id="confirmDeleteInput"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText("");
                }}
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={confirmText !== "DELETE" || deleting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {deleting ? "Deleting..." : "Erase Everything"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
