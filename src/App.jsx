import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import Dashboard from "./pages/Dashboard.jsx"; // ÔåÉ FIXED THIS LINE
import Workouts from "./pages/Workouts.jsx";
import Nutrition from "./pages/Nutrition.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import ContactForm from "./pages/ContactForm.jsx";
import AICoach from "./pages/AICoach.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Subscription from "./pages/Subscription.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import { Toaster } from "react-hot-toast";

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

  // Admin bypass
  if (user.isAdmin) return children;

  const isTrialActive = user.trialEndsAt && new Date(user.trialEndsAt) > new Date();
  const isSubscribed = user.isSubscribed === true || (user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > new Date());

  // If trial expired AND not subscribed, force to subscription page
  // BUT allow access to the subscription page itself!
  const useLocationResult = useLocation();
  if (!isTrialActive && !isSubscribed && useLocationResult.pathname !== "/subscription") {
    return <Navigate to="/subscription" replace />;
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
          className={`flex-1 ${!hideLayout ? 'pt-24 lg:pt-32' : ''}`}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      {!hideLayout && <Footer />}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid rgba(74, 222, 128, 0.2)',
            borderRadius: '12px',
          },
          success: {
            iconTheme: { primary: '#4ade80', secondary: '#000' },
          },
        }}
      />
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
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
          <Route path="/nutrition" element={<ProtectedRoute><Nutrition /></ProtectedRoute>} />
          <Route path="/coach" element={<ProtectedRoute><AICoach /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
