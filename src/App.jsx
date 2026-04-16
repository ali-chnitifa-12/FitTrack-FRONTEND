import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Workouts from "./pages/Workouts.jsx";
import Nutrition from "./pages/Nutrition.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import About from "./pages/About.jsx";
import ContactForm from "./pages/ContactForm.jsx";
import AICoach from "./pages/AICoach.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import {
  Zap, Dumbbell, Apple, BarChart3, Brain, Trophy,
  ArrowRight, ChevronDown, Star, Users, Clock
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ────────────────────────────────────────────────────────────────────────────
// Protected Route
// ────────────────────────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-4 border-transparent"
          style={{ borderTopColor: "var(--accent-primary)", borderRightColor: "var(--accent-secondary)" }}
        />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// ────────────────────────────────────────────────────────────────────────────
// Main Layout
// ────────────────────────────────────────────────────────────────────────────
function MainLayout({ children }) {
  const location = useLocation();
  const hideLayout = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="page-wrapper">
      {!hideLayout && <Navbar />}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={!hideLayout ? "pt-20" : ""}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      {!hideLayout && <Footer />}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Hero Section
// ────────────────────────────────────────────────────────────────────────────
function HeroSection() {
  const heroRef    = useRef(null);
  const titleRef   = useRef(null);
  const subRef     = useRef(null);
  const btnRef     = useRef(null);
  const orb1Ref    = useRef(null);
  const orb2Ref    = useRef(null);
  const orb3Ref    = useRef(null);
  const floatRef   = useRef(null);
  const badgeRef   = useRef(null);
  const mousePos   = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Badge pop
      gsap.fromTo(badgeRef.current,
        { scale: 0, rotation: -20, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.7, ease: "back.out(2.5)", delay: 0.2 }
      );

      // Title 3D entrance
      gsap.fromTo(titleRef.current,
        { y: 120, rotationX: -60, opacity: 0 },
        { y: 0, rotationX: 0, opacity: 1, duration: 1.4, ease: "expo.out", delay: 0.4 }
      );

      // Subtitle
      gsap.fromTo(subRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.9 }
      );

      // Button
      gsap.fromTo(btnRef.current,
        { scale: 0.5, rotation: 8, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.9, ease: "elastic.out(1, 0.55)", delay: 1.1 }
      );

      // Orb animations — crazy floating
      gsap.to(orb1Ref.current, {
        x: 60, y: -80, rotation: 180, scale: 1.3,
        duration: 7, yoyo: true, repeat: -1, ease: "sine.inOut"
      });
      gsap.to(orb2Ref.current, {
        x: -70, y: 90, rotation: -220, scale: 0.8,
        duration: 9, yoyo: true, repeat: -1, ease: "sine.inOut"
      });
      gsap.to(orb3Ref.current, {
        x: 40, y: 50, rotation: 360,
        duration: 12, yoyo: true, repeat: -1, ease: "none"
      });

      // Floating card-like element
      gsap.to(floatRef.current, {
        y: -18, rotation: 2,
        duration: 3, yoyo: true, repeat: -1, ease: "power1.inOut"
      });

      // Parallax on scroll
      gsap.to(heroRef.current, {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });
    });

    // Magnetic mouse effect on title
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (e.clientX - rect.left - cx) / cx;
      const dy = (e.clientY - rect.top  - cy) / cy;
      gsap.to(titleRef.current, {
        rotationY: dx * 6,
        rotationX: -dy * 4,
        duration: 0.5,
        ease: "power2.out",
      });
    };
    const resetTilt = () => {
      gsap.to(titleRef.current, { rotationY: 0, rotationX: 0, duration: 0.8, ease: "power2.out" });
    };

    const el = heroRef.current;
    el?.addEventListener("mousemove", handleMouseMove);
    el?.addEventListener("mouseleave", resetTilt);
    return () => {
      ctx.revert();
      el?.removeEventListener("mousemove", handleMouseMove);
      el?.removeEventListener("mouseleave", resetTilt);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center px-6"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Orbs */}
      <div ref={orb1Ref} className="orb orb-orange w-[520px] h-[520px] -top-32 -left-32" />
      <div ref={orb2Ref} className="orb orb-yellow w-[400px] h-[400px] -bottom-24 -right-24" />
      <div ref={orb3Ref} className="orb orb-purple w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Mesh grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(var(--accent-primary) 1px, transparent 1px), linear-gradient(90deg, var(--accent-primary) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl w-full" style={{ perspective: "800px", transformStyle: "preserve-3d" }}>

        {/* Badge */}
        <div ref={badgeRef} className="flex justify-center mb-6">
          <span className="tag flex items-center gap-2 text-xs">
            <Zap size={12} fill="white" /> 
            NEW  ·  AI-Powered Fitness Coach
          </span>
        </div>

        {/* Main Title */}
        <div
          ref={titleRef}
          className="card-3d mb-6"
          style={{ transformStyle: "preserve-3d" }}
        >
          <h1 className="font-display tracking-wider leading-none">
            <span
              className="block text-[clamp(4rem,12vw,10rem)] shimmer"
              style={{ lineHeight: 0.95 }}
            >
              TRACK.
            </span>
            <span
              className="block text-[clamp(4rem,12vw,10rem)]"
              style={{
                lineHeight: 0.95,
                color: "var(--text-primary)",
                WebkitTextStroke: "2px var(--accent-primary)",
                WebkitTextFillColor: "transparent",
              }}
            >
              TRAIN.
            </span>
            <span
              className="block text-[clamp(4rem,12vw,10rem)] shimmer"
              style={{ lineHeight: 1.0 }}
            >
              TRANSFORM.
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p
          ref={subRef}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          The all-in-one fitness platform that tracks your workouts, nutrition, and progress —
          powered by an AI coach that knows your data.
        </p>

        {/* CTA buttons */}
        <div ref={btnRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/dashboard" className="btn-accent text-base px-8 py-4 gap-2">
            Start Your Journey <ArrowRight size={20} />
          </Link>
          <Link to="/about" className="btn-outline text-base px-8 py-4">
            Learn More
          </Link>
        </div>

        {/* Social proof row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-14"
          style={{ color: "var(--text-muted)" }}
        >
          {[
            { icon: Users, val: "10K+", label: "Users" },
            { icon: Star,  val: "4.9★", label: "Rating" },
            { icon: Clock, val: "24/7", label: "Support" },
          ].map(({ icon: Icon, val, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <Icon size={15} style={{ color: "var(--accent-primary)" }} />
              <strong style={{ color: "var(--text-primary)" }}>{val}</strong>
              <span>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: "var(--text-muted)" }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={18} />
      </motion.div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Feature Cards Section
// ────────────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: BarChart3, title: "Smart Dashboard",
    desc: "Real-time analytics on your weight, calories, and fitness trends — all in one glance.",
    link: "/dashboard", color: "#ff6b35"
  },
  {
    icon: Dumbbell, title: "Workout Tracker",
    desc: "Log every rep, set, and session. Build custom routines and crush your PRs.",
    link: "/workouts", color: "#ffd23f"
  },
  {
    icon: Apple, title: "Nutrition Logging",
    desc: "Track macros, calories, and meal plans. Fuel your body the right way.",
    link: "/nutrition", color: "#ff6b35"
  },
  {
    icon: Brain, title: "AI Coach",
    desc: "Your personal Gemini-powered coach giving data-driven advice 24/7.",
    link: "/coach", color: "#a855f7"
  },
  {
    icon: Trophy, title: "Progress Goals",
    desc: "Set ambitious targets and watch the analytics prove you're winning.",
    link: "/dashboard", color: "#ffd23f"
  },
  {
    icon: Zap, title: "Instant Insights",
    desc: "AI analyzes your data and surfaces actionable insights before you even ask.",
    link: "/coach", color: "#ff6b35"
  },
];

function FeaturesSection() {
  const sectionRef = useRef(null);
  const cardsRef   = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        gsap.utils.toArray(".ft-card"),
        { y: 80, opacity: 0, rotationX: -20, scale: 0.92 },
        {
          y: 0, opacity: 1, rotationX: 0, scale: 1,
          duration: 0.9, stagger: 0.12, ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          }
        }
      );
    });

    // 3D mouse-tilt on each card
    cardsRef.current.forEach((card) => {
      if (!card) return;
      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        gsap.to(card, {
          rotationY: dx * 12,
          rotationX: -dy * 8,
          scale: 1.04,
          duration: 0.3,
          ease: "power2.out",
        });
      };
      const onLeave = () => {
        gsap.to(card, { rotationY: 0, rotationX: 0, scale: 1, duration: 0.5, ease: "power2.out" });
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-6 py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <span className="tag mb-4 inline-block">Everything You Need</span>
        <h2
          className="font-display text-[clamp(3rem,7vw,6rem)] mb-4"
          style={{ color: "var(--text-primary)", lineHeight: 1 }}
        >
          BUILT FOR <span className="text-accent">CHAMPIONS</span>
        </h2>
        <div className="section-divider" />
        <p className="mt-5 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
          Every feature designed around one goal: making you unstoppable.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <Link
              key={f.title}
              to={f.link}
              ref={el => cardsRef.current[i] = el}
              className="ft-card glass-card card-3d block p-7 group cursor-pointer"
              style={{ transformStyle: "preserve-3d", textDecoration: "none" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: `linear-gradient(135deg, ${f.color}22, ${f.color}44)`,
                  border: `1px solid ${f.color}44`,
                }}
              >
                <Icon size={22} style={{ color: f.color }} />
              </div>
              <h3
                className="font-bold text-lg mb-2 group-hover:text-[var(--accent-primary)] transition-colors"
                style={{ color: "var(--text-primary)" }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                {f.desc}
              </p>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider group-hover:gap-3 transition-all"
                style={{ color: "var(--accent-primary)" }}
              >
                Explore <ArrowRight size={13} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Stats Section
// ────────────────────────────────────────────────────────────────────────────
function StatsSection() {
  const sectionRef = useRef(null);
  const [counted, setCounted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        onEnter: () => setCounted(true),
      });

      gsap.fromTo(".stat-pill",
        { y: 60, opacity: 0, scale: 0.8 },
        {
          y: 0, opacity: 1, scale: 1,
          stagger: 0.15, duration: 0.8, ease: "elastic.out(1, 0.6)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          }
        }
      );

      // Float stagger
      gsap.to(".stat-pill", {
        y: -10, duration: 2.5, yoyo: true, repeat: -1, ease: "power1.inOut", stagger: 0.3
      });
    });
    return () => ctx.revert();
  }, []);

  const STATS = [
    { val: "95%",  label: "Success Rate",   sub: "Users hitting goals" },
    { val: "10K+", label: "Active Members", sub: "Worldwide community" },
    { val: "4.9★", label: "App Rating",     sub: "5-star reviews" },
    { val: "24/7", label: "AI Support",     sub: "Always coaching you" },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
      style={{ background: "var(--bg-surface)" }}
    >
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 50% 50%, var(--accent-glow) 0%, transparent 60%)" }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-[clamp(2.5rem,6vw,5rem)] text-center mb-14"
          style={{ color: "var(--text-primary)" }}
        >
          NUMBERS THAT <span className="text-accent">SPEAK</span>
        </motion.h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="stat-pill glass-card card-3d p-7 text-center"
            >
              <div className="stat-number text-5xl mb-2">{s.val}</div>
              <div className="font-bold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{s.label}</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// CTA Banner
// ────────────────────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto glass-card p-16 text-center relative overflow-hidden"
      >
        <div className="orb orb-orange w-64 h-64 -top-20 -right-20 opacity-20" />
        <div className="orb orb-yellow w-48 h-48 -bottom-16 -left-16 opacity-15" />
        <div className="relative z-10">
          <span className="tag mb-6 inline-block">Ready to Transform?</span>
          <h2
            className="font-display text-[clamp(3rem,7vw,5.5rem)] mb-4"
            style={{ color: "var(--text-primary)", lineHeight: 1 }}
          >
            START <span className="text-accent">TODAY</span>
          </h2>
          <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
            Join thousands already training smarter. Your strongest self is waiting.
          </p>
          <Link to="/dashboard" className="btn-accent text-base px-10 py-4 inline-flex items-center gap-2">
            Go to Dashboard <ArrowRight size={20} />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Home Page
// ────────────────────────────────────────────────────────────────────────────
function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTABanner />
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// App Root
// ────────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/"         element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/workouts"  element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
            <Route path="/nutrition" element={<ProtectedRoute><Nutrition /></ProtectedRoute>} />
            <Route path="/about"     element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/contact"   element={<ProtectedRoute><ContactForm /></ProtectedRoute>} />
            <Route path="/coach"     element={<ProtectedRoute><AICoach /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
