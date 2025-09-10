// src/components/ProgressChart.jsx
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
} from "recharts";

export default function ProgressChart({ data = [] }) {
  const hasData = data && data.length > 0;

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl text-green-500 font-bold mb-6">Progress Charts</h2>

      {!hasData ? (
        <p className="text-gray-400 text-center italic">
          No progress data yet. Start logging your results!
        </p>
      ) : (
        <>
          {/* Weight Over Time */}
          <div className="mb-10">
            <h3 className="text-green-400 mb-3">Weight Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
                  labelStyle={{ color: "#00ff7f" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#00ff7f"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Calories Intake vs Burned */}
          <div>
            <h3 className="text-green-400 mb-3">Calories Intake vs Burned</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
                  labelStyle={{ color: "#00ff7f" }}
                />
                <Legend />
                <Bar dataKey="caloriesIn" fill="#00ff7f" radius={[6, 6, 0, 0]} />
                <Bar dataKey="caloriesOut" fill="#ff4d4d" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
