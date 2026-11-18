import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../Utils/axios";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login({ ...data.user, token: data.token });
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Could not sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fit-auth">
      <form className="fit-auth-card" onSubmit={handleSubmit}>
        <h1>Sign in to FitTrack</h1>
        <p className="fit-auth-intro">Pick up where you left off.</p>
        {error && <p role="alert" className="rounded-lg bg-red-900/30 p-3 text-sm text-red-200">{error}</p>}

        <label className="fit-field-label" htmlFor="email">Email address</label>
        <input
          className="fit-auth-input"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label className="fit-field-label" htmlFor="password">Password</label>
        <input
          className="fit-auth-input"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button className="fit-button fit-button-primary mt-5 w-full disabled:opacity-60" disabled={submitting} type="submit">
          {submitting ? "Signing in…" : "Sign in"}
        </button>
        <p className="mt-4 text-center text-sm text-gray-300">
          New to FitTrack? <Link to="/register" className="font-semibold text-green-300 hover:underline">Create an account</Link>
        </p>
        <Link to="/" className="fit-auth-back">Back to home</Link>
      </form>
    </div>
  );
}
