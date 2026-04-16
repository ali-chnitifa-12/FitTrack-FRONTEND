import { useContext, useState, useEffect, useRef } from "react";
import api from "../Utils/axios.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { Zap, Target, Quote } from "lucide-react";

// Components
import ProgressForm from "../Components/ProgressForm.jsx";
import ProgressChart from "../Components/ProgressChart.jsx";

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

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Container entrance
      gsap.fromTo(containerRef.current,
        { rotationY: -15, scale: 0.95, opacity: 0, y: 30 },
        { rotationY: 0, scale: 1, opacity: 1, y: 0, duration: 1.2, ease: "back.out(1.7)" }
      );

      // Stagger child cards
      const cards = cardsRef.current.filter(el => el);
      if (cards.length > 0) {
        gsap.fromTo(cards,
          { y: 40, opacity: 0, rotationX: -10 },
          {
            y: 0, opacity: 1, rotationX: 0,
            duration: 0.8, stagger: 0.15, delay: 0.3,
            ease: "power2.out"
          }
        );

        // 3D Mouse follow on cards
        cards.forEach((card) => {
          const onMove = (e) => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);
            gsap.to(card, {
              rotationY: dx * 8,
              rotationX: -dy * 8,
              transformPerspective: 1000,
              duration: 0.4,
              ease: "power2.out",
            });
          };
          const onLeave = () => {
            gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.6, ease: "power2.out" });
          };
          card.addEventListener("mousemove", onMove);
          card.addEventListener("mouseleave", onLeave);
        });
      }
    });

    return () => ctx.revert();
  }, [loading]);

  const [challenge, setChallenge] = useState(dailyChallenges[0]);
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    setChallenge(dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)]);
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

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

    api.get("/dashboard", { headers: { Authorization: `Bearer ${user.token}` } })
      .then((res) => {
        setProgressData(res.data.progress || []);
        setShowChart(res.data.progress?.length > 0);
      })
      .catch((err) => {
        console.error("Dashboard error:", err);
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        } else {
          setError("Failed to load dashboard data.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, logout, navigate]);

  const addEntry = (entry) => {
    if (!user || !user.token) return;
    setError("");
    api.post("/progress", entry, { headers: { Authorization: `Bearer ${user.token}` } })
      .then((res) => {
        setProgressData(res.data.progress || []);
        setShowChart(true);
        const latest = res.data.progress[res.data.progress.length - 1];
        if (latest.weight && latest.targetWeight && latest.caloriesIn && latest.caloriesOut) {
          const weightDiff = latest.targetWeight - latest.weight;
          const deficit = latest.caloriesOut - latest.caloriesIn;
          if (deficit <= 0) {
             setEstimatedTime("Need a calorie deficit to estimate weight loss time.");
          } else {
             const days = Math.abs((weightDiff * 7700) / deficit);
             setEstimatedTime(`${Math.ceil(days / 7)} week(s) approx to reach target.`);
          }
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        } else {
          setError("Failed to add entry.");
        }
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-4 border-transparent"
          style={{ borderTopColor: "var(--accent-primary)", borderRightColor: "var(--accent-secondary)" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden py-12 px-4 sm:px-6">
      {/* Background Orbs */}
      <div className="orb orb-orange w-96 h-96 -top-32 -left-32" />
      <div className="orb orb-yellow w-[500px] h-[500px] top-1/3 -right-64" />

      <div ref={containerRef} className="max-w-6xl mx-auto relative z-10 w-full" style={{ perspective: "1200px" }}>
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <h1 className="font-display text-5xl tracking-widest text-accent mb-4 md:mb-0">DASHBOARD</h1>
          {user && (
            <div className="flex items-center gap-4 glass-card px-5 py-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                   style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))", color: "white" }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-sm">
                <p className="font-bold" style={{ color: "var(--accent-primary)" }}>{user.name}</p>
                <p style={{ color: "var(--text-muted)" }}>Welcome back</p>
              </div>
            </div>
          )}
        </header>

        {error && (
          <div className="mb-6 p-4 rounded-xl text-center font-medium" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Welcome & Motivational */}
          <div className="lg:col-span-1 space-y-6">
            <div ref={el => cardsRef.current[0] = el} className="glass-card card-3d p-7 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-primary)] opacity-10 rounded-bl-full mix-blend-screen" />
              <div className="flex items-center gap-3 mb-4">
                <Zap className="text-[var(--accent-primary)]" />
                <h2 className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>Daily Challenge</h2>
              </div>
              <p className="text-lg font-medium mb-6" style={{ color: "var(--text-secondary)" }}>{challenge}</p>
              <button onClick={() => setChallenge(dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)])}
                      className="btn-outline w-full justify-center text-sm py-2">
                New Challenge
              </button>
            </div>

            <div ref={el => cardsRef.current[1] = el} className="glass-card card-3d p-7">
              <div className="flex items-center gap-3 mb-4">
                <Quote className="text-[var(--accent-secondary)]" />
                <h2 className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>Motivation</h2>
              </div>
              <blockquote className="italic mb-6 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                "{quote}"
              </blockquote>
              <button onClick={() => setQuote(quotes[Math.floor(Math.random() * quotes.length)])}
                      className="btn-outline w-full justify-center text-sm py-2">
                New Quote
              </button>
            </div>
          </div>

          {/* Form & Chart */}
          <div className="lg:col-span-2 space-y-6">
            <div ref={el => cardsRef.current[2] = el} className="card-3d">
              {/* ProgressForm will handle its own glass card internally, but we can wrap it if needed. */}
              <div className="glass-card p-6">
                 <h2 className="font-display text-2xl tracking-widest text-accent mb-4">LOG PROGRESS</h2>
                 <ProgressForm addEntry={addEntry} />
              </div>
            </div>

            <AnimatePresence>
              {showChart && progressData.length > 0 && (
                <motion.div ref={el => cardsRef.current[3] = el}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass-card card-3d p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                     <h2 className="font-display text-2xl tracking-widest text-accent">YOUR TRENDS</h2>
                     {estimatedTime && (
                       <span className="tag !text-[10px] !bg-none border border-[var(--accent-secondary)] !text-[var(--accent-secondary)]">
                         {estimatedTime}
                       </span>
                     )}
                  </div>
                  <ProgressChart data={progressData} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}