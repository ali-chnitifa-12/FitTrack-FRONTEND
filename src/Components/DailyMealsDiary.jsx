import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../Utils/axios";
import toast from "react-hot-toast";
import FoodScanner from "./FoodScanner";
import FoodSearchModal from "./FoodSearchModal";
import analytics from "../Utils/analytics";

export default function DailyMealsDiary({ targetMacros, targetCalories }) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [meals, setMeals] = useState([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
  const [_loading, setLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMealTypeForAdd, setActiveMealTypeForAdd] = useState("lunch");
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    fetchMeals(selectedDate);
  }, [selectedDate]);

  const fetchMeals = async (date) => {
    setLoading(true);
    try {
      const res = await api.get(`/meals?date=${date}`);
      setMeals(res.data.meals || []);
      setTotals(res.data.totals || { calories: 0, protein: 0, carbs: 0, fats: 0 });
    } catch (err) {
      console.error("Failed to fetch meals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  const handleDeleteMeal = async (id) => {
    try {
      await api.delete(`/meals/${id}`);
      toast.success("Meal removed");
      fetchMeals(selectedDate);
    } catch {
      toast.error("Failed to delete meal");
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const res = await api.post(`/meals/${id}/favorite`);
      toast.success(res.data.isFavorite ? "Added to favorites ⭐" : "Removed from favorites");
      fetchMeals(selectedDate);
    } catch {
      toast.error("Failed to update favorite");
    }
  };

  const handleCopyYesterday = async () => {
    setCopying(true);
    try {
      const res = await api.post("/meals/copy-yesterday", { targetDate: selectedDate });
      toast.success(res.data.message || "Copied yesterday's meals!");
      fetchMeals(selectedDate);
    } catch (err) {
      toast.error(err.response?.data?.message || "No meals from yesterday found.");
    } finally {
      setCopying(false);
    }
  };

  const openSearchFor = (type) => {
    setActiveMealTypeForAdd(type);
    setIsSearchOpen(true);
  };

  const mealCategories = [
    { type: "breakfast", label: "Breakfast", icon: "🌅" },
    { type: "lunch", label: "Lunch", icon: "☀️" },
    { type: "dinner", label: "Dinner", icon: "🌙" },
    { type: "snack", label: "Snacks", icon: "🍎" },
  ];

  const calorieTarget = targetCalories || 2000;
  const calPercent = Math.min(100, Math.round((totals.calories / calorieTarget) * 100));

  return (
    <div className="bg-gray-800/40 border border-green-500/20 rounded-3xl p-5 md:p-8 space-y-6">
      {/* Top Header & Date Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-700/60 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>📖</span> Daily Food & Meals Diary
          </h2>
          <p className="text-xs text-gray-400">
            Log your daily intake with the AI Food Scanner, Moroccan local dishes, or barcode search.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-gray-900/80 p-1.5 rounded-xl border border-gray-700">
          <button
            onClick={handlePrevDay}
            className="px-2.5 py-1 text-gray-400 hover:text-white transition-colors"
            title="Previous Day"
          >
            ◀
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
          />
          <button
            onClick={handleNextDay}
            className="px-2.5 py-1 text-gray-400 hover:text-white transition-colors"
            title="Next Day"
          >
            ▶
          </button>
          <button
            onClick={handleToday}
            className="px-2 py-1 text-[11px] bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded font-semibold transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {/* Daily Progress Tracker Card */}
      <div className="bg-gray-900/70 p-4 md:p-6 rounded-2xl border border-gray-700/60 space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wider block">Calories Consumed</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-400">{totals.calories}</span>
              <span className="text-sm text-gray-500 font-medium">/ {calorieTarget} kcal target</span>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
            {calPercent}% of target
          </span>
        </div>

        {/* Calorie Progress Bar */}
        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-green-500 to-teal-400 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${calPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Macros Breakdown Cards */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="bg-gray-800/60 p-3 rounded-xl border border-gray-700/40 text-center">
            <span className="text-xs text-blue-400 font-bold block">{totals.protein}g</span>
            <span className="text-[10px] text-gray-400">
              Protein {targetMacros ? `(${targetMacros.protein}g target)` : ""}
            </span>
          </div>
          <div className="bg-gray-800/60 p-3 rounded-xl border border-gray-700/40 text-center">
            <span className="text-xs text-green-400 font-bold block">{totals.carbs}g</span>
            <span className="text-[10px] text-gray-400">
              Carbs {targetMacros ? `(${targetMacros.carbs}g target)` : ""}
            </span>
          </div>
          <div className="bg-gray-800/60 p-3 rounded-xl border border-gray-700/40 text-center">
            <span className="text-xs text-yellow-400 font-bold block">{totals.fats}g</span>
            <span className="text-[10px] text-gray-400">
              Fats {targetMacros ? `(${targetMacros.fats}g target)` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <FoodScanner onFoodLogged={() => fetchMeals(selectedDate)} />

        <button
          onClick={() => openSearchFor("lunch")}
          className="bg-gray-900 border border-green-500/40 hover:border-green-400 text-green-400 font-bold py-3 px-5 rounded-xl transition-all text-xs flex items-center gap-2 shadow-sm"
        >
          <span>🇲🇦</span>
          <span>Moroccan Dishes & Search</span>
        </button>

        <button
          onClick={handleCopyYesterday}
          disabled={copying}
          className="bg-gray-900 border border-gray-700 hover:border-gray-500 text-gray-300 py-3 px-4 rounded-xl transition-all text-xs flex items-center gap-2 disabled:opacity-50"
        >
          <span>📋</span>
          <span>{copying ? "Copying..." : "Copy Yesterday's Meals"}</span>
        </button>
      </div>

      {/* Meals Category Sections */}
      <div className="space-y-4 pt-2">
        {mealCategories.map((cat) => {
          const categoryMeals = meals.filter((m) => m.mealType === cat.type);
          const catCalories = categoryMeals.reduce((acc, m) => acc + m.calories, 0);

          return (
            <div
              key={cat.type}
              className="bg-gray-900/50 rounded-2xl border border-gray-800 p-4 md:p-5 space-y-3"
            >
              <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cat.icon}</span>
                  <h3 className="text-base font-bold text-white capitalize">{cat.label}</h3>
                  <span className="text-xs text-gray-500">
                    ({categoryMeals.length} item{categoryMeals.length === 1 ? "" : "s"})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-green-400 font-mono">
                    {catCalories} kcal
                  </span>
                  <button
                    onClick={() => openSearchFor(cat.type)}
                    className="text-xs text-green-400 hover:text-green-300 font-medium"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {categoryMeals.length > 0 ? (
                <div className="space-y-2">
                  {categoryMeals.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-gray-800/40 rounded-xl border border-gray-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => handleToggleFavorite(m.id)}
                          className={`text-sm transition-colors ${
                            m.isFavorite ? "text-yellow-400" : "text-gray-600 hover:text-yellow-400"
                          }`}
                          title="Toggle favorite"
                        >
                          ★
                        </button>
                        <div>
                          <p className="text-sm font-semibold text-white flex items-center gap-2">
                            {m.foodName}
                            {m.source === "moroccan_curated" && (
                              <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-1.5 py-0.2 rounded">
                                🇲🇦 Moroccan
                              </span>
                            )}
                            {m.source === "ai_scan" && (
                              <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-1.5 py-0.2 rounded">
                                🤖 AI Scan
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {m.portion || "1 serving"}{" "}
                            {m.portionMultiplier !== 1.0 ? `(${m.portionMultiplier}x)` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <div className="text-right">
                          <span className="text-sm font-bold text-green-400 font-mono block">
                            {m.calories} kcal
                          </span>
                          <span className="text-[10px] text-gray-400">
                            P:{m.protein}g C:{m.carbs}g F:{m.fats}g
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteMeal(m.id)}
                          className="text-gray-500 hover:text-red-400 p-1 text-xs transition-colors"
                          title="Delete meal"
                        >
                          ✕
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic py-1">
                  No {cat.label.toLowerCase()} foods logged for this date.
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-gray-500 italic text-center pt-2">
        ⚠️ Nutritional values from AI scans and curated dishes are approximate estimates. Portion sizes, cooking oils, and traditional recipes naturally vary.
      </p>

      {/* Food Search & Moroccan Dishes Modal */}
      <FoodSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onFoodLogged={() => {
          analytics.trackMealLogged("manual"); // user added a meal via search/manual entry
          fetchMeals(selectedDate);
        }}
        defaultMealType={activeMealTypeForAdd}
      />
    </div>
  );
}
