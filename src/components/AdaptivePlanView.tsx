import React, { useState } from 'react';
import { ShoppingBag, Utensils, Check, ArrowRight } from 'lucide-react';
import { UserProfile, AdaptiveMealPlan, FoodLogItem } from '../types';

interface AdaptivePlanViewProps {
  profile: UserProfile;
  plan: AdaptiveMealPlan;
  onLogMeal: (dayName: string, item: Omit<FoodLogItem, 'id'>) => void;
  flexibilityScale: number;
}

export const AdaptivePlanView: React.FC<AdaptivePlanViewProps> = ({
  profile,
  plan,
  onLogMeal,
  flexibilityScale,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [loggedAlert, setLoggedAlert] = useState<string>('');

  const activeDay = plan.days[selectedDayIndex] || plan.days[0];

  const handleQuickLogFromPlan = (mealType: FoodLogItem['mealType'], name: string, cal: number, prot: number) => {
    onLogMeal(activeDay.dayName, {
      mealType,
      dishName: name,
      source: profile.role === 'hostel_student' ? 'University Mess' : 'Home Cooked',
      calories: cal,
      protein: prot,
      carbs: Math.round(cal * 0.12),
      fat: Math.round(cal * 0.03)
    });

    setLoggedAlert(`Logged "${name}" as eaten!`);
    setTimeout(() => setLoggedAlert(''), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Adaptive Nutrition Engine</span>
            <span aria-hidden="true">·</span>
            <span>Local Market Ingredients</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">Flexibility Score {flexibilityScale}/10</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Hyper-Localized Adaptive Weekly Plan
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            {plan.planOverview}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-right shrink-0 shadow-xs">
          <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Est. Weekly Grocery Cost</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            ₹{plan.weeklyBudgetEstimateINR}
          </span>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block font-medium">Affordable local staples</span>
        </div>
      </div>

      {/* Zero Subscription / Zero Ads Transparency Notice */}
      <div className="p-3.5 bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-700 dark:text-slate-300 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 dark:text-white">Zero Subscription & Zero Ads:</span>
          <span>100% free for students & families. Supported via quick commerce & dining affiliate links.</span>
        </div>
        <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200 text-[11px]">
          <span>Quick Commerce: Blinkit · Zepto · Instamart</span>
          <span>·</span>
          <span>Dining: Swiggy · Zomato</span>
        </div>
      </div>

      {/* Logged feedback toast */}
      {loggedAlert && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> {loggedAlert}</span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Nutrient drift automatically recalculated</span>
        </div>
      )}

      {/* Day Selector Buttons */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {plan.days.map((day, idx) => (
          <button
            key={day.dayName}
            onClick={() => setSelectedDayIndex(idx)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              selectedDayIndex === idx
                ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 dark:hover:text-slate-100'
            }`}
          >
            {day.dayName}
          </button>
        ))}
      </div>

      {/* Day Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Breakfast */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Breakfast</span>
              <span className="font-mono text-slate-500 dark:text-slate-400">{activeDay.breakfast.prepTime}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {activeDay.breakfast.name}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              {activeDay.breakfast.description}
            </p>

            <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 p-2.5 rounded-lg mb-3">
              <strong>Practicality:</strong> {activeDay.breakfast.practicalityTip}
            </div>

            {/* Dual Market Triangulation Details */}
            {activeDay.breakfast.dualMarket && (
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 space-y-2 text-xs">
                <span className="font-medium text-slate-500 dark:text-slate-400 block text-[11px]">Dual Market Triangulation:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 space-y-1">
                    <div className="flex items-center gap-1 text-blue-700 dark:text-blue-400 font-bold">
                      <ShoppingBag className="w-3 h-3" /> Quick Commerce
                    </div>
                    <span className="text-slate-900 dark:text-slate-100 font-medium block">{activeDay.breakfast.dualMarket.rawIngredientsOption.dishName}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">₹{activeDay.breakfast.dualMarket.rawIngredientsOption.costEstimateINR} · {activeDay.breakfast.dualMarket.rawIngredientsOption.platform}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 space-y-1">
                    <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold">
                      <Utensils className="w-3 h-3" /> Regional Dining
                    </div>
                    <span className="text-slate-900 dark:text-slate-100 font-medium block">{activeDay.breakfast.dualMarket.restaurantOrMessOption.dishName}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">₹{activeDay.breakfast.dualMarket.restaurantOrMessOption.costEstimateINR} · {activeDay.breakfast.dualMarket.restaurantOrMessOption.platform}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="font-mono text-slate-600 dark:text-slate-400 tabular-nums">
              <strong className="text-slate-900 dark:text-white">{activeDay.breakfast.calories} kcal</strong> · <strong className="text-emerald-700 dark:text-emerald-400">{activeDay.breakfast.proteinG}g Protein</strong>
            </div>
            <button
              onClick={() => handleQuickLogFromPlan('Breakfast', activeDay.breakfast.name, activeDay.breakfast.calories, activeDay.breakfast.proteinG)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Log as Eaten
            </button>
          </div>
        </div>

        {/* Lunch */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Lunch</span>
              <span className="font-mono text-slate-500 dark:text-slate-400">{activeDay.lunch.prepTime}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {activeDay.lunch.name}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              {activeDay.lunch.description}
            </p>

            <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 p-2.5 rounded-lg mb-3">
              <strong>Practicality:</strong> {activeDay.lunch.practicalityTip}
            </div>

            {/* Dual Market Triangulation Details */}
            {activeDay.lunch.dualMarket && (
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 space-y-2 text-xs">
                <span className="font-medium text-slate-500 dark:text-slate-400 block text-[11px]">Dual Market Triangulation:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 space-y-1">
                    <div className="flex items-center gap-1 text-blue-700 dark:text-blue-400 font-bold">
                      <ShoppingBag className="w-3 h-3" /> Quick Commerce
                    </div>
                    <span className="text-slate-900 dark:text-slate-100 font-medium block">{activeDay.lunch.dualMarket.rawIngredientsOption.dishName}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">₹{activeDay.lunch.dualMarket.rawIngredientsOption.costEstimateINR} · {activeDay.lunch.dualMarket.rawIngredientsOption.platform}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 space-y-1">
                    <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold">
                      <Utensils className="w-3 h-3" /> Regional Dining
                    </div>
                    <span className="text-slate-900 dark:text-slate-100 font-medium block">{activeDay.lunch.dualMarket.restaurantOrMessOption.dishName}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">₹{activeDay.lunch.dualMarket.restaurantOrMessOption.costEstimateINR} · {activeDay.lunch.dualMarket.restaurantOrMessOption.platform}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="font-mono text-slate-600 dark:text-slate-400 tabular-nums">
              <strong className="text-slate-900 dark:text-white">{activeDay.lunch.calories} kcal</strong> · <strong className="text-emerald-700 dark:text-emerald-400">{activeDay.lunch.proteinG}g Protein</strong>
            </div>
            <button
              onClick={() => handleQuickLogFromPlan('Lunch', activeDay.lunch.name, activeDay.lunch.calories, activeDay.lunch.proteinG)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Log as Eaten
            </button>
          </div>
        </div>

        {/* Dinner */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Dinner</span>
              <span className="font-mono text-slate-500 dark:text-slate-400">{activeDay.dinner.prepTime}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {activeDay.dinner.name}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              {activeDay.dinner.description}
            </p>

            <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 p-2.5 rounded-lg mb-3">
              <strong>Practicality:</strong> {activeDay.dinner.practicalityTip}
            </div>

            {/* Dual Market Triangulation Details */}
            {activeDay.dinner.dualMarket && (
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 space-y-2 text-xs">
                <span className="font-medium text-slate-500 dark:text-slate-400 block text-[11px]">Dual Market Triangulation:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 space-y-1">
                    <div className="flex items-center gap-1 text-blue-700 dark:text-blue-400 font-bold">
                      <ShoppingBag className="w-3 h-3" /> Quick Commerce
                    </div>
                    <span className="text-slate-900 dark:text-slate-100 font-medium block">{activeDay.dinner.dualMarket.rawIngredientsOption.dishName}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">₹{activeDay.dinner.dualMarket.rawIngredientsOption.costEstimateINR} · {activeDay.dinner.dualMarket.rawIngredientsOption.platform}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 space-y-1">
                    <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold">
                      <Utensils className="w-3 h-3" /> Regional Dining
                    </div>
                    <span className="text-slate-900 dark:text-slate-100 font-medium block">{activeDay.dinner.dualMarket.restaurantOrMessOption.dishName}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">₹{activeDay.dinner.dualMarket.restaurantOrMessOption.costEstimateINR} · {activeDay.dinner.dualMarket.restaurantOrMessOption.platform}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="font-mono text-slate-600 dark:text-slate-400 tabular-nums">
              <strong className="text-slate-900 dark:text-white">{activeDay.dinner.calories} kcal</strong> · <strong className="text-emerald-700 dark:text-emerald-400">{activeDay.dinner.proteinG}g Protein</strong>
            </div>
            <button
              onClick={() => handleQuickLogFromPlan('Dinner', activeDay.dinner.name, activeDay.dinner.calories, activeDay.dinner.proteinG)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Log as Eaten
            </button>
          </div>
        </div>

        {/* Snack */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Late Snack / Study Fuel</span>
              <span className="font-mono text-slate-500 dark:text-slate-400">{activeDay.snack.prepTime}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {activeDay.snack.name}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              {activeDay.snack.description}
            </p>

            <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 p-2.5 rounded-lg mb-3">
              <strong>Practicality:</strong> {activeDay.snack.practicalityTip}
            </div>

            {/* Dual Market Triangulation Details */}
            {activeDay.snack.dualMarket && (
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 space-y-1">
                    <div className="flex items-center gap-1 text-blue-700 dark:text-blue-400 font-bold">
                      <ShoppingBag className="w-3 h-3" /> Quick Commerce
                    </div>
                    <span className="text-slate-900 dark:text-slate-100 font-medium block">{activeDay.snack.dualMarket.rawIngredientsOption.dishName}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">₹{activeDay.snack.dualMarket.rawIngredientsOption.costEstimateINR} · {activeDay.snack.dualMarket.rawIngredientsOption.platform}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 space-y-1">
                    <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold">
                      <Utensils className="w-3 h-3" /> Regional Dining
                    </div>
                    <span className="text-slate-900 dark:text-slate-100 font-medium block">{activeDay.snack.dualMarket.restaurantOrMessOption.dishName}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">₹{activeDay.snack.dualMarket.restaurantOrMessOption.costEstimateINR} · {activeDay.snack.dualMarket.restaurantOrMessOption.platform}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="font-mono text-slate-600 dark:text-slate-400 tabular-nums">
              <strong className="text-slate-900 dark:text-white">{activeDay.snack.calories} kcal</strong> · <strong className="text-emerald-700 dark:text-emerald-400">{activeDay.snack.proteinG}g Protein</strong>
            </div>
            <button
              onClick={() => handleQuickLogFromPlan('Late Snack', activeDay.snack.name, activeDay.snack.calories, activeDay.snack.proteinG)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Log as Eaten
            </button>
          </div>
        </div>
      </div>

      {/* Leftover & PrepHack Strip */}
      <div className="p-4 rounded-xl bg-slate-900 dark:bg-slate-800/90 text-white border border-slate-800 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
        <div>
          <span className="text-emerald-400 block text-[11px] font-mono font-semibold">Practical Living & Zero-Waste Hack:</span>
          <span className="font-medium text-slate-100">{activeDay.leftoverOrPrepHack}</span>
        </div>
        <span className="text-slate-400 font-mono text-[11px] shrink-0">
          Day {selectedDayIndex + 1} of 7
        </span>
      </div>
    </div>
  );
};
