import { useContext } from "react";
import { Link } from "react-router-dom";
import PageHeading from "../Components/PageHeading.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

export default function About() {
  const { user } = useContext(AuthContext);

  return (
    <div className="fit-page fit-container">
      <PageHeading title="About FitTrack" description="FitTrack helps you log meals, follow a workout routine, and keep track of your progress." />
      <div className="fit-about-grid">
        <section className="fit-panel">
          <h2 className="fit-section-title">Start with one thing</h2>
          <ul className="fit-about-list">
            <li><strong>Track progress.</strong> Log your weight and see how it changes over time.</li>
            <li><strong>Keep a meal diary.</strong> Search for food, scan a meal, or enter it yourself.</li>
            <li><strong>Follow a routine.</strong> Choose a plan and check off exercises as you go.</li>
            <li><strong>Ask the AI Coach.</strong> Get ideas for meals, workouts, and recovery.</li>
          </ul>
          <Link className="fit-button fit-button-primary" to={user ? "/dashboard" : "/register"}>
            {user ? "Go to dashboard" : "Create a free account"}
          </Link>
        </section>
        <aside className="fit-panel">
          <h2 className="fit-section-title">Need help?</h2>
          <p className="mb-4 text-[var(--fit-muted)]">Tell us if something is unclear or isn’t working.</p>
          <Link className="fit-button fit-button-secondary" to="/contact">Contact FitTrack</Link>
        </aside>
      </div>
    </div>
  );
}
