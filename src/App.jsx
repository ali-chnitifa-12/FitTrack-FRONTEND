import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import Dashboard from "./pages/Dashboard.jsx";
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
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactForm />} />
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
      </MainLayout>
    </BrowserRouter>
  );
}
