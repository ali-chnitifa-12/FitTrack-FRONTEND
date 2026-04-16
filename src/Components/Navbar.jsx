import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { Menu, X, Sparkles, Sun, Moon, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/workouts",  label: "Workouts" },
  { to: "/nutrition", label: "Nutrition" },
  { to: "/coach",     label: "AI Coach", isAI: true },
  { to: "/about",     label: "About" },
  { to: "/contact",   label: "Contact" },
];

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const logoRef = useRef(null);

  /* ── Scroll listener ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── GSAP logo entrance ── */
  useEffect(() => {
    if (!logoRef.current) return;
    gsap.fromTo(
      logoRef.current,
      { rotationY: -180, scale: 0, opacity: 0 },
      { rotationY: 0, scale: 1, opacity: 1, duration: 1.1, ease: "back.out(1.7)", delay: 0.1 }
    );
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      ref={navRef}
      style={{
        background: scrolled
          ? "var(--nav-bg)"
          : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-subtle)" : "1px solid transparent",
        transition: "background 0.4s, backdrop-filter 0.4s, border-color 0.4s",
      }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-3 group">
          <div
            ref={logoRef}
            className="card-3d w-11 h-11 rounded-xl flex items-center justify-center pulse-glow"
            style={{
              background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
            }}
          >
            <Zap size={22} className="text-white" fill="white" />
          </div>
          <span
            className="font-display text-3xl tracking-widest text-accent"
            style={{ letterSpacing: "0.08em" }}
          >
            FITTRACK
          </span>
        </Link>

        {/* ── Desktop Links ── */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((item, i) => (
            <motion.div key={item.to} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 * i, duration: 0.5 }}>
              <Link
                to={item.to}
                className={`flex items-center gap-1.5 text-sm font-semibold hover-underline transition-colors duration-200 ${
                  isActive(item.to)
                    ? "nav-active"
                    : item.isAI
                    ? "text-[var(--accent-secondary)] hover:text-[var(--accent-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
                style={{ letterSpacing: "0.03em" }}
              >
                {item.isAI && <Sparkles size={13} style={{ color: "var(--accent-secondary)" }} />}
                {item.label}
              </Link>
            </motion.div>
          ))}

          {/* Theme toggle */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </motion.button>

          {/* Auth button */}
          {user ? (
            <motion.button
              onClick={logout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 rounded-full text-sm font-bold"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-normal)",
                color: "var(--accent-primary)",
              }}
            >
              Logout
            </motion.button>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login" className="btn-accent text-sm py-2 px-5">
                Login
              </Link>
            </motion.div>
          )}
        </div>

        {/* ── Mobile controls ── */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
            style={{ color: "var(--text-primary)" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isOpen ? "x" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="md:hidden mt-4 overflow-hidden rounded-2xl"
            style={{
              background: "var(--bg-card)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div className="p-5 space-y-2">
              {NAV_LINKS.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive(item.to) ? "nav-active" : ""
                    }`}
                    style={{
                      color: isActive(item.to) ? "var(--accent-primary)" : item.isAI ? "var(--accent-secondary)" : "var(--text-secondary)",
                      background: isActive(item.to) ? "var(--accent-glow)" : "transparent",
                    }}
                  >
                    {item.isAI && <Sparkles size={13} />}
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-2">
                {user ? (
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="w-full py-3 rounded-xl font-bold text-sm"
                    style={{ border: "1px solid var(--border-normal)", color: "var(--accent-primary)" }}
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="btn-accent w-full justify-center text-sm py-3"
                    style={{ display: "flex" }}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
