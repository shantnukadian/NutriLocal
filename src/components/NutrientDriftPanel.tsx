import React, { useState } from 'react';
import { Plus, CheckCircle2, TrendingDown, TrendingUp, AlertTriangle, ShieldCheck, Pill } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'diary' | 'supplements'>('diagnosis');
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
    <div className="h-full flex flex-col space-y-3 overflow-hidden">
      {/* Top Header Strip with Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Nutrient Drift & Compensatory Intelligence
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Real-time intake tracking with 48h non-judgmental compensation.
          </p>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setActiveTab('diagnosis')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'diagnosis'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Drift & Diagnosis
          </button>
          <button
            onClick={() => setActiveTab('diary')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'diary'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Food Diary & Table
          </button>
          <button
            onClick={() => setActiveTab('supplements')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'supplements'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            14-Day Clinical Triggers
          </button>
        </div>
      </div>

      {/* Main Tabbed Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        <AnimatePresence mode="wait">
          {/* TAB 1: DRIFT DIAGNOSIS & METERS */}
          {activeTab === 'diagnosis' && (
            <motion.div
              key="diagnosis"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="space-y-3"
            >
              {/* 4 Compact Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                {/* Protein Drift */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span>Protein Drift</span>
                    <span className={`font-mono font-bold ${proteinGap < -10 ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                      {proteinGap > 0 ? `+${proteinGap}g` : `${proteinGap}g`}
                    </span>
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                    {drift?.avgDailyProt || 42}g <span className="text-[11px] text-slate-400 font-normal">/ {profile.targetProtein}g</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full ${proteinGap < -10 ? 'bg-amber-600 dark:bg-amber-500' : 'bg-emerald-600 dark:bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, Math.round(((drift?.avgDailyProt || 42) / profile.targetProtein) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Calorie Balance */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span>Calorie Balance</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {calorieGap > 0 ? `+${calorieGap} kcal` : `${calorieGap} kcal`}
                    </span>
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                    {drift?.avgDailyCal || 1780} <span className="text-[11px] text-slate-400 font-normal">/ {profile.targetCalories} kcal</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-slate-800 dark:bg-slate-300"
                      style={{ width: `${Math.min(100, Math.round(((drift?.avgDailyCal || 1780) / profile.targetCalories) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Carbs Ratio */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span>Carbs Load</span>
                    <span className={`font-mono font-bold ${carbGap > 20 ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {carbGap > 0 ? `+${carbGap}g` : `${carbGap}g`}
                    </span>
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                    {drift?.avgDailyCarbs || 265}g <span className="text-[11px] text-slate-400 font-normal">/ {profile.targetCarbs}g</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full ${carbGap > 25 ? 'bg-amber-500' : 'bg-slate-700 dark:bg-slate-400'}`}
                      style={{ width: `${Math.min(100, Math.round(((drift?.avgDailyCarbs || 265) / profile.targetCarbs) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Drift Severity */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span>Drift Severity</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {driftAnalysis?.status || 'Mild Drift'}
                    </span>
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    Score {flexibilityScale} / 10
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 truncate">
                    Compensating over 48h
                  </div>
                </div>
              </div>

              {/* Empathetic AI Feedback Callout */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide block">
                  Empathetic Clinical Intelligence
                </span>
                <p className="text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed font-medium">
                  {driftAnalysis?.interpretation || "Hostel lifestyle detected: You have a noticeable protein lag due to starchy mess rice and potato curries. At 65% flexibility, we will not ask you to skip mess meals. Instead, we weave in two low-cost, kettle-ready protein bridges like Sattu and boiled eggs."}
                </p>
              </div>

              {/* Compensatory Micro-Bridges */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2.5 shadow-xs">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide block">
                  Recommended Compensatory Micro-Bridges (48h Recovery):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {(driftAnalysis?.actionSteps || [
                    'Add a 3-minute Sattu drink (2 tbsp sattu + water + lemon) before evening study.',
                    'Boil 2 eggs in your electric kettle or request 2 boiled eggs from the canteen.'
                  ]).map((step, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-slate-900 dark:bg-emerald-600 text-white flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed text-xs">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: INTERACTIVE FOOD DIARY & TABLE */}
          {activeTab === 'diary' && (
            <motion.div
              key="diary"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="space-y-3"
            >
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 gap-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {weeklyLogs.map((log, index) => (
                      <button
                        key={log.dayName}
                        onClick={() => setSelectedDayIndex(index)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                          selectedDayIndex === index
                            ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {log.dayName.slice(0, 3)} ({log.meals.length})
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Log Dish / Meal
                  </button>
                </div>

                {/* Meals Table with Contained Internal Scroll */}
                <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-1">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold sticky top-0 bg-white dark:bg-slate-900">
                        <th className="py-2 pr-4">Type</th>
                        <th className="py-2 px-3">Dish Description</th>
                        <th className="py-2 px-3">Source</th>
                        <th className="py-2 px-3 text-right">Calories</th>
                        <th className="py-2 pl-3 text-right">Protein</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {activeDay.meals.map((meal) => (
                        <tr key={meal.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="py-2.5 pr-4 font-bold text-slate-900 dark:text-slate-100">
                            {meal.mealType}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-medium text-slate-800 dark:text-slate-200">{meal.dishName}</div>
                            {meal.notes && <div className="text-[10px] text-slate-400">{meal.notes}</div>}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-[10px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                              {meal.source}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-900 dark:text-slate-100">
                            {meal.calories} kcal
                          </td>
                          <td className="py-2.5 pl-3 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                            {meal.protein}g
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Day Totals Strip */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono tabular-nums">
                  <span className="text-slate-500 dark:text-slate-400">{activeDay.dayName} Totals:</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 dark:text-white">{activeDay.totals.calories} kcal</span>
                    <span>·</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">{activeDay.totals.protein}g P</span>
                    <span>·</span>
                    <span>{activeDay.totals.carbs}g C</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: 14-DAY CLINICAL DEFICIT TRIGGERS */}
          {activeTab === 'supplements' && (
            <motion.div
              key="supplements"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="space-y-3"
            >
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 text-xs font-bold uppercase tracking-wide">
                  <Pill className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>14-Day Chronic Deficit Detection Protocol</span>
                </div>
                <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
                  When intake data confirms a clinical deficit (such as bioavailable protein &lt;45g/day, B12, or Vitamin D) persisting longer than 14 consecutive days, NutriLocal automatically activates affordable generic Indian supplement triggers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {(driftAnalysis?.supplementRecommendations || [
                  {
                    id: 'sup-1',
                    nutrient: 'Bioavailable Protein Gap',
                    deficiencyDays: 16,
                    suggestedSupplement: 'Raw Unflavored Whey / Roasted Sattu Jar (1kg)',
                    dosage: '1 scoop (24g P) or 3 tbsp Sattu post-workout/evening',
                    estimatedCostINR: 199,
                    clinicalReason: 'Hostel mess dal is diluted; 16-day tracking shows average intake <45g protein, risking muscle catabolism and academic lethargy.',
                    affiliatePlatform: 'Blinkit' as const,
                  },
                  {
                    id: 'sup-2',
                    nutrient: 'Vitamin B12 & D3 Micro-Deficit',
                    deficiencyDays: 18,
                    suggestedSupplement: 'Vitamin D3 60,000 IU (Generic Capsule) + B12 Methylcobalamin',
                    dosage: '1 capsule weekly for 8 weeks',
                    estimatedCostINR: 85,
                    clinicalReason: 'High starchy mess diet with zero dairy/eggs for 18 days creates micro-nutrient fatigue.',
                    affiliatePlatform: '1mg' as const,
                  }
                ]).map((sup) => (
                  <div
                    key={sup.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        <span className="font-bold text-amber-700 dark:text-amber-400">{sup.nutrient}</span>
                        <span className="font-mono text-red-600 dark:text-red-400 font-bold">{sup.deficiencyDays} Days Deficit</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{sup.suggestedSupplement}</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{sup.clinicalReason}</p>
                      <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        Dosage: {sup.dosage} · Est. ₹{sup.estimatedCostINR}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-[10px] text-slate-400">Available on {sup.affiliatePlatform}</span>
                      <a
                        href={`https://${sup.affiliatePlatform.toLowerCase()}.com`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 rounded"
                      >
                        Find on {sup.affiliatePlatform} →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Meal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-5 space-y-3 shadow-xl"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Log Meal for {activeDay.dayName}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dish / Food Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mess Dal Rice + 1 Boiled Egg"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Late Snack">Late Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Source</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
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
                  <label className="block text-[10px] text-slate-500 mb-0.5">Calories</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full p-1.5 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">Protein (g)</label>
                  <input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(Number(e.target.value))}
                    className="w-full p-1.5 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 font-mono text-xs text-emerald-700 dark:text-emerald-400 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">Carbs (g)</label>
                  <input
                    type="number"
                    value={carbs}
                    onChange={(e) => setCarbs(Number(e.target.value))}
                    className="w-full p-1.5 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">Fat (g)</label>
                  <input
                    type="number"
                    value={fat}
                    onChange={(e) => setFat(Number(e.target.value))}
                    className="w-full p-1.5 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 rounded transition-colors cursor-pointer"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
