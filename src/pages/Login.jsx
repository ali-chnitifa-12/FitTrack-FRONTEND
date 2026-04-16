import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";
import api from "../Utils/axios";
import { Zap, Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const cardRef  = useRef(null);
  const orb1Ref  = useRef(null);
  const orb2Ref  = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Card 3D entrance
      gsap.fromTo(cardRef.current,
        { rotationY: -25, rotationX: 8, scale: 0.85, opacity: 0, y: 40 },
        { rotationY: 0, rotationX: 0, scale: 1, opacity: 1, y: 0, duration: 1.2, ease: "back.out(1.7)" }
      );
      // Floating orbs
      gsap.to(orb1Ref.current, { x: 40, y: -30, rotation: 120, duration: 8, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(orb2Ref.current, { x: -35, y: 45, rotation: -90, duration: 10, yoyo: true, repeat: -1, ease: "sine.inOut" });
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login({ name: data.user.name, email: data.user.email, token: data.token });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Background orbs */}
      <div ref={orb1Ref} className="orb orb-orange w-80 h-80 top-10 -left-20" />
      <div ref={orb2Ref} className="orb orb-yellow w-96 h-96 -bottom-20 -right-20" />
      <div className="orb orb-purple w-64 h-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div
        ref={cardRef}
        className="glass-card card-3d w-full max-w-md p-10 relative z-10"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center pulse-glow"
            style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))" }}
            animate={{ rotateY: [0, 10, 0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Zap size={30} className="text-white" fill="white" />
          </motion.div>
        </div>

        <h1 className="font-display text-4xl text-center mb-1 text-accent tracking-widest">WELCOME BACK</h1>
        <p className="text-center text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          Sign in to your FitTrack account
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 px-4 py-3 rounded-xl text-sm font-medium"
            style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)" }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
              Email
            </label>
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                className="input-field pr-12"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="btn-accent w-full justify-center mt-2"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing in…" : "Sign In"}
            {!loading && <ArrowRight size={18} />}
          </motion.button>
        </form>

        <p className="text-center mt-6 text-sm" style={{ color: "var(--text-muted)" }}>
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold hover-underline" style={{ color: "var(--accent-primary)" }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
