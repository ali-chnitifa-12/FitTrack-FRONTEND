import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Menu, X } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black p-6 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo + App Name */}
        <Link to="/" className="flex items-center space-x-4">
          <motion.img
            src="/gym.jpg"
            alt="FitTrack Logo"
            className="w-12 h-12 object-cover rounded-full"
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.h1
            className="text-2xl md:text-3xl font-extrabold text-green-500 tracking-wide"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            FitTrack
          </motion.h1>
        </Link>

        {/* Desktop Menu (Animated) */}
        <motion.div
          className="hidden md:flex items-center space-x-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link to="/dashboard" className="text-lg text-gray-300 hover:text-green-500 transition">
            Dashboard
          </Link>
          <Link to="/workouts" className="text-lg text-gray-300 hover:text-green-500 transition">
            Workouts
          </Link>
          <Link to="/nutrition" className="text-lg text-gray-300 hover:text-green-500 transition">
            Nutrition
          </Link>
          <Link to="/about" className="text-lg text-gray-300 hover:text-green-500 transition">
            About
          </Link>
          <Link to="/contact" className="text-lg text-gray-300 hover:text-green-500 transition">
            Contact
          </Link>

          {user ? (
            <motion.button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm md:text-base font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg text-sm md:text-base font-semibold"
              >
                Login
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-300 hover:text-green-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown (Animated) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden mt-4 space-y-4 bg-gray-900 p-6 rounded-lg shadow-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/dashboard"
              className="block text-lg text-gray-300 hover:text-green-500"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/workouts"
              className="block text-lg text-gray-300 hover:text-green-500"
              onClick={() => setIsOpen(false)}
            >
              Workouts
            </Link>
            <Link
              to="/nutrition"
              className="block text-lg text-gray-300 hover:text-green-500"
              onClick={() => setIsOpen(false)}
            >
              Nutrition
            </Link>
            <Link
              to="/about"
              className="block text-lg text-gray-300 hover:text-green-500"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block text-lg text-gray-300 hover:text-green-500"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            {user ? (
              <motion.button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-base font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg text-base font-semibold"
                >
                  Login
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
