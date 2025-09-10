import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import Dashboard from "./pages/Dashboard.jsx"; // ← FIXED THIS LINE
import Workouts from "./pages/Workouts.jsx";
import Nutrition from "./pages/Nutrition.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import About from "./pages/About.jsx";
import ContactForm from "./pages/ContactForm.jsx";
import { AuthContext } from "./context/AuthContext.jsx";

// ---------- Animation Variants ----------
// ... rest of your code
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
          className="flex-1"
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
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
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
                  <section className="h-screen flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-green-900">
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={staggerChildren}
                      className="relative z-10 text-center space-y-8"
                    >
                      <motion.h1 
                        variants={fadeInUp}
                        className="text-6xl md:text-8xl font-bold text-green-400 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400"
                      >
                        Welcome to FitTrack
                      </motion.h1>
                      
                      <motion.p 
                        variants={fadeInUp}
                        className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
                      >
                        Transform your body, track your progress, and achieve your fitness goals with our comprehensive platform
                      </motion.p>
                      
                      <motion.div variants={fadeInUp}>
                        <Link
                          to="/dashboard"
                          className="inline-block bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-black font-bold px-12 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-green-500/30"
                        >
                          Start Your Journey
                        </Link>
                      </motion.div>
                    </motion.div>

                    {/* Animated Background Elements */}
                    <motion.div
                      className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full mix-blend-soft-light filter blur-xl opacity-20 animate-pulse"
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    
                    <motion.div
                      className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500 rounded-full mix-blend-soft-light filter blur-xl opacity-15"
                      animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 0, 360]
                      }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </section>

                  {/* Features Grid */}
                  <section className="max-w-7xl mx-auto p-6 py-20">
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={staggerChildren}
                      className="text-center mb-16"
                    >
                      <motion.h2 
                        variants={fadeInUp}
                        className="text-5xl font-bold text-green-400 mb-6"
                      >
                        Discover Your Potential
                      </motion.h2>
                      <motion.p 
                        variants={fadeInUp}
                        className="max-w-2xl mx-auto text-xl text-gray-400"
                      >
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
                        <motion.div
                          key={index}
                          variants={scaleIn}
                          whileHover={{ 
                            scale: 1.05,
                            rotateY: 5,
                            transition: { duration: 0.3 }
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link
                            to={section.link}
                            className="block bg-gray-900 rounded-2xl overflow-hidden shadow-2xl hover:shadow-green-500/20 transition-all duration-300 group"
                          >
                            <div className="relative overflow-hidden">
                              <img
                                src={section.img}
                                alt={section.title}
                                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute top-4 right-4 bg-green-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                                {section.category}
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                            </div>
                            
                            <div className="p-6">
                              <h3 className="text-2xl font-bold text-green-400 mb-3 group-hover:text-green-300 transition-colors">
                                {section.title}
                              </h3>
                              <p className="text-gray-400 mb-4 leading-relaxed">
                                {section.description}
                              </p>
                              <span className="inline-flex items-center text-green-500 font-semibold group-hover:text-green-400 transition-colors">
                                Explore Now 
                                <motion.span
                                  initial={{ x: 0 }}
                                  whileHover={{ x: 5 }}
                                  className="ml-2"
                                >
                                  →
                                </motion.span>
                              </span>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  </section>

                  {/* Stats Section */}
                  <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerChildren}
                    className="bg-gradient-to-r from-gray-900 to-black py-20"
                  >
                    <div className="max-w-6xl mx-auto text-center">
                      <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-green-400 mb-12">
                        Why Thousands Choose FitTrack
                      </motion.h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                          { number: "95%", label: "Success Rate", desc: "Users achieving their goals" },
                          { number: "10K+", label: "Active Users", desc: "Worldwide community" },
                          { number: "24/7", label: "Support", desc: "Always here to help you" }
                        ].map((stat, index) => (
                          <motion.div
                            key={index}
                            variants={fadeInUp}
                            className="text-center p-6 bg-gray-800 rounded-2xl hover:bg-gray-750 transition-colors"
                          >
                            <div className="text-5xl font-bold text-green-400 mb-4">{stat.number}</div>
                            <div className="text-xl font-semibold text-white mb-2">{stat.label}</div>
                            <div className="text-gray-400">{stat.desc}</div>
                          </motion.div>
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

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}