import { useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { AuthContext } from "../context/AuthContext";
import api from "../Utils/axios";
import FoodScanner from "../Components/FoodScanner";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

// ── Macro Donut Chart ────────────────────────────────────────────────────────
function MacroDonut({ carbs, protein, fats, totalCalories }) {
  const totalKcal = carbs * 4 + protein * 4 + fats * 9;
  const carbPct = Math.round((carbs * 4 / totalKcal) * 100);
  const proteinPct = Math.round((protein * 4 / totalKcal) * 100);
  const fatPct = 100 - carbPct - proteinPct;
  const gradient = `conic-gradient(#4ade80 0% ${carbPct}%, #60a5fa ${carbPct}% ${carbPct + proteinPct}%, #eab308 ${carbPct + proteinPct}% 100%)`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "backOut" }}
      className="flex flex-col items-center gap-4"
    >
      <div className="relative" style={{ width: 170, height: 170 }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: gradient,
            WebkitMask: "radial-gradient(transparent 52%, black 53%)",
            mask: "radial-gradient(transparent 52%, black 53%)",
            filter: "drop-shadow(0 0 14px rgba(74,222,128,0.35))",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-green-400">{totalCalories}</span>
          <span className="text-xs text-gray-400">kcal/day</span>
        </div>
      </div>

      {/* Macro Badges */}
      <div className="grid grid-cols-3 gap-2 w-full">
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-2 text-center">
          <div className="text-green-400 font-bold text-sm">{carbs}g</div>
          <div className="text-gray-400 text-xs">Carbs</div>
          <div className="text-gray-500 text-xs">{carbPct}%</div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-2 text-center">
          <div className="text-blue-400 font-bold text-sm">{protein}g</div>
          <div className="text-gray-400 text-xs">Protein</div>
          <div className="text-gray-500 text-xs">{proteinPct}%</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-2 text-center">
          <div className="text-yellow-400 font-bold text-sm">{fats}g</div>
          <div className="text-gray-400 text-xs">Fats</div>
          <div className="text-gray-500 text-xs">{fatPct}%</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-3 text-xs text-gray-400 flex-wrap justify-center">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" /> Carbs
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" /> Protein
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" /> Fats
        </span>
      </div>
    </motion.div>
  );
}

// ── BMI Scale ────────────────────────────────────────────────────────────────
function BMIScale({ weight, height }) {
  if (!weight || !height) return null;
  const bmi = parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2);
  const clamped = Math.max(15, Math.min(40, bmi));
  const pct = ((clamped - 15) / 25) * 100;

  const { label, color } =
    bmi < 18.5 ? { label: "Underweight", color: "text-blue-400" }
    : bmi < 25  ? { label: "Normal Weight", color: "text-green-400" }
    : bmi < 30  ? { label: "Overweight", color: "text-yellow-400" }
    :             { label: "Obese", color: "text-red-400" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-gray-800/50 p-4 rounded-2xl border border-green-500/20"
    >
      <h4 className="text-green-400 font-bold mb-3 flex items-center gap-2 text-sm">
        ⚖️ BMI Indicator
      </h4>
      <div
        className="relative h-5 rounded-full mb-2"
        style={{ background: "linear-gradient(to right, #60a5fa 0%, #4ade80 30%, #eab308 62%, #ef4444 100%)" }}
      >
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-6 bg-white rounded-full -translate-x-1/2"
          initial={{ left: "0%" }}
          animate={{ left: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ boxShadow: "0 0 10px rgba(255,255,255,0.9)" }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-500 mt-1">
        <span>15 · Under</span>
        <span>18.5 · Normal</span>
        <span>25 · Over</span>
        <span>30+ · Obese</span>
      </div>
      <p className={`text-center font-bold mt-2 text-sm ${color}`}>
        BMI: {bmi.toFixed(1)} — {label}
      </p>
    </motion.div>
  );
}

// ── Water Tracker ────────────────────────────────────────────────────────────
function WaterTracker() {
  const [glasses, setGlasses] = useState(0);
  const goal = 8;

  const toggle = (i) => {
    const newGlasses = i + 1 === glasses ? i : i + 1;
    setGlasses(newGlasses);
    if (newGlasses === goal) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#60a5fa', '#3b82f6', '#ffffff']
      });
      toast.success("Daily water goal reached! Stay hydrated! 💧");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35 }}
      className="bg-gray-800/50 p-4 rounded-2xl border border-blue-500/20"
    >
      <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2 text-sm">
        💧 Daily Water Intake
      </h4>
      <div className="flex gap-1.5 flex-wrap mb-2">
        {Array.from({ length: goal }).map((_, i) => (
          <motion.button
            key={i}
            onClick={() => toggle(i)}
            whileTap={{ scale: 0.75 }}
            whileHover={{ scale: 1.2 }}
            className={`text-xl transition-all duration-200 ${i < glasses ? "opacity-100" : "opacity-25"}`}
          >
            💧
          </motion.button>
        ))}
      </div>
      <p className="text-xs text-gray-400">
        {glasses}/{goal} glasses · {glasses * 250}ml / {goal * 250}ml
      </p>
      <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-400 rounded-full"
          animate={{ width: `${(glasses / goal) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <AnimatePresence>
        {glasses >= goal && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-green-400 text-xs font-bold mt-2"
          >
            🎉 Daily goal reached!
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function Nutrition() {
  const { user } = useContext(AuthContext);
  const containerRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          containerRef.current,
          { rotationY: -90, scale: 0.8, opacity: 0 },
          { rotationY: 0, scale: 1, opacity: 1, duration: 1.5, ease: "back.out(1.7)" }
        );

        const formElements = document.querySelectorAll(".form-element");
        if (formElements.length > 0) {
          gsap.fromTo(
            formElements,
            { y: 50, opacity: 0, rotationX: -30 },
            { y: 0, opacity: 1, rotationX: 0, duration: 0.8, stagger: 0.1, delay: 0.5, ease: "power2.out" }
          );
        }

        particlesRef.current.forEach((particle, index) => {
          if (particle) {
            gsap.to(particle, {
              y: -20, opacity: 0.8, duration: 2 + index * 0.5,
              ease: "power1.inOut", yoyo: true, repeat: -1, delay: index * 0.3,
            });
          }
        });

        gsap.to(".bg-circle-1", { rotation: 360, scale: 1.2, duration: 20, repeat: -1, ease: "none" });
        gsap.to(".bg-circle-2", { rotation: -360, scale: 1.5, duration: 25, repeat: -1, ease: "none" });
      }, containerRef);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  // Form state
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("1.2");
  const [bodyType, setBodyType] = useState("mesomorph");
  const [goal, setGoal] = useState("maintain");

  // Result state
  const [tdee, setTdee] = useState(null);
  const [macros, setMacros] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState(0);

  // History
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    if (user && user.token) {
      try {
        const response = await api.get("/nutrition/goals", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setHistory(
          response.data.nutritionGoals.map((item) => ({
            id: item.id,
            date: new Date(item.createdAt).toLocaleDateString(),
            age: item.age, weight: item.weight, height: item.height,
            gender: item.gender, activity: item.activityLevel,
            bodyType: item.bodyType, goal: item.goal,
            tdee: item.tdee, carbs: item.carbs, protein: item.protein, fats: item.fats,
          }))
        );
      } catch {
        const storedHistory = JSON.parse(localStorage.getItem("nutritionHistory")) || [];
        setHistory(storedHistory);
      }
    } else {
      const storedHistory = JSON.parse(localStorage.getItem("nutritionHistory")) || [];
      setHistory(storedHistory);
    }
  };

  const saveToHistory = (entry) => {
    const newHistory = [entry, ...history].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem("nutritionHistory", JSON.stringify(newHistory));
  };

  const handleDelete = async (index) => {
    const item = history[index];
    if (user && user.token && item.id) {
      try {
        await api.delete(`/nutrition/goals/${item.id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        loadHistory();
      } catch {
        const newHistory = [...history];
        newHistory.splice(index, 1);
        setHistory(newHistory);
        localStorage.setItem("nutritionHistory", JSON.stringify(newHistory));
      }
    } else {
      const newHistory = [...history];
      newHistory.splice(index, 1);
      setHistory(newHistory);
      localStorage.setItem("nutritionHistory", JSON.stringify(newHistory));
    }
  };

  const handleDeleteAll = () => {
    setHistory([]);
    localStorage.removeItem("nutritionHistory");
  };

  const calculateBMR = () => {
    const w = parseFloat(weight), h = parseFloat(height), a = parseFloat(age);
    return gender === "male" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
  };

  const calculateTDEE = () => calculateBMR() * parseFloat(activity);

  const calculateMacros = (tdeeCalories) => {
    let carbRatio, proteinRatio, fatRatio;
    switch (bodyType) {
      case "ectomorph": carbRatio = 0.55; proteinRatio = 0.25; fatRatio = 0.20; break;
      case "mesomorph": carbRatio = 0.40; proteinRatio = 0.30; fatRatio = 0.30; break;
      case "endomorph": carbRatio = 0.30; proteinRatio = 0.35; fatRatio = 0.35; break;
      default:          carbRatio = 0.40; proteinRatio = 0.30; fatRatio = 0.30;
    }
    return {
      carbs:   Math.round((tdeeCalories * carbRatio) / 4),
      protein: Math.round((tdeeCalories * proteinRatio) / 4),
      fats:    Math.round((tdeeCalories * fatRatio) / 9),
    };
  };

  const adjustCalories = (tdeeCalories) => {
    switch (goal) {
      case "bulk": return Math.round(tdeeCalories * 1.2);
      case "cut":  return Math.round(tdeeCalories * 0.8);
      default:     return Math.round(tdeeCalories);
    }
  };

  const suggestedFoods = {
    carbs:   { label: "Carbs",   foods: "Rice, Oats, Potatoes, Whole Bread", emoji: "🌾" },
    protein: { label: "Protein", foods: "Chicken, Eggs, Fish, Tofu",         emoji: "🥩" },
    fats:    { label: "Fats",    foods: "Avocado, Olive Oil, Nuts",           emoji: "🥑" },
  };

  const mealEmojis = { Breakfast: "🌅", Lunch: "☀️", Dinner: "🌙", "Snack 1": "🍎", "Snack 2": "🥜" };

  const generateMealPlan = () => {
    if (!macros) return [];
    const mealDistribution = [
      { type: "Breakfast", ratio: 0.3 },
      { type: "Lunch",     ratio: 0.3 },
      { type: "Dinner",    ratio: 0.3 },
      { type: "Snack 1",   ratio: 0.05 },
      { type: "Snack 2",   ratio: 0.05 },
    ];
    const carbFoods    = ["Oats (50g)",    "Rice (100g)",      "Potatoes (150g)", "Bread (2 slices)"];
    const proteinFoods = ["Chicken (150g)","Eggs (2)",         "Fish (150g)",     "Tofu (100g)"];
    const fatFoods     = ["Avocado (50g)", "Olive oil (1 tbsp)","Nuts (30g)",    "Peanut butter (1 tbsp)"];

    return Array.from({ length: 7 }, (_, day) => ({
      day: `Day ${day + 1}`,
      meals: mealDistribution.map((meal, idx) => ({
        type: meal.type,
        carbs:           Math.round(macros.carbs * meal.ratio),
        protein:         Math.round(macros.protein * meal.ratio),
        fats:            Math.round(macros.fats * meal.ratio),
        calories:        Math.round((macros.carbs * meal.ratio * 4) + (macros.protein * meal.ratio * 4) + (macros.fats * meal.ratio * 9)),
        suggestedCarb:   carbFoods[idx % carbFoods.length],
        suggestedProtein:proteinFoods[idx % proteinFoods.length],
        suggestedFat:    fatFoods[idx % fatFoods.length],
      })),
    }));
  };

  const detailedMealPlan = generateMealPlan();

  const handleExport = () => {
    if (!tdee || !macros) return;
    const activityLabels = { "1.2": "Sedentary", "1.375": "Lightly Active", "1.55": "Moderate", "1.725": "Very Active", "1.9": "Extra Active" };
    const lines = [
      "╔══════════════════════════════════════╗",
      "║      FITTRACK — NUTRITION PLAN       ║",
      "╚══════════════════════════════════════╝",
      `Generated : ${new Date().toLocaleDateString()}`,
      "",
      "─── YOUR PROFILE ───────────────────────",
      `Age        : ${age} years`,
      `Weight     : ${weight} kg`,
      `Height     : ${height} cm`,
      `Gender     : ${gender}`,
      `Activity   : ${activityLabels[activity] || activity}`,
      `Body Type  : ${bodyType}`,
      `Goal       : ${goal.toUpperCase()}`,
      "",
      "─── DAILY TARGETS ──────────────────────",
      `Calories   : ${tdee} kcal/day`,
      `Carbs      : ${macros.carbs} g`,
      `Protein    : ${macros.protein} g`,
      `Fats       : ${macros.fats} g`,
      "",
      "─── SUGGESTED FOODS ────────────────────",
      `Carbs   : Rice, Oats, Potatoes, Whole Bread`,
      `Protein : Chicken, Eggs, Fish, Tofu`,
      `Fats    : Avocado, Olive Oil, Nuts`,
      "",
      "─── DAY 1 MEAL PLAN ────────────────────",
      ...(detailedMealPlan[0]?.meals.map(
        (m) => `${m.type.padEnd(12)}: ${m.calories} kcal | C:${m.carbs}g P:${m.protein}g F:${m.fats}g`
      ) || []),
      "",
      "Generated by FitTrack • Stay consistent! 💪",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fittrack-nutrition-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Plan exported successfully! ⬇️");
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSelectedDay(0);

    try {
      const tdeeCalories = calculateTDEE();
      const adjustedCalories = adjustCalories(tdeeCalories);
      const macroResult = calculateMacros(adjustedCalories);

      setTdee(adjustedCalories);
      setMacros(macroResult);

      if (user && user.token) {
        try {
          await api.post("/nutrition/goals", {
            age: parseInt(age), weight: parseFloat(weight), height: parseFloat(height),
            gender, activityLevel: activity, bodyType, goal,
            tdee: adjustedCalories, carbs: macroResult.carbs,
            protein: macroResult.protein, fats: macroResult.fats,
          }, { headers: { Authorization: `Bearer ${user.token}` } });
          loadHistory();
          toast.success("Nutrition plan calculated and saved! 🥗");
        } catch {
          saveToHistory({ date: new Date().toLocaleDateString(), age, weight, height, gender, activity, bodyType, goal, tdee: adjustedCalories, ...macroResult });
          toast.success("Plan calculated! Saved locally.");
        }
      } else {
        saveToHistory({ date: new Date().toLocaleDateString(), age, weight, height, gender, activity, bodyType, goal, tdee: adjustedCalories, ...macroResult });
        toast.success("Plan calculated! Sign in to save across devices.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        toast.error("Session expired.");
      } else if (err.code === "ERR_NETWORK" || err.response?.status >= 500) {
        setError("Cannot connect to server. Using local calculation.");
        toast.error("Server unreachable. Using local calculation.");
      } else {
        setError("Failed to calculate. Please try again.");
        toast.error("Failed to calculate.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center p-4 md:p-6 text-gray-100">
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900/80 backdrop-blur-md p-4 md:p-8 rounded-3xl shadow-xl border border-green-500/30 max-w-5xl w-full relative overflow-hidden"
      >
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10">

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-600/80 text-white p-3 rounded-xl mb-4 text-center text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400"
          >
            Nutrition Calculator
          </motion.h1>
          <motion.p variants={itemVariants} className="text-gray-400 text-center mb-6">
            Calculate your daily calorie needs and personalized macro targets
          </motion.p>

          {/* Food Scanner */}
          <motion.div variants={itemVariants} className="flex flex-col items-center justify-center mb-8 pb-6 border-b border-gray-800">
            <p className="text-gray-400 mb-4 text-sm text-center">Want to know the macros of your meal instantly?</p>
            <FoodScanner />
          </motion.div>

          {/* Form */}
          <motion.form
            variants={containerVariants}
            onSubmit={handleCalculate}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8"
          >
            {[
              { id: "age",    label: "Age (years)",  value: age,    setter: setAge,    type: "number" },
              { id: "weight", label: "Weight (kg)",  value: weight, setter: setWeight, type: "number" },
              { id: "height", label: "Height (cm)",  value: height, setter: setHeight, type: "number" },
            ].map((field) => (
              <motion.div key={field.id} variants={itemVariants} className="form-element transform-gpu" style={{ transformStyle: "preserve-3d" }}>
                <label htmlFor={field.id} className="block mb-2 font-semibold text-gray-300 text-sm">{field.label}</label>
                <input
                  id={field.id} name={field.id} type={field.type}
                  value={field.value} onChange={(e) => field.setter(e.target.value)}
                  aria-label={field.label} required
                  className="w-full p-3 rounded-xl bg-gray-800 text-gray-100 border border-green-500/50 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400/30 transition-all duration-300"
                />
              </motion.div>
            ))}

            {[
              { id: "gender",   label: "Gender",         value: gender,   setter: setGender,   options: [{ v: "male",    l: "Male" }, { v: "female", l: "Female" }] },
              { id: "activity", label: "Activity Level",  value: activity, setter: setActivity, options: [{ v: "1.2", l: "Sedentary" }, { v: "1.375", l: "Lightly Active" }, { v: "1.55", l: "Moderate" }, { v: "1.725", l: "Very Active" }, { v: "1.9", l: "Extra Active" }] },
              { id: "bodyType", label: "Body Type",       value: bodyType, setter: setBodyType, options: [{ v: "ectomorph", l: "Ectomorph 🏃" }, { v: "mesomorph", l: "Mesomorph 💪" }, { v: "endomorph", l: "Endomorph 🔥" }] },
              { id: "goal",     label: "Goal",            value: goal,     setter: setGoal,     options: [{ v: "maintain", l: "Maintain" }, { v: "bulk", l: "Bulk 📈" }, { v: "cut", l: "Cut 📉" }] },
            ].map((field) => (
              <motion.div key={field.id} variants={itemVariants} className="form-element transform-gpu" style={{ transformStyle: "preserve-3d" }}>
                <label htmlFor={field.id} className="block mb-2 font-semibold text-gray-300 text-sm">{field.label}</label>
                <select
                  id={field.id} name={field.id} value={field.value}
                  onChange={(e) => field.setter(e.target.value)} aria-label={field.label}
                  className="w-full p-3 rounded-xl bg-gray-800 text-gray-100 border border-green-500/50 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400/30 transition-all duration-300"
                >
                  {field.options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </motion.div>
            ))}

            <motion.div variants={itemVariants} className="md:col-span-2 form-element transform-gpu" style={{ transformStyle: "preserve-3d" }}>
              <motion.button
                type="submit" disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? "none" : "0 0 20px rgba(74,222,128,0.4)" }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                className={`w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 rounded-xl text-lg transition-all duration-200 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Calculating...
                  </div>
                ) : "Calculate Nutrition Plan 🚀"}
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Results */}
          <AnimatePresence>
            {tdee && macros && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                {/* Results Header */}
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-2xl font-bold text-green-400">
                    Your Results{" "}
                    <span className="text-base font-normal text-gray-400 capitalize">({goal})</span>
                  </h3>
                  <motion.button
                    onClick={handleExport}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/40 text-green-400 rounded-xl text-sm font-semibold hover:bg-green-500/20 transition-all"
                  >
                    ⬇️ Export Plan
                  </motion.button>
                </div>

                {/* Donut + Stats grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  {/* Left: Donut */}
                  <div className="bg-gray-800/50 p-5 rounded-2xl border border-green-500/20 flex items-center justify-center">
                    <MacroDonut carbs={macros.carbs} protein={macros.protein} fats={macros.fats} totalCalories={tdee} />
                  </div>

                  {/* Right: BMI + Water */}
                  <div className="flex flex-col gap-4">
                    <BMIScale weight={weight} height={height} />
                    <WaterTracker />
                  </div>
                </div>

                {/* Suggested Foods */}
                <div className="mb-5">
                  <h4 className="font-bold text-lg text-green-400 mb-3">🍽️ Suggested Foods</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.values(suggestedFoods).map((sf) => (
                      <div key={sf.label} className="bg-gray-800/50 p-3 rounded-xl border border-gray-700/50 flex items-start gap-2">
                        <span className="text-xl flex-shrink-0">{sf.emoji}</span>
                        <div>
                          <div className="text-green-400 font-semibold text-sm">{sf.label}</div>
                          <div className="text-gray-400 text-xs">{sf.foods}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meal Plan */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-bold text-green-400">📅 Weekly Meal Plan</h4>
                    <motion.button
                      onClick={() => setShowHistory(!showHistory)}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg text-gray-300 transition-all"
                    >
                      {showHistory ? "Hide History" : "Show History"}
                    </motion.button>
                  </div>

                  {/* Day Selector */}
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
                    {detailedMealPlan.map((d, i) => (
                      <motion.button
                        key={i}
                        onClick={() => setSelectedDay(i)}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
                          selectedDay === i
                            ? "bg-green-500 text-black"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        {d.day}
                      </motion.button>
                    ))}
                  </div>

                  {/* Meal Cards */}
                  <AnimatePresence mode="wait">
                    {detailedMealPlan[selectedDay] && (
                      <motion.div
                        key={selectedDay}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.25 }}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
                      >
                        {detailedMealPlan[selectedDay].meals.map((meal, midx) => (
                          <motion.div
                            key={midx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: midx * 0.06 }}
                            className="bg-gray-800/50 p-3 rounded-xl border border-gray-700/50 hover:border-green-500/30 transition-all"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xl">{mealEmojis[meal.type] || "🍴"}</span>
                              <span className="text-green-400 font-bold text-sm">{meal.type}</span>
                            </div>
                            <div className="text-xs text-gray-400 mb-2">{meal.calories} kcal</div>
                            <div className="grid grid-cols-3 gap-1 text-xs mb-2">
                              <span className="bg-green-500/10 text-green-400 rounded px-1 py-0.5 text-center">C:{meal.carbs}g</span>
                              <span className="bg-blue-500/10 text-blue-400 rounded px-1 py-0.5 text-center">P:{meal.protein}g</span>
                              <span className="bg-yellow-500/10 text-yellow-400 rounded px-1 py-0.5 text-center">F:{meal.fats}g</span>
                            </div>
                            <div className="text-xs text-gray-500 leading-relaxed">
                              {meal.suggestedCarb}, {meal.suggestedProtein}, {meal.suggestedFat}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* History */}
          <AnimatePresence>
            {(showHistory || history.length > 0) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-gray-800/50 p-5 rounded-2xl border border-green-500/20 mb-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-green-400">🕓 Last Calculations</h3>
                  <motion.button
                    onClick={handleDeleteAll}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="bg-red-600/80 hover:bg-red-700 px-3 py-1.5 rounded-xl text-white text-xs font-semibold"
                  >
                    Clear All
                  </motion.button>
                </div>
                <ul className="space-y-2">
                  {history.length > 0 ? (
                    history.map((item, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-gray-700/30 p-3 rounded-xl flex justify-between items-center"
                      >
                        <div className="text-sm">
                          <span className="text-green-400 font-semibold mr-2">{item.date}</span>
                          <span className="text-gray-300 capitalize">{item.goal}</span>
                          <span className="text-gray-400 ml-2">· {item.tdee} kcal</span>
                        </div>
                        <motion.button
                          onClick={() => handleDelete(idx)}
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          className="bg-red-600/70 hover:bg-red-700 px-2 py-1 rounded-lg text-white text-xs"
                        >
                          Delete
                        </motion.button>
                      </motion.li>
                    ))
                  ) : (
                    <li className="text-gray-400 text-center py-4 text-sm">No calculation history yet.</li>
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Floating particles */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            ref={(el) => (particlesRef.current[i - 1] = el)}
            className="absolute w-2 h-2 bg-green-400 rounded-full transform-gpu opacity-20"
            style={{ top: `${10 + i * 12}%`, left: `${5 + i * 15}%`, transformStyle: "preserve-3d" }}
          />
        ))}
      </motion.div>
    </div>
  );
}