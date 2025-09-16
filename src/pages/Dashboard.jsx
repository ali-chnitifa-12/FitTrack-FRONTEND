import { useContext, useState, useEffect } from "react";
import api from "../Utils/axios.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Components
import ProgressForm from "../Components/ProgressForm.jsx";
import ProgressChart from "../Components/ProgressChart.jsx";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
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




export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const dailyChallenges = [
    "Do 20 push-ups!",
    "Take a 15-min walk.",
    "Try a new healthy snack.",
    "Drink 2L of water today.",
    "Do a 5-min plank.",
  ];

  const quotes = [
    "The only bad workout is the one that didn't happen.",
    "Push yourself, because no one else is going to do it for you.",
    "Don't limit your challenges, challenge your limits.",
    "Success starts with self-discipline.",
    "You don't get the body you want by wishing for it, but by working for it.",
  ];

  const [challenge, setChallenge] = useState(dailyChallenges[0]);
  const [quote, setQuote] = useState(quotes[0]);

  // Set random challenge and quote on mount
  useEffect(() => {
    setChallenge(dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)]);
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  // Fetch progress from backend
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (!user.token) {
      setError("No authentication token found. Please login again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    api.get("/dashboard", { 
      headers: { 
        Authorization: `Bearer ${user.token}` 
      } 
    })
      .then((res) => {
        setProgressData(res.data.progress || []);
        setShowChart(res.data.progress?.length > 0);
        setError("");
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          logout();
          navigate("/login");
        } else {
          setError("Failed to load dashboard data. Please try again.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, logout, navigate]);

  // Add new progress entry
  const addEntry = (entry) => {
    if (!user || !user.token) {
      setError("Please login to add progress entries");
      return;
    }

    setError("");

    api
      .post("/progress", entry, { 
        headers: { 
          Authorization: `Bearer ${user.token}` 
        } 
      })
      .then((res) => {
        setProgressData(res.data.progress || []);
        setShowChart(true);
        setError("");

        const latest = res.data.progress[res.data.progress.length - 1];
        if (latest.weight && latest.targetWeight && latest.caloriesIn && latest.caloriesOut) {
          const weightDiff = latest.targetWeight - latest.weight;
          const dailyCalorieDeficit = latest.caloriesOut - latest.caloriesIn;
          if (dailyCalorieDeficit === 0) {
            setEstimatedTime("Cannot estimate time with zero calorie deficit");
          } else {
            const caloriesPerKg = 7700;
            const daysNeeded = Math.abs((weightDiff * caloriesPerKg) / dailyCalorieDeficit);
            const weeks = Math.ceil(daysNeeded / 7);
            setEstimatedTime(`${weeks} week(s) approx to reach your target weight`);
          }
        }
      })
      .catch((err) => {
        console.error("Add entry error:", err);
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          logout();
          navigate("/login");
        } else {
          setError("Failed to add progress entry. Please try again.");
        }
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-green-500 text-xl"
        >
          <div className="flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mr-3"
            />
            Loading dashboard...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 p-6 flex items-center justify-center">
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
          className="relative z-10 space-y-8"
        >
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-600/80 text-white p-4 rounded-xl text-center backdrop-blur-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <motion.header
            variants={itemVariants}
            className="flex justify-center md:justify-between items-center"
          >
            <h1 className="text-5xl font-extrabold text-green-400 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400">
              Dashboard
            </h1>
            {user && (
              <motion.div 
                className="hidden md:flex items-center space-x-3 bg-gray-800/50 p-3 rounded-xl"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-green-400 font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-400">Welcome back!</p>
                </div>
              </motion.div>
            )}
          </motion.header>

          {/* Welcome & Daily Challenge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              variants={itemVariants}
              className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-green-500/20 relative overflow-hidden"
            >
              <h2 className="text-2xl font-bold text-green-400 mb-3">Welcome</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {user
                  ? `Hello, ${user.name}! Ready to crush your goals today?`
                  : "Welcome! Log in to track your fitness journey."}
              </p>
              <motion.div
                className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-500 rounded-full mix-blend-soft-light filter blur-xl opacity-10"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-green-500/30 relative overflow-hidden"
            >
              <h2 className="text-2xl font-bold text-green-400 mb-3">Daily Challenge</h2>
              <p className="text-gray-300 text-lg mb-4">{challenge}</p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(74, 222, 128, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const index = Math.floor(Math.random() * dailyChallenges.length);
                  setChallenge(dailyChallenges[index]);
                }}
                className="px-5 py-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-black rounded-lg font-semibold transition duration-200"
              >
                New Challenge
              </motion.button>
            </motion.div>
          </div>

          {/* Progress Form + Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProgressForm addEntry={addEntry} />
            <AnimatePresence>
              {showChart && progressData.length > 0 && (
                <motion.div
                  key="progress-chart"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gray-800/50 p-6 rounded-2xl border border-green-500/20"
                >
                  {estimatedTime && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-green-400 font-semibold mb-4 p-3 bg-gray-700/50 rounded-xl text-center"
                    >
                      {estimatedTime}
                    </motion.p>
                  )}
                  <ProgressChart data={progressData} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Motivational Quote */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-green-500/30 text-center relative overflow-hidden"
          >
            <h2 className="text-2xl font-bold text-green-400 mb-3">Daily Motivation</h2>
            <motion.blockquote 
              className="text-gray-300 text-lg italic mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              "{quote}"
            </motion.blockquote>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(74, 222, 128, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const index = Math.floor(Math.random() * quotes.length);
                setQuote(quotes[index]);
              }}
              className="px-5 py-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-black rounded-lg font-semibold transition duration-200"
            >
              New Quote
            </motion.button>
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