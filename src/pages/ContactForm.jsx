import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import api from "../Utils/axios";
import { Send, PartyPopper, Mail, User, MessageSquare } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current,
        { rotationY: 20, scale: 0.95, opacity: 0, y: 30 },
        { rotationY: 0, scale: 1, opacity: 1, y: 0, duration: 1.2, ease: "back.out(1.7)" }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await api.post("/contact", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
      <div className="orb orb-orange w-96 h-96 -top-32 -left-32" />
      <div className="orb orb-yellow w-[500px] h-[500px] top-1/3 -right-64" />

      <div ref={containerRef} className="max-w-md w-full relative z-10" style={{ perspective: "1200px" }}>
        <div className="glass-card card-3d p-8 md:p-10 relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center space-y-6"
              >
                <div className="flex justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: "var(--accent-glow-y)", color: "var(--accent-secondary)" }}
                  >
                    <PartyPopper size={40} />
                  </motion.div>
                </div>
                
                <h2 className="text-3xl font-display uppercase tracking-widest text-accent mb-2">Message Sent!</h2>
                
                <p className="mb-6 font-semibold" style={{ color: "var(--text-secondary)" }}>
                  Thank you for reaching out! We'll get back to you within 24 hours.
                </p>
                
                <button onClick={() => setSubmitted(false)} className="btn-accent w-full justify-center">
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center mb-8">
                  <h1 className="font-display text-4xl text-accent tracking-widest mb-2">GET IN TOUCH</h1>
                  <p className="font-semibold" style={{ color: "var(--text-muted)" }}>Have questions? We'd love to hear from you!</p>
                </div>

                {error && (
                  <div className="bg-red-600/10 text-red-500 border border-red-500/30 p-3 rounded-xl mb-6 text-center font-bold text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest flex items-center gap-2 mb-2" style={{ color: "var(--text-muted)" }}>
                      <User size={14} /> Your Name
                    </label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="John Doe" required />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest flex items-center gap-2 mb-2" style={{ color: "var(--text-muted)" }}>
                      <Mail size={14} /> Your Email
                    </label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="john@example.com" required />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest flex items-center gap-2 mb-2" style={{ color: "var(--text-muted)" }}>
                      <MessageSquare size={14} /> Your Message
                    </label>
                    <textarea name="message" value={formData.message} onChange={handleChange} rows="5" className="input-field resize-none" placeholder="How can we help?" required />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="btn-accent w-full justify-center mt-2 group relative overflow-hidden" style={{ opacity: isSubmitting ? 0.7 : 1 }}>
                    {isSubmitting ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <Send size={18} className="group-hover:translate-x-1 transition-transform" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}