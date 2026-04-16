import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function Footer() {
  useEffect(() => {
    // This useEffect can be removed if not needed for other purposes
    // It was previously used to set isVisible which is no longer needed
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120
      }
    }
  };
  
  const heartVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: [1, 1.3, 1],
      transition: { 
        duration: 0.6,
        times: [0, 0.5, 1]
      }
    },
    beat: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatDelay: 1.5
      }
    }
  };

  return (
    <motion.footer 
      className="bg-gradient-to-b from-gray-900 to-black py-12 mt-16 shadow-2xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand section */}
          <motion.div 
            className="text-center md:text-left"
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold text-white mb-4">FitTrack</h3>
            <p className="text-gray-400 text-sm">
              Your personal fitness companion for tracking workouts, nutrition, and progress.
            </p>
          </motion.div>
          
          {/* Links section */}
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/dashboard" className="text-gray-400 hover:text-green-500 transition-colors duration-300 text-sm block">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/workouts" className="text-gray-400 hover:text-green-500 transition-colors duration-300 text-sm block">
                  Workouts
                </a>
              </li>
              <li>
                <a href="/nutrition" className="text-gray-400 hover:text-green-500 transition-colors duration-300 text-sm block">
                  Nutrition
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-green-500 transition-colors duration-300 text-sm block">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-green-500 transition-colors duration-300 text-sm block">
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>
          
          {/* Social section */}
          <motion.div 
            className="text-center md:text-right"
            variants={itemVariants}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex justify-center md:justify-end space-x-4">
              <motion.a
                href="https://www.linkedin.com/in/ali-chnitifa-7926b5290/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </motion.a>
              <motion.a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="border-t border-gray-800 mt-8 pt-8 text-center"
          variants={itemVariants}
        >
          <p className="text-gray-400 text-sm flex items-center justify-center flex-wrap">
            © 2025 FitTrack. All rights reserved. 
            <span className="mx-1">Designed with</span>
            <motion.span
              className="text-red-500 inline-block"
              variants={heartVariants}
              initial="rest"
              whileHover="hover"
              animate="beat"
            >
              ❤️
            </motion.span>
            <span className="ml-1">for fitness enthusiasts.</span>
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}