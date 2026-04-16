import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { Zap, CheckCircle2, Dumbbell } from "lucide-react";

export default function Workouts() {
  const { user } = useContext(AuthContext);
  const [bodyType, setBodyType] = useState("mesomorph");
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current,
        { rotationY: -15, scale: 0.95, opacity: 0, y: 30 },
        { rotationY: 0, scale: 1, opacity: 1, y: 0, duration: 1.2, ease: "back.out(1.7)" }
      );
    });
    return () => ctx.revert();
  }, []);

  const exercises = {
    ectomorph: {
      "Upper Body": ["Pull-ups (4x8)", "Incline Bench Press (4x10)", "Dumbbell Rows (4x12)", "Shoulder Press (3x12)"],
      "Lower Body": ["Squats (4x10)", "Leg Press (3x12)", "Lunges (3x12 each leg)", "Calf Raises (3x20)"],
      "Core": ["Plank (3x60s)", "Russian Twists (3x20)", "Leg Raises (3x15)"],
      "Cardio": ["Light Jog (15-20min)", "Cycling (20min)", "Jump Rope (10min)"],
    },
    mesomorph: {
      "Upper Body": ["Bench Press (4x10)", "Pull-ups (4x8)", "Shoulder Press (4x12)", "Bicep Curls (3x15)"],
      "Lower Body": ["Deadlifts (4x8)", "Squats (4x10)", "Lunges (3x12 each leg)", "Leg Curls (3x12)"],
      "Core": ["Plank (3x90s)", "Sit-ups (3x20)", "Bicycle Crunches (3x20)"],
      "Cardio": ["HIIT (15min)", "Treadmill (20min moderate)", "Rowing (15min)"],
    },
    endomorph: {
      "Upper Body": ["Push-ups (4x15)", "Incline Dumbbell Press (3x12)", "Lat Pulldowns (3x12)", "Tricep Dips (3x15)"],
      "Lower Body": ["Squats (4x12)", "Step-ups (3x12 each leg)", "Lunges (3x12)", "Leg Press (3x12)"],
      "Core": ["Plank (3x45s)", "Mountain Climbers (3x30s)", "Leg Raises (3x12)"],
      "Cardio": ["Brisk Walking (30min)", "Cycling (20-30min)", "Elliptical (20min)"],
    },
  };

  const bodyTypes = ["ectomorph", "mesomorph", "endomorph"];
  const bodyTypeInfo = {
    ectomorph: { desc: "Naturally thin with fast metabolism. Focus on strength training with adequate recovery.", icon: "🏃‍♂️" },
    mesomorph: { desc: "Naturally muscular. Responds well to both strength and hypertrophy training.", icon: "💪" },
    endomorph: { desc: "Naturally higher body fat. Benefits from combination of cardio and strength training.", icon: "🔥" }
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-12 px-4 sm:px-6">
      <div className="orb orb-orange w-96 h-96 -top-32 -left-32" />
      <div className="orb orb-yellow w-[500px] h-[500px] top-1/3 -right-64" />

      <div ref={containerRef} className="max-w-5xl mx-auto relative z-10 w-full" style={{ perspective: "1200px" }}>
        
        <header className="mb-10 text-center">
          <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] text-accent tracking-widest leading-none mb-4">
            TRAINING PLANS
          </h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            {user ? `Hey ${user.name}, select your body type to see tailored workouts.` : "Select your body type to see tailored workouts."}
          </p>
        </header>

        {/* Body Type Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {bodyTypes.map((type) => {
            const isSel = bodyType === type;
            return (
              <motion.button
                key={type}
                onClick={() => setBodyType(type)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-4 rounded-xl flex items-center gap-3 transition-colors duration-300"
                style={{
                  background: isSel ? "var(--accent-glow)" : "var(--bg-elevated)",
                  border: isSel ? "1px solid var(--accent-primary)" : "1px solid var(--border-subtle)",
                  color: isSel ? "var(--accent-primary)" : "var(--text-primary)"
                }}
              >
                <span className="text-2xl">{bodyTypeInfo[type].icon}</span>
                <div className="text-left">
                  <div className="font-bold uppercase tracking-widest text-sm">{type}</div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Header for selected type */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full mb-4" style={{ background: "var(--accent-glow-y)", border: "1px solid var(--accent-secondary)" }}>
             <Zap size={18} style={{ color: "var(--accent-secondary)" }} />
             <span className="font-bold uppercase tracking-widest text-sm" style={{ color: "var(--accent-secondary)" }}>
               {bodyType} routine active
             </span>
          </div>
          <p className="max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            {bodyTypeInfo[bodyType].desc}
          </p>
        </div>

        {/* Workout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <AnimatePresence mode="popLayout">
            {Object.keys(exercises[bodyType]).map((part, idx) => (
              <motion.div
                key={part + bodyType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass-card card-3d p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 opacity-5 rounded-bl-full mix-blend-screen" style={{ background: "var(--accent-primary)" }} />
                <h2 className="text-xl font-bold mb-5 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  <Dumbbell size={20} style={{ color: "var(--accent-primary)" }} />
                  {part}
                </h2>
                <ul className="space-y-3">
                  {exercises[bodyType][part].map((exercise, i) => (
                    <li key={i} className="flex items-start gap-3" style={{ color: "var(--text-secondary)" }}>
                      <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" style={{ color: "var(--accent-secondary)" }} /> 
                      <span className="font-medium text-sm">{exercise}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Tips */}
        <div className="glass-card p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ background: "linear-gradient(45deg, var(--accent-primary), transparent)" }} />
          <h2 className="font-display text-3xl mb-4 text-accent tracking-widest">TRAINING TIPS</h2>
          <ul className="max-w-xl mx-auto text-sm space-y-2 text-left" style={{ color: "var(--text-secondary)" }}>
            <li className="flex gap-2"><span>⚡</span> Warm up 5-10 minutes before starting any exercise.</li>
            <li className="flex gap-2"><span>⚡</span> Maintain proper form to avoid injuries.</li>
            <li className="flex gap-2"><span>⚡</span> Rest 48 hours before training the same muscle group again.</li>
            <li className="flex gap-2"><span>⚡</span> Adjust weights and reps based on your progression.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}