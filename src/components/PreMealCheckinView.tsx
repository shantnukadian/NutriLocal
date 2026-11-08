import React, { useState } from 'react';
import { ShoppingBag, Utensils, AlertCircle, CheckCircle2, Lock, Unlock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, WeeklyLogDay, FoodLogItem } from '../types';

interface PreMealCheckinViewProps {
  profile: UserProfile;
  weeklyLogs: WeeklyLogDay[];
  onLogMeal: (dayName: string, item: Omit<FoodLogItem, 'id'>) => void;
  flexibilityScale: number;
}

export const PreMealCheckinView: React.FC<PreMealCheckinViewProps> = ({
  profile,
  weeklyLogs,
  onLogMeal,
  flexibilityScale,
}) => {
  const [targetMealType, setTargetMealType] = useState<'Lunch' | 'Dinner' | 'Late Snack'>('Dinner');
  const [quickDishInput, setQuickDishInput] = useState<string>('');
  const [quickCalories, setQuickCalories] = useState<number>(550);
  const [quickProtein, setQuickProtein] = useState<number>(14);
  const [activeTab, setActiveTab] = useState<'decision' | 'context'>('decision');

  // Check today's logged meals (Monday or first log)
  const todayLog = weeklyLogs[0] || { meals: [], dayName: 'Monday', totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } };
  const loggedMealTypes = todayLog.meals.map(m => m.mealType);

  const unloggedPriorMeals: string[] = [];
  if (targetMealType === 'Lunch' && !loggedMealTypes.includes('Breakfast')) {
    unloggedPriorMeals.push('Breakfast');
  }
  if (targetMealType === 'Dinner') {
    if (!loggedMealTypes.includes('Breakfast')) unloggedPriorMeals.push('Breakfast');
    if (!loggedMealTypes.includes('Lunch')) unloggedPriorMeals.push('Lunch');
  }
  if (targetMealType === 'Late Snack' && !loggedMealTypes.includes('Dinner')) {
    unloggedPriorMeals.push('Dinner');
  }

  const isLocked = unloggedPriorMeals.length > 0;

  const handleQuickLogPriorMeal = (mealName: string) => {
    onLogMeal(todayLog.dayName, {
      mealType: unloggedPriorMeals[0] as any,
      dishName: mealName || `${profile.role === 'hostel_student' ? 'Mess' : 'Home'} ${unloggedPriorMeals[0]}`,
      source: profile.role === 'hostel_student' ? 'University Mess' : 'Home Cooked',
      calories: quickCalories,
      protein: quickProtein,
      carbs: 75,
      fat: 16
    });
    setQuickDishInput('');
  };

  const isStudent = profile.role === 'hostel_student';
  const proteinLoggedSoFar = todayLog.totals.protein;
  const proteinGap = Math.max(0, profile.targetProtein - proteinLoggedSoFar);

  return (
    <div className="h-full flex flex-col space-y-3 overflow-hidden">
      {/* Top Control Bar with Sub-tabs & Meal Targets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800 shrink-0">
        {/* Meal Selection Tabs */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden sm:inline mr-1">
            Planning:
          </span>
          {(['Lunch', 'Dinner', 'Late Snack'] as const).map(type => {
            const isSelected = targetMealType === type;
            return (
              <button
                key={type}
                onClick={() => setTargetMealType(type)}
                className={`relative px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  isSelected
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activePreMealTab"
                    className="absolute inset-0 bg-slate-900 dark:bg-emerald-600 rounded-md shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span>{type}</span>
              </button>
            );
          })}
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setActiveTab('decision')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'decision'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Decision Engine
          </button>
          <button
            onClick={() => setActiveTab('context')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'context'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Today's Intake ({todayLog.meals.length} Logged)
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        <AnimatePresence mode="wait">
          {activeTab === 'decision' ? (
            <motion.div
              key="decision-view"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="space-y-3"
            >
              {isLocked ? (
                /* LOCKED STATE */
                <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 rounded-xl p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h2 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                        Pre-Meal Check-in Required: Log your {unloggedPriorMeals.join(' & ')}
                      </h2>
                      <p className="text-xs text-amber-900/90 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                        To calculate exact nutrient compensation without over-fueling, confirm what you ate earlier today.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-amber-200 dark:border-amber-900/60 space-y-3">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">
                      1-Tap Quick Presets for {unloggedPriorMeals[0]}:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <button
                        onClick={() => handleQuickLogPriorMeal(isStudent ? 'Mess Dal, White Rice & Sabzi' : 'Tuvar Dal, 2 Phulkas & Sabzi')}
                        className="p-3 text-left border border-slate-200 dark:border-slate-700/80 rounded-lg hover:border-slate-900 dark:hover:border-emerald-500 transition-colors text-xs bg-slate-50 dark:bg-slate-800/80 cursor-pointer"
                      >
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {isStudent ? 'Standard Mess Thali' : 'Standard Home Dal-Roti'}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">~550 kcal · ~14g Protein</div>
                      </button>

                      <button
                        onClick={() => handleQuickLogPriorMeal(isStudent ? 'Canteen Samosa & Chai' : 'Aloo Paratha & Chai')}
                        className="p-3 text-left border border-slate-200 dark:border-slate-700/80 rounded-lg hover:border-slate-900 dark:hover:border-emerald-500 transition-colors text-xs bg-slate-50 dark:bg-slate-800/80 cursor-pointer"
                      >
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {isStudent ? 'Canteen Samosa & Tea' : 'Stuffed Paratha & Tea'}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">~420 kcal · ~6g Protein</div>
                      </button>

                      <button
                        onClick={() => handleQuickLogPriorMeal('Skipped Meal / Only Black Tea')}
                        className="p-3 text-left border border-slate-200 dark:border-slate-700/80 rounded-lg hover:border-slate-900 dark:hover:border-emerald-500 transition-colors text-xs bg-slate-50 dark:bg-slate-800/80 cursor-pointer"
                      >
                        <div className="font-bold text-slate-900 dark:text-slate-100">Skipped Meal</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">0 kcal · 0g Protein</div>
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                      <input
                        type="text"
                        placeholder={`Or type custom ${unloggedPriorMeals[0]} dish...`}
                        value={quickDishInput}
                        onChange={(e) => setQuickDishInput(e.target.value)}
                        className="flex-1 p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      />
                      <button
                        onClick={() => handleQuickLogPriorMeal(quickDishInput)}
                        disabled={!quickDishInput.trim()}
                        className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 disabled:opacity-50 rounded-lg cursor-pointer whitespace-nowrap"
                      >
                        Log & Unlock →
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* UNLOCKED STATE */
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>
                        <strong>Intake Grounded:</strong> Prior meals logged ({todayLog.totals.calories} kcal, {todayLog.totals.protein}g protein). Remaining target gap: <strong className="font-mono text-emerald-700 dark:text-emerald-400">{proteinGap}g Protein</strong>.
                      </span>
                    </div>
                    <span className="font-mono text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      Compensated
                    </span>
                  </div>

                  {/* Dual Market Triangulation Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Option A: Quick Commerce Raw Ingredients */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between space-y-3 shadow-xs">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide flex items-center gap-1.5 text-[11px]">
                            <ShoppingBag className="w-3.5 h-3.5" /> Option A · Quick Commerce (10 min)
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                            Est. ₹{isStudent ? '24' : '65'}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                          {isStudent ? 'Kettle-Boiled 2 Eggs & Spiced Dahi Toast' : 'Fresh Paneer-Palak Bhurji with Phulkas'}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                          {isStudent 
                            ? 'Boil 2 eggs in your kettle (8 mins) and slice over bread with chilled curd. Delivers 22g clean protein to eliminate today’s drift.'
                            : 'Wholesome one-kadai high-protein dish using fresh dairy paneer and tender winter spinach.'}
                        </p>

                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 rounded-lg text-[11px] space-y-1">
                          <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Ingredients (Blinkit / Zepto):</span>
                          <div className="flex flex-wrap gap-1 text-slate-700 dark:text-slate-300">
                            <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">Eggs 6-pack (₹45)</span>
                            <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">Dahi Pouch (₹18)</span>
                            <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">Bread / Roti</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">10 min via Blinkit</span>
                        <a
                          href="https://blinkit.com"
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 rounded-lg transition-colors"
                        >
                          Order on Blinkit →
                        </a>
                      </div>
                    </div>

                    {/* Option B: Regional Restaurant / Canteen Dish */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between space-y-3 shadow-xs">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide flex items-center gap-1.5 text-[11px]">
                            <Utensils className="w-3.5 h-3.5" /> Option B · Regional Dining
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                            Est. ₹{isStudent ? '45' : '135'}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                          {isStudent ? 'Canteen Double Egg Bhurji & 2 Rotis' : 'Local Dhaba Dal Tadka & Tandoori Rotis'}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                          {isStudent
                            ? 'Pick up or order from campus canteen. Zero cooking or dishwashing required in your room.'
                            : 'Order from verified local dhaba with low-oil instruction for family dinner.'}
                        </p>

                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 rounded-lg text-[11px] space-y-1">
                          <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Regional Spot:</span>
                          <div className="text-slate-800 dark:text-slate-200 font-medium">
                            {isStudent ? 'Campus Canteen / University Gate Dhaba' : 'Local Verified Dhaba on Swiggy'}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">15-20 min via Swiggy</span>
                        <a
                          href="https://swiggy.com"
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 rounded-lg transition-colors"
                        >
                          Order on Swiggy →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            /* CONTEXT TAB */
            <motion.div
              key="context-view"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="space-y-3"
            >
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">Today's Food Entries ({todayLog.dayName})</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">{todayLog.totals.protein}g Protein logged</span>
                </div>

                <div className="space-y-2">
                  {todayLog.meals.map((meal) => (
                    <div
                      key={meal.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{meal.mealType}: </span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{meal.dishName}</span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-2">({meal.source})</span>
                      </div>
                      <div className="font-mono tabular-nums text-slate-600 dark:text-slate-400">
                        <strong>{meal.calories} kcal</strong> · <strong className="text-emerald-700 dark:text-emerald-400">{meal.protein}g P</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
