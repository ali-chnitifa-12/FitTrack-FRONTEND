// src/pages/Register.jsx
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../Utils/axios";
import analytics from "../Utils/analytics";

export default function Register() {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError("");

    if (!agreed) {
      setError("You must agree to the Terms of Service and Privacy Policy to create an account.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/register", { name, email, password });

      // Save user in context and localStorage
      login({ ...data.user, token: data.token });
      analytics.trackSignup();

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fit-auth">
      <form
        onSubmit={handleSubmit}
        className="fit-auth-card"
      >
        <h1>Create your FitTrack account</h1>
        <p className="fit-auth-intro">Start tracking meals, workouts, and progress.</p>

        {error && <p role="alert" className="rounded-lg bg-red-900/30 p-3 text-sm text-red-200">{error}</p>}

        <label className="fit-field-label" htmlFor="name">Full name</label>

        <input
          id="name"
          name="name"
          autoComplete="name"
          type="text"

          className="fit-auth-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="fit-field-label" htmlFor="email">Email address</label>

        <input
          id="email"
          name="email"
          type="email"
            autoComplete="email"

          className="fit-auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="fit-field-label" htmlFor="password">Password</label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"

          className="fit-auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-start gap-2.5 mt-4 mb-5 text-left">
          <input
            id="termsConsent"
            name="termsConsent"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 rounded bg-gray-800 border-gray-700 text-green-500 focus:ring-green-500 focus:ring-offset-gray-900 cursor-pointer"
            required
          />
          <label htmlFor="termsConsent" className="text-sm text-gray-300 leading-relaxed cursor-pointer">
            I agree to the{" "}
            <Link to="/terms" target="_blank" className="text-green-400 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" target="_blank" className="text-green-400 hover:underline">
              Privacy Policy
            </Link>
            , and acknowledge the health disclaimer.
          </label>
        </div>

        <button
          type="submit"
          className="fit-button fit-button-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={!agreed || submitting}
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>

        <p className="text-center mt-4 text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 hover:underline">
            Sign in
          </Link>
        </p>
        <Link to="/" className="fit-auth-back">Back to home</Link>
      </form>
    </div>
  );
}
