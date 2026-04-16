import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Minus, Target, Activity } from "lucide-react";

const tabs = ["Weight", "Calories", "Mood & Energy"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-green-500/30 rounded-xl p-3 shadow-xl text-sm">
        <p className="text-green-400 font-semibold mb-1">{label}</p>
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

  // Derived stats
  const latest = hasData ? data[data.length - 1] : null;
  const first = hasData ? data[0] : null;
  const weightChange = latest && first ? (latest.weight - first.weight).toFixed(1) : null;
  const weightToGo = latest ? (latest.weight - latest.targetWeight).toFixed(1) : null;

  // Goal progress %
  const goalProgress =
    latest && first
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round(
              ((first.weight - latest.weight) / (first.weight - latest.targetWeight)) * 100
            )
          )
        )
      : 0;

  // BMI
  const bmi = latest
    ? null // height not tracked yet — placeholder
    : null;

  const WeightIcon =
    weightChange === null ? Minus : Number(weightChange) < 0 ? TrendingDown : TrendingUp;
  const weightColor = Number(weightChange) < 0 ? "text-green-400" : "text-red-400";

  return (
    <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-green-500/20 space-y-5">
      <h2 className="text-2xl text-green-400 font-bold flex items-center gap-2">
        <Activity size={22} />
        Progress Insights
      </h2>

      {/* Stat Cards */}
      {hasData && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700/50 text-center">
            <p className="text-xs text-gray-400 mb-1">Weight Change</p>
            <p className={`text-xl font-bold ${weightColor} flex items-center justify-center gap-1`}>
              <WeightIcon size={16} />
              {weightChange !== null ? `${weightChange} kg` : "—"}
            </p>
          </div>
          <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700/50 text-center">
            <p className="text-xs text-gray-400 mb-1">To Target</p>
            <p className="text-xl font-bold text-yellow-400 flex items-center justify-center gap-1">
              <Target size={16} />
              {weightToGo !== null ? `${weightToGo} kg` : "—"}
            </p>
          </div>
          <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700/50 text-center">
            <p className="text-xs text-gray-400 mb-1">Entries</p>
            <p className="text-xl font-bold text-cyan-400">{data.length}</p>
          </div>
        </div>
      )}

      {/* Goal Progress Bar */}
      {hasData && latest?.targetWeight && (
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Goal Progress</span>
            <span className="text-green-400 font-semibold">{goalProgress}%</span>
          </div>
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-teal-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${goalProgress}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Start: {first?.weight} kg</span>
            <span>Target: {latest?.targetWeight} kg</span>
          </div>
        </div>
      )}

      {!hasData ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-4xl mb-3">📊</p>
          <p className="text-gray-400 italic">No progress data yet.</p>
          <p className="text-gray-500 text-sm mt-1">Log your first entry to see charts!</p>
        </div>
      ) : (
        <>
          {/* Chart Tabs */}
          <div className="flex gap-2 bg-gray-800/50 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-green-500 text-black shadow-lg"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Weight Chart */}
          {activeTab === "Weight" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine
                    y={latest?.targetWeight}
                    stroke="#facc15"
                    strokeDasharray="6 3"
                    label={{ value: "Target", fill: "#facc15", fontSize: 11 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#4ade80"
                    strokeWidth={3}
                    fill="url(#weightGrad)"
                    dot={{ r: 4, fill: "#4ade80" }}
                    activeDot={{ r: 7 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Calories Chart */}
          {activeTab === "Calories" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar dataKey="caloriesIn" name="Consumed" fill="#4ade80" radius={[5, 5, 0, 0]} />
                  <Bar dataKey="caloriesOut" name="Burned" fill="#f87171" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Mood & Energy Chart */}
          {activeTab === "Mood & Energy" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 5]} stroke="#6b7280" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    name="Mood"
                    stroke="#f472b6"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="energy"
                    name="Energy"
                    stroke="#facc15"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500 text-center mt-2">Scale: 1 (Low) → 5 (High)</p>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
