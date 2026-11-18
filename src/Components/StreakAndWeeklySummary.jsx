// src/Components/StreakAndWeeklySummary.jsx
import React, { useState } from "react";
import { Flame, Calendar, Bell, CheckCircle, TrendingDown, TrendingUp, Minus } from "lucide-react";
import toast from "react-hot-toast";

export default function StreakAndWeeklySummary({ progressData = [] }) {
  const [remindersEnabled, setRemindersEnabled] = useState(() => {
    return localStorage.getItem("fittrack_daily_reminders") === "true";
  });

  // Calculate current consecutive logging streak
  const calculateStreak = () => {
    if (!progressData || progressData.length === 0) return 0;

    // Extract unique dates sorted descending
    const dateStrings = Array.from(
      new Set(
        progressData
          .map((p) => p.date ? new Date(p.date).toISOString().split("T")[0] : null)
          .filter(Boolean)
      )
    ).sort().reverse();

    if (dateStrings.length === 0) return 0;

    const todayStr = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // Must have logged today or yesterday to maintain an active streak
    let streak = 0;
    let expectedDate = new Date();

    if (dateStrings[0] === todayStr) {
      streak = 1;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else if (dateStrings[0] === yesterdayStr) {
      streak = 1;
      expectedDate = yesterday;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      return 0; // Streak broken
    }

    // Check consecutive prior days
    for (let i = 1; i < dateStrings.length; i++) {
      const expStr = expectedDate.toISOString().split("T")[0];
      if (dateStrings[i] === expStr) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const streak = calculateStreak();

  // Weekly Stats (last 7 days)
  const calculateWeeklyStats = () => {
    if (!progressData || progressData.length === 0) {
      return { daysLogged: 0, weightDelta: 0, latestWeight: null };
    }

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const pastWeekEntries = progressData.filter((p) => {
      const d = new Date(p.date || p.createdAt);
      return d >= sevenDaysAgo;
    });

    const daysLogged = new Set(
      pastWeekEntries.map((p) => new Date(p.date || p.createdAt).toISOString().split("T")[0])
    ).size;

    const sortedAll = [...progressData].sort(
      (a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt)
    );

    const latest = sortedAll[sortedAll.length - 1]?.weight || 0;
    const initialWeek = pastWeekEntries[0]?.weight || latest;
    const weightDelta = parseFloat((latest - initialWeek).toFixed(1));

    return { daysLogged, weightDelta, latestWeight: latest };
  };

  const weeklyStats = calculateWeeklyStats();

  const toggleReminders = async () => {
    if (!remindersEnabled) {
      if ("Notification" in window) {
        const perm = await Notification.requestPermission();
        if (perm === "granted") {
          toast.success("Daily logging reminders enabled!");
        } else {
          toast("In-app reminder set (browser notifications blocked).");
        }
      } else {
        toast("Daily reminder enabled in-app.");
      }
      localStorage.setItem("fittrack_daily_reminders", "true");
      setRemindersEnabled(true);
    } else {
      localStorage.setItem("fittrack_daily_reminders", "false");
      setRemindersEnabled(false);
      toast("Reminders paused.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
      {/* 1. Daily Streak Card */}
      <div className="bg-gradient-to-br from-orange-500/10 via-gray-900 to-gray-900 border border-orange-500/30 rounded-2xl p-5 flex items-center gap-4">
        <div className={`p-3.5 rounded-2xl ${streak > 0 ? "bg-orange-500/20 text-orange-400" : "bg-gray-800 text-gray-500"}`}>
          <Flame className="w-8 h-8 animate-pulse" />
        </div>
        <div>
          <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider block">Active Streak</span>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            {streak} {streak === 1 ? "Day" : "Days"}
            {streak >= 3 && <span className="text-xs bg-orange-500/30 text-orange-300 px-2 py-0.5 rounded-full font-bold">On Fire! 🔥</span>}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {streak === 0 ? "Log today's weight or meal to start a streak!" : "Consistency is 90% of your results."}
          </p>
        </div>
      </div>

      {/* 2. Weekly Summary Card */}
      <div className="bg-gradient-to-br from-blue-500/10 via-gray-900 to-gray-900 border border-blue-500/30 rounded-2xl p-5 flex items-center gap-4">
        <div className="p-3.5 rounded-2xl bg-blue-500/20 text-blue-400">
          <Calendar className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">7-Day Summary</span>
          <div className="text-sm font-bold text-white flex items-center justify-between mt-1">
            <span>Logged: <strong className="text-blue-400 font-extrabold">{weeklyStats.daysLogged}/7 days</strong></span>
            {weeklyStats.weightDelta !== 0 && (
              <span className={`text-xs font-bold flex items-center gap-0.5 ${weeklyStats.weightDelta < 0 ? "text-green-400" : "text-amber-400"}`}>
                {weeklyStats.weightDelta < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                {Math.abs(weeklyStats.weightDelta)} kg
              </span>
            )}
            {weeklyStats.weightDelta === 0 && weeklyStats.latestWeight && (
              <span className="text-xs text-gray-400 flex items-center gap-0.5">
                <Minus className="w-3 h-3" /> Steady
              </span>
            )}
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-blue-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (weeklyStats.daysLogged / 7) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Daily Reminders Card */}
      <div className="bg-gradient-to-br from-teal-500/10 via-gray-900 to-gray-900 border border-teal-500/30 rounded-2xl p-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className={`p-3.5 rounded-2xl ${remindersEnabled ? "bg-teal-500/20 text-teal-400" : "bg-gray-800 text-gray-400"}`}>
            <Bell className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider block">Daily Reminders</span>
            <div className="text-sm font-bold text-white">
              {remindersEnabled ? "Reminders Active" : "Reminders Off"}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {remindersEnabled ? "We'll nudge you to stay on track." : "Get a daily reminder to log progress."}
            </p>
          </div>
        </div>
        <button
          onClick={toggleReminders}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            remindersEnabled
              ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
          }`}
        >
          {remindersEnabled ? "Turn Off" : "Enable"}
        </button>
      </div>
    </div>
  );
}
