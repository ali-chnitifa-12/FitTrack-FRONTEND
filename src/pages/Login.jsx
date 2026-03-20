// src/pages/Login.jsx
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";
import api from "../Utils/axios";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const formRef = useRef(null);
  const titleRef = useRef(null);
  const inputsRef = useRef([]);
  const buttonRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!formRef.current) return;

      const ctx = gsap.context(() => {
        // Form entrance animation
        gsap.fromTo(formRef.current, 
          { rotationY: -90, scale: 0.8, opacity: 0 },
          { rotationY: 0, scale: 1, opacity: 1, duration: 1.2, ease: "back.out(1.7)" }
        );

        // Title animation
        if (titleRef.current) {
          gsap.fromTo(titleRef.current, 
            { y: -30, opacity: 0, rotationX: -45 },
            { y: 0, opacity: 1, rotationX: 0, duration: 0.8, delay: 0.3, ease: "power2.out" }
          );
        }

        // Inputs stagger animation
        const inputs = inputsRef.current.filter(el => el);
        if (inputs.length > 0) {
          gsap.fromTo(inputs, 
            { x: -30, opacity: 0, rotationY: -20 },
            { 
              x: 0, 
              opacity: 1, 
              rotationY: 0,
              duration: 0.6, 
              stagger: 0.2, 
              delay: 0.6,
              ease: "power2.out" 
            }
          );
        }

        // Button animation
        if (buttonRef.current) {
          gsap.fromTo(buttonRef.current, 
            { scale: 0, rotationX: 90, opacity: 0 },
            { scale: 1, rotationX: 0, opacity: 1, duration: 0.8, delay: 1, ease: "elastic.out(1, 0.5)" }
          );
        }
      }, formRef);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/login", { email, password });

      // Save user in context and localStorage
      login({ name: data.user.name, email: data.user.email, token: data.token });
      localStorage.setItem("token", data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-green-500 rounded-full mix-blend-soft-light filter blur-xl opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-teal-500 rounded-full mix-blend-soft-light filter blur-xl opacity-15 animate-pulse" />

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-gray-900/90 backdrop-blur-lg rounded-xl shadow-2xl p-8 w-96 border border-gray-700/50 transform-gpu"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <h2 ref={titleRef} className="text-3xl font-bold text-center mb-6 text-green-500 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400">
          Login
        </h2>

        {error && <p className="text-red-500 mb-4 text-center bg-red-900/50 p-2 rounded-lg">{error}</p>}

        <div className="space-y-4">
          <input
            ref={el => inputsRef.current[0] = el}
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 hover:bg-gray-800 border border-gray-600/50 transform-gpu"
            style={{ transformStyle: 'preserve-3d' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            ref={el => inputsRef.current[1] = el}
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 hover:bg-gray-800 border border-gray-600/50 transform-gpu"
            style={{ transformStyle: 'preserve-3d' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          ref={buttonRef}
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-black font-semibold py-3 rounded-lg transition-all duration-300 mt-6 shadow-lg hover:shadow-green-500/30 transform-gpu"
          style={{ transformStyle: 'preserve-3d' }}
        >
          Login
        </button>

        <p className="text-center mt-4 text-gray-400">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-500 hover:text-green-400 transition-colors hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
