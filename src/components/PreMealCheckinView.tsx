import React, { useState } from 'react';
import { UserProfile, WeeklyLogDay, AdaptiveMealDetails, FoodLogItem } from '../types';

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

  // Dynamic next meal recommendation once check-in passes
  const proteinLoggedSoFar = todayLog.totals.protein;
  const proteinGap = Math.max(0, profile.targetProtein - proteinLoggedSoFar);

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Mandatory Pre-Meal Check-In Engine</span>
          <span aria-hidden="true">·</span>
          <span>Dual Market Triangulation</span>
          <span aria-hidden="true">·</span>
          <span>Intake-Grounded Decision</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          What Should I Eat Next?
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
          In strict accordance with the system blueprint, the engine mandates a <strong>pre-meal intake check-in</strong> before answering. Recommendations are calculated from your real-time nutrient drift and triangulated between raw grocery delivery and regional food delivery.
        </p>
      </div>

      {/* Meal Selection Bar */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
          I am planning for:
        </span>
        {(['Lunch', 'Dinner', 'Late Snack'] as const).map(type => (
          <button
            key={type}
            onClick={() => setTargetMealType(type)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              targetMealType === type
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Conditional Branch 1: LOCKED due to unlogged prior meals */}
      {isLocked ? (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <span className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shrink-0">
              !
            </span>
            <div>
              <h2 className="text-base font-bold text-amber-950">
                Pre-Meal Check-in Required: Log your {unloggedPriorMeals.join(' and ')} first
              </h2>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed max-w-2xl">
                To prevent nutrient drift and ensure you don’t over-compensate or under-fuel, the AI must know what you actually ate earlier today.
              </p>
            </div>
          </div>

          {/* Quick-log 1-tap options */}
          <div className="bg-white p-5 rounded-lg border border-amber-200 space-y-4">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
              1-Tap Quick Log for {unloggedPriorMeals[0]}:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleQuickLogPriorMeal(isStudent ? 'Mess Dal, White Rice & Sabzi' : 'Tuvar Dal, 2 Phulkas & Sabzi')}
                className="p-3 text-left border border-slate-200 rounded-lg hover:border-slate-900 transition-colors text-xs bg-slate-50 cursor-pointer"
              >
                <div className="font-bold text-slate-900">
                  {isStudent ? 'Standard Mess Plate' : 'Standard Home Dal-Roti'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">~550 kcal · ~14g Protein</div>
              </button>

              <button
                onClick={() => handleQuickLogPriorMeal(isStudent ? 'Canteen Samosa & Chai' : 'Aloo Paratha & Chai')}
                className="p-3 text-left border border-slate-200 rounded-lg hover:border-slate-900 transition-colors text-xs bg-slate-50 cursor-pointer"
              >
                <div className="font-bold text-slate-900">
                  {isStudent ? 'Canteen Samosa & Tea' : 'Stuffed Paratha & Tea'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">~420 kcal · ~6g Protein</div>
              </button>

              <button
                onClick={() => handleQuickLogPriorMeal('Skipped Meal / Only Black Tea')}
                className="p-3 text-left border border-slate-200 rounded-lg hover:border-slate-900 transition-colors text-xs bg-slate-50 cursor-pointer"
              >
                <div className="font-bold text-slate-900">Skipped Meal</div>
                <div className="text-[11px] text-slate-500 mt-1">0 kcal · 0g Protein</div>
              </button>
            </div>

            {/* Custom Log input */}
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder={`Or type custom ${unloggedPriorMeals[0]} dish...`}
                value={quickDishInput}
                onChange={(e) => setQuickDishInput(e.target.value)}
                className="flex-1 p-2 text-xs border border-slate-200 rounded bg-slate-50"
              />
              <button
                onClick={() => handleQuickLogPriorMeal(quickDishInput)}
                disabled={!quickDishInput.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded cursor-pointer whitespace-nowrap"
              >
                Log & Unlock Next Meal
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Conditional Branch 2: UNLOCKED — Recommendations with Dual Market Triangulation */
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="text-xs text-emerald-950">
              <span className="font-bold">Prior Meals Logged:</span> Today you have consumed <strong>{todayLog.totals.calories} kcal</strong> and <strong>{todayLog.totals.protein}g protein</strong>. Remaining protein deficit: <span className="font-mono font-bold text-emerald-700">{proteinGap}g</span>.
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wide bg-white px-2.5 py-1 rounded border border-emerald-200">
              Drift Compensated
            </span>
          </div>

          {/* Dual Market Triangulation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option A: Quick Commerce Raw Ingredients (Cook in Room / Home) */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-blue-700 uppercase tracking-wide">
                    Option A · Raw Ingredients (10-min Delivery)
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900">
                    Est. ₹{isStudent ? '24' : '65'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {isStudent ? 'Kettle-Boiled 2 Eggs & Spiced Dahi Toast' : 'Fresh Paneer-Palak Bhurji with Phulkas'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {isStudent 
                    ? 'Boil 2 eggs in your electric kettle (8 mins) and slice over bread with chilled curd. Delivers 22g clean protein to eliminate today’s drift.'
                    : 'Wholesome one-kadai high-protein dish using fresh dairy paneer and tender winter spinach.'}
                </p>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded text-xs space-y-1">
                  <span className="text-slate-400 block text-[11px]">Ingredients Needed (Quick Commerce):</span>
                  <div className="flex flex-wrap gap-1 text-[11px] text-slate-700">
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Eggs 6-pack (₹45)</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Dahi Pouch (₹18)</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Bread / Roti</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">10 min delivery via Blinkit / Zepto</span>
                <a
                  href="https://blinkit.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
                >
                  Order on Blinkit →
                </a>
              </div>
            </div>

            {/* Option B: Regional Restaurant / Canteen Dish (Ready to Eat) */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-amber-700 uppercase tracking-wide">
                    Option B · Regional Restaurant / Canteen Delivery
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900">
                    Est. ₹{isStudent ? '45' : '135'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {isStudent ? 'Canteen Double Egg Bhurji & 2 Rotis' : 'Local Dhaba Dal Tadka & Tandoori Rotis'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {isStudent
                    ? 'Pick up or order from campus canteen. Zero cooking or dishwashing required in your room.'
                    : 'Order from verified local dhaba with low-oil instruction for family dinner.'}
                </p>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded text-xs space-y-1">
                  <span className="text-slate-400 block text-[11px]">Regional Spot / Source:</span>
                  <div className="text-[11px] text-slate-800 font-medium">
                    {isStudent ? 'Campus Canteen / University Gate Dhaba' : 'Local Verified Dhaba on Swiggy'}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">15-20 min via Swiggy / Zomato</span>
                <a
                  href="https://swiggy.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors cursor-pointer"
                >
                  Order on Swiggy →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
