import React, { useState, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../Utils/axios';

export default function FoodScanner({ onAnalyzed }) {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [base64Image, setBase64Image] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    setError("");
    setResult(null);

    // Only accept images
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setBase64Image(e.target.result);
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    // Ensure we read as DataURL to get the Base64 representation directly
    reader.readAsDataURL(file);
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
    setResult(null);

    try {
      const response = await api.post(
        "/ai/scan-food",
        { imageBase64: base64Image },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (response.data && response.data.calories !== undefined) {
        setResult(response.data);
        if (onAnalyzed) {
          onAnalyzed(response.data);
        }
      } else {
        throw new Error(response.data.error || "Failed to analyze image.");
      }
    } catch (err) {
      console.error("Scan Error:", err);
      setError(err.response?.data?.error || err.message || "An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  const closeScanner = () => {
    setIsOpen(false);
    setTimeout(() => {
      setImagePreview(null);
      setBase64Image("");
      setResult(null);
      setError("");
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
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

              <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">
                AI Food Scanner
              </h2>
              <p className="text-gray-400 mb-6 text-sm">
                Upload or snap a photo of your meal and let our AI estimate the nutritional breakdown.
              </p>

              {/* Upload Area */}
              {!imagePreview && (
                <div 
                  className="border-2 border-dashed border-gray-600 hover:border-green-500 bg-gray-800/50 rounded-xl p-8 text-center cursor-pointer transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-5xl mb-4">🍽️</div>
                  <p className="text-white font-medium mb-1">Click to upload photo</p>
                  <p className="text-gray-500 text-sm">JPEG, PNG up to 5MB</p>
                </div>
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-gray-700">
                  <img src={imagePreview} alt="Meal preview" className="max-h-full max-w-full object-contain" />
                  {!loading && !result && (
                    <button 
                      onClick={() => { setImagePreview(null); setBase64Image(""); setResult(null); }}
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
                <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded-lg mt-4 text-sm text-center">
                  {error}
                </div>
              )}

              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 bg-gray-800 border border-green-500/20 rounded-xl p-5"
                >
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
                    {result.foodName || "Analysis Result"}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div className="bg-gray-900 p-3 rounded-lg text-center border border-gray-700">
                      <div className="text-green-400 text-2xl font-bold">{result.calories}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Calories</div>
                    </div>
                    <div className="bg-gray-900 p-3 rounded-lg text-center border border-gray-700">
                      <div className="text-amber-400 text-2xl font-bold">{result.protein}g</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Protein</div>
                    </div>
                    <div className="bg-gray-900 p-3 rounded-lg text-center border border-gray-700">
                      <div className="text-blue-400 text-2xl font-bold">{result.carbs}g</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Carbs</div>
                    </div>
                    <div className="bg-gray-900 p-3 rounded-lg text-center border border-gray-700">
                      <div className="text-red-400 text-2xl font-bold">{result.fats}g</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Fats</div>
                    </div>
                  </div>
                  
                  <div className="text-right text-xs text-gray-500 mt-3 flex justify-between items-center">
                    <span>AI Confidence: <strong className="text-gray-300">{result.confidence || "Unknown"}</strong></span>
                    <button 
                      onClick={closeScanner}
                      className="text-green-400 hover:text-green-300 font-medium"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}

              {!result && imagePreview && (
                <button
                  onClick={handleScan}
                  disabled={loading}
                  className={`w-full mt-6 py-3 rounded-xl font-bold text-black transition-all flex items-center justify-center space-x-2 ${
                    loading 
                    ? "bg-gray-500 cursor-not-allowed" 
                    : "bg-green-500 hover:bg-green-400"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing...</span>
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
