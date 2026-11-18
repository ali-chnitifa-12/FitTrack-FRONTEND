import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../Utils/axios";
import toast from "react-hot-toast";

export default function FoodSearchModal({ isOpen, onClose, onFoodLogged, defaultMealType = "lunch" }) {
  const [activeTab, setActiveTab] = useState("moroccan"); // 'moroccan' | 'search' | 'barcode' | 'recent'
  const [query, setQuery] = useState("");
  const [barcode, setBarcode] = useState("");
  const [results, setResults] = useState([]);
  const [moroccanDishes, setMoroccanDishes] = useState([]);
  const [recentFoods, setRecentFoods] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [portionMultiplier, setPortionMultiplier] = useState(1.0);
  const [mealType, setMealType] = useState(defaultMealType);
  const [saving, setSaving] = useState(false);

  // Load Moroccan dishes once on mount
  useEffect(() => {
    if (isOpen) {
      loadMoroccanDishes();
      loadRecentAndFavorites();
    }
  }, [isOpen]);

  const loadMoroccanDishes = async () => {
    try {
      const res = await api.get("/foods/moroccan");
      setMoroccanDishes(res.data.dishes || []);
    } catch (err) {
      console.error("Failed to load Moroccan foods:", err);
    }
  };

  const loadRecentAndFavorites = async () => {
    try {
      const [recRes, favRes] = await Promise.allSettled([
        api.get("/meals/recent"),
        api.get("/meals/favorites"),
      ]);
      if (recRes.status === "fulfilled") setRecentFoods(recRes.value.data.recent || []);
      if (favRes.status === "fulfilled") setFavorites(favRes.value.data.favorites || []);
    } catch (err) {
      console.error("Failed to load recent/favorites:", err);
    }
  };

  // Debounced Search for Open Food Facts + Moroccan
  useEffect(() => {
    if (activeTab !== "search" || query.trim().length < 2) {
      if (activeTab === "search") setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/foods/search?q=${encodeURIComponent(query.trim())}`);
        setResults(res.data.results || []);
      } catch (err) {
        console.error("Search error:", err);
        toast.error("Failed to search foods");
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, activeTab]);

  const handleBarcodeSearch = async (e) => {
    e.preventDefault();
    if (!barcode.trim()) return;

    setLoading(true);
    try {
      const res = await api.get(`/foods/barcode/${encodeURIComponent(barcode.trim())}`);
      if (res.data?.product) {
        setSelectedFood(res.data.product);
      } else {
        toast.error("Product not found");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Barcode not found in Open Food Facts");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setPortionMultiplier(1.0);
  };

  const handleLogFood = async () => {
    if (!selectedFood) return;

    setSaving(true);
    try {
      const payload = {
        foodName: selectedFood.name,
        mealType,
        portion: selectedFood.servingSize || "1 serving",
        portionMultiplier,
        calories: Math.round(selectedFood.calories * portionMultiplier),
        protein: Math.round(selectedFood.protein * portionMultiplier * 10) / 10,
        carbs: Math.round(selectedFood.carbs * portionMultiplier * 10) / 10,
        fats: Math.round(selectedFood.fats * portionMultiplier * 10) / 10,
        source: selectedFood.source || "manual",
        barcode: selectedFood.barcode || null,
      };

      const res = await api.post("/meals", payload);
      toast.success(`Logged ${selectedFood.name} (${payload.calories} kcal)!`);
      if (onFoodLogged) onFoodLogged(res.data.meal);
      setSelectedFood(null);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to log meal");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 border border-green-500/30 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
      >
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/90">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <span>🥗</span> Food Database & Logger
            </h2>
            <p className="text-gray-400 text-xs">
              Search Open Food Facts, Moroccan local dishes, or scan barcodes.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800 bg-gray-950/60 p-2 gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => { setActiveTab("moroccan"); setSelectedFood(null); }}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "moroccan"
                ? "bg-green-500 text-black shadow-md shadow-green-500/20"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <span>🇲🇦</span> Moroccan Dishes
          </button>
          <button
            onClick={() => { setActiveTab("search"); setSelectedFood(null); }}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "search"
                ? "bg-green-500 text-black shadow-md shadow-green-500/20"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <span>🔍</span> Search Global (Open Food Facts)
          </button>
          <button
            onClick={() => { setActiveTab("barcode"); setSelectedFood(null); }}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "barcode"
                ? "bg-green-500 text-black shadow-md shadow-green-500/20"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <span>🏷️</span> Barcode Lookup
          </button>
          <button
            onClick={() => { setActiveTab("recent"); setSelectedFood(null); }}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "recent"
                ? "bg-green-500 text-black shadow-md shadow-green-500/20"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <span>⭐</span> Favorites & Recent
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-4">
          {/* 1. Moroccan Tab */}
          {activeTab === "moroccan" && (
            <div className="space-y-3">
              <p className="text-xs text-gray-400">
                Curated traditional recipes with estimated macros per authentic portion:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {moroccanDishes.map((dish) => (
                  <div
                    key={dish.id}
                    onClick={() => handleSelectFood(dish)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedFood?.id === dish.id
                        ? "bg-green-500/15 border-green-500 ring-1 ring-green-500"
                        : "bg-gray-800/40 border-gray-700/60 hover:border-gray-600 hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-white text-sm font-semibold">{dish.name}</p>
                      <span className="text-[11px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-mono font-bold">
                        {dish.calories} kcal
                      </span>
                    </div>
                    {dish.nameAr && <p className="text-xs text-green-400/80 mb-1 font-arabic" dir="rtl">{dish.nameAr}</p>}
                    <p className="text-[11px] text-gray-400 mb-2">{dish.servingSize}</p>
                    <div className="flex gap-2 text-[10px]">
                      <span className="bg-gray-900 px-2 py-0.5 rounded text-blue-400">P: {dish.protein}g</span>
                      <span className="bg-gray-900 px-2 py-0.5 rounded text-green-400">C: {dish.carbs}g</span>
                      <span className="bg-gray-900 px-2 py-0.5 rounded text-yellow-400">F: {dish.fats}g</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Global Search Tab */}
          {activeTab === "search" && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search food by name (e.g. Oatmeal, Nutella, Danone, Banana)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 text-sm"
              />

              {loading && (
                <div className="text-center py-8 text-green-400 text-xs animate-pulse">
                  Searching Open Food Facts & Moroccan database...
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="space-y-2">
                  {results.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      onClick={() => handleSelectFood(item)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedFood?.id === item.id
                          ? "bg-green-500/15 border-green-500"
                          : "bg-gray-800/40 border-gray-700/60 hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex-1 pr-3">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">{item.name}</p>
                          {item.brands && (
                            <span className="text-[10px] bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">
                              {item.brands}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400">
                          Serving: {item.servingSize || "100g"} • Source:{" "}
                          <span className="text-gray-300">{item.source === "moroccan_curated" ? "🇲🇦 Moroccan" : "Open Food Facts"}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-400">{item.calories} kcal</p>
                        <p className="text-[10px] text-gray-400">P:{item.protein} C:{item.carbs} F:{item.fats}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && query.length >= 2 && results.length === 0 && (
                <p className="text-center py-8 text-gray-500 text-xs">
                  No foods matched "{query}". Try checking your spelling or use Barcode lookup.
                </p>
              )}
            </div>
          )}

          {/* 3. Barcode Lookup Tab */}
          {activeTab === "barcode" && (
            <div className="space-y-4">
              <form onSubmit={handleBarcodeSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter barcode digits (e.g. 3017620422003)..."
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 text-sm font-mono"
                />
                <button
                  type="submit"
                  disabled={loading || !barcode.trim()}
                  className="bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-3 rounded-xl text-xs transition-colors disabled:opacity-50"
                >
                  {loading ? "Looking up..." : "Lookup"}
                </button>
              </form>

              <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-800 text-xs text-gray-400 space-y-1">
                <p className="font-semibold text-gray-300">💡 Barcode Tip:</p>
                <p>Enter the 8 to 13 digits printed beneath the barcode on any packaged food or drink. We query the free Open Food Facts international registry.</p>
              </div>
            </div>
          )}

          {/* 4. Recent & Favorites Tab */}
          {activeTab === "recent" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">⭐ Favorite Foods</h4>
                {favorites.length > 0 ? (
                  <div className="space-y-1.5">
                    {favorites.map((fav) => (
                      <div
                        key={fav.id}
                        onClick={() => handleSelectFood(fav)}
                        className={`p-2.5 rounded-xl border flex justify-between items-center cursor-pointer ${
                          selectedFood?.id === fav.id ? "bg-green-500/15 border-green-500" : "bg-gray-800/40 border-gray-700 hover:bg-gray-800"
                        }`}
                      >
                        <span className="text-sm text-white font-medium">{fav.foodName || fav.name}</span>
                        <span className="text-xs text-green-400 font-bold">{fav.calories} kcal</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No favorite foods starred yet.</p>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">🕒 Recently Logged</h4>
                {recentFoods.length > 0 ? (
                  <div className="space-y-1.5">
                    {recentFoods.map((rec) => (
                      <div
                        key={rec.id}
                        onClick={() => handleSelectFood(rec)}
                        className={`p-2.5 rounded-xl border flex justify-between items-center cursor-pointer ${
                          selectedFood?.id === rec.id ? "bg-green-500/15 border-green-500" : "bg-gray-800/40 border-gray-700 hover:bg-gray-800"
                        }`}
                      >
                        <span className="text-sm text-white font-medium">{rec.foodName || rec.name}</span>
                        <span className="text-xs text-green-400 font-bold">{rec.calories} kcal</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No recent foods logged yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Selected Food Confirmation Box */}
          {selectedFood && (
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/40 rounded-2xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-bold text-white">{selectedFood.name || selectedFood.foodName}</h4>
                  <p className="text-xs text-gray-400">{selectedFood.servingSize || selectedFood.portion || "1 serving"}</p>
                </div>
                <span className="text-sm font-bold text-green-400 font-mono">
                  {Math.round(selectedFood.calories * portionMultiplier)} kcal
                </span>
              </div>

              {/* Portion Multiplier Slider */}
              <div>
                <div className="flex justify-between text-xs text-gray-300 mb-1">
                  <span>Serving Portion:</span>
                  <span className="font-bold text-green-400">{portionMultiplier}x portion</span>
                </div>
                <div className="flex gap-2">
                  {[0.5, 1.0, 1.5, 2.0].map((mult) => (
                    <button
                      key={mult}
                      type="button"
                      onClick={() => setPortionMultiplier(mult)}
                      className={`flex-1 py-1 rounded-lg text-xs font-semibold border ${
                        portionMultiplier === mult
                          ? "bg-green-500 text-black border-green-500"
                          : "bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500"
                      }`}
                    >
                      {mult}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Meal Type Selector */}
              <div className="flex gap-2 text-xs">
                {["breakfast", "lunch", "dinner", "snack"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMealType(type)}
                    className={`flex-1 py-1.5 rounded-lg capitalize font-medium border ${
                      mealType === type
                        ? "bg-teal-500 text-black border-teal-500 font-bold"
                        : "bg-gray-800 text-gray-400 border-gray-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Macro Preview */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-gray-900/80 p-2 rounded-lg">
                  <span className="text-blue-400 font-bold block">
                    {Math.round(selectedFood.protein * portionMultiplier * 10) / 10}g
                  </span>
                  <span className="text-gray-400 text-[10px]">Protein</span>
                </div>
                <div className="bg-gray-900/80 p-2 rounded-lg">
                  <span className="text-green-400 font-bold block">
                    {Math.round(selectedFood.carbs * portionMultiplier * 10) / 10}g
                  </span>
                  <span className="text-gray-400 text-[10px]">Carbs</span>
                </div>
                <div className="bg-gray-900/80 p-2 rounded-lg">
                  <span className="text-yellow-400 font-bold block">
                    {Math.round(selectedFood.fats * portionMultiplier * 10) / 10}g
                  </span>
                  <span className="text-gray-400 text-[10px]">Fats</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogFood}
                disabled={saving}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2"
              >
                {saving ? "Logging..." : "Log to Today's Diary"}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
