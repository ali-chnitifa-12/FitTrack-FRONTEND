import { createElement, useContext } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChartNoAxesCombined, Dumbbell, MessageCircle, Utensils } from "lucide-react";
import { AuthContext } from "../context/AuthContext.jsx";

const features = [
  { to: "/dashboard", icon: ChartNoAxesCombined, title: "Track your progress", description: "Log your weight and see how it changes over time.", action: "View progress" },
  { to: "/nutrition", icon: Utensils, title: "Log your meals", description: "Search for food, scan a meal, and see how much you’ve eaten today.", action: "Open nutrition" },
  { to: "/workouts", icon: Dumbbell, title: "Find a workout", description: "Choose a routine and check off each set as you go.", action: "Browse workouts" },
  { to: "/coach", icon: MessageCircle, title: "Ask the AI Coach", description: "Get help with workout ideas, meal planning, or recovery.", action: "Open AI Coach" },
];

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="fit-home">
      <section className="fit-hero fit-container">
        <div className="fit-hero-copy">
          <h1>Fitness that fits <span>your day.</span></h1>
          <p>Log meals, follow a workout routine, and see your progress in one place.</p>
          <div className="fit-actions">
            <Link className="fit-button fit-button-primary" to={user ? "/dashboard" : "/register"}>
              {user ? "Go to dashboard" : "Create a free account"} <ArrowRight size={18} aria-hidden="true" />
            </Link>
            {user ? (
              <Link className="fit-button fit-button-secondary" to="/nutrition">Log a meal</Link>
            ) : (
              <Link className="fit-button fit-button-secondary" to="/login">Sign in</Link>
            )}
          </div>
        </div>
        <img
          className="fit-hero-photo"
          src="/fittrack-training-1100.webp"
          srcSet="/fittrack-training-640.webp 640w, /fittrack-training-1100.webp 1100w"
          sizes="(max-width: 672px) calc(100vw - 32px), (max-width: 1200px) 47vw, 560px"
          alt=""
          fetchPriority="high"
        />
      </section>

      <section className="fit-container fit-features" aria-labelledby="features-title">
        <div className="fit-section-heading">
          <h2 id="features-title">{user ? "What would you like to do?" : "What you can do with FitTrack"}</h2>
        </div>
        <div className="fit-feature-grid">
          {features.map(({ to, icon, title, description, action }) => (
            <article className="fit-feature" key={to}>
              <span className="fit-feature-icon">{createElement(icon, { size: 21, "aria-hidden": true })}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              {user && <Link to={to}>{action} <ArrowRight size={16} aria-hidden="true" /></Link>}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
