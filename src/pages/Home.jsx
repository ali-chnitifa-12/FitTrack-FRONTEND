import { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { AuthContext } from "../context/AuthContext.jsx";

// --- Custom Components ---

// Infinite Marquee
function Marquee({ children, direction = "left", speed = 20 }) {
  return (
    <div className="flex overflow-hidden w-full select-none gap-6 pb-4">
      <motion.div
        initial={{ x: direction === "left" ? "0%" : "-100%" }}
        animate={{ x: direction === "left" ? "-100%" : "0%" }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
        className="flex shrink-0 gap-6"
      >
        {children}
        {children}
      </motion.div>
      <motion.div
        initial={{ x: direction === "left" ? "0%" : "-100%" }}
        animate={{ x: direction === "left" ? "-100%" : "0%" }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
        className="flex shrink-0 gap-6"
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

// Testimonial Card
function TestimonialCard({ name, role, text, img }) {
  return (
    <div className="bg-gray-800/40 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 w-80 md:w-96 flex-shrink-0 shadow-xl">
      <div className="flex text-yellow-400 text-sm mb-3">★★★★★</div>
      <p className="text-gray-300 italic mb-5 leading-relaxed">"{text}"</p>
      <div className="flex items-center gap-3">
        <img src={img} alt={name} className="w-10 h-10 rounded-full object-cover border-2 border-green-500/30" />
        <div>
          <div className="font-bold text-gray-100 text-sm">{name}</div>
          <div className="text-xs text-gray-400">{role}</div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user } = useContext(AuthContext);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Framer Motion Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const staggerChildren = {
    visible: { transition: { staggerChildren: 0.15 } },
  };

  return (
    <div ref={containerRef} className="bg-black mix-blend-normal overflow-hidden min-h-screen">
      
      {/* ── HERO SECTION (Parallax) ── */}
      <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
        {/* Background Gradients */}
        <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
          <div className="absolute top-20 -left-10 w-[500px] h-[500px] bg-green-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 -right-10 w-[600px] h-[600px] bg-teal-600/20 rounded-full mix-blend-screen filter blur-[100px]" style={{ animationDuration: '4s' }} />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          style={{ y: yText, opacity }}
          className="relative z-10 text-center space-y-8 px-4"
        >
          <motion.div variants={fadeInUp} className="inline-block mb-2">
            <span className="bg-gray-800/80 border border-gray-700 backdrop-blur-sm text-green-400 text-xs md:text-sm font-bold tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg">
              ✨ The Future of Fitness Tracking
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white drop-shadow-2xl"
          >
            Forge Your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-400 to-cyan-500">
              Legacy.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="max-w-2xl mx-auto text-lg md:text-2xl text-gray-400 mb-8 leading-relaxed font-light"
          >
            Transform your body, master your nutrition, and crush your goals with our intelligent, all-in-one platform.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? "/dashboard" : "/register"}
              className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 font-bold px-10 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)] shadow-white/20 flex items-center justify-center gap-2"
            >
              {user ? "Go to Dashboard" : "Start For Free"} <span aria-hidden="true">&rarr;</span>
            </Link>
            {!user && (
              <Link
                to="/login"
                className="w-full sm:w-auto bg-gray-900/50 hover:bg-gray-800 backdrop-blur-md border border-gray-700 text-white font-bold px-10 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Sign In
              </Link>
            )}
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
        >
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-gray-500 to-transparent" />
        </motion.div>
      </section>

      {/* ── BENTO BOX FEATURES ── */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerChildren}
          className="mb-16 text-center md:text-left"
        >
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Everything you need. <br />
            <span className="text-gray-500">In one place.</span>
          </motion.h2>
        </motion.div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px]">
          
          {/* Big Card 1 - Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 relative overflow-hidden group shadow-2xl hover:border-green-500/30 transition-colors"
          >
            <div className="absolute top-0 right-0 p-8 w-full flex justify-end opacity-20 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 pointer-events-none">
               <svg width="200" height="200" viewBox="0 0 100 100" className="text-green-500 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]">
                 <path d="M10,80 L30,50 L50,60 L90,10" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                 <circle cx="90" cy="10" r="4" fill="currentColor" />
               </svg>
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end">
              <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mb-4 border border-green-500/30 text-green-400 text-2xl">📈</div>
              <h3 className="text-3xl font-bold text-white mb-2">Beautiful Analytics.</h3>
              <p className="text-gray-400 text-lg">Watch your body transform with precision charts, weight predictions, and dynamic timeline grids.</p>
            </div>
          </motion.div>

          {/* Small Card 1 - Nutrition */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2 bg-gray-900 border border-gray-800 rounded-3xl p-8 relative overflow-hidden group hover:border-teal-500/30 transition-colors"
          >
            <div className="absolute right-[-40px] top-[-40px] w-48 h-48 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-colors" />
            <div className="relative z-10">
              <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center mb-4 border border-teal-500/30 text-teal-400">🥗</div>
              <h3 className="text-2xl font-bold text-white mb-2">Macro Mastery.</h3>
              <p className="text-gray-400">Custom meal plans and dynamic calorie calculation. Hit your targets automatically.</p>
            </div>
          </motion.div>

          {/* Small Card 2 - Workouts */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-1 bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-cyan-500/30 transition-colors flex flex-col justify-between"
          >
            <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30 text-cyan-400">💪</div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Interactive Sets</h3>
              <p className="text-sm text-gray-400">Check off your reps and track rest times live.</p>
            </div>
          </motion.div>

          {/* Small Card 3 - AI Coach */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-1 bg-gradient-to-br from-[#0a1f0f] to-[#081526] border border-green-500/30 rounded-3xl p-8 relative hover:shadow-[0_0_30px_rgba(74,222,128,0.2)] transition-shadow overflow-hidden flex flex-col justify-between"
          >
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/20 blur-xl rounded-full"
            />
            <div className="relative z-10 w-10 h-10 bg-black/50 backdrop-blur-md rounded-xl flex items-center justify-center border border-green-500/40 text-green-400">🤖</div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-green-400 mb-1">AI Coach</h3>
              <p className="text-sm text-gray-300">Powered by Gemini. Ask anything anytime.</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── TESTIMONIALS (Marquee) ── */}
      <section className="py-24 bg-gray-900/40 border-y border-gray-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Trusted by thousands of athletes</h2>
          <p className="text-gray-400 mt-2">See what our community is saying about FitTrack.</p>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <Marquee speed={30}>
            <TestimonialCard 
              name="Sarah Jenkins" role="Lost 15lbs in 2 months"
              text="The macro calculator changed the game for me. I finally understand what I'm supposed to be eating without starving myself!"
              img="https://i.pravatar.cc/150?img=47"
            />
            <TestimonialCard 
              name="Michael Rodriguez" role="Powerlifter"
              text="The AI Coach provides incredibly sound advice. It's like having a personal trainer in my pocket giving me recovery tips."
              img="https://i.pravatar.cc/150?img=11"
            />
            <TestimonialCard 
              name="Emma Watson" role="Marathon Runner"
              text="I love the minimalist, dark design. It's so fast to just open the app, check off my workout, and visualize my progress."
              img="https://i.pravatar.cc/150?img=5"
            />
             <TestimonialCard 
              name="David Chen" role="Gained 10lbs of muscle"
              text="I couldn't figure out my body type routine until FitTrack laid out the perfect weekly schedule for me. Amazing!"
              img="https://i.pravatar.cc/150?img=8"
            />
          </Marquee>
          
          <div className="mt-6"></div>

          <Marquee speed={35} direction="right">
            <TestimonialCard 
              name="Jessica Lee" role="Busy Mom"
              text="FitTrack makes tracking my daily steps and water goals so satisfying. The little confetti bursts make my day."
              img="https://i.pravatar.cc/150?img=44"
            />
            <TestimonialCard 
              name="James Wilson" role="Fitness Enthusiast"
              text="The interactive dashboard is phenomenal. I can actually estimate the exact date I'll hit my target weight now."
              img="https://i.pravatar.cc/150?img=33"
            />
            <TestimonialCard 
              name="Olivia Martinez" role="Beginner"
              text="I was so intimidated by the gym. The onboarding process made everything so easy to understand, step by step."
              img="https://i.pravatar.cc/150?img=49"
            />
            <TestimonialCard 
              name="Alex Thorne" role="CrossFit Athlete"
              text="The rest timer inside the workouts page is a genius touch. Keeps me completely honest during my HIIT sessions."
              img="https://i.pravatar.cc/150?img=12"
            />
          </Marquee>
        </motion.div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="py-32 relative flex justify-center items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-900/20" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center relative z-10"
        >
          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6">Ready to start?</h2>
          <p className="text-gray-400 text-xl mb-10 max-w-lg mx-auto">Join FitTrack today and take absolute control of your physical journey.</p>
          <Link
            to={user ? "/dashboard" : "/register"}
            className="bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-black font-extrabold px-12 py-5 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_40px_rgba(74,222,128,0.4)]"
          >
            {user ? "Enter App" : "Create Free Account"}
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
