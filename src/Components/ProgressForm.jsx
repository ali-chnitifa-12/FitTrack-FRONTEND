import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Flame, Zap, Heart } from "lucide-react";

const moodOptions = [
  { value: 1, emoji: "😞", label: "Bad" },
  { value: 2, emoji: "😐", label: "Okay" },
  { value: 3, emoji: "🙂", label: "Good" },
  { value: 4, emoji: "😄", label: "Great" },
  { value: 5, emoji: "🔥", label: "Amazing" },
];

const energyOptions = [
  { value: 1, label: "Very Low", color: "bg-red-500" },
  { value: 2, label: "Low", color: "bg-orange-500" },
  { value: 3, label: "Medium", color: "bg-yellow-500" },
  { value: 4, label: "High", color: "bg-green-400" },
  { value: 5, label: "Max", color: "bg-green-500" },
];

export default function ProgressForm({ addEntry }) {
  const [caloriesIn, setCaloriesIn] = useState("");
  const [caloriesOut, setCaloriesOut] = useState("");
  const [weight, setWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [mood, setMood] = useState(null);
  const [energy, setEnergy] = useState(null);
  const [showExtra, setShowExtra] = useState(false);

  // Extra measurements
  const [waist, setWaist] = useState("");
  const [chest, setChest] = useState("");
  const [arms, setArms] = useState("");
  const [workoutDone, setWorkoutDone] = useState(false);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!caloriesIn || !caloriesOut || !weight || !targetWeight) return;

    addEntry({
      date: new Date().toLocaleDateString(),
      caloriesIn: Number(caloriesIn),
      caloriesOut: Number(caloriesOut),
      weight: Number(weight),
      targetWeight: Number(targetWeight),
      mood: mood || 3,
      energy: energy || 3,
      waist: waist ? Number(waist) : undefined,
      chest: chest ? Number(chest) : undefined,
      arms: arms ? Number(arms) : undefined,
      workoutDone,
      notes,
    });

    setCaloriesIn("");
    setCaloriesOut("");
    setWeight("");
    setTargetWeight("");
    setMood(null);
    setEnergy(null);
    setWaist("");
    setChest("");
    setArms("");
    setWorkoutDone(false);
    setNotes("");
  };

  const inputCls =
    "w-full p-3 rounded-xl bg-gray-800/80 text-gray-100 border border-gray-700 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/50 transition-all duration-200 placeholder-gray-500";

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-green-500/20 space-y-5"
    >
      <h2 className="text-2xl text-green-400 font-bold flex items-center gap-2">
        <Flame size={22} className="text-orange-400" />
        Log Today's Entry
      </h2>

      {/* Core Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="caloriesIn" className="text-xs text-gray-400 mb-1 block">Calories Consumed</label>
          <input
            id="caloriesIn"
            name="caloriesIn"
            type="number"
            placeholder="e.g. 2200"
            value={caloriesIn}
            onChange={(e) => setCaloriesIn(e.target.value)}
            className={inputCls}
            required
          />
        </div>
        <div>
          <label htmlFor="caloriesOut" className="text-xs text-gray-400 mb-1 block">Calories Burned</label>
          <input
            id="caloriesOut"
            name="caloriesOut"
            type="number"
            placeholder="e.g. 400"
            value={caloriesOut}
            onChange={(e) => setCaloriesOut(e.target.value)}
            className={inputCls}
            required
          />
        </div>
        <div>
          <label htmlFor="weight" className="text-xs text-gray-400 mb-1 block">Current Weight (kg)</label>
          <input
            id="weight"
            name="weight"
            type="number"
            step="0.1"
            placeholder="e.g. 82.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={inputCls}
            required
          />
        </div>
        <div>
          <label htmlFor="targetWeight" className="text-xs text-gray-400 mb-1 block">Target Weight (kg)</label>
          <input
            id="targetWeight"
            name="targetWeight"
            type="number"
            step="0.1"
            placeholder="e.g. 75.0"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            className={inputCls}
            required
          />
        </div>
      </div>

      {/* Mood Selector */}
      <div>
        <label className="text-xs text-gray-400 mb-2 block flex items-center gap-1">
          <Heart size={12} className="text-pink-400" /> Today's Mood
        </label>
        <div className="flex gap-2">
          {moodOptions.map((m) => (
            <motion.button
              key={m.value}
              type="button"
              onClick={() => setMood(m.value)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className={`flex-1 flex flex-col items-center py-2 rounded-xl border transition-all duration-200 ${
                mood === m.value
                  ? "border-green-500 bg-green-500/20"
                  : "border-gray-700 bg-gray-800/50 hover:border-gray-500"
              }`}
            >
              <span className="text-xl">{m.emoji}</span>
              <span className="text-xs text-gray-400 mt-0.5">{m.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Energy Selector */}
      <div>
        <label className="text-xs text-gray-400 mb-2 block flex items-center gap-1">
          <Zap size={12} className="text-yellow-400" /> Energy Level
        </label>
        <div className="flex gap-2 items-end">
          {energyOptions.map((e) => (
            <motion.button
              key={e.value}
              type="button"
              onClick={() => setEnergy(e.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div
                className={`w-full rounded-t-sm transition-all duration-200 ${e.color} ${
                  energy === e.value ? "opacity-100 shadow-lg" : "opacity-40"
                }`}
                style={{ height: `${e.value * 8 + 8}px` }}
              />
              <span className="text-xs text-gray-400">{e.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Workout Done Toggle */}
      <div className="flex items-center justify-between bg-gray-800/50 rounded-xl px-4 py-3 border border-gray-700">
        <span className="text-gray-300 text-sm">Workout completed today?</span>
        <motion.button
          type="button"
          onClick={() => setWorkoutDone(!workoutDone)}
          whileTap={{ scale: 0.9 }}
          className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${
            workoutDone ? "bg-green-500" : "bg-gray-600"
          }`}
        >
          <motion.div
            className="w-5 h-5 bg-white rounded-full absolute top-0.5"
            animate={{ left: workoutDone ? "26px" : "2px" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </motion.button>
      </div>

      {/* Extra Measurements Toggle */}
      <motion.button
        type="button"
        onClick={() => setShowExtra(!showExtra)}
        className="w-full flex items-center justify-between text-sm text-gray-400 hover:text-green-400 transition-colors py-1"
        whileHover={{ x: 2 }}
      >
        <span>Body Measurements (optional)</span>
        {showExtra ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </motion.button>

      <AnimatePresence>
        {showExtra && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label htmlFor="waist" className="text-xs text-gray-400 mb-1 block">Waist (cm)</label>
                <input
                  id="waist"
                  name="waist"
                  type="number"
                  placeholder="e.g. 82"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="chest" className="text-xs text-gray-400 mb-1 block">Chest (cm)</label>
                <input
                  id="chest"
                  name="chest"
                  type="number"
                  placeholder="e.g. 96"
                  value={chest}
                  onChange={(e) => setChest(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="arms" className="text-xs text-gray-400 mb-1 block">Arms (cm)</label>
                <input
                  id="arms"
                  name="arms"
                  type="number"
                  placeholder="e.g. 35"
                  value={arms}
                  onChange={(e) => setArms(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label htmlFor="notes" className="text-xs text-gray-400 mb-1 block">Notes</label>
              <textarea
                id="notes"
                name="notes"
                placeholder="How did you feel? Any notes for today..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className={`${inputCls} resize-none`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        whileHover={{
          scale: 1.02,
          boxShadow: "0px 0px 20px rgba(74, 222, 128, 0.4)",
        }}
        whileTap={{ scale: 0.97 }}
        className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-black font-bold py-3 rounded-xl text-base transition-all duration-200 shadow-lg shadow-green-500/20"
      >
        Log Entry
      </motion.button>
    </motion.form>
  );
}
