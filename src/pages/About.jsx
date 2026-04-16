import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Users, Target, Headphones, Activity, Apple, Dumbbell, Trophy } from "lucide-react";

export default function About() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current,
        { rotationY: -15, scale: 0.95, opacity: 0, y: 30 },
        { rotationY: 0, scale: 1, opacity: 1, y: 0, duration: 1.2, ease: "back.out(1.7)" }
      );
    });
    return () => ctx.revert();
  }, []);

  const stats = [
    { icon: Users, number: "10K+", label: "Active Users" },
    { icon: Target, number: "95%", label: "Success Rate" },
    { icon: Headphones, number: "24/7", label: "AI Support" }
  ];

  const features = [
    { icon: Activity, title: "Progress Tracking", desc: "Monitor your journey with detailed analytics" },
    { icon: Apple, title: "Nutrition Planning", desc: "Personalized meal plans for your goals" },
    { icon: Dumbbell, title: "Workout Guides", desc: "Customized exercise routines" },
    { icon: Trophy, title: "Goal Setting", desc: "Set and achieve your fitness targets" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="orb orb-orange w-96 h-96 -top-32 -left-32" />
      <div className="orb orb-yellow w-[500px] h-[500px] top-1/3 -right-64" />

      <div ref={containerRef} className="max-w-4xl mx-auto relative z-10 w-full" style={{ perspective: "1200px" }}>
        <div className="glass-card card-3d p-8 md:p-12 relative overflow-hidden">
          <div className="text-center mb-10">
            <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] text-accent tracking-widest leading-none mb-4">
              ABOUT FITTRACK
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Your personal fitness and nutrition companion. Built for those who demand more from their training.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 rounded-xl text-center flex flex-col items-center justify-center"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
                >
                  <Icon size={32} className="mb-3" style={{ color: "var(--accent-primary)" }} />
                  <div className="text-4xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>{stat.number}</div>
                  <div className="text-sm uppercase tracking-widest font-semibold" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
                </motion.div>
              );
            })}
          </div>

          <div className="space-y-6 mb-12 text-center max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            <p className="text-lg">
              Our mission is to help people stay consistent with their health goals by 
              providing simple tools for tracking calories, weight, and progress charts. 
            </p>
            <p className="text-lg">
              Whether you want to lose fat, gain muscle, or simply maintain a healthy 
              lifestyle, FitTrack gives you everything you need in one place.
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--text-primary)" }}>
            What We Offer
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                  whileHover={{ scale: 1.03 }}
                  className="p-6 rounded-xl flex flex-col items-center text-center"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "var(--accent-glow)", color: "var(--accent-primary)" }}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>{feature.title}</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center p-6 rounded-xl" style={{ background: "var(--accent-glow-y)", border: "1px solid var(--accent-secondary)" }}>
            <motion.p
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-xl font-bold uppercase tracking-widest"
              style={{ color: "var(--accent-secondary)" }}
            >
              Stay motivated. Stay healthy. Stay strong.
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}