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
  { value: 1, label: "Very Low", color: "#ef4444" },
  { value: 2, label: "Low",      color: "#f97316" },
  { value: 3, label: "Medium",   color: "#eab308" },
  { value: 4, label: "High",     color: "var(--accent-secondary)" },
  { value: 5, label: "Max",      color: "var(--accent-primary)" },
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

    setCaloriesIn(""); setCaloriesOut(""); setWeight(""); setTargetWeight("");
    setMood(null); setEnergy(null); setWaist(""); setChest(""); setArms("");
    setWorkoutDone(false); setNotes("");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Calories Consumed", val: caloriesIn, set: setCaloriesIn, ph: "e.g. 2200", step: "1" },
          { label: "Calories Burned",   val: caloriesOut, set: setCaloriesOut, ph: "e.g. 400", step: "1" },
          { label: "Current Weight (kg)", val: weight, set: setWeight, ph: "e.g. 82.5", step: "0.1" },
          { label: "Target Weight (kg)",  val: targetWeight, set: setTargetWeight, ph: "e.g. 75.0", step: "0.1" },
        ].map(i => (
          <div key={i.label}>
            <label className="text-xs mb-1 block font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{i.label}</label>
            <input
              type="number"
              step={i.step}
              placeholder={i.ph}
              value={i.val}
              onChange={(e) => i.set(e.target.value)}
              className="input-field"
              required
            />
          </div>
        ))}
      </div>

      {/* Mood Selector */}
      <div>
        <label className="text-xs mb-2 flex items-center gap-1 font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          <Heart size={12} className="text-pink-400" /> Today's Mood
        </label>
        <div className="flex gap-2">
          {moodOptions.map((m) => {
            const isSel = mood === m.value;
            return (
              <motion.button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="flex-1 flex flex-col items-center py-2 rounded-xl transition-all duration-200"
                style={{
                  background: isSel ? "var(--accent-glow)" : "var(--bg-elevated)",
                  border: isSel ? "1px solid var(--accent-primary)" : "1px solid var(--border-subtle)"
                }}
              >
                <span className="text-xl">{m.emoji}</span>
                <span className="text-xs mt-0.5" style={{ color: isSel ? "var(--accent-primary)" : "var(--text-muted)" }}>{m.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Energy Selector */}
      <div>
        <label className="text-xs mb-2 flex items-center gap-1 font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          <Zap size={12} style={{ color: "var(--accent-primary)" }} /> Energy Level
        </label>
        <div className="flex gap-2 items-end h-20">
          {energyOptions.map((e) => (
            <motion.button
              key={e.value}
              type="button"
              onClick={() => setEnergy(e.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className="flex-1 flex flex-col justify-end items-center gap-1 h-full"
            >
              <div
                className="w-full rounded-t-sm transition-all duration-200"
                style={{
                  background: e.color,
                  height: `${e.value * 12 + 10}px`, /* Increased height */
                  opacity: energy === e.value ? 1 : 0.3,
                  boxShadow: energy === e.value ? `0 0 10px ${e.color}` : "none"
                }}
              />
              <span className="text-[10px] leading-tight text-center font-semibold uppercase tracking-wider" style={{ color: energy === e.value ? "var(--text-primary)" : "var(--text-muted)" }}>{e.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Workout Done Toggle */}
      <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
        <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>Workout completed today?</span>
        <motion.button
          type="button"
          onClick={() => setWorkoutDone(!workoutDone)}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-6 rounded-full transition-colors duration-300 relative"
          style={{ background: workoutDone ? "var(--accent-primary)" : "var(--text-muted)" }}
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
        className="w-full flex items-center justify-between text-sm py-1 font-semibold uppercase tracking-widest transition-colors"
        style={{ color: showExtra ? "var(--accent-primary)" : "var(--text-muted)" }}
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
              {[
                { label: "Waist (cm)", val: waist, set: setWaist },
                { label: "Chest (cm)", val: chest, set: setChest },
                { label: "Arms (cm)",  val: arms, set: setArms },
              ].map(i => (
                <div key={i.label}>
                  <label className="text-xs mb-1 block font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{i.label}</label>
                  <input
                    type="number"
                    placeholder="e.g. 82"
                    value={i.val}
                    onChange={(e) => i.set(e.target.value)}
                    className="input-field"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="text-xs mb-1 block font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Notes</label>
              <textarea
                placeholder="How did you feel? Any notes for today..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="input-field resize-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="btn-accent w-full justify-center"
      >
        Log Entry
      </motion.button>
    </motion.form>
  );
}
