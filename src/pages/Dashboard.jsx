import { useContext, useState, useEffect, useRef } from "react";
import api from "../Utils/axios.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

// Components
import ProgressForm from "../Components/ProgressForm.jsx";
import ProgressChart from "../Components/ProgressChart.jsx";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

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

// --- Skeleton Loader Component ---
function DashboardSkeleton() {
  return (
    <div className="w-full flex-1 relative p-6 flex items-center justify-center">
      <div className="bg-gray-900 p-4 md:p-8 rounded-3xl shadow-xl max-w-6xl w-full border border-gray-800">
        <div className="animate-pulse space-y-8">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-10 bg-gray-800 rounded-xl w-48 blur-sm"></div>
            <div className="hidden md:flex items-center space-x-3 bg-gray-800/50 p-3 rounded-xl blur-sm">
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded w-20"></div>
                <div className="h-2 bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          </div>

          {/* Welcome & Challenge Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-40 bg-gray-800 rounded-2xl blur-[2px]"></div>
            <div className="h-40 bg-gray-800 rounded-2xl blur-[2px]"></div>
          </div>

          {/* Form & Chart Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-800 rounded-2xl blur-[2px]"></div>
            <div className="h-96 bg-gray-800 rounded-2xl blur-[2px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Empty State Chart Component ---
function EmptyChartState() {
  return (
    <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-700/50 rounded-2xl bg-gray-800/30">
      <div className="relative w-24 h-24 mb-4">
        <svg className="absolute inset-0 w-full h-full text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        <motion.div 
          animate={{ y: [0, -10, 0] }} 
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-4xl">📈</span>
        </motion.div>
      </div>
      <h3 className="text-xl font-bold text-gray-300 mb-2">No Data Yet</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-sm">
        Start tracking your weight and calories to see your progress chart magically appear here.
      </p>
    </div>
  );
}

// --- Onboarding Wizard Component ---
function OnboardingWizard({ setDismissed }) {
  const steps = [
    { title: "Calculate Macros", desc: "Head over to the Nutrition page to find out exactly how much you should be eating.", link: "/nutrition", icon: "🥗" },
    { title: "Choose Your Routine", desc: "Set your body type in the Workouts page to get a customized weekly split.", link: "/workouts", icon: "🏋️" },
    { title: "Log Your Day 1", desc: "Add your very first weight entry below to officially start your journey.", icon: "⚖️" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0, scale: 0.95 }}
      animate={{ opacity: 1, height: "auto", scale: 1 }}
      className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/30 p-6 rounded-2xl mb-8 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4">
        <button onClick={() => setDismissed(true)} className="text-gray-400 hover:text-white transition-colors text-sm font-semibold">✕ Dismiss</button>
      </div>
      <h2 className="text-2xl font-bold text-green-400 mb-2">👋 Welcome to FitTrack!</h2>
      <p className="text-gray-300 mb-6 font-medium">To get the most out of your journey, here are your first 3 steps:</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step, i) => (
          <div key={i} className="bg-gray-900/60 p-4 rounded-xl border border-gray-700/50 hover:border-green-500/30 transition-all flex flex-col h-full">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl bg-gray-800 p-2 rounded-lg">{step.icon}</span>
              <h3 className="font-bold text-white text-sm">Step {i + 1}: {step.title}</h3>
            </div>
            <p className="text-xs text-gray-400 flex-1 leading-relaxed">{step.desc}</p>
            {step.link && (
              <Link to={step.link} className="mt-3 text-xs font-bold text-green-400 hover:text-green-300 flex items-center gap-1">
                Go there <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dismissOnboarding, setDismissOnboarding] = useState(false);
  const [searchParams] = useSearchParams();
  const paymentSuccess = searchParams.get("payment_success") === "true";

  const containerRef = useRef(null);
  const welcomeRef = useRef(null);
  const challengeRef = useRef(null);
  const quoteRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (loading) return; // Wait until loaded before animating
    const timer = setTimeout(() => {
      if (!containerRef.current) return;
      const ctx = gsap.context(() => {
        // Container entrance
        gsap.fromTo(containerRef.current, 
          { y: 40, scale: 0.96, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" }
        );

        // Welcome and challenge cards
        const cards = [welcomeRef.current, challengeRef.current].filter(el => el);
        if (cards.length > 0) {
          gsap.fromTo(cards, 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, delay: 0.2, ease: "power2.out" }
          );
        }

        // Floating particles
        particlesRef.current.forEach((particle, index) => {
          if (particle) {
            gsap.to(particle, {
              y: -25, opacity: 0.6, duration: 3 + index * 0.5,
              ease: "sine.inOut", yoyo: true, repeat: -1, delay: index * 0.3
            });
          }
        });
      });
      return () => ctx.revert();
    }, 50);
    return () => clearTimeout(timer);
  }, [loading]);

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
      toast.error("Authentication error. Please login.");
      setLoading(false);
      return;
    }
    api.get("/dashboard", { headers: { Authorization: `Bearer ${user.token}` } })
      .then((res) => {
        setProgressData(res.data.progress || []);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          toast.error("Session expired.");
          logout();
          navigate("/login");
        } else {
          toast.error("Failed to load dashboard data. Assuming empty state.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, logout, navigate]);

  // Add new progress entry
  const addEntry = (entry) => {
    if (!user || !user.token) {
      toast.error("Please login to add progress entries");
      return;
    }

    const toastId = toast.loading("Saving progress...");

    api.post("/progress", entry, { headers: { Authorization: `Bearer ${user.token}` } })
      .then((res) => {
        setProgressData(res.data.progress || []);
        toast.success("Progress saved successfully! 🚀", { id: toastId });

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
        if (err.response?.status === 401) {
          toast.error("Session expired.", { id: toastId });
          logout();
          navigate("/login");
        } else {
          toast.error("Failed to add progress entry.", { id: toastId });
        }
      });
  };

  if (loading) return <DashboardSkeleton />;

  const showOnboarding = progressData.length === 0 && !dismissOnboarding;

  return (
    <div className="w-full flex-1 relative p-4 md:p-6 flex items-center justify-center text-white">
      <motion.div
        ref={containerRef}
        className="bg-gray-900/90 backdrop-blur-md p-5 md:p-8 rounded-3xl shadow-2xl max-w-6xl w-full relative overflow-hidden border border-gray-800"
      >
        <div className="relative z-10 space-y-8">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400">
              Dashboard
            </h1>
            {user && (
              <motion.div 
                className="flex items-center space-x-3 bg-gray-800/80 p-3 rounded-2xl border border-gray-700/50"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 bg-gradient-to-tr from-green-500 to-teal-400 rounded-full flex items-center justify-center text-black font-extrabold shadow-lg shadow-green-500/20">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-gray-100 font-bold text-sm tracking-wide">{user.name}</p>
                  <p className="text-xs text-green-400 font-medium">Ready to work?</p>
                </div>
              </motion.div>
            )}
          </header>

          {/* Optional Onboarding */}
          <AnimatePresence>
            {showOnboarding && <OnboardingWizard setDismissed={setDismissOnboarding} />}
          </AnimatePresence>

          {/* Welcome & Daily Challenge Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              ref={welcomeRef}
              className="bg-gradient-to-br from-[#02162f] to-[#042852] p-6 rounded-2xl shadow-lg border border-blue-500/20 relative overflow-hidden"
            >
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-blue-400">👋</span> Welcome Back
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                {user ? `Keep the momentum going, ${user.name}! Your goals are closer than yesterday.` : "Log in to track your fitness journey."}
              </p>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500 rounded-full mix-blend-soft-light filter blur-2xl opacity-20" />
            </motion.div>

            <motion.div
              ref={challengeRef}
              className="bg-gradient-to-br from-[#022f44] to-[#014161] p-6 rounded-2xl shadow-lg border border-cyan-500/20 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-cyan-400">⚡</span> Daily Challenge
                </h2>
                <p className="text-gray-200 text-lg font-medium mb-4">{challenge}</p>
              </div>
              <button
                onClick={() => setChallenge(dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)])}
                className="self-start text-xs font-bold px-4 py-2 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 rounded-lg transition-colors border border-cyan-500/30"
              >
                Shuffle 🔀
              </button>
            </motion.div>
          </div>

          {/* Progress Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form */}
            <div className="lg:col-span-5">
              <ProgressForm addEntry={addEntry} />
            </div>
            
            {/* Chart */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="bg-gray-800/40 p-4 md:p-6 rounded-3xl border border-gray-700/50 flex-1 flex flex-col shadow-inner backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  📈 Progress Analytics
                </h3>
                {estimatedTime && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="mb-4 p-3 bg-green-500/10 border border-green-500/30 text-green-400 font-medium rounded-xl text-sm"
                  >
                    🎯 Goal Prediction: {estimatedTime}
                  </motion.div>
                )}
                
                <div className="flex-1 w-full relative">
                  {progressData.length > 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                      <ProgressChart data={progressData} />
                    </motion.div>
                  ) : (
                    <EmptyChartState />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Quote Bottom Row */}
          <div className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700/50 text-center relative overflow-hidden backdrop-blur-sm group">
            <motion.blockquote 
              className="text-gray-300 text-lg italic font-light tracking-wide"
            >
              "{quote}"
            </motion.blockquote>
            <button
              onClick={() => setQuote(quotes[Math.floor(Math.random() * quotes.length)])}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg text-gray-300"
            >
              New Quote
            </button>
          </div>

        </div>

        {/* Ambient background particles */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            ref={el => particlesRef.current[i-1] = el}
            className="absolute w-1.5 h-1.5 bg-green-400 rounded-full blur-[1px] opacity-20 pointer-events-none"
            style={{ top: `${15 + i * 12}%`, left: `${10 + i * 15}%` }}
          />
        ))}
      </motion.div>
    </div>
  );
}