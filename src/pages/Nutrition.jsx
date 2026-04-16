import { useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { AuthContext } from "../context/AuthContext";
import api from "../Utils/axios";
import { FileHeart, Calculator, Settings, Activity, Sparkles, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function Nutrition() {
  const { user } = useContext(AuthContext);
  const containerRef = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current,
        { rotationY: -10, scale: 0.95, opacity: 0, y: 30 },
        { rotationY: 0, scale: 1, opacity: 1, y: 0, duration: 1.2, ease: "back.out(1.7)" }
      );
    });
    return () => ctx.revert();
  }, []);

  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("1.2");
  const [bodyType, setBodyType] = useState("mesomorph");
  const [goal, setGoal] = useState("maintain");

  const [tdee, setTdee] = useState(null);
  const [macros, setMacros] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => { loadHistory(); }, [user]);

  const loadHistory = async () => {
    if (user && user.token) {
      try {
        const response = await api.get("/nutrition/goals", { headers: { Authorization: `Bearer ${user.token}` } });
        setHistory(response.data.nutritionGoals.map(item => ({
          id: item.id, date: new Date(item.createdAt).toLocaleDateString(),
          age: item.age, weight: item.weight, height: item.height, gender: item.gender,
          activity: item.activityLevel, bodyType: item.bodyType, goal: item.goal,
          tdee: item.tdee, carbs: item.carbs, protein: item.protein, fats: item.fats
        })));
      } catch (err) {
        setHistory(JSON.parse(localStorage.getItem("nutritionHistory")) || []);
      }
    } else {
      setHistory(JSON.parse(localStorage.getItem("nutritionHistory")) || []);
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
        await api.delete(`/nutrition/goals/${item.id}`, { headers: { Authorization: `Bearer ${user.token}` }});
        loadHistory();
      } catch (err) {
        const newHistory = [...history]; newHistory.splice(index, 1); setHistory(newHistory); localStorage.setItem("nutritionHistory", JSON.stringify(newHistory));
      }
    } else {
      const newHistory = [...history]; newHistory.splice(index, 1); setHistory(newHistory); localStorage.setItem("nutritionHistory", JSON.stringify(newHistory));
    }
  };

  const handleDeleteAll = async () => {
    setHistory([]);
    localStorage.removeItem("nutritionHistory");
  };

  const calculateBMR = () => {
    const w = parseFloat(weight); const h = parseFloat(height); const a = parseFloat(age);
    return gender === "male" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
  };

  const calculateTDEE = () => calculateBMR() * parseFloat(activity);

  const calculateMacros = (tdeeCalories) => {
    let carbRatio, proteinRatio, fatRatio;
    switch (bodyType) {
      case "ectomorph": carbRatio = 0.55; proteinRatio = 0.25; fatRatio = 0.20; break;
      case "mesomorph": carbRatio = 0.40; proteinRatio = 0.30; fatRatio = 0.30; break;
      case "endomorph": carbRatio = 0.30; proteinRatio = 0.35; fatRatio = 0.35; break;
      default: carbRatio = 0.40; proteinRatio = 0.30; fatRatio = 0.30;
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

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");

    try {
      const tdeeCalories = calculateTDEE();
      const adjustedCalories = adjustCalories(tdeeCalories);
      const macroResult = calculateMacros(adjustedCalories);
      
      setTdee(adjustedCalories);
      setMacros(macroResult);

      if (user && user.token) {
        try {
          await api.post("/nutrition/goals", {
            age: parseInt(age), weight: parseFloat(weight), height: parseFloat(height), gender,
            activityLevel: activity, bodyType, goal, tdee: adjustedCalories, ...macroResult
          }, { headers: { Authorization: `Bearer ${user.token}` } });
          loadHistory();
        } catch (err) {
          saveToHistory({ date: new Date().toLocaleDateString(), age, weight, height, gender, activity, bodyType, goal, tdee: adjustedCalories, ...macroResult });
        }
      } else {
        saveToHistory({ date: new Date().toLocaleDateString(), age, weight, height, gender, activity, bodyType, goal, tdee: adjustedCalories, ...macroResult });
      }
    } catch (err) {
      setError("Failed to calculate nutrition. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const suggestedFoods = { carbs: "Rice, oats, potatoes, bread", protein: "Chicken, eggs, fish, tofu", fats: "Avocado, olive oil, nuts" };

  return (
    <div className="min-h-screen relative overflow-hidden py-12 px-4 sm:px-6">
      <div className="orb orb-orange w-96 h-96 -top-32 -left-32" />
      <div className="orb orb-yellow w-[500px] h-[500px] top-1/3 -right-64" />

      <div ref={containerRef} className="max-w-5xl mx-auto relative z-10 w-full" style={{ perspective: "1200px" }}>
        
        <header className="mb-10 text-center">
          <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] text-accent tracking-widest leading-none mb-4">
            NUTRITION CALC
          </h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Discover your daily calorie needs and optimal macro split.
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 rounded-xl text-center font-medium" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Setup */}
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleCalculate} className="glass-card card-3d p-6 md:p-8">
              <h2 className="font-bold text-xl mb-6 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <Settings size={20} style={{ color: "var(--accent-primary)" }} /> Base Stats
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Age", val: age, set: setAge },
                  { label: "Weight (kg)", val: weight, set: setWeight },
                  { label: "Height (cm)", val: height, set: setHeight },
                ].map(f => (
                  <div key={f.label} className={f.label === "Age" ? "col-span-2" : ""}>
                    <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>{f.label}</label>
                    <input type="number" required value={f.val} onChange={e => f.set(e.target.value)} className="input-field" />
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-8">
                {[
                  { label: "Gender", val: gender, set: setGender, opts: [{l: "Male", v: "male"}, {l: "Female", v: "female"}] },
                  { label: "Activity Level", val: activity, set: setActivity, opts: [
                      {l: "Sedentary", v: "1.2"}, {l: "Lightly Active", v: "1.375"}, {l: "Moderate", v: "1.55"}, {l: "Very Active", v: "1.725"}
                  ]},
                  { label: "Body Type", val: bodyType, set: setBodyType, opts: [
                      {l: "Ectomorph", v: "ectomorph"}, {l: "Mesomorph", v: "mesomorph"}, {l: "Endomorph", v: "endomorph"}
                  ]},
                  { label: "Goal", val: goal, set: setGoal, opts: [
                      {l: "Maintain Weight", v: "maintain"}, {l: "Bulk (Gain Weight)", v: "bulk"}, {l: "Cut (Lose Weight)", v: "cut"}
                  ]}
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>{f.label}</label>
                    <select required value={f.val} onChange={e => f.set(e.target.value)} className="input-field cursor-pointer">
                      {f.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <button type="submit" disabled={loading} className="btn-accent w-full justify-center">
                {loading ? "Calculating..." : <><Calculator size={18} /> Calculate Macros</>}
              </button>
            </form>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="popLayout">
              {tdee && macros ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card card-3d p-6 md:p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="font-bold text-xl flex items-center gap-2 mb-2" style={{ color: "var(--text-primary)" }}>
                        <Activity size={20} style={{ color: "var(--accent-primary)" }} /> Results for {goal}
                      </h2>
                      <p className="text-sm uppercase tracking-widest font-semibold" style={{ color: "var(--accent-secondary)" }}>Target Calories: {tdee} kcal</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[
                      { l: "Carbs", v: macros.carbs, c: "#ff6b35", s: suggestedFoods.carbs },
                      { l: "Protein", v: macros.protein, c: "#a855f7", s: suggestedFoods.protein },
                      { l: "Fats", v: macros.fats, c: "#ffd23f", s: suggestedFoods.fats }
                    ].map(m => (
                      <div key={m.l} className="p-4 rounded-xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
                        <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: "var(--text-muted)" }}>{m.l}</p>
                        <p className="text-3xl font-display tracking-widest mb-2" style={{ color: m.c }}>{m.v}g</p>
                        <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{m.s}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center p-4 rounded-xl" style={{ background: "var(--accent-glow-y)", border: "1px solid var(--accent-secondary)" }}>
                    <p className="text-sm font-semibold flex items-center justify-center gap-2" style={{ color: "var(--accent-secondary)" }}>
                      <Sparkles size={16} /> Connect to AI Coach for an exact meal plan.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="glass-card card-3d p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                  <FileHeart size={48} className="mb-4 opacity-50" style={{ color: "var(--text-muted)" }} />
                  <p className="font-semibold uppercase tracking-widest text-sm" style={{ color: "var(--text-muted)" }}>Enter your stats to see your macro targets</p>
                </div>
              )}
            </AnimatePresence>

            {/* History */}
            {(showHistory || history.length > 0) && (
              <div className="glass-card p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>Recent Calculations</h3>
                  <button onClick={handleDeleteAll} className="text-xs font-semibold uppercase tracking-widest hover:text-red-500 transition-colors" style={{ color: "var(--text-muted)" }}>
                    Clear History
                  </button>
                </div>
                {history.length > 0 ? (
                  <div className="space-y-3">
                    {history.map((h, i) => (
                      <div key={i} className="flex justify-between items-center p-4 rounded-xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
                        <div>
                          <p className="font-semibold text-sm mb-1" style={{ color: "var(--accent-primary)" }}>{h.goal.toUpperCase()} • {h.tdee} kcal</p>
                          <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{h.date}</p>
                        </div>
                        <button onClick={() => handleDelete(i)} className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors" style={{ color: "var(--text-muted)" }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>No history found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}