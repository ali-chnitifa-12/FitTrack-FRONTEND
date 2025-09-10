import { useState } from "react";

export default function ProgressForm({ addEntry }) {
  const [caloriesIn, setCaloriesIn] = useState("");
  const [caloriesOut, setCaloriesOut] = useState("");
  const [weight, setWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!caloriesIn || !caloriesOut || !weight || !targetWeight) return;

    addEntry({
      date: new Date().toLocaleDateString(),
      caloriesIn: Number(caloriesIn),
      caloriesOut: Number(caloriesOut),
      weight: Number(weight),
      targetWeight: Number(targetWeight),
    });

    setCaloriesIn("");
    setCaloriesOut("");
    setWeight("");
    setTargetWeight("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-2xl shadow-lg space-y-4">
      <h2 className="text-2xl text-green-500 font-bold">Add Daily Entry</h2>

      <input
        type="number"
        placeholder="Calories Consumed"
        value={caloriesIn}
        onChange={(e) => setCaloriesIn(e.target.value)}
        className="w-full p-3 rounded-lg bg-gray-800 text-gray-200"
      />

      <input
        type="number"
        placeholder="Calories Burned"
        value={caloriesOut}
        onChange={(e) => setCaloriesOut(e.target.value)}
        className="w-full p-3 rounded-lg bg-gray-800 text-gray-200"
      />

      <input
        type="number"
        placeholder="Current Weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className="w-full p-3 rounded-lg bg-gray-800 text-gray-200"
      />

      <input
        type="number"
        placeholder="Target Weight (kg)"
        value={targetWeight}
        onChange={(e) => setTargetWeight(e.target.value)}
        className="w-full p-3 rounded-lg bg-gray-800 text-gray-200"
      />

      <button
        type="submit"
        className="px-5 py-2 bg-green-500 hover:bg-green-600 text-black rounded-lg font-semibold transition duration-200"
      >
        Add Entry
      </button>
    </form>
  );
}
