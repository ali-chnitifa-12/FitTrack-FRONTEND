import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function About() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.2 } }
  };

  const timelineData = [
    { year: "2023", title: "The Idea", desc: "Recognized the need for an all-in-one platform that combines rigorous tracking with high-end UI design." },
    { year: "Early 2024", title: "Building the Foundation", desc: "Developed the core modules: custom Workouts matrices, Macro calculations, and real-time Chart generation." },
    { year: "Late 2024", title: "Injecting Intelligence", desc: "Integrated Gemini AI to provide an intelligent, context-aware Coach capable of analyzing user datasets." },
    { year: "2025", title: "The Launch 🚀", desc: "FitTrack goes live, offering users a holistic, ultra-premium solution to master their physical potential." },
  ];

  return (
    <div className="min-h-screen bg-black pt-20 pb-24 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-900/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center mb-24">
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-6">
            We build tools for <br className="hidden md:block"/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500">
              Peak Performance.
            </span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            FitTrack was engineered from the ground up to eliminate the friction between you and your fitness goals. Data-driven, beautifully designed, and brutally effective.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Our Story Timeline */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}
            className="lg:col-span-7"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-white mb-10 flex items-center gap-3">
              <span className="w-8 h-1 bg-green-500 rounded-full" /> The Evolution
            </motion.h2>

            <div className="relative border-l-2 border-gray-800 ml-4 space-y-12 pb-8">
              {timelineData.map((item, i) => (
                <motion.div key={i} variants={fadeInUp} className="relative pl-8">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[11px] top-1.5 w-5 h-5 bg-black border-4 border-green-500 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                  <div className="text-green-400 font-mono text-sm font-bold tracking-widest mb-1">{item.year}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed max-w-md">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Dev Card & Quick Stats */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="lg:col-span-5 space-y-8"
          >
            {/* System Architecture Card */}
            <motion.div variants={fadeInUp} className="bg-gradient-to-b from-gray-900 to-black p-[1px] rounded-3xl overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="bg-gray-900/90 h-full rounded-[23px] p-8 relative z-10 backdrop-blur-xl border border-gray-800 group-hover:border-green-500/30 transition-colors">
                <h3 className="text-xs uppercase tracking-widest text-green-400 font-bold mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Platform Architecture
                </h3>
                
                <h4 className="text-2xl font-bold text-white mb-4">Under the Hood</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  FitTrack is engineered using modern web technologies. We prioritized a blisteringly fast user experience, hyper-responsive layouts, and robust security protocols.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-black/50 p-3 rounded-xl border border-gray-800">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-lg">⚛️</div>
                    <div className="flex-1">
                      <div className="font-bold text-white text-sm">React ecosystem</div>
                      <div className="text-xs text-gray-500">Component-driven architecture</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 bg-black/50 p-3 rounded-xl border border-gray-800">
                    <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center text-lg">✨</div>
                    <div className="flex-1">
                      <div className="font-bold text-white text-sm">Framer Motion & GSAP</div>
                      <div className="text-xs text-gray-500">Hardware-accelerated animations</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-black/50 p-3 rounded-xl border border-gray-800">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 flex items-center justify-center text-lg">🧠</div>
                    <div className="flex-1">
                      <div className="font-bold text-white text-sm">Google Gemini AI</div>
                      <div className="text-xs text-gray-500">Advanced algorithmic coaching</div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* Quick Stats Bento Box */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div variants={fadeInUp} className="bg-gray-900 border border-gray-800 p-6 rounded-3xl">
                <div className="text-3xl font-bold text-white mb-1">10K+</div>
                <div className="text-gray-500 text-sm font-medium">Active Users</div>
              </motion.div>
              <motion.div variants={fadeInUp} className="bg-gray-900 border border-gray-800 p-6 rounded-3xl">
                <div className="text-3xl font-bold text-green-400 mb-1">95%</div>
                <div className="text-gray-500 text-sm font-medium">Success Rate</div>
              </motion.div>
              <motion.div variants={fadeInUp} className="col-span-2 bg-gradient-to-r from-teal-500/10 to-transparent border border-teal-500/20 p-6 rounded-3xl flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white mb-1">24/7</div>
                  <div className="text-teal-400 text-sm font-medium">Server Uptime</div>
                </div>
                <div className="text-teal-500 drop-shadow-[0_0_10px_rgba(20,184,166,0.8)]">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                </div>
              </motion.div>
            </div>

          </motion.div>
        </div>

      </div>
    </div>
  );
}