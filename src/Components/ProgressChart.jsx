import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, AreaChart, Area, ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Minus, Target } from "lucide-react";

const tabs = ["Weight", "Calories", "Mood & Energy"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl p-3 shadow-xl text-sm" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-normal)" }}>
        <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ProgressChart({ data = [] }) {
  const [activeTab, setActiveTab] = useState("Weight");
  const hasData = data && data.length > 0;

  const latest = hasData ? data[data.length - 1] : null;
  const first = hasData ? data[0] : null;
  const weightChange = latest && first ? (latest.weight - first.weight).toFixed(1) : null;
  const weightToGo = latest ? (latest.weight - latest.targetWeight).toFixed(1) : null;

  const goalProgress = latest && first
    ? Math.max(0, Math.min(100, Math.round(((first.weight - latest.weight) / (first.weight - latest.targetWeight)) * 100)))
    : 0;

  const WeightIcon = weightChange === null ? Minus : Number(weightChange) < 0 ? TrendingDown : TrendingUp;
  const weightColor = Number(weightChange) < 0 ? "var(--success)" : "var(--error)";

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      {hasData && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl p-3 text-center" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>Change</p>
            <p className="text-xl font-bold flex items-center justify-center gap-1" style={{ color: weightColor }}>
              <WeightIcon size={16} />
              {weightChange !== null ? `${weightChange} kg` : "—"}
            </p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>To Target</p>
            <p className="text-xl font-bold flex items-center justify-center gap-1" style={{ color: "var(--accent-secondary)" }}>
              <Target size={16} />
              {weightToGo !== null ? `${weightToGo} kg` : "—"}
            </p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>Entries</p>
            <p className="text-xl font-bold" style={{ color: "var(--accent-primary)" }}>{data.length}</p>
          </div>
        </div>
      )}

      {/* Goal Progress Bar */}
      {hasData && latest?.targetWeight && (
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            <span>Goal Progress</span>
            <span style={{ color: "var(--accent-primary)" }}>{goalProgress}%</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, var(--accent-secondary), var(--accent-primary))" }}
              initial={{ width: 0 }}
              animate={{ width: `${goalProgress}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {!hasData ? (
        <div className="text-center py-8">
          <p className="text-4xl mb-3 opacity-50">📊</p>
          <p className="italic" style={{ color: "var(--text-muted)" }}>No progress data yet.</p>
        </div>
      ) : (
        <>
          {/* Chart Tabs */}
          <div className="flex gap-2 p-1 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200"
                style={{
                  background: activeTab === tab ? "var(--accent-primary)" : "transparent",
                  color: activeTab === tab ? "#fff" : "var(--text-muted)"
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="pt-2">
            {activeTab === "Weight" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#39ff14" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#39ff14" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                    <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={latest?.targetWeight} stroke="var(--accent-secondary)" strokeDasharray="6 3" />
                    <Area type="monotone" dataKey="weight" stroke="#39ff14" strokeWidth={3} fill="url(#weightGrad)" dot={{ r: 4, fill: "#39ff14" }} activeDot={{ r: 7 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {activeTab === "Calories" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                    <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "bold" }} />
                    <Bar dataKey="caloriesIn" name="Consumed" fill="#39ff14" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="caloriesOut" name="Burned" fill="#00ff88" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {activeTab === "Mood & Energy" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                    <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 5]} stroke="var(--text-muted)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "bold" }} />
                    <Line type="monotone" dataKey="mood" name="Mood" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="energy" name="Energy" stroke="#00ff88" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
