import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";

export default function Workouts() {
  const { user } = useContext(AuthContext);
  const [bodyType, setBodyType] = useState("mesomorph");

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Exercises data (unchanged from your original)
  const exercises = {
    ectomorph: {
      "Upper Body": [
        "Pull-ups (4x8)",
        "Incline Bench Press (4x10)",
        "Dumbbell Rows (4x12)",
        "Shoulder Press (3x12)",
      ],
      "Lower Body": [
        "Squats (4x10)",
        "Leg Press (3x12)",
        "Lunges (3x12 each leg)",
        "Calf Raises (3x20)",
      ],
      Core: [
        "Plank (3x60s)",
        "Russian Twists (3x20)",
        "Leg Raises (3x15)",
      ],
      Cardio: [
        "Light Jog (15-20min)",
        "Cycling (20min)",
        "Jump Rope (10min)",
      ],
    },
    mesomorph: {
      "Upper Body": [
        "Bench Press (4x10)",
        "Pull-ups (4x8)",
        "Shoulder Press (4x12)",
        "Bicep Curls (3x15)",
      ],
      "Lower Body": [
        "Deadlifts (4x8)",
        "Squats (4x10)",
        "Lunges (3x12 each leg)",
        "Leg Curls (3x12)",
      ],
      Core: [
        "Plank (3x90s)",
        "Sit-ups (3x20)",
        "Bicycle Crunches (3x20)",
      ],
      Cardio: [
        "HIIT (15min)",
        "Treadmill (20min moderate)",
        "Rowing (15min)",
      ],
    },
    endomorph: {
      "Upper Body": [
        "Push-ups (4x15)",
        "Incline Dumbbell Press (3x12)",
        "Lat Pulldowns (3x12)",
        "Tricep Dips (3x15)",
      ],
      "Lower Body": [
        "Squats (4x12)",
        "Step-ups (3x12 each leg)",
        "Lunges (3x12)",
        "Leg Press (3x12)",
      ],
      Core: [
        "Plank (3x45s)",
        "Mountain Climbers (3x30s)",
        "Leg Raises (3x12)",
      ],
      Cardio: [
        "Brisk Walking (30min)",
        "Cycling (20-30min)",
        "Elliptical (20min)",
      ],
    },
  };

  const bodyTypes = ["ectomorph", "mesomorph", "endomorph"];

  // Body type descriptions
  const bodyTypeInfo = {
    ectomorph: {
      desc: "Naturally thin with fast metabolism. Focus on strength training with adequate recovery.",
      image: "🏃‍♂️"
    },
    mesomorph: {
      desc: "Naturally muscular. Responds well to both strength and hypertrophy training.",
      image: "💪"
    },
    endomorph: {
      desc: "Naturally higher body fat. Benefits from combination of cardio and strength training.",
      image: "🔥"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 text-gray-200 p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-green-500/20 max-w-6xl w-full relative overflow-hidden"
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 bg-green-500 rounded-full mix-blend-soft-light filter blur-xl opacity-20"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        <motion.div
          className="absolute -bottom-20 -right-20 w-60 h-60 bg-teal-500 rounded-full mix-blend-soft-light filter blur-xl opacity-15"
          animate={{
            rotate: -360,
            scale: [1.2, 1, 1.2]
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl font-bold text-green-400 mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400"
          >
            Workouts & Training Plans
          </motion.h1>

          {/* Greeting */}
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 mb-8 text-center"
          >
            {user
              ? `Hey ${user.name}, select your body type to see tailored workouts!`
              : "Select your body type to see tailored workouts!"}
          </motion.p>

          {/* Body Type Selector */}
          <motion.div
            variants={containerVariants}
            className="flex justify-center mb-10 space-x-4"
          >
            {bodyTypes.map((type) => (
              <motion.div
                key={type}
                className="relative group flex flex-col items-center"
                variants={itemVariants}
              >
                <motion.button
                  onClick={() => setBodyType(type)}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0px 0px 15px rgba(74, 222, 128, 0.5)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-xl font-semibold text-lg transition duration-200 flex items-center ${
                    bodyType === type
                      ? "bg-green-500 text-black"
                      : "bg-gray-800 text-gray-200 hover:bg-green-600 hover:text-black"
                  }`}
                >
                  <span className="mr-2 text-xl">{bodyTypeInfo[type].image}</span>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </motion.button>
                <div className="absolute bottom-full mb-2 w-48 bg-gray-900 text-white text-sm p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  {bodyTypeInfo[type].desc}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Body Type Header */}
          <motion.div
            variants={fadeIn}
            className="flex items-center justify-center mb-8"
          >
            <motion.span 
              className="text-4xl mr-3"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {bodyTypeInfo[bodyType].image}
            </motion.span>
            <h2 className="text-3xl font-bold text-green-400">
              {bodyType.charAt(0).toUpperCase() + bodyType.slice(1)} Workout Plan
            </h2>
          </motion.div>

          {/* Workout Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
          >
            {Object.keys(exercises[bodyType]).map((part) => (
              <motion.div
                key={part}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.2 }
                }}
                className="bg-gray-800/50 p-6 rounded-2xl border border-green-500/20"
              >
                <h2 className="text-2xl font-bold text-green-400 mb-4">{part}</h2>
                <ul className="space-y-2 text-gray-300">
                  {exercises[bodyType][part].map((exercise, idx) => (
                    <motion.li 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start"
                    >
                      <span className="text-green-400 mr-2">•</span> 
                      {exercise}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Tips Section */}
          <motion.div
            variants={fadeIn}
            className="p-6 rounded-2xl border border-green-500/30 bg-gradient-to-r from-green-500/10 to-teal-500/10"
          >
            <h2 className="text-2xl font-bold text-green-400 mb-4">Workout Tips</h2>
            <motion.ul 
              variants={containerVariants}
              className="space-y-2 text-gray-300"
            >
              <motion.li variants={itemVariants} className="flex items-start">
                <span className="text-green-400 mr-2">•</span> 
                Warm up 5-10 minutes before starting any exercise.
              </motion.li>
              <motion.li variants={itemVariants} className="flex items-start">
                <span className="text-green-400 mr-2">•</span> 
                Maintain proper form to avoid injuries.
              </motion.li>
              <motion.li variants={itemVariants} className="flex items-start">
                <span className="text-green-400 mr-2">•</span> 
                Rest 48 hours before training the same muscle group again.
              </motion.li>
              <motion.li variants={itemVariants} className="flex items-start">
                <span className="text-green-400 mr-2">•</span> 
                Hydrate and follow a nutrition plan that fits your goals.
              </motion.li>
              <motion.li variants={itemVariants} className="flex items-start">
                <span className="text-green-400 mr-2">•</span> 
                Adjust weights and reps based on your body type and goal.
              </motion.li>
            </motion.ul>
          </motion.div>

          {/* Motivational Quote */}
          <motion.div
            variants={fadeIn}
            className="text-center mt-8 p-6 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-2xl border border-green-500/30"
          >
            <motion.p
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-xl font-bold text-green-400"
            >
              💪 Stay consistent. See results. Transform your body.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Floating particles */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full"
            style={{
              top: `${10 + i * 12}%`,
              left: `${5 + i * 15}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}