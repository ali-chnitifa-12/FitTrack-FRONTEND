// src/config/plans.js
export const PLANS = {
  FREE: {
    id: "free",
    name: "Free Tier",
    tagline: "Core fitness essentials for everyday workouts and meal tracking.",
    priceMonthly: { usd: 0, mad: 0 },
    priceAnnual: { usd: 0, mad: 0 },
    features: [
      { name: "Daily Calorie & Macro Target Calculator", included: true },
      { name: "Daily Meals Diary & Food Logging", included: true },
      { name: "Curated Moroccan Dishes Database", included: true },
      { name: "Open Food Facts Global Search", included: true },
      { name: "Interactive Workout Routines & Timers", included: true },
      { name: "AI Food Scanner", detail: "3 scans per day", included: true },
      { name: "AI Fitness Coach", detail: "10 chats per day", included: true },
      { name: "Full Data Export (GDPR / Law 09-08)", included: true },
      { name: "Advanced Progress Analytics & Predictions", included: false },
      { name: "Personalized AI Weekly Meal Plans", included: false },
      { name: "Priority AI Vision Processing", included: false },
    ],
  },
  PREMIUM: {
    id: "premium",
    name: "FitTrack Pro",
    tagline: "Unleash high-volume AI scanner power and deep nutrition analytics.",
    priceMonthly: { usd: 6, mad: 60 },
    priceAnnual: { usd: 49, mad: 490 }, // ~30% discount
    badge: "Most Popular",
    features: [
      { name: "Daily Calorie & Macro Target Calculator", included: true },
      { name: "Daily Meals Diary & Food Logging", included: true },
      { name: "Curated Moroccan Dishes Database", included: true },
      { name: "Open Food Facts Global Search", included: true },
      { name: "Interactive Workout Routines & Timers", included: true },
      { name: "AI Food Scanner", detail: "50 scans per day", included: true },
      { name: "AI Fitness Coach", detail: "100 chats per day", included: true },
      { name: "Full Data Export (GDPR / Law 09-08)", included: true },
      { name: "Advanced Progress Analytics & Predictions", included: true },
      { name: "Personalized AI Weekly Meal Plans", included: true },
      { name: "Priority AI Vision Processing", included: true },
    ],
  },
};
