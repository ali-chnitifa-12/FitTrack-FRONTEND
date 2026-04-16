import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
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

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ---------- Animation Variants ----------
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" }
  }
};

// ---------- ProtectedRoute Component ----------
function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-green-500 text-xl"
        >
          Loading...
        </motion.div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// ---------- Layout Component ----------
function MainLayout({ children }) {
  const location = useLocation();
  const hideLayout = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="bg-black text-gray-300 min-h-screen">
      {!hideLayout && <Navbar />}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex-1 ${!hideLayout ? 'pt-24' : ''}`}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      {!hideLayout && <Footer />}
    </div>
  );
}

// ---------- App Component ----------
export default function App() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const bg1Ref = useRef(null);
  const bg2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      if (titleRef.current) {
        gsap.fromTo(titleRef.current, 
          { y: 100, opacity: 0, rotationX: -90 },
          { y: 0, opacity: 1, rotationX: 0, duration: 1.5, ease: "back.out(1.7)" }
        );
      }
      
      if (subtitleRef.current) {
        gsap.fromTo(subtitleRef.current,
          { y: 50, opacity: 0, rotationX: -45 },
          { y: 0, opacity: 1, rotationX: 0, duration: 1.2, delay: 0.3, ease: "power2.out" }
        );
      }
      
      if (buttonRef.current) {
        gsap.fromTo(buttonRef.current,
          { scale: 0, rotationY: 180, opacity: 0 },
          { scale: 1, rotationY: 0, opacity: 1, duration: 1, delay: 0.6, ease: "elastic.out(1, 0.5)" }
        );
      }

      // Background animations
      if (bg1Ref.current) {
        gsap.to(bg1Ref.current, {
          rotation: 360,
          scale: 1.2,
          duration: 20,
          repeat: -1,
          ease: "none"
        });
      }
      
      if (bg2Ref.current) {
        gsap.to(bg2Ref.current, {
          rotation: -360,
          scale: 1.5,
          duration: 25,
          repeat: -1,
          ease: "none"
        });
      }

      // Parallax effect on scroll
      if (heroRef.current) {
        gsap.to(heroRef.current, {
          yPercent: -52,
          rotateX: 2,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }

      if (bg1Ref.current) {
        gsap.to(bg1Ref.current, {
          x: 80,
          y: -45,
          rotationY: 360,
          rotationX: 40,
          duration: 18,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

      if (bg2Ref.current) {
        gsap.to(bg2Ref.current, {
          x: -90,
          y: 55,
          rotationY: -360,
          rotationX: -25,
          duration: 20,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

      // Crazy 3D hero wobble timeline
      const heroChaos = gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 1.8, ease: "sine.inOut" } });
      if (titleRef.current) {
        heroChaos.to(titleRef.current, { rotationY: 18, rotationX: -8, x: 12, y: -7, scale: 1.05 });
      }
      if (subtitleRef.current) {
        heroChaos.to(subtitleRef.current, { rotationY: -8, rotationX: 7, x: -6, y: 5, scale: 1.02 }, "<");
      }
      if (buttonRef.current) {
        heroChaos.to(buttonRef.current, { rotationY: 12, rotationX: 6, x: 5, scale: 1.03 }, "<");
      }

      // Float the colored ring in 3D space as well
      const ringRefs = gsap.utils.toArray(".hero-ring");
      if (ringRefs.length > 0) {
        gsap.to(ringRefs, {
          rotationY: 360,
          rotationX: 45,
          x: 20,
          y: -20,
          duration: 24,
          repeat: -1,
          ease: "power1.inOut"
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const featuresRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Features section animations - wait for elements to exist
        const featureCards = gsap.utils.toArray(".feature-card");
        if (featureCards.length > 0 && featuresRef.current) {
          gsap.fromTo(featureCards, 
            { y: 100, opacity: 0, rotationX: -30 },
            { 
              y: 0, 
              opacity: 1, 
              rotationX: 0, 
              duration: 1, 
              stagger: 0.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: featuresRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }

        // Hover effects for cards
        cardsRef.current.forEach((card, index) => {
          if (card) {
            const handleMouseEnter = () => {
              gsap.to(card, { 
                rotationY: 10, 
                scale: 1.05, 
                duration: 0.3, 
                ease: "power2.out" 
              });
            };
            const handleMouseLeave = () => {
              gsap.to(card, { 
                rotationY: 0, 
                scale: 1, 
                duration: 0.3, 
                ease: "power2.out" 
              });
            };
            
            card.addEventListener('mouseenter', handleMouseEnter);
            card.addEventListener('mouseleave', handleMouseLeave);
            
            return () => {
              card.removeEventListener('mouseenter', handleMouseEnter);
              card.removeEventListener('mouseleave', handleMouseLeave);
            };
          }
        });
      });

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  const statsRef = useRef(null);
  const statCardsRef = useRef([]);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Stats section animations - wait for elements to exist
        const statCards = gsap.utils.toArray(".stat-card");
        if (statCards.length > 0 && statsRef.current) {
          gsap.fromTo(statCards, 
            { y: 80, opacity: 0, rotationX: -20, scale: 0.8 },
            { 
              y: 0, 
              opacity: 1, 
              rotationX: 0,
              scale: 1,
              duration: 1.2, 
              stagger: 0.3,
              ease: "elastic.out(1, 0.5)",
              scrollTrigger: {
                trigger: statsRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );

          // Continuous floating animation for stat cards
          gsap.to(statCards, {
            y: -10,
            duration: 2,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
            stagger: 0.2
          });
        }
      });

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  const sections = [
    {
      title: "Upper Body Strength",
      description: "Build powerful arms, chest, and back with targeted exercises",
      img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
      link: "/workouts",
      category: "strength"
    },
    {
      title: "Lower Body Power",
      description: "Develop strong legs and glutes with compound movements",
      img: "https://images.unsplash.com/photo-1536922246289-88c42f957773?auto=format&fit=crop&w=800&q=80",
      link: "/workouts",
      category: "strength"
    },
    {
      title: "Cardio Blast",
      description: "Boost your endurance and burn calories with intense cardio",
      img: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?auto=format&fit=crop&w=800&q=80",
      link: "/workouts",
      category: "cardio"
    },
    {
      title: "Healthy Nutrition",
      description: "Discover delicious and nutritious meal plans for your goals",
      img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
      link: "/nutrition",
      category: "nutrition"
    },
    {
      title: "Supplement Guide",
      description: "Optimize your results with science-backed supplements",
      img: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=800&q=80",
      link: "/nutrition",
      category: "nutrition"
    },
    {
      title: "Flexibility & Recovery",
      description: "Improve mobility and accelerate recovery with proper stretching",
      img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
      link: "/workouts",
      category: "recovery"
    },
    {
      title: "Mindfulness & Meditation",
      description: "Enhance mental focus and reduce stress through meditation",
      img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
      link: "/workouts",
      category: "mental"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your journey with advanced analytics and insights",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      link: "/dashboard",
      category: "tracking"
    },
    {
      title: "Community Support",
      description: "Connect with like-minded fitness enthusiasts worldwide",
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&w=800&q=80",
      link: "/community",
      category: "community"
    }
  ];

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  {/* Hero Section */}
                  <section ref={heroRef} className="h-screen flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-[#060a1e] via-[#0f1f3f] to-[#03102a] perspective-1000 text-white">
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={staggerChildren}
                      className="relative z-10 text-center space-y-8 transform-gpu"
                    >
                      <motion.h1 
                        ref={titleRef}
                        variants={fadeInUp}
                        className="text-6xl md:text-8xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#73ffdb] via-[#00e5ff] to-[#6de5ff] tracking-tight shadow-[0_0_20px_rgba(0, 255, 230, 0.65)] transform-gpu"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        Welcome to FitTrack
                      </motion.h1>
                      <motion.p 
                        ref={subtitleRef}
                        variants={fadeInUp}
                        className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed transform-gpu"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        Transform your body, track your progress, and achieve your fitness goals with our comprehensive platform
                      </motion.p>
                      <motion.div ref={buttonRef} variants={fadeInUp} className="transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
                        <Link
                          to="/dashboard"
                          className="inline-block bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-black font-bold px-12 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-green-500/30 hover:shadow-green-500/50"
                        >
                          Start Your Journey
                        </Link>
                      </motion.div>
                    </motion.div>

                    {/* Animated Background */}
                    <div ref={bg1Ref} className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full mix-blend-soft-light filter blur-xl opacity-20 transform-gpu" style={{ transformStyle: 'preserve-3d' }} />
                    <div ref={bg2Ref} className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500 rounded-full mix-blend-soft-light filter blur-xl opacity-15 transform-gpu" style={{ transformStyle: 'preserve-3d' }} />
                    <div className="hero-ring absolute inset-1/3 w-80 h-80 border-2 border-purple-400/40 rounded-full opacity-30 mix-blend-screen transform-gpu" style={{ transformStyle: 'preserve-3d', boxShadow: '0 0 50px rgba(142, 94, 255, 0.4)' }} />
                    
                    {/* Additional 3D elements */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500 rounded-full mix-blend-soft-light filter blur-lg opacity-10 animate-bounce" />
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500 rounded-full mix-blend-soft-light filter blur-lg opacity-10 animate-pulse" />
                  </section>

                  {/* Features Grid */}
                  <section ref={featuresRef} className="max-w-7xl mx-auto p-6 py-20">
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={staggerChildren}
                      className="text-center mb-16"
                    >
                      <motion.h2 variants={fadeInUp} className="text-5xl font-bold text-green-400 mb-6">
                        Discover Your Potential
                      </motion.h2>
                      <motion.p variants={fadeInUp} className="max-w-2xl mx-auto text-xl text-gray-400">
                        Everything you need for your fitness journey in one place
                      </motion.p>
                    </motion.div>

                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={staggerChildren}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                      {sections.map((section, index) => (
                        <div 
                          key={index} 
                          ref={el => cardsRef.current[index] = el}
                          className="feature-card transform-gpu"
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          <Link
                            to={section.link}
                            className="block bg-gray-900/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl hover:shadow-green-500/20 transition-all duration-300 group border border-gray-700/50"
                          >
                            <div className="relative overflow-hidden">
                              <img src={section.img} alt={section.title} className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"/>
                              <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm text-black px-3 py-1 rounded-full text-sm font-semibold">
                                {section.category}
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"/>
                            </div>
                            <div className="p-6">
                              <h3 className="text-2xl font-bold text-green-400 mb-3 group-hover:text-green-300 transition-colors">
                                {section.title}
                              </h3>
                              <p className="text-gray-400 mb-4 leading-relaxed">{section.description}</p>
                              <span className="inline-flex items-center text-green-500 font-semibold group-hover:text-green-400 transition-colors">
                                Explore Now
                                <motion.span initial={{ x: 0 }} whileHover={{ x: 5 }} className="ml-2">→</motion.span>
                              </span>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </motion.div>
                  </section>

                  {/* Stats Section */}
                  <motion.section 
                    ref={statsRef} 
                    initial="hidden" 
                    whileInView="visible" 
                    viewport={{ once: true }} 
                    variants={staggerChildren} 
                    className="bg-gradient-to-r from-gray-900 to-black py-20 relative overflow-hidden"
                  >
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-10 left-10 w-32 h-32 border border-green-500 rounded-full"></div>
                      <div className="absolute top-20 right-20 w-24 h-24 border border-teal-500 rounded-full"></div>
                      <div className="absolute bottom-10 left-1/3 w-40 h-40 border border-purple-500 rounded-full"></div>
                    </div>
                    
                    <div className="max-w-6xl mx-auto text-center relative z-10">
                      <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-green-400 mb-12">
                        Why Thousands Choose FitTrack
                      </motion.h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                          { number: "95%", label: "Success Rate", desc: "Users achieving their goals" },
                          { number: "10K+", label: "Active Users", desc: "Worldwide community" },
                          { number: "24/7", label: "Support", desc: "Always here to help you" }
                        ].map((stat, idx) => (
                          <div 
                            key={idx} 
                            className="stat-card transform-gpu bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 hover:bg-gray-750/80 transition-all duration-300 border border-gray-700/50"
                            style={{ transformStyle: 'preserve-3d' }}
                          >
                            <div className="text-5xl font-bold text-green-400 mb-4 transform-gpu" style={{ transform: 'translateZ(20px)' }}>{stat.number}</div>
                            <div className="text-xl font-semibold text-white mb-2">{stat.label}</div>
                            <div className="text-gray-400">{stat.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.section>
                </>
              </ProtectedRoute>
            }
          />

          {/* Other protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
          <Route path="/nutrition" element={<ProtectedRoute><Nutrition /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><ContactForm /></ProtectedRoute>} />
          <Route path="/coach" element={<ProtectedRoute><AICoach /></ProtectedRoute>} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
