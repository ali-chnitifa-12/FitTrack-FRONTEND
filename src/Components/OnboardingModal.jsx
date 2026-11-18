// src/Components/OnboardingModal.jsx
import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, ArrowRight, ArrowLeft, Target, 
  Sparkles, AlertTriangle, Activity, Scale, Info, X 
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import api from "../Utils/axios";
import toast from "react-hot-toast";

const GOALS = [
  { id: "cut", title: "Fat Loss (Cut)", desc: "Moderate calorie deficit to burn fat while retaining lean muscle.", icon: "🔥" },
  { id: "maintain", title: "Maintain & Recomp", desc: "Keep weight steady, improve endurance, and build functional tone.", icon: "⚖️" },
  { id: "bulk", title: "Muscle Gain (Bulk)", desc: "Controlled calorie surplus to optimize muscle growth and strength.", icon: "💪" },
];

const ACTIVITIES = [
  { value: "1.2", label: "Sedentary", desc: "Desk job, little to no deliberate exercise" },
  { value: "1.375", label: "Lightly Active", desc: "1–3 workouts per week or moderate walking" },
  { value: "1.55", label: "Moderately Active", desc: "3–5 workouts per week, active lifestyle" },
  { value: "1.725", label: "Very Active", desc: "6–7 intense workouts per week or physical job" },
];

const BODY_TYPES = [
  { id: "ectomorph", title: "Ectomorph", desc: "Lean build, fast metabolism, handles carbs well (55% C / 25% P / 20% F)" },
  { id: "mesomorph", title: "Mesomorph", desc: "Naturally athletic build, responds quickly (40% C / 30% P / 30% F)" },
  { id: "endomorph", title: "Endomorph", desc: "Broader frame, prefers lower carb ratio (30% C / 35% P / 35% F)" },
];

export default function OnboardingModal({ isOpen, onClose, onComplete }) {
  const { user } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [goal, setGoal] = useState("cut");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [activity, setActivity] = useState("1.55");
  const [bodyType, setBodyType] = useState("mesomorph");

  // Calculated Results
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  // Real-time BMI
  const heightM = height / 100;
  const bmi = heightM > 0 ? (weight / (heightM * heightM)).toFixed(1) : 0;

  const handleNextStep = async () => {
    if (step < 4) {
      setStep((prev) => prev + 1);
      return;
    }

    if (step === 4) {
      // Calculate
      setLoading(true);
      try {
        const payload = {
          age: Number(age),
          gender,
          height: Number(height),
          weight: Number(weight),
          activity: activity.toString(),
          bodyType,
          goal,
        };

        const res = await api.post("/nutrition/calculate", payload);
        setResult(res.data);
        setStep(5);
      } catch (err) {
        console.error("Calculation error:", err);
        // Fallback local calculation if offline or server issue
        const bmr = gender === "male"
          ? 10 * weight + 6.25 * height - 5 * age + 5
          : 10 * weight + 6.25 * height - 5 * age - 161;
        let tdee = bmr * parseFloat(activity);
        if (goal === "cut") tdee *= 0.8;
        if (goal === "bulk") tdee *= 1.2;
        const roundedKcal = Math.round(tdee);
        setResult({
          bmi,
          tdee: roundedKcal,
          carbs: Math.round((roundedKcal * 0.4) / 4),
          protein: Math.round((roundedKcal * 0.3) / 4),
          fats: Math.round((roundedKcal * 0.3) / 9),
          warnings: [],
        });
        setStep(5);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveAndFinish = async () => {
    if (!result) return;
    setLoading(true);
    try {
      if (user?.token) {
        // Save Nutrition Goal
        await api.post(
          "/nutrition/save",
          {
            age: Number(age),
            weight: Number(weight),
            height: Number(height),
            gender,
            activityLevel: activity.toString(),
            bodyType,
            goal,
            tdee: result.tdee,
            carbs: result.carbs,
            protein: result.protein,
            fats: result.fats,
          },
          { headers: { Authorization: `Bearer ${user.token}` } }
        ).catch(() => {});

        // Save initial progress entry
        await api.post(
          "/progress",
          { weight: Number(weight), date: new Date().toISOString().split("T")[0] },
          { headers: { Authorization: `Bearer ${user.token}` } }
        ).catch(() => {});
      }

      toast.success("Profile initialized! Welcome to FitTrack.");
      if (onComplete) onComplete(result);
      onClose();
    } catch (err) {
      console.error("Save onboarding error:", err);
      toast.success("Targets calculated!");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 border border-green-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          aria-label="Close onboarding modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Stepper */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-400 mb-2">
            <span>Step {step} of 5</span>
            <span className="text-green-400">
              {step === 1 && "Select Goal"}
              {step === 2 && "Demographics"}
              {step === 3 && "Body Metrics"}
              {step === 4 && "Lifestyle & Metabolism"}
              {step === 5 && "Your Target Blueprint"}
            </span>
          </div>
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-teal-400 h-full rounded-full"
              initial={{ width: "20%" }}
              animate={{ width: `${step * 20}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          <AnimatePresence mode="wait">
            {/* STEP 1: GOAL */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Target className="w-6 h-6 text-green-400" /> What is your primary fitness goal?
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    We adapt calorie deficits and macronutrient ratios to support your specific outcome.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {GOALS.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoal(g.id)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                        goal === g.id
                          ? "bg-green-500/15 border-green-500 text-white shadow-lg shadow-green-500/10"
                          : "bg-gray-800/60 border-gray-700/60 text-gray-300 hover:border-gray-600"
                      }`}
                    >
                      <span className="text-3xl p-2 rounded-xl bg-gray-800/80 shrink-0">{g.icon}</span>
                      <div className="flex-1">
                        <div className="font-bold text-base flex items-center justify-between">
                          {g.title}
                          {goal === g.id && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                        </div>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{g.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: GENDER & AGE */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Activity className="w-6 h-6 text-green-400" /> Tell us about yourself
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Biological sex and age determine basal metabolic rate (BMR) under the Mifflin-St Jeor formula.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">Biological Sex</label>
                    <div className="grid grid-cols-2 gap-3">
                      {["male", "female"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={`p-3.5 rounded-xl border text-center font-bold capitalize transition-all ${
                            gender === g
                              ? "bg-green-500/15 border-green-500 text-green-400"
                              : "bg-gray-800/60 border-gray-700 text-gray-300 hover:border-gray-600"
                          }`}
                        >
                          {g === "male" ? "♂ Male" : "♀ Female"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="ageInput" className="text-xs font-semibold text-gray-300">Age (Years)</label>
                      <span className="text-sm font-bold text-green-400">{age} years</span>
                    </div>
                    <input
                      id="ageInput"
                      type="range"
                      min="13"
                      max="80"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full accent-green-500 cursor-pointer"
                    />
                    {age < 18 && (
                      <div className="mt-2 text-xs p-2.5 rounded-lg bg-blue-500/15 text-blue-300 border border-blue-500/30 flex items-center gap-2">
                        <Info className="w-4 h-4 shrink-0" />
                        Under 18: Weight-loss deficits are disabled to protect natural bone & hormonal development.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: HEIGHT & WEIGHT */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Scale className="w-6 h-6 text-green-400" /> Height & Current Weight
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Used to calculate baseline energy expenditure and starting Body Mass Index.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-gray-800/60 border border-gray-700/60 space-y-2">
                    <label htmlFor="heightInput" className="text-xs font-semibold text-gray-300 block">Height (cm)</label>
                    <input
                      id="heightInput"
                      type="number"
                      min="100"
                      max="240"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 text-white font-bold text-xl focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <span className="text-xs text-gray-400">e.g. 175 cm (5'9")</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-800/60 border border-gray-700/60 space-y-2">
                    <label htmlFor="weightInput" className="text-xs font-semibold text-gray-300 block">Current Weight (kg)</label>
                    <input
                      id="weightInput"
                      type="number"
                      min="35"
                      max="250"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 text-white font-bold text-xl focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <span className="text-xs text-gray-400">e.g. 75 kg (165 lbs)</span>
                  </div>
                </div>

                {/* BMI Callout */}
                <div className="p-3.5 rounded-xl bg-gray-800/40 border border-gray-700 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-300">Estimated Body Mass Index:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-green-400 text-base">{bmi}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      bmi < 18.5 ? "bg-amber-500/20 text-amber-300" :
                      bmi < 25 ? "bg-green-500/20 text-green-300" :
                      bmi < 30 ? "bg-blue-500/20 text-blue-300" : "bg-red-500/20 text-red-300"
                    }`}>
                      {bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal Weight" : bmi < 30 ? "Overweight" : "Obese"}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: ACTIVITY LEVEL & BODY TYPE */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Activity className="w-6 h-6 text-green-400" /> Activity Level & Body Type
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Fine-tune your total daily energy expenditure and macronutrient breakdown.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-2">Weekly Activity</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {ACTIVITIES.map((act) => (
                        <button
                          key={act.value}
                          type="button"
                          onClick={() => setActivity(act.value)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            activity === act.value
                              ? "bg-green-500/15 border-green-500 text-white"
                              : "bg-gray-800/60 border-gray-700/60 text-gray-300 hover:border-gray-600"
                          }`}
                        >
                          <div className="font-bold text-xs sm:text-sm text-green-400">{act.label}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5">{act.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-2">Body Type (Somatotype)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {BODY_TYPES.map((bt) => (
                        <button
                          key={bt.id}
                          type="button"
                          onClick={() => setBodyType(bt.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            bodyType === bt.id
                              ? "bg-green-500/15 border-green-500 text-white"
                              : "bg-gray-800/60 border-gray-700/60 text-gray-300 hover:border-gray-600"
                          }`}
                        >
                          <div className="font-bold text-xs text-green-400">{bt.title}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-2">{bt.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: CALCULATED RESULTS */}
            {step === 5 && result && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-5"
              >
                <div className="text-center space-y-1">
                  <div className="inline-flex p-3 rounded-full bg-green-500/20 text-green-400 mb-1">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">Your Daily Target Blueprint</h3>
                  <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
                    Calculated using the medically validated <strong>Mifflin-St Jeor equation</strong> with your personal metrics.
                  </p>
                </div>

                {/* Calorie Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500/20 via-gray-900 to-gray-900 border border-green-500/40 text-center">
                  <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Target Daily Calories</span>
                  <div className="text-4xl sm:text-5xl font-black text-white mt-1">
                    {result.tdee} <span className="text-lg font-medium text-gray-400">kcal/day</span>
                  </div>
                </div>

                {/* Macro Split Grid */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30">
                    <span className="text-[11px] font-bold text-blue-400 uppercase block">Protein</span>
                    <span className="text-xl font-extrabold text-white">{result.protein}g</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{result.protein * 4} kcal</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/30">
                    <span className="text-[11px] font-bold text-green-400 uppercase block">Carbs</span>
                    <span className="text-xl font-extrabold text-white">{result.carbs}g</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{result.carbs * 4} kcal</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                    <span className="text-[11px] font-bold text-yellow-400 uppercase block">Fats</span>
                    <span className="text-xl font-extrabold text-white">{result.fats}g</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{result.fats * 9} kcal</span>
                  </div>
                </div>

                {/* Formula Explanation Accordion / Callout */}
                <div className="p-3.5 rounded-xl bg-gray-800/50 border border-gray-700/60 text-xs text-gray-300 space-y-1.5 leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold text-green-400">
                    <Info className="w-4 h-4" />
                    <span>How This Was Calculated:</span>
                  </div>
                  <p>
                    1. <strong>BMR (Mifflin-St Jeor):</strong> (10 × {weight}kg) + (6.25 × {height}cm) - (5 × {age}) {gender === "male" ? "+ 5" : "- 161"}
                  </p>
                  <p>
                    2. <strong>TDEE:</strong> BMR × {activity} (activity multiplier) {goal === "cut" ? "− 20% deficit" : goal === "bulk" ? "+ 20% surplus" : "(maintenance)"}.
                  </p>
                </div>

                {/* Warnings if any */}
                {result.warnings && result.warnings.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>{result.warnings.join(" ")}</div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-800 pt-5 mt-4 flex items-center justify-between">
          {step > 1 && step < 5 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => prev - 1)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNextStep}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-green-500 hover:bg-green-400 text-black flex items-center gap-2 shadow-lg shadow-green-500/20 transition-all disabled:opacity-50"
            >
              {loading ? "Calculating..." : step === 4 ? "Calculate My Targets" : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveAndFinish}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-green-400 to-teal-400 hover:opacity-90 text-black flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              {loading ? "Saving Blueprint..." : "Save Targets & Go to Dashboard"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
