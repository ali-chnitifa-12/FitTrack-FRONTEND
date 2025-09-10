import { motion } from "framer-motion";

export default function About() {
  // Animation variants
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Support" }
  ];

  const features = [
    { icon: "📊", title: "Progress Tracking", desc: "Monitor your journey with detailed analytics" },
    { icon: "🍎", title: "Nutrition Planning", desc: "Personalized meal plans for your goals" },
    { icon: "💪", title: "Workout Guides", desc: "Customized exercise routines" },
    { icon: "📈", title: "Goal Setting", desc: "Set and achieve your fitness targets" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 text-gray-200 p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-green-500/20 max-w-4xl w-full relative overflow-hidden"
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 bg-green-500 rounded-full mix-blend-soft-light filter blur-xl opacity-20"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        <motion.div
          className="absolute -bottom-20 -right-20 w-60 h-60 bg-teal-500 rounded-full mix-blend-soft-light filter blur-xl opacity-15"
          animate={{
            rotate: -360,
            scale: [1.2, 1, 1.2]
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl font-bold text-green-400 mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400"
          >
            About FitTrack
          </motion.h1>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800/50 p-6 rounded-2xl text-center border border-green-500/20"
              >
                <div className="text-4xl font-bold text-green-400 mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="space-y-6 mb-10"
          >
            <motion.p variants={itemVariants} className="text-lg leading-relaxed">
              Welcome to <span className="text-green-400 font-semibold">FitTrack</span>, 
              your personal fitness and nutrition companion. 
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-lg leading-relaxed">
              Our mission is to help people stay consistent with their health goals by 
              providing simple tools for tracking calories, weight, and progress charts. 
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-lg leading-relaxed">
              Whether you want to lose fat, gain muscle, or simply maintain a healthy 
              lifestyle, FitTrack gives you everything you need in one place.
            </motion.p>
          </motion.div>

          <motion.h2
            variants={fadeIn}
            className="text-3xl font-bold text-green-400 mb-6 text-center"
          >
            What We Offer
          </motion.h2>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.2 }
                }}
                className="bg-gray-800/50 p-6 rounded-2xl border border-green-500/20"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-green-400 mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="text-center p-6 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-2xl border border-green-500/30"
          >
            <motion.p
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-2xl font-bold text-green-400"
            >
              🚀 Stay motivated. Stay healthy. Stay strong.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Floating particles */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full"
            style={{
              top: `${10 + i * 12}%`,
              left: `${5 + i * 15}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}