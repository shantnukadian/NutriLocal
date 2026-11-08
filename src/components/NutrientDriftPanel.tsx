import React, { useState } from 'react';
import { UserProfile, WeeklyLogDay, NutrientDriftAnalysis, FoodLogItem } from '../types';

interface NutrientDriftPanelProps {
  profile: UserProfile;
  weeklyLogs: WeeklyLogDay[];
  driftAnalysis: NutrientDriftAnalysis | null;
  onAddLogItem: (dayName: string, item: Omit<FoodLogItem, 'id'>) => void;
  flexibilityScale: number;
}

export const NutrientDriftPanel: React.FC<NutrientDriftPanelProps> = ({
  profile,
  weeklyLogs,
  driftAnalysis,
  onAddLogItem,
  flexibilityScale,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form state for adding an item to the log
  const [dishName, setDishName] = useState<string>('');
  const [mealType, setMealType] = useState<FoodLogItem['mealType']>('Lunch');
  const [source, setSource] = useState<FoodLogItem['source']>('University Mess');
  const [calories, setCalories] = useState<number>(450);
  const [protein, setProtein] = useState<number>(12);
  const [carbs, setCarbs] = useState<number>(65);
  const [fat, setFat] = useState<number>(14);

  const activeDay = weeklyLogs[selectedDayIndex] || weeklyLogs[0];

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) return;

    onAddLogItem(activeDay.dayName, {
      dishName,
      mealType,
      source,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat)
    });

    setDishName('');
    setShowAddModal(false);
  };

  const drift = driftAnalysis?.drift;
  const proteinGap = drift ? drift.proteinDrift : -28;
  const calorieGap = drift ? drift.calorieDrift : -180;
  const carbGap = drift ? drift.carbDrift : 45;

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Core Algorithm</span>
          <span aria-hidden="true">·</span>
          <span>Weekly Food Log Ingestion</span>
          <span aria-hidden="true">·</span>
          <span>Dynamic Nutrient Drift Calculation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Nutrient Drift & Compensatory Intelligence
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Instead of punishing users for eating starchy hostel mess food or festive family gravies, NutriLocal continuously calculates your <strong>Nutrient Drift</strong> against your target requirements and adjusts upcoming meal recommendations to bridge the gap gracefully.
        </p>
      </div>

      {/* 4-Card Visual Drift Status Meter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Protein Drift */}
        <div className="p-5 rounded-xl bg-white border border-slate-200">
          <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
            <span>Protein Drift</span>
            <span className={`font-mono font-bold ${proteinGap < -10 ? 'text-amber-700' : 'text-emerald-700'}`}>
              {proteinGap > 0 ? `+${proteinGap}g` : `${proteinGap}g`}
            </span>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
            {drift?.avgDailyProt || 42}g <span className="text-xs text-slate-400 font-normal">/ {profile.targetProtein}g</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className={`h-full ${proteinGap < -10 ? 'bg-amber-600' : 'bg-emerald-600'}`}
              style={{ width: `${Math.min(100, Math.round(((drift?.avgDailyProt || 42) / profile.targetProtein) * 100))}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {profile.role === 'hostel_student' ? 'Lagging due to watery mess dal' : 'Needs mild family staple boost'}
          </p>
        </div>

        {/* Caloric Drift */}
        <div className="p-5 rounded-xl bg-white border border-slate-200">
          <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
            <span>Calorie Balance</span>
            <span className="font-mono font-bold text-slate-700">
              {calorieGap > 0 ? `+${calorieGap} kcal` : `${calorieGap} kcal`}
            </span>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
            {drift?.avgDailyCal || 1780} <span className="text-xs text-slate-400 font-normal">/ {profile.targetCalories} kcal</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-slate-800"
              style={{ width: `${Math.min(100, Math.round(((drift?.avgDailyCal || 1780) / profile.targetCalories) * 100))}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Average across logged weekly days
          </p>
        </div>

        {/* Carbohydrate Load */}
        <div className="p-5 rounded-xl bg-white border border-slate-200">
          <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
            <span>Carbohydrate Ratio</span>
            <span className={`font-mono font-bold ${carbGap > 20 ? 'text-amber-700' : 'text-slate-700'}`}>
              {carbGap > 0 ? `+${carbGap}g` : `${carbGap}g`}
            </span>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
            {drift?.avgDailyCarbs || 265}g <span className="text-xs text-slate-400 font-normal">/ {profile.targetCarbs}g</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className={`h-full ${carbGap > 25 ? 'bg-amber-500' : 'bg-slate-700'}`}
              style={{ width: `${Math.min(100, Math.round(((drift?.avgDailyCarbs || 265) / profile.targetCarbs) * 100))}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Refined rice & canteen fried snacks
          </p>
        </div>

        {/* Flexibility Adherence Status */}
        <div className="p-5 rounded-xl bg-white border border-slate-200">
          <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
            <span>Drift Severity</span>
            <span className="font-bold text-emerald-700">
              {driftAnalysis?.status || 'Mild Drift'}
            </span>
          </div>
          <div className="text-xl font-bold text-slate-900">
            {flexibilityScale}% Scale Active
          </div>
          <div className="mt-3 text-[11px] text-slate-600 leading-normal">
            Compensating over 48h using zero-cook staples. Zero strict restrictions applied.
          </div>
        </div>
      </div>

      {/* Empathetic AI Interpretation & Compensatory Bridges */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Empathetic Clinical Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Non-Judgmental Feedback</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Current Nutrient Diagnosis & Drift Analysis
          </h2>
        </div>

        <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200">
          <p className="text-sm text-emerald-950 font-medium leading-relaxed">
            {driftAnalysis?.interpretation || "Hostel lifestyle detected: You have a noticeable protein lag due to starchy mess rice and potato curries. At 65% flexibility, we will not ask you to skip mess meals. Instead, we weave in two low-cost, kettle-ready protein bridges like Sattu and boiled eggs."}
          </p>
        </div>

        {/* Action Steps */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Recommended Compensatory Micro-Bridges
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(driftAnalysis?.actionSteps || [
              'Add a 3-minute Sattu buttermilk (2 tbsp sattu + water + lemon) before evening study.',
              'Boil 2 eggs in your electric kettle or request 2 boiled eggs from the canteen.'
            ]).map((step, idx) => (
              <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-slate-800 leading-relaxed font-medium">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Food Log Interactive View */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Weekly Meal Food Diary ({activeDay.dayName})
            </h2>
            <p className="text-xs text-slate-500">
              Review logged meals or log a new dish to see real-time drift recalculation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              + Log Food / Mess Meal
            </button>
          </div>
        </div>

        {/* Day Buttons */}
        <div className="flex flex-wrap gap-2">
          {weeklyLogs.map((log, index) => (
            <button
              key={log.dayName}
              onClick={() => setSelectedDayIndex(index)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedDayIndex === index
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {log.dayName} ({log.meals.length} Meals)
            </button>
          ))}
        </div>

        {/* Meals Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2.5 pr-4">Meal Type</th>
                <th className="py-2.5 px-4">Dish Description</th>
                <th className="py-2.5 px-4">Source</th>
                <th className="py-2.5 px-4 text-right">Calories</th>
                <th className="py-2.5 px-4 text-right">Protein</th>
                <th className="py-2.5 pl-4 text-right">Carbs / Fat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {activeDay.meals.map((meal) => (
                <tr key={meal.id}>
                  <td className="py-3 pr-4 font-bold text-slate-900">
                    {meal.mealType}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800">{meal.dishName}</div>
                    {meal.notes && <div className="text-[11px] text-slate-400">{meal.notes}</div>}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {meal.source}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">
                    {meal.calories} kcal
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 tabular-nums">
                    {meal.protein}g
                  </td>
                  <td className="py-3 pl-4 text-right font-mono text-slate-500 tabular-nums">
                    {meal.carbs}g / {meal.fat}g
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Day Totals Strip */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <span className="font-bold text-slate-700">
            {activeDay.dayName} Cumulative Totals:
          </span>
          <div className="flex items-center gap-4 font-mono tabular-nums">
            <span><strong>{activeDay.totals.calories}</strong> kcal</span>
            <span>·</span>
            <span className="text-emerald-700 font-bold"><strong>{activeDay.totals.protein}g</strong> Protein</span>
            <span>·</span>
            <span><strong>{activeDay.totals.carbs}g</strong> Carbs</span>
            <span>·</span>
            <span><strong>{activeDay.totals.fat}g</strong> Fat</span>
          </div>
        </div>
      </div>

      {/* Add Meal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Log Meal for {activeDay.dayName}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Dish / Food Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mess Dal Rice + 1 Boiled Egg"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded bg-slate-50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Meal Category
                  </label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded bg-slate-50 text-slate-900"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Late Snack">Late Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Food Source
                  </label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded bg-slate-50 text-slate-900"
                  >
                    <option value="University Mess">University Mess</option>
                    <option value="Home Cooked">Home Cooked</option>
                    <option value="Canteen / Street">Canteen / Street</option>
                    <option value="Packaged / Snack">Packaged / Snack</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Calories</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded bg-slate-50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded bg-slate-50 font-mono text-emerald-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={carbs}
                    onChange={(e) => setCarbs(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded bg-slate-50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Fat (g)</label>
                  <input
                    type="number"
                    value={fat}
                    onChange={(e) => setFat(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded bg-slate-50 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                >
                  Save & Update Drift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
