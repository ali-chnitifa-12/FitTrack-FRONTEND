import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import api from "../Utils/axios";

export default function Nutrition() {
  const { user } = useContext(AuthContext);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
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

  // History
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    if (user && user.token) {
      try {
        const response = await api.get("/nutrition/goals", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        setHistory(response.data.nutritionGoals.map(item => ({
          id: item.id,
          date: new Date(item.createdAt).toLocaleDateString(),
          age: item.age,
          weight: item.weight,
          height: item.height,
          gender: item.gender,
          activity: item.activityLevel,
          bodyType: item.bodyType,
          goal: item.goal,
          tdee: item.tdee,
          carbs: item.carbs,
          protein: item.protein,
          fats: item.fats
        })));
      } catch (err) {
        console.error("Failed to load history from server:", err);
        // Fallback to local storage
        const storedHistory = JSON.parse(localStorage.getItem("nutritionHistory")) || [];
        setHistory(storedHistory);
      }
    } else {
      // Not logged in, use local storage
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
          headers: { Authorization: `Bearer ${user.token}` }
        });
        // Reload history from server
        loadHistory();
      } catch (err) {
        console.error("Failed to delete from server:", err);
        // Fallback to local storage
        const newHistory = [...history];
        newHistory.splice(index, 1);
        setHistory(newHistory);
        localStorage.setItem("nutritionHistory", JSON.stringify(newHistory));
      }
    } else {
      // Not logged in or no ID, use local storage
      const newHistory = [...history];
      newHistory.splice(index, 1);
      setHistory(newHistory);
      localStorage.setItem("nutritionHistory", JSON.stringify(newHistory));
    }
  };

  const handleDeleteAll = async () => {
    if (user && user.token) {
      try {
        setHistory([]);
        localStorage.removeItem("nutritionHistory");
      } catch (err) {
        console.error("Failed to delete all from server:", err);
        setHistory([]);
        localStorage.removeItem("nutritionHistory");
      }
    } else {
      setHistory([]);
      localStorage.removeItem("nutritionHistory");
    }
  };

  // BMR and TDEE
  const calculateBMR = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    return gender === "male"
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;
  };

  const calculateTDEE = () => calculateBMR() * parseFloat(activity);

  // Macros
  const calculateMacros = (tdeeCalories) => {
    let carbRatio, proteinRatio, fatRatio;
    switch (bodyType) {
      case "ectomorph":
        carbRatio = 0.55; proteinRatio = 0.25; fatRatio = 0.20; break;
      case "mesomorph":
        carbRatio = 0.40; proteinRatio = 0.30; fatRatio = 0.30; break;
      case "endomorph":
        carbRatio = 0.30; proteinRatio = 0.35; fatRatio = 0.35; break;
      default:
        carbRatio = 0.40; proteinRatio = 0.30; fatRatio = 0.30;
    }
    return {
      carbs: Math.round((tdeeCalories * carbRatio) / 4),
      protein: Math.round((tdeeCalories * proteinRatio) / 4),
      fats: Math.round((tdeeCalories * fatRatio) / 9),
    };
  };

  const adjustCalories = (tdeeCalories) => {
    switch (goal) {
      case "bulk": return Math.round(tdeeCalories * 1.2);
      case "cut": return Math.round(tdeeCalories * 0.8);
      default: return Math.round(tdeeCalories);
    }
  };

  const suggestedFoods = {
    carbs: "rice, oats, potatoes, bread",
    protein: "chicken, eggs, fish, tofu",
    fats: "avocado, olive oil, nuts"
  };

  const generateMealPlan = () => {
    if (!macros) return [];
    const dailyMeals = [];
    const mealDistribution = [
      { type: "Breakfast", ratio: 0.3 },
      { type: "Lunch", ratio: 0.3 },
      { type: "Dinner", ratio: 0.3 },
      { type: "Snack 1", ratio: 0.05 },
      { type: "Snack 2", ratio: 0.05 },
    ];
    const carbFoods = ["Oats (50g)", "Rice (100g)", "Potatoes (150g)", "Bread (2 slices)"];
    const proteinFoods = ["Chicken (150g)", "Eggs (2)", "Fish (150g)", "Tofu (100g)"];
    const fatFoods = ["Avocado (50g)", "Olive oil (1 tbsp)", "Nuts (30g)", "Peanut butter (1 tbsp)"];

    for (let i = 1; i <= 7; i++) {
      const meals = mealDistribution.map((meal, idx) => ({
        type: meal.type,
        carbs: Math.round(macros.carbs * meal.ratio),
        protein: Math.round(macros.protein * meal.ratio),
        fats: Math.round(macros.fats * meal.ratio),
        suggestedCarb: carbFoods[idx % carbFoods.length],
        suggestedProtein: proteinFoods[idx % proteinFoods.length],
        suggestedFat: fatFoods[idx % fatFoods.length],
      }));
      dailyMeals.push({ day: `Day ${i}`, meals });
    }
    return dailyMeals;
  };

  const detailedMealPlan = generateMealPlan();

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Calculate values first (frontend calculation)
      const tdeeCalories = calculateTDEE();
      const adjustedCalories = adjustCalories(tdeeCalories);
      const macroResult = calculateMacros(adjustedCalories);
      
      // Update UI immediately
      setTdee(adjustedCalories);
      setMacros(macroResult);

      if (user && user.token) {
        try {
          // Try to save to backend
          const response = await api.post("/nutrition/goals", {
            age: parseInt(age),
            weight: parseFloat(weight),
            height: parseFloat(height),
            gender,
            activityLevel: activity,
            bodyType,
            goal,
            tdee: adjustedCalories,
            carbs: macroResult.carbs,
            protein: macroResult.protein,
            fats: macroResult.fats
          }, {
            headers: { Authorization: `Bearer ${user.token}` }
          });

          console.log("Saved to server:", response.data);
          
          // Reload history to get the new entry
          loadHistory();
        } catch (serverErr) {
          console.error("Failed to save to server:", serverErr);
          // Still save to local history even if server save fails
          saveToHistory({
            date: new Date().toLocaleDateString(),
            age, weight, height, gender, activity, bodyType, goal,
            tdee: adjustedCalories,
            ...macroResult
          });
        }
      } else {
        // Not logged in, save to local storage
        saveToHistory({
          date: new Date().toLocaleDateString(),
          age, weight, height, gender, activity, bodyType, goal,
          tdee: adjustedCalories,
          ...macroResult
        });
      }
    } catch (err) {
      console.error("Nutrition calculation error:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.code === 'ERR_NETWORK' || err.response?.status === 404 || err.response?.status === 500) {
        setError("Cannot connect to server. Using local calculation.");
      } else {
        setError("Failed to calculate nutrition. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 text-gray-100 p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-green-500/30 max-w-5xl w-full relative overflow-hidden"
      >
        {/* Background circles */}
        <motion.div className="absolute -top-20 -left-20 w-40 h-40 bg-green-500 rounded-full mix-blend-soft-light blur-3xl opacity-20"
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ rotate: { duration: 15, repeat: Infinity, ease: "linear" }, scale: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
        />
        <motion.div className="absolute -bottom-20 -right-20 w-60 h-60 bg-teal-500 rounded-full mix-blend-soft-light blur-3xl opacity-15"
          animate={{ rotate: -360, scale: [1.2, 1, 1.2] }}
          transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 10, repeat: Infinity, ease: "easeInOut" } }}
        />

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10">
          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-600/80 text-white p-3 rounded-xl mb-4 text-center"
            >
              {error}
            </motion.div>
          )}

          <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400">
            Nutrition Calculator
          </motion.h1>

          <motion.form variants={containerVariants} onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              { label: "Age (years)", value: age, setter: setAge, type: "number" },
              { label: "Weight (kg)", value: weight, setter: setWeight, type: "number" },
              { label: "Height (cm)", value: height, setter: setHeight, type: "number" },
            ].map((field, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <label className="block mb-2 text-lg font-semibold">{field.label}</label>
                <input type={field.type} value={field.value} onChange={(e) => field.setter(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-800 text-gray-100 text-lg border border-green-500 focus:border-green-400 focus:outline-none"
                  required
                />
              </motion.div>
            ))}

            {[
              { label: "Gender", value: gender, setter: setGender, options: ["male", "female"], labels: { male: "Male", female: "Female" } },
              { label: "Activity Level", value: activity, setter: setActivity, options: ["1.2", "1.375", "1.55", "1.725", "1.9"], labels: { "1.2": "Sedentary", "1.375": "Lightly Active", "1.55": "Moderate", "1.725": "Very Active", "1.9": "Extra Active" } },
              { label: "Body Type", value: bodyType, setter: setBodyType, options: ["ectomorph", "mesomorph", "endomorph"], labels: { ectomorph: "Ectomorph", mesomorph: "Mesomorph", endomorph: "Endomorph" } },
              { label: "Goal", value: goal, setter: setGoal, options: ["maintain", "bulk", "cut"], labels: { maintain: "Maintain", bulk: "Bulk", cut: "Cut" } }
            ].map((field, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <label className="block mb-2 text-lg font-semibold">{field.label}</label>
                <select value={field.value} onChange={(e) => field.setter(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-800 text-gray-100 text-lg border border-green-500 focus:border-green-400 focus:outline-none"
                >
                  {field.options.map(option => <option key={option} value={option}>{field.labels[option]}</option>)}
                </select>
              </motion.div>
            ))}

            <motion.div variants={itemVariants} className="md:col-span-2">
              <motion.button 
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.03, boxShadow: loading ? "none" : "0px 0px 15px rgba(74, 222, 128, 0.5)" }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                className={`w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 rounded-xl text-xl transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Calculating...
                  </div>
                ) : (
                  "Calculate Nutrition Plan"
                )}
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
                className="mb-8 bg-gray-800/50 p-6 rounded-2xl border border-green-500/30"
              >
                <h3 className="text-3xl font-bold text-green-400 mb-4">Your Results ({goal})</h3>
                <div className="flex flex-col md:flex-row md:space-x-6 mb-6">
                  <p className="text-xl text-gray-100 mb-4 md:mb-0">Calories/day: <strong className="text-green-400">{tdee} kcal</strong></p>
                  <div className="flex flex-col space-y-2">
                    <span className="bg-green-600 px-4 py-2 rounded-xl text-white text-center">Carbs: {macros.carbs} g</span>
                    <span className="bg-blue-600 px-4 py-2 rounded-xl text-white text-center">Protein: {macros.protein} g</span>
                    <span className="bg-yellow-500 px-4 py-2 rounded-xl text-white text-center">Fats: {macros.fats} g</span>
                  </div>
                </div>

                {/* Suggested Foods */}
                <div className="mb-6">
                  <h4 className="font-bold text-xl text-green-400 mb-3">Suggested Foods</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-700/50 p-3 rounded-xl text-gray-100">Carbs: {suggestedFoods.carbs}</div>
                    <div className="bg-gray-70/50 p-3 rounded-xl text-gray-100">Protein: {suggestedFoods.protein}</div>
                    <div className="bg-gray-700/50 p-3 rounded-xl text-gray-100">Fats: {suggestedFoods.fats}</div>
                  </div>
                </div>

                {/* Weekly Meal Plan */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-bold text-green-400">Detailed Weekly Meal Plan</h4>
                    <motion.button 
                      onClick={() => setShowHistory(!showHistory)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-sm bg-gray-700 px-3 py-1 rounded-lg text-gray-200"
                    >
                      {showHistory ? "Hide History" : "Show History"}
                    </motion.button>
                  </div>
                  <AnimatePresence>
                    {!showHistory && detailedMealPlan.map((day, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mb-4 bg-gray-700/30 p-4 rounded-xl text-gray-100"
                      >
                        <h5 className="text-green-400 font-semibold mb-2">{day.day}</h5>
                        <ul className="space-y-2">
                          {day.meals.map((meal, midx) => (
                            <motion.li 
                              key={midx} 
                              className="bg-gray-800/50 p-3 rounded-lg"
                              whileHover={{ x: 5 }}
                            >
                              <strong className="text-green-400">{meal.type}:</strong>
                              <div className="grid grid-cols-3 gap-2 mt-1 text-sm text-gray-300">
                                <span>Carbs: {meal.carbs}g</span>
                                <span>Protein: {meal.protein}g</span>
                                <span>Fats: {meal.fats}g</span>
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                Suggestions: {meal.suggestedCarb}, {meal.suggestedProtein}, {meal.suggestedFat}
                              </div>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
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
                transition={{ duration: 0.5 }}
                className="bg-gray-800/50 p-6 rounded-2xl border border-green-500/30 text-gray-100 mb-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-green-400">Last Calculations</h3>
                  <motion.button 
                    onClick={handleDeleteAll}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-white text-sm"
                  >
                    Delete All
                  </motion.button>
                </div>
                <ul className="space-y-3">
                  {history.length > 0 ? (
                    history.map((item, idx) => (
                      <motion.li 
                        key={idx} 
                        className="bg-gray-700/30 p-4 rounded-xl flex justify-between items-center"
                        whileHover={{ x: 5 }}
                      >
                        <div><span className="text-green-400 mr-3">{item.date}</span>{item.goal}: {item.tdee} kcal</div>
                        <motion.button 
                          onClick={() => handleDelete(idx)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-white text-sm"
                        >
                          Delete
                        </motion.button>
                      </motion.li>
                    ))
                  ) : (
                    <li className="text-gray-400 text-center py-4">No calculation history yet.</li>
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Floating particles */}
        {[1,2,3,4,5,6].map(i => (
          <motion.div key={i} className="absolute w-2 h-2 bg-green-400 rounded-full"
            style={{ top: `${10 + i*12}%`, left: `${5 + i*15}%` }}
            animate={{ y: [0, -15, 0], opacity: [0.3,0.8,0.3] }}
            transition={{ duration: 3+i, repeat: Infinity, delay: i*0.5 }}
          />
        ))}
      </motion.div>
    </div>
  );
}