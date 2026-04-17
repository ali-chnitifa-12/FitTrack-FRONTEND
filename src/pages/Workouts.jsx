import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";

// ── Rest Timer Component ─────────────────────────────────────────────────────
function RestTimer() {
  const [timerDuration, setTimerDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (active && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setActive(false);
            setDone(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [active]);

  const start = (dur) => {
    clearInterval(intervalRef.current);
    setTimerDuration(dur);
    setTimeLeft(dur);
    setActive(true);
    setDone(false);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    setActive(false);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setActive(false);
    setTimeLeft(timerDuration);
    setDone(false);
  };

  const r = 45;
  const circ = 2 * Math.PI * r;
  const strokeDash = (timeLeft / timerDuration) * circ;
  const strokeColor =
    timeLeft > timerDuration * 0.5
      ? "#4ade80"
      : timeLeft > timerDuration * 0.25
      ? "#eab308"
      : "#ef4444";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 p-5 rounded-2xl border border-green-500/20 flex flex-col items-center gap-3"
    >
      <h3 className="text-green-400 font-bold text-lg flex items-center gap-2">
        ⏱️ Rest Timer
      </h3>

      {/* SVG Ring */}
      <div className="relative">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#1f2937" strokeWidth="8" />
          <motion.circle
            cx="60" cy="60" r={r} fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circ}
            strokeDashoffset={circ - strokeDash}
            strokeLinecap="round"
            style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px" }}
            animate={{ stroke: strokeColor }}
            transition={{ duration: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{timeLeft}</span>
          <span className="text-xs text-gray-400">sec</span>
        </div>
      </div>

      <AnimatePresence>
        {done && (
          <motion.p
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-green-400 font-bold text-sm text-center"
          >
            🎉 Rest done! Start your next set.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Duration Presets */}
      <div className="flex gap-2">
        {[30, 60, 90].map((d) => (
          <motion.button
            key={d}
            onClick={() => start(d)}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.93 }}
            className={`px-3 py-1 rounded-lg text-sm font-semibold border transition-colors ${
              timerDuration === d && active
                ? "bg-green-500 text-black border-green-500"
                : "bg-gray-700 text-gray-200 border-gray-600 hover:border-green-500"
            }`}
          >
            {d}s
          </motion.button>
        ))}
      </div>

      <div className="flex gap-3">
        {active ? (
          <motion.button
            onClick={stop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded-xl text-sm font-semibold"
          >
            ⏸ Pause
          </motion.button>
        ) : (
          <motion.button
            onClick={() => start(timerDuration)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-green-500/20 border border-green-500 text-green-400 rounded-xl text-sm font-semibold"
          >
            ▶ Start
          </motion.button>
        )}
        <motion.button
          onClick={reset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-xl text-sm"
        >
          ↺ Reset
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function Workouts() {
  const { user } = useContext(AuthContext);
  const [bodyType, setBodyType] = useState("mesomorph");
  const [checked, setChecked] = useState({});
  const [showSchedule, setShowSchedule] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const exercises = {
    ectomorph: {
      "Upper Body": ["Pull-ups (4x8)", "Incline Bench Press (4x10)", "Dumbbell Rows (4x12)", "Shoulder Press (3x12)"],
      "Lower Body": ["Squats (4x10)", "Leg Press (3x12)", "Lunges (3x12 each leg)", "Calf Raises (3x20)"],
      Core: ["Plank (3x60s)", "Russian Twists (3x20)", "Leg Raises (3x15)"],
      Cardio: ["Light Jog (15-20min)", "Cycling (20min)", "Jump Rope (10min)"],
    },
    mesomorph: {
      "Upper Body": ["Bench Press (4x10)", "Pull-ups (4x8)", "Shoulder Press (4x12)", "Bicep Curls (3x15)"],
      "Lower Body": ["Deadlifts (4x8)", "Squats (4x10)", "Lunges (3x12 each leg)", "Leg Curls (3x12)"],
      Core: ["Plank (3x90s)", "Sit-ups (3x20)", "Bicycle Crunches (3x20)"],
      Cardio: ["HIIT (15min)", "Treadmill (20min moderate)", "Rowing (15min)"],
    },
    endomorph: {
      "Upper Body": ["Push-ups (4x15)", "Incline Dumbbell Press (3x12)", "Lat Pulldowns (3x12)", "Tricep Dips (3x15)"],
      "Lower Body": ["Squats (4x12)", "Step-ups (3x12 each leg)", "Lunges (3x12)", "Leg Press (3x12)"],
      Core: ["Plank (3x45s)", "Mountain Climbers (3x30s)", "Leg Raises (3x12)"],
      Cardio: ["Brisk Walking (30min)", "Cycling (20-30min)", "Elliptical (20min)"],
    },
  };

  const bodyTypeInfo = {
    ectomorph: { desc: "Naturally thin with fast metabolism. Focus on strength training with adequate caloric surplus.", image: "🏃‍♂️" },
    mesomorph: { desc: "Naturally athletic & muscular. Responds well to both strength and hypertrophy training.", image: "💪" },
    endomorph: { desc: "Naturally higher body fat. Combination of cardio & strength with strict nutrition is key.", image: "🔥" },
  };

  const difficultyInfo = {
    ectomorph: { label: "Hard", color: "text-red-400", bg: "bg-red-500/10 border-red-500/40", desc: "High caloric surplus & heavy compound lifts required" },
    mesomorph: { label: "Moderate", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/40", desc: "Responds well to varied splits — easiest body type to progress" },
    endomorph: { label: "Challenging", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/40", desc: "High cardio volume & strict diet discipline needed" },
  };

  const weeklySchedule = {
    ectomorph: {
      Mon: { group: "Upper Body", emoji: "💪", color: "bg-blue-500/20 border-blue-500/40 text-blue-300" },
      Tue: { group: "Lower Body", emoji: "🦵", color: "bg-purple-500/20 border-purple-500/40 text-purple-300" },
      Wed: { group: "Rest & Recovery", emoji: "😴", color: "bg-gray-700/50 border-gray-600 text-gray-400" },
      Thu: { group: "Upper Body", emoji: "💪", color: "bg-blue-500/20 border-blue-500/40 text-blue-300" },
      Fri: { group: "Core + Cardio", emoji: "🔥", color: "bg-green-500/20 border-green-500/40 text-green-300" },
      Sat: { group: "Lower Body", emoji: "🦵", color: "bg-purple-500/20 border-purple-500/40 text-purple-300" },
      Sun: { group: "Rest", emoji: "😴", color: "bg-gray-700/50 border-gray-600 text-gray-400" },
    },
    mesomorph: {
      Mon: { group: "Chest + Back", emoji: "💪", color: "bg-blue-500/20 border-blue-500/40 text-blue-300" },
      Tue: { group: "Legs", emoji: "🦵", color: "bg-purple-500/20 border-purple-500/40 text-purple-300" },
      Wed: { group: "Core + HIIT", emoji: "⚡", color: "bg-yellow-500/20 border-yellow-500/40 text-yellow-300" },
      Thu: { group: "Shoulders + Arms", emoji: "🏋️", color: "bg-blue-500/20 border-blue-500/40 text-blue-300" },
      Fri: { group: "Full Body", emoji: "💥", color: "bg-green-500/20 border-green-500/40 text-green-300" },
      Sat: { group: "Cardio", emoji: "🏃", color: "bg-teal-500/20 border-teal-500/40 text-teal-300" },
      Sun: { group: "Rest", emoji: "😴", color: "bg-gray-700/50 border-gray-600 text-gray-400" },
    },
    endomorph: {
      Mon: { group: "Cardio + Core", emoji: "🔥", color: "bg-orange-500/20 border-orange-500/40 text-orange-300" },
      Tue: { group: "Upper Body", emoji: "💪", color: "bg-blue-500/20 border-blue-500/40 text-blue-300" },
      Wed: { group: "Cardio", emoji: "🏃", color: "bg-teal-500/20 border-teal-500/40 text-teal-300" },
      Thu: { group: "Lower Body", emoji: "🦵", color: "bg-purple-500/20 border-purple-500/40 text-purple-300" },
      Fri: { group: "Full Body HIIT", emoji: "⚡", color: "bg-yellow-500/20 border-yellow-500/40 text-yellow-300" },
      Sat: { group: "Cardio", emoji: "🏃", color: "bg-teal-500/20 border-teal-500/40 text-teal-300" },
      Sun: { group: "Active Rest", emoji: "🧘", color: "bg-gray-700/50 border-gray-600 text-gray-400" },
    },
  };

  const comparisonData = [
    { attr: "Build", ecto: "Lean & Thin", meso: "Athletic", endo: "Stocky & Broad" },
    { attr: "Metabolism", ecto: "Very Fast ⚡", meso: "Moderate 🔄", endo: "Slow 🐢" },
    { attr: "Gains Muscle", ecto: "Moderate", meso: "Easy ✅", endo: "Easy ✅" },
    { attr: "Gains Fat", ecto: "Hard", meso: "Moderate", endo: "Easy ⚠️" },
    { attr: "Best For", ecto: "Endurance", meso: "Any Style", endo: "Strength" },
    { attr: "Avoid", ecto: "Excess Cardio", meso: "Overtraining", endo: "High-Carb Diet" },
  ];

  const muscleGroupEmojis = { "Upper Body": "💪", "Lower Body": "🦵", Core: "🎯", Cardio: "🏃" };
  const bodyTypes = ["ectomorph", "mesomorph", "endomorph"];

  const toggleExercise = (key) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const getGroupProgress = (type, part) => {
    const exList = exercises[type][part];
    const done = exList.filter((_, i) => checked[`${type}-${part}-${i}`]).length;
    return { done, total: exList.length };
  };

  const getTotalProgress = (type) => {
    const total = Object.values(exercises[type]).flat().length;
    const done = Object.keys(exercises[type]).reduce((acc, part) => {
      return acc + exercises[type][part].filter((_, i) => checked[`${type}-${part}-${i}`]).length;
    }, 0);
    return { done, total };
  };

  const { done: totalDone, total: totalExercises } = getTotalProgress(bodyType);
  const totalPct = totalExercises > 0 ? Math.round((totalDone / totalExercises) * 100) : 0;

  return (
    <div className="w-full flex-1 flex items-center justify-center p-4 md:p-6 text-gray-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900/80 backdrop-blur-md p-4 md:p-8 rounded-3xl shadow-2xl border border-green-500/20 max-w-6xl w-full relative overflow-hidden"
      >
        {/* Floating particles */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full"
            style={{ top: `${10 + i * 12}%`, left: `${5 + i * 15}%` }}
            animate={{ y: [0, -15, 0], opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10">

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400 mb-2"
          >
            Workouts & Training Plans
          </motion.h1>
          <motion.p variants={itemVariants} className="text-gray-400 text-center mb-6 text-lg">
            {user ? `Hey ${user.name}, let's crush today's workout! 🔥` : "Select your body type and start training!"}
          </motion.p>

          {/* Body Type Selector */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-4">
            {bodyTypes.map((type) => (
              <motion.button
                key={type}
                onClick={() => setBodyType(type)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 md:px-7 py-3 rounded-xl font-semibold text-sm md:text-base flex items-center gap-2 transition-all duration-200 ${
                  bodyType === type
                    ? "bg-green-500 text-black shadow-lg shadow-green-500/30"
                    : "bg-gray-800 text-gray-200 hover:bg-green-600/20 border border-gray-700 hover:border-green-500/50"
                }`}
              >
                <span>{bodyTypeInfo[type].image}</span>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </motion.button>
            ))}
          </motion.div>

          {/* Difficulty Badge */}
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={bodyType}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className={`px-4 py-2 rounded-xl border text-sm flex flex-wrap items-center gap-2 ${difficultyInfo[bodyType].bg}`}
              >
                <span className={`font-bold ${difficultyInfo[bodyType].color}`}>
                  ⚡ Difficulty: {difficultyInfo[bodyType].label}
                </span>
                <span className="text-gray-400">— {difficultyInfo[bodyType].desc}</span>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Overall Progress Bar */}
          <motion.div variants={itemVariants} className="mb-6 bg-gray-800/50 p-4 rounded-2xl border border-green-500/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400 font-semibold">Today's Progress</span>
              <span className="text-green-400 font-bold text-sm">{totalDone}/{totalExercises} exercises</span>
            </div>
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-teal-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${totalPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{totalPct === 100 ? "🎉 Workout complete!" : "Keep going!"}</span>
              <span>{totalPct}%</span>
            </div>
          </motion.div>

          {/* Toggle Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-6">
            <motion.button
              onClick={() => setShowSchedule(!showSchedule)}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                showSchedule ? "bg-green-500/20 border-green-500 text-green-400" : "bg-gray-800 border-gray-600 text-gray-300 hover:border-green-500/50"
              }`}
            >
              📅 {showSchedule ? "Hide" : "Show"} Weekly Schedule
            </motion.button>
            <motion.button
              onClick={() => setShowComparison(!showComparison)}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                showComparison ? "bg-teal-500/20 border-teal-500 text-teal-400" : "bg-gray-800 border-gray-600 text-gray-300 hover:border-teal-500/50"
              }`}
            >
              📊 {showComparison ? "Hide" : "Compare"} Body Types
            </motion.button>
          </motion.div>

          {/* Weekly Schedule */}
          <AnimatePresence>
            {showSchedule && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="bg-gray-800/30 p-4 rounded-2xl border border-green-500/20">
                  <h3 className="text-green-400 font-bold text-lg mb-4">📅 Weekly Training Schedule</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {Object.entries(weeklySchedule[bodyType]).map(([day, info]) => (
                      <div key={day} className={`p-3 rounded-xl border text-center ${info.color}`}>
                        <div className="font-bold text-xs mb-1">{day}</div>
                        <div className="text-2xl mb-1">{info.emoji}</div>
                        <div className="text-xs leading-tight">{info.group}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Body Type Comparison */}
          <AnimatePresence>
            {showComparison && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="bg-gray-800/30 p-4 rounded-2xl border border-teal-500/20 overflow-x-auto">
                  <h3 className="text-teal-400 font-bold text-lg mb-4">📊 Body Type Comparison</h3>
                  <table className="w-full text-sm text-left min-w-[400px]">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-700">
                        <th className="py-2 pr-4">Attribute</th>
                        <th className="py-2 pr-4">🏃‍♂️ Ectomorph</th>
                        <th className="py-2 pr-4">💪 Mesomorph</th>
                        <th className="py-2">🔥 Endomorph</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.map((row, i) => (
                        <motion.tr
                          key={i}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="border-b border-gray-700/50 hover:bg-gray-700/20"
                        >
                          <td className="py-2 pr-4 text-gray-400 font-medium">{row.attr}</td>
                          <td className={`py-2 pr-4 ${bodyType === "ectomorph" ? "text-green-400 font-bold" : "text-gray-300"}`}>{row.ecto}</td>
                          <td className={`py-2 pr-4 ${bodyType === "mesomorph" ? "text-green-400 font-bold" : "text-gray-300"}`}>{row.meso}</td>
                          <td className={`py-2 ${bodyType === "endomorph" ? "text-green-400 font-bold" : "text-gray-300"}`}>{row.endo}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Layout: Exercises + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Exercise Cards */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={bodyType}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {Object.keys(exercises[bodyType]).map((part) => {
                    const { done, total } = getGroupProgress(bodyType, part);
                    const pct = Math.round((done / total) * 100);
                    return (
                      <motion.div
                        key={part}
                        layout
                        className="bg-gray-800/50 p-4 rounded-2xl border border-green-500/20 hover:border-green-500/40 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-base font-bold text-green-400 flex items-center gap-2">
                            {muscleGroupEmojis[part]} {part}
                          </h2>
                          <span className="text-xs text-gray-400 font-medium">{done}/{total}</span>
                        </div>
                        {/* Mini progress */}
                        <div className="h-1.5 bg-gray-700 rounded-full mb-3 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-green-500 to-teal-400 rounded-full"
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <ul className="space-y-2">
                          {exercises[bodyType][part].map((ex, i) => {
                            const key = `${bodyType}-${part}-${i}`;
                            const isChecked = !!checked[key];
                            return (
                              <motion.li
                                key={i}
                                onClick={() => toggleExercise(key)}
                                whileHover={{ x: 3 }}
                                whileTap={{ scale: 0.97 }}
                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all select-none ${
                                  isChecked
                                    ? "bg-green-500/10 border border-green-500/30"
                                    : "hover:bg-gray-700/50"
                                }`}
                              >
                                <motion.div
                                  animate={{ scale: isChecked ? [1, 1.4, 1] : 1 }}
                                  transition={{ duration: 0.25 }}
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                    isChecked ? "bg-green-500 border-green-500" : "border-gray-500"
                                  }`}
                                >
                                  {isChecked && <span className="text-black text-xs font-bold">✓</span>}
                                </motion.div>
                                <span className={`text-sm transition-all ${isChecked ? "line-through text-gray-500" : "text-gray-200"}`}>
                                  {ex}
                                </span>
                              </motion.li>
                            );
                          })}
                        </ul>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              <RestTimer />

              {/* Body Type Info */}
              <motion.div
                variants={itemVariants}
                className="bg-gray-800/50 p-4 rounded-2xl border border-green-500/20"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={bodyType}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2 text-base">
                      {bodyTypeInfo[bodyType].image}{" "}
                      {bodyType.charAt(0).toUpperCase() + bodyType.slice(1)}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{bodyTypeInfo[bodyType].desc}</p>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Workout Tips */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-green-500/10 to-teal-500/10 p-4 rounded-2xl border border-green-500/20"
              >
                <h3 className="text-green-400 font-bold mb-3">💡 Workout Tips</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  {[
                    "Warm up 5–10 min before any session",
                    "Maintain proper form to avoid injuries",
                    "Rest 48h before training same muscle",
                    "Hydrate throughout your workout",
                    "Progressive overload is the key to growth",
                  ].map((tip, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-2"
                    >
                      <span className="text-green-400 mt-0.5 flex-shrink-0">•</span>
                      {tip}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Motivational Quote */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-8 p-6 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-2xl border border-green-500/30"
          >
            <motion.p
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-xl font-bold text-green-400"
            >
              💪 Stay consistent. See results. Transform your body.
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}