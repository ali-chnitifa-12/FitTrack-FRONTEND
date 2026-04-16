import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, Instagram, Linkedin, Github, ArrowUpRight } from "lucide-react";

const LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/workouts",  label: "Workouts" },
  { to: "/nutrition", label: "Nutrition" },
  { to: "/about",     label: "About" },
  { to: "/contact",   label: "Contact" },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
      }}
      className="mt-24 pt-16 pb-8"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))" }}
              >
                <Zap size={18} className="text-white" fill="white" />
              </div>
              <span className="font-display text-2xl text-accent tracking-widest">FITTRACK</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Your personal fitness companion for tracking workouts, nutrition, and progress. Built for champions.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:text-center"
          >
            <h4 className="font-bold text-sm uppercase tracking-widest mb-5" style={{ color: "var(--text-muted)" }}>
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm font-medium hover-underline inline-flex items-center gap-1 transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {link.label}
                    <ArrowUpRight size={12} style={{ color: "var(--accent-primary)" }} />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:text-right"
          >
            <h4 className="font-bold text-sm uppercase tracking-widest mb-5" style={{ color: "var(--text-muted)" }}>
              Follow Us
            </h4>
            <div className="flex md:justify-end gap-3">
              {[
                { href: "https://www.linkedin.com/in/ali-chnitifa-7926b5290/", icon: Linkedin, label: "LinkedIn" },
                { href: "https://github.com/", icon: Github, label: "GitHub" },
              ].map(({ href, icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-secondary)",
                    transition: "border-color 0.3s, color 0.3s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "var(--accent-primary)";
                    e.currentTarget.style.color = "var(--accent-primary)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "var(--border-subtle)";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}
        >
          <p>© 2025 FitTrack. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed with
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.5 }}
              className="text-[var(--accent-primary)]"
            >
              ♥
            </motion.span>
            for fitness enthusiasts.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}