import PageHeading from "../Components/PageHeading.jsx";
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
import DataPrivacySettings from "../Components/DataPrivacySettings.jsx";
import OnboardingModal from "../Components/OnboardingModal.jsx";
import StreakAndWeeklySummary from "../Components/StreakAndWeeklySummary.jsx";

// --- Animation Variants ---
const _containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const _itemVariants = {
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

function DashboardLoader() {
  return (
    <div className="fit-page fit-container">
      <PageHeading title="Dashboard" />
      <div className="fit-panel flex min-h-52 items-center justify-center gap-4" role="status">
        <span className="size-9 shrink-0 animate-spin rounded-full border-4 border-green-300/25 border-t-green-300" aria-hidden="true" />
        <div>
          <p className="font-semibold">Loading your dashboard</p>
          <p className="text-sm text-[var(--fit-muted)]">Getting your latest progress…</p>
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
      </div>
      <h3 className="text-xl font-bold text-gray-300 mb-2">No progress logged yet</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-sm">
        Log your first entry to start tracking changes over time.
      </p>
    </div>
  );
}

// --- Onboarding Wizard Component ---
function OnboardingWizard({ setDismissed, onStartOnboarding }) {
  const steps = [
    { title: "Set nutrition goals", desc: "Estimate your daily calories, protein, carbs, and fats.", link: "/nutrition" },
    { title: "Choose a workout routine", desc: "Pick a goal and see which exercises to do each day.", link: "/workouts" },
    { title: "Log your first entry", desc: "Use the progress form below to record your weight." }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0, scale: 0.95 }}
      animate={{ opacity: 1, height: "auto", scale: 1 }}
      className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/30 p-6 rounded-2xl mb-8 relative overflow-hidden"
    >
      <div className="mb-2 flex justify-end">
        <button onClick={() => setDismissed(true)} className="text-gray-400 hover:text-white transition-colors text-sm font-semibold">Dismiss</button>
      </div>
      <h2 className="text-2xl font-bold text-green-400 mb-2"> Welcome to FitTrack!</h2>
      <p className="text-gray-300 mb-6 font-medium">Start with any of these actions.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step, i) => (
          <div key={i} className="bg-gray-900/60 p-4 rounded-xl border border-gray-700/50 hover:border-green-500/30 transition-all flex flex-col h-full">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-white text-sm">Step {i + 1}: {step.title}</h3>
            </div>
            <p className="text-xs text-gray-400 flex-1 leading-relaxed">{step.desc}</p>
            {step.link && (
              <Link to={step.link} className="mt-3 text-xs font-bold text-green-400 hover:text-green-300 flex items-center gap-1">
                Open {step.link.slice(1)}
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-800/80 flex flex-wrap gap-3 items-center justify-between">
        <button
          type="button"
          onClick={onStartOnboarding}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-400 to-teal-400 hover:opacity-90 text-black font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-green-500/20"
        >
          Set up my goals
        </button>
        <button 
          type="button"
          onClick={() => setDismissed(true)} 
          className="text-xs text-gray-400 hover:text-white"
        >
          I'll set this up later
        </button>
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
  const [loadError, setLoadError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [dismissOnboarding, setDismissOnboarding] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [searchParams] = useSearchParams();
  const _paymentSuccess = searchParams.get("payment_success") === "true";

  const containerRef = useRef(null);
  const welcomeRef = useRef(null);
  const challengeRef = useRef(null);
  const _quoteRef = useRef(null);
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

  const reloadDashboard = () => {
    setLoading(true);
    setLoadError("");
    setLoadAttempt((attempt) => attempt + 1);
  };

  useEffect(() => {
    if (!user?.token) return;
    const request = new AbortController();

    api.get("/dashboard", { signal: request.signal, timeout: 35000 })
      .then(({ data }) => {
        if (!Array.isArray(data?.progress)) throw new Error("Invalid dashboard response");
        if (!request.signal.aborted) setProgressData(data.progress);
      })
      .catch((error) => {
        if (request.signal.aborted) return;
        if (error.response?.status === 401) {
          toast.error("Your session expired. Please sign in again.");
          logout();
          navigate("/login", { replace: true });
          return;
        }
        setLoadError(navigator.onLine
          ? "We couldn’t load your progress. Please try again."
          : "You’re offline. Reconnect to the internet, then try again.");
      })
      .finally(() => {
        if (!request.signal.aborted) setLoading(false);
      });

    return () => request.abort();
  }, [user?.token, logout, navigate, loadAttempt]);

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
        toast.success("Progress saved successfully! ", { id: toastId });

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

  if (loading) return <DashboardLoader />;

  if (loadError) {
    return (
      <div className="fit-page fit-container">
        <PageHeading title="Dashboard" />
        <section className="fit-panel">
          <h2 className="fit-section-title">Dashboard couldn’t load</h2>
          <p className="mb-4 text-[var(--fit-muted)]" role="alert">{loadError}</p>
          <button type="button" className="fit-button fit-button-primary" onClick={reloadDashboard}>Try again</button>
        </section>
      </div>
    );
  }

  const showOnboarding = progressData.length === 0 && !dismissOnboarding;

  // Has the user completed a log today?
  const hasLoggedToday = progressData.length > 0 && 
    new Date(progressData[progressData.length - 1].date).toDateString() === new Date().toDateString();

  return (
    <div className="fit-page fit-container">
      <motion.div
        ref={containerRef}
        className="relative min-w-0"
      >
        <div className="relative z-10 space-y-5">

          <PageHeading title="Dashboard" description={user?.name ? `Welcome back, ${user.name}. What would you like to do today?` : "Log your progress and see how you’re doing."} />

          <nav aria-label="Quick actions" className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <a href="#log-progress" className="fit-button fit-button-primary">Log progress</a>
            <Link to="/nutrition" className="fit-button fit-button-secondary">Log a meal</Link>
            <Link to="/workouts" className="fit-button fit-button-secondary">Find a workout</Link>
          </nav>

          {/* Streaks, Weekly Progress & Daily Reminder */}
          <StreakAndWeeklySummary progressData={progressData} />

          {/* Optional Onboarding */}
          <AnimatePresence>
            {showOnboarding && (
              <OnboardingWizard 
                setDismissed={setDismissOnboarding} 
                onStartOnboarding={() => setShowOnboardingModal(true)} 
              />
            )}
          </AnimatePresence>

          {/* Welcome & Daily Challenge Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              ref={welcomeRef}
              className={`fit-panel relative overflow-hidden`}
            >
              {hasLoggedToday ? (
                <>
                  <h2 className="text-xl font-bold text-green-400 mb-2 flex items-center gap-2">
                    Progress logged today
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    Great job, {user?.name}! Your progress entry is saved for today.
                  </p>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-500 rounded-full mix-blend-soft-light filter blur-2xl opacity-20" />
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    Welcome Back
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {user ? `Keep the momentum going, ${user.name}! Don't forget to log your daily progress.` : "Log in to track your fitness journey."}
                  </p>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500 rounded-full mix-blend-soft-light filter blur-2xl opacity-20" />
                </>
              )}
            </motion.div>

            <motion.div
              ref={challengeRef}
              className="fit-panel flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    Daily Challenge
                </h2>
                <p className="text-gray-200 text-lg font-medium mb-4">{challenge}</p>
              </div>
              <button
                onClick={() => setChallenge(dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)])}
                className="fit-button fit-button-secondary self-start text-sm"
              >
                Try another challenge
              </button>
            </motion.div>
          </div>

          {/* Progress Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form */}
            <div id="log-progress" className="min-w-0 scroll-mt-24 lg:col-span-5">
              <ProgressForm addEntry={addEntry} />
            </div>

            {/* Chart */}
            <div className="min-w-0 lg:col-span-7 flex flex-col">
              <div className="fit-panel flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                   Progress over time
                </h3>
                {estimatedTime && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="mb-4 p-3 bg-green-500/10 border border-green-500/30 text-green-400 font-medium rounded-xl text-sm"
                  >
                     Estimated time to goal: {estimatedTime}
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

          {/* Data Privacy & GDPR Controls */}
          <DataPrivacySettings />

          {/* Motivational Quote Bottom Row */}
          <div className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700/50 text-center relative overflow-hidden backdrop-blur-sm group">
            <motion.blockquote 
              className="text-gray-300 text-lg italic font-light tracking-wide"
            >
              "{quote}"
            </motion.blockquote>
            <button
              onClick={() => setQuote(quotes[Math.floor(Math.random() * quotes.length)])}
              className="mt-3 min-h-11 text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg text-gray-300"
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

        {/* Interactive Onboarding Modal */}
        <OnboardingModal
          isOpen={showOnboardingModal}
          onClose={() => setShowOnboardingModal(false)}
          onComplete={reloadDashboard}
        />
      </motion.div>
    </div>
  );
}