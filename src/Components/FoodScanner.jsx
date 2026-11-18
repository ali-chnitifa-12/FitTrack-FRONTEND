import React, { useState, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../Utils/axios";
import { compressImage } from "../Utils/imageCompressor";
import analytics from "../Utils/analytics";
import toast from "react-hot-toast";

export default function FoodScanner({ onAnalyzed, onFoodLogged }) {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [base64Image, setBase64Image] = useState("");
  const [compressedSize, setCompressedSize] = useState(null);
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState("");
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const [result, setResult] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFoodName, setEditedFoodName] = useState("");
  const [editedCalories, setEditedCalories] = useState(0);
  const [editedProtein, setEditedProtein] = useState(0);
  const [editedCarbs, setEditedCarbs] = useState(0);
  const [editedFats, setEditedFats] = useState(0);
  const [portionMultiplier, setPortionMultiplier] = useState(1.0);
  const [mealType, setMealType] = useState("lunch");
  const [logging, setLogging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file) => {
    setError("");
    setIsQuotaExceeded(false);
    setResult(null);
    setIsEditing(false);

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPEG, PNG, WebP).");
      return;
    }

    try {
      setCompressing(true);
      const { base64, sizeKb } = await compressImage(file, 1024, 0.75);
      setImagePreview(base64);
      setBase64Image(base64);
      setCompressedSize(sizeKb);
    } catch (err) {
      console.error("Compression error:", err);
      setError("Failed to process image. Please try another photo.");
    } finally {
      setCompressing(false);
    }
  };

  const handleScan = async () => {
    if (!base64Image) {
      setError("Please select an image first.");
      return;
    }

    if (!user || !user.token) {
      setError("You must be logged in to use the AI Scanner.");
      return;
    }

    setLoading(true);
    setError("");
    setIsQuotaExceeded(false);
    setResult(null);

    try {
      const response = await api.post(
        "/ai/scan-food",
        { imageBase64: base64Image },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (response.data && response.data.calories !== undefined) {
        const data = response.data;
        setResult(data);
        setEditedFoodName(data.foodName || "Scanned Meal");
        setEditedCalories(data.calories || 0);
        setEditedProtein(data.protein || 0);
        setEditedCarbs(data.carbs || 0);
        setEditedFats(data.fats || 0);
        setPortionMultiplier(1.0);
        analytics.trackScanUsed();

        if (onAnalyzed) {
          onAnalyzed(data);
        }
      } else {
        throw new Error(response.data.error || "Failed to analyze image.");
      }
    } catch (err) {
      console.error("Scan Error:", err);
      const resData = err.response?.data;
      if (resData?.code === "QUOTA_EXCEEDED") {
        setIsQuotaExceeded(true);
        analytics.trackLimitReached("scan");
        setError(resData.error || "Daily AI scan quota reached (3/3). Upgrade to Premium for unlimited scans!");
      } else {
        setError(resData?.error || err.message || "An error occurred during analysis.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDiary = async () => {
    if (!result) return;

    setLogging(true);
    try {
      const finalCalories = Math.round(editedCalories * portionMultiplier);
      const finalProtein = Math.round(editedProtein * portionMultiplier * 10) / 10;
      const finalCarbs = Math.round(editedCarbs * portionMultiplier * 10) / 10;
      const finalFats = Math.round(editedFats * portionMultiplier * 10) / 10;

      const payload = {
        foodName: editedFoodName.trim() || result.foodName,
        mealType,
        portion: `${result.portion || "1 serving"} (${portionMultiplier}x)`,
        portionMultiplier,
        calories: finalCalories,
        protein: finalProtein,
        carbs: finalCarbs,
        fats: finalFats,
        source: "ai_scan",
      };

      const res = await api.post("/meals", payload);
      toast.success(`Logged ${payload.foodName} (${finalCalories} kcal) to ${mealType}!`);
      analytics.trackMealLogged("ai_scan");
      if (onFoodLogged) onFoodLogged(res.data.meal);
      closeScanner();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to log scanned meal to diary.");
    } finally {
      setLogging(false);
    }
  };

  const closeScanner = () => {
    setIsOpen(false);
    setTimeout(() => {
      setImagePreview(null);
      setBase64Image("");
      setCompressedSize(null);
      setResult(null);
      setError("");
      setIsQuotaExceeded(false);
      setIsEditing(false);
    }, 300);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative overflow-hidden group bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-400 hover:to-green-400 text-black font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-green-500/30 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
      >
        <span className="text-xl">📸</span>
        <span>AI Food Scanner</span>
        <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gray-900 border border-green-500/30 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={closeScanner}
                className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">
                AI Food Scanner
              </h2>
              <p className="text-gray-400 mb-4 text-xs">
                Snap or upload your meal. We compress and estimate macros with AI. You can review and edit before saving.
              </p>

              {/* Upload Area */}
              {!imagePreview && (
                <div
                  className="border-2 border-dashed border-gray-600 hover:border-green-500 bg-gray-800/50 rounded-xl p-8 text-center cursor-pointer transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-5xl mb-4">🍽️</div>
                  <p className="text-white font-medium mb-1">Click to upload photo</p>
                  <p className="text-gray-500 text-xs">JPEG, PNG up to 10MB (automatically compressed)</p>
                </div>
              )}

              {/* Compressing indicator */}
              {compressing && (
                <div className="p-4 bg-gray-800/80 rounded-xl text-center text-sm text-green-400 animate-pulse">
                  Optimizing photo for fast scan...
                </div>
              )}

              {/* Image Preview */}
              {imagePreview && !compressing && (
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-gray-700">
                  <img src={imagePreview} alt="Meal preview" className="max-h-full max-w-full object-contain" />
                  {compressedSize && (
                    <span className="absolute bottom-2 left-2 bg-black/70 text-gray-300 text-[11px] px-2 py-0.5 rounded">
                      ~{compressedSize} KB
                    </span>
                  )}
                  {!loading && !result && (
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setBase64Image("");
                        setResult(null);
                        setCompressedSize(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500/80 text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                      title="Remove image"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              )}

              <input
                id="food-photo-upload"
                name="food-photo-upload"
                type="file"
                ref={fileInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />

              {error && (
                <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-4 rounded-xl mt-4 text-sm text-center">
                  <p className="mb-2">{error}</p>
                  {isQuotaExceeded && (
                    <Link
                      to="/subscription"
                      onClick={closeScanner}
                      className="inline-block mt-2 bg-gradient-to-r from-green-500 to-teal-500 text-black font-bold px-4 py-2 rounded-lg text-xs hover:brightness-110"
                    >
                      Upgrade to Premium ($6/mo)
                    </Link>
                  )}
                </div>
              )}

              {/* Interactive & Editable Result Step */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 bg-gray-800 border border-green-500/20 rounded-xl p-5 space-y-4"
                >
                  <div className="flex justify-between items-start border-b border-gray-700 pb-3">
                    <div className="flex-1 mr-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedFoodName}
                          onChange={(e) => setEditedFoodName(e.target.value)}
                          className="bg-gray-900 border border-green-500 rounded px-2 py-1 text-sm text-white w-full"
                          placeholder="Food title"
                        />
                      ) : (
                        <h3 className="text-lg font-bold text-white">{editedFoodName}</h3>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">
                        Base: {result.portion || "Standard serving"} • Confidence:{" "}
                        <strong className="text-gray-200">{result.confidence || "Estimated"}</strong>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-xs text-green-400 hover:text-green-300 font-medium underline"
                    >
                      {isEditing ? "Done Editing" : "✏️ Correct this"}
                    </button>
                  </div>

                  {/* Portion Multiplier Selector */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-300 mb-1">
                      <span>Serving multiplier:</span>
                      <span className="font-bold text-green-400">{portionMultiplier}x portion</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[0.5, 1.0, 1.5, 2.0].map((mult) => (
                        <button
                          key={mult}
                          type="button"
                          onClick={() => setPortionMultiplier(mult)}
                          className={`py-1 rounded-lg text-xs font-semibold border transition-all ${
                            portionMultiplier === mult
                              ? "bg-green-500 text-black border-green-500 font-bold"
                              : "bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500"
                          }`}
                        >
                          {mult}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Macro Display & Quick Editor */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-900 p-3 rounded-lg text-center border border-gray-700">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editedCalories}
                          onChange={(e) => setEditedCalories(Number(e.target.value))}
                          className="w-full text-center bg-gray-800 text-green-400 font-bold rounded py-1"
                        />
                      ) : (
                        <div className="text-green-400 text-2xl font-bold">
                          {Math.round(editedCalories * portionMultiplier)}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Calories (est.)</div>
                    </div>

                    <div className="bg-gray-900 p-3 rounded-lg text-center border border-gray-700">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editedProtein}
                          onChange={(e) => setEditedProtein(Number(e.target.value))}
                          className="w-full text-center bg-gray-800 text-amber-400 font-bold rounded py-1"
                        />
                      ) : (
                        <div className="text-amber-400 text-2xl font-bold">
                          {Math.round(editedProtein * portionMultiplier * 10) / 10}g
                        </div>
                      )}
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Protein</div>
                    </div>

                    <div className="bg-gray-900 p-3 rounded-lg text-center border border-gray-700">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editedCarbs}
                          onChange={(e) => setEditedCarbs(Number(e.target.value))}
                          className="w-full text-center bg-gray-800 text-blue-400 font-bold rounded py-1"
                        />
                      ) : (
                        <div className="text-blue-400 text-2xl font-bold">
                          {Math.round(editedCarbs * portionMultiplier * 10) / 10}g
                        </div>
                      )}
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Carbs</div>
                    </div>

                    <div className="bg-gray-900 p-3 rounded-lg text-center border border-gray-700">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editedFats}
                          onChange={(e) => setEditedFats(Number(e.target.value))}
                          className="w-full text-center bg-gray-800 text-red-400 font-bold rounded py-1"
                        />
                      ) : (
                        <div className="text-red-400 text-2xl font-bold">
                          {Math.round(editedFats * portionMultiplier * 10) / 10}g
                        </div>
                      )}
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Fats</div>
                    </div>
                  </div>

                  {/* Meal Destination Selector */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Log to which meal?</label>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      {["breakfast", "lunch", "dinner", "snack"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setMealType(type)}
                          className={`py-1.5 rounded-lg capitalize font-medium border ${
                            mealType === type
                              ? "bg-teal-500 text-black border-teal-500 font-bold"
                              : "bg-gray-900 text-gray-400 border-gray-700"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 italic">
                    ⚠️ Numbers are AI estimates. Nutritional values vary based on cooking oils, sauces, and precise portions.
                  </p>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={closeScanner}
                      className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl text-xs font-semibold"
                    >
                      Dismiss
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveToDiary}
                      disabled={logging}
                      className="flex-2 w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-black font-bold rounded-xl text-xs shadow-lg shadow-green-500/20"
                    >
                      {logging ? "Saving to Diary..." : `✓ Log to ${mealType.toUpperCase()}`}
                    </button>
                  </div>
                </motion.div>
              )}

              {!result && imagePreview && (
                <button
                  onClick={handleScan}
                  disabled={loading || compressing}
                  className={`w-full mt-6 py-3 rounded-xl font-bold text-black transition-all flex items-center justify-center space-x-2 ${
                    loading || compressing
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-400"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing meal with AI...</span>
                    </>
                  ) : (
                    <span>Analyze Meal</span>
                  )}
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
