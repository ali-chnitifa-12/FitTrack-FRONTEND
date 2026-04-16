import { Link } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const menuItemsRef = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!navRef.current) return;

      const ctx = gsap.context(() => {
        // Logo animation
        if (logoRef.current) {
          gsap.fromTo(logoRef.current, 
            { rotationY: -180, scale: 0 },
            { rotationY: 0, scale: 1, duration: 1, ease: "back.out(1.7)" }
          );
        }

        // Menu items stagger animation
        const menuItems = menuItemsRef.current.filter(el => el);
        if (menuItems.length > 0) {
          gsap.fromTo(menuItems, 
            { y: -30, opacity: 0, rotationX: -45 },
            { 
              y: 0, 
              opacity: 1, 
              rotationX: 0,
              duration: 0.8, 
              stagger: 0.1, 
              delay: 0.5,
              ease: "power2.out" 
            }
          );
        }

        // Navbar background blur on scroll
        const handleScroll = () => {
          if (navRef.current) {
            if (window.scrollY > 50) {
              gsap.to(navRef.current, { 
                backdropFilter: "blur(20px)", 
                backgroundColor: "rgba(0,0,0,0.9)",
                duration: 0.3 
              });
            } else {
              gsap.to(navRef.current, { 
                backdropFilter: "blur(0px)", 
                backgroundColor: "rgba(0,0,0,1)",
                duration: 0.3 
              });
            }
          }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, navRef);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <nav ref={navRef} className="bg-black/95 backdrop-blur-md p-6 shadow-md fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo + App Name */}
        <Link to="/" className="flex items-center space-x-4 group">
          <div ref={logoRef} className="transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
            <motion.img
              src="/gym.jpg"
              alt="FitTrack Logo"
              className="w-12 h-12 object-cover rounded-full shadow-lg shadow-green-500/30 group-hover:shadow-green-500/50 transition-shadow duration-300"
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <motion.h1
            className="text-2xl md:text-3xl font-extrabold text-green-500 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
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
          {[
            { to: "/dashboard", label: "Dashboard" },
            { to: "/workouts", label: "Workouts" },
            { to: "/nutrition", label: "Nutrition" },
            { to: "/coach", label: "AI Coach", isAI: true },
            { to: "/about", label: "About" },
            { to: "/contact", label: "Contact" }
          ].map((item, index) => (
            <Link 
              key={item.to}
              ref={el => menuItemsRef.current[index] = el}
              to={item.to} 
              className={`text-lg transition-all duration-300 relative group transform-gpu flex items-center gap-1.5 ${
                item.isAI
                  ? "text-green-400 font-semibold hover:text-green-300"
                  : "text-gray-300 hover:text-green-400"
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {item.isAI && <Sparkles size={15} className="text-green-400" />}
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-teal-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}

          {user ? (
            <motion.button
              ref={el => menuItemsRef.current[5] = el}
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm md:text-base font-semibold shadow-lg hover:shadow-red-500/30 transition-all duration-300 transform-gpu"
              whileHover={{ scale: 1.05, rotateX: 5 }}
              whileTap={{ scale: 0.95 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              Logout
            </motion.button>
          ) : (
            <motion.div 
              ref={el => menuItemsRef.current[5] = el}
              whileHover={{ scale: 1.05, rotateX: 5 }} 
              whileTap={{ scale: 0.95 }}
              className="transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Link
                to="/login"
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-black px-4 py-2 rounded-lg text-sm md:text-base font-semibold shadow-lg hover:shadow-green-500/30 transition-all duration-300"
              >
                Login
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden text-gray-300 hover:text-green-500 p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isOpen ? 'close' : 'open'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Dropdown (Animated) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden mt-4 space-y-4 bg-gray-900/95 backdrop-blur-lg p-6 rounded-lg shadow-2xl border border-gray-700/50"
            initial={{ height: 0, opacity: 0, rotationX: -30 }}
            animate={{ height: "auto", opacity: 1, rotationX: 0 }}
            exit={{ height: 0, opacity: 0, rotationX: -30 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {[
              { to: "/dashboard", label: "Dashboard" },
              { to: "/workouts", label: "Workouts" },
              { to: "/nutrition", label: "Nutrition" },
              { to: "/coach", label: "AI Coach", isAI: true },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" }
            ].map((item) => (
              <motion.div
                key={item.to}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                whileHover={{ x: 10, scale: 1.02 }}
              >
                <Link
                  to={item.to}
                  className={`flex items-center gap-2 text-lg transition-colors py-2 border-b border-gray-700/30 last:border-b-0 ${
                    item.isAI ? "text-green-400 font-semibold" : "text-gray-300 hover:text-green-400"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.isAI && <Sparkles size={15} />}
                  {item.label}
                </Link>
              </motion.div>
            ))}

            {user ? (
              <motion.button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg text-base font-semibold shadow-lg hover:shadow-red-500/30 transition-all duration-300 mt-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Logout
              </motion.button>
            ) : (
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4"
              >
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-black px-4 py-3 rounded-lg text-base font-semibold shadow-lg hover:shadow-green-500/30 transition-all duration-300"
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
