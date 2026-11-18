import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import { Toaster } from "react-hot-toast";

// Lazy-loaded route components for fast mobile load times
const Home = lazy(() => import("./pages/Home.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const ContactForm = lazy(() => import("./pages/ContactForm.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Workouts = lazy(() => import("./pages/Workouts.jsx"));
const Nutrition = lazy(() => import("./pages/Nutrition.jsx"));
const AICoach = lazy(() => import("./pages/AICoach.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const Subscription = lazy(() => import("./pages/Subscription.jsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.jsx"));
const TermsOfService = lazy(() => import("./pages/TermsOfService.jsx"));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
        <span className="text-xs font-semibold text-gray-400">Loading FitTrack...</span>
      </div>
    </div>
  );
}

// ---------- ProtectedRoute Component ----------
function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-green-500 text-xl font-medium"
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
    <div className="bg-black text-gray-300 min-h-screen flex flex-col">
      {!hideLayout && <Navbar />}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex-1 ${!hideLayout ? "pt-24 lg:pt-32" : ""}`}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      {!hideLayout && <Footer />}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid rgba(74, 222, 128, 0.2)",
            borderRadius: "12px",
          },
          success: {
            iconTheme: { primary: "#4ade80", secondary: "#000" },
          },
        }}
      />
    </div>
  );
}

// ---------- App Component ----------
export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes (Freemium - full app access with quota limits) */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
            <Route path="/nutrition" element={<ProtectedRoute><Nutrition /></ProtectedRoute>} />
            <Route path="/coach" element={<ProtectedRoute><AICoach /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </BrowserRouter>
  );
}
