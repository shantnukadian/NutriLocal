import React, { useState } from 'react';
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
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Adaptive Nutrition Engine</span>
            <span aria-hidden="true">·</span>
            <span>Local Market Ingredients</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-700 font-semibold">Flexibility Scale {flexibilityScale}/10</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hyper-Localized Adaptive Weekly Plan
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            {plan.planOverview}
          </p>
        </div>

        <div className="bg-slate-100 p-3.5 rounded-xl border border-slate-200 text-xs text-right shrink-0">
          <span className="text-slate-500 block text-[11px]">Est. Weekly Grocery Cost</span>
          <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
            ₹{plan.weeklyBudgetEstimateINR}
          </span>
          <span className="text-[11px] text-slate-500 block">Affordable local staples</span>
        </div>
      </div>

      {/* Zero Subscription / Zero Ads Transparency Notice */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">Zero Subscription & Zero Ads:</span>
          <span>100% free for students & families. Supported via ingredient and meal affiliate links.</span>
        </div>
        <div className="flex items-center gap-2 font-medium text-slate-800 text-[11px]">
          <span>Quick Commerce: Blinkit · Zepto · Instamart</span>
          <span>·</span>
          <span>Dining: Swiggy · Zomato</span>
        </div>
      </div>

      {/* Logged feedback toast */}
      {loggedAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center justify-between">
          <span>✓ {loggedAlert}</span>
          <span className="text-[11px] text-emerald-600">Nutrient drift updated</span>
        </div>
      )}

      {/* Day Selector Buttons */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {plan.days.map((day, idx) => (
          <button
            key={day.dayName}
            onClick={() => setSelectedDayIndex(idx)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              selectedDayIndex === idx
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {day.dayName}
          </button>
        ))}
      </div>

      {/* Day Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Breakfast */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5">
              <span className="font-bold text-slate-700 uppercase tracking-wide">Breakfast</span>
              <span className="font-mono">{activeDay.breakfast.prepTime}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {activeDay.breakfast.name}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {activeDay.breakfast.description}
            </p>

            <div className="text-[11px] text-emerald-800 font-medium bg-emerald-50/70 p-2 rounded mb-3">
              Tip: {activeDay.breakfast.practicalityTip}
            </div>

            {/* Dual Market Triangulation Details */}
            {activeDay.breakfast.dualMarket && (
              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700">Dual Market Triangulation:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-blue-700 font-bold block mb-0.5">Raw / Quick Commerce</span>
                    <span className="text-slate-800 font-medium block">{activeDay.breakfast.dualMarket.rawIngredientsOption.dishName}</span>
                    <span className="text-slate-500 font-mono">₹{activeDay.breakfast.dualMarket.rawIngredientsOption.costEstimateINR} · {activeDay.breakfast.dualMarket.rawIngredientsOption.platform}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-amber-700 font-bold block mb-0.5">Regional / Delivered</span>
                    <span className="text-slate-800 font-medium block">{activeDay.breakfast.dualMarket.restaurantOrMessOption.dishName}</span>
                    <span className="text-slate-500 font-mono">₹{activeDay.breakfast.dualMarket.restaurantOrMessOption.costEstimateINR} · {activeDay.breakfast.dualMarket.restaurantOrMessOption.platform}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="font-mono text-slate-600 tabular-nums">
              <strong className="text-slate-900">{activeDay.breakfast.calories} kcal</strong> · <strong className="text-emerald-700">{activeDay.breakfast.proteinG}g Protein</strong>
            </div>
            <button
              onClick={() => handleQuickLogFromPlan('Breakfast', activeDay.breakfast.name, activeDay.breakfast.calories, activeDay.breakfast.proteinG)}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
            >
              Log as Eaten
            </button>
          </div>
        </div>

        {/* Lunch */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5">
              <span className="font-bold text-slate-700 uppercase tracking-wide">Lunch</span>
              <span className="font-mono">{activeDay.lunch.prepTime}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {activeDay.lunch.name}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {activeDay.lunch.description}
            </p>

            <div className="text-[11px] text-emerald-800 font-medium bg-emerald-50/70 p-2 rounded mb-3">
              Tip: {activeDay.lunch.practicalityTip}
            </div>

            {/* Dual Market Triangulation Details */}
            {activeDay.lunch.dualMarket && (
              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700">Dual Market Triangulation:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-blue-700 font-bold block mb-0.5">Raw / Quick Commerce</span>
                    <span className="text-slate-800 font-medium block">{activeDay.lunch.dualMarket.rawIngredientsOption.dishName}</span>
                    <span className="text-slate-500 font-mono">₹{activeDay.lunch.dualMarket.rawIngredientsOption.costEstimateINR} · {activeDay.lunch.dualMarket.rawIngredientsOption.platform}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-amber-700 font-bold block mb-0.5">Regional / Delivered</span>
                    <span className="text-slate-800 font-medium block">{activeDay.lunch.dualMarket.restaurantOrMessOption.dishName}</span>
                    <span className="text-slate-500 font-mono">₹{activeDay.lunch.dualMarket.restaurantOrMessOption.costEstimateINR} · {activeDay.lunch.dualMarket.restaurantOrMessOption.platform}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="font-mono text-slate-600 tabular-nums">
              <strong className="text-slate-900">{activeDay.lunch.calories} kcal</strong> · <strong className="text-emerald-700">{activeDay.lunch.proteinG}g Protein</strong>
            </div>
            <button
              onClick={() => handleQuickLogFromPlan('Lunch', activeDay.lunch.name, activeDay.lunch.calories, activeDay.lunch.proteinG)}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
            >
              Log as Eaten
            </button>
          </div>
        </div>

        {/* Dinner */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5">
              <span className="font-bold text-slate-700 uppercase tracking-wide">Dinner</span>
              <span className="font-mono">{activeDay.dinner.prepTime}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {activeDay.dinner.name}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {activeDay.dinner.description}
            </p>

            <div className="text-[11px] text-emerald-800 font-medium bg-emerald-50/70 p-2 rounded mb-3">
              Tip: {activeDay.dinner.practicalityTip}
            </div>

            {/* Dual Market Triangulation Details */}
            {activeDay.dinner.dualMarket && (
              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700">Dual Market Triangulation:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-blue-700 font-bold block mb-0.5">Raw / Quick Commerce</span>
                    <span className="text-slate-800 font-medium block">{activeDay.dinner.dualMarket.rawIngredientsOption.dishName}</span>
                    <span className="text-slate-500 font-mono">₹{activeDay.dinner.dualMarket.rawIngredientsOption.costEstimateINR} · {activeDay.dinner.dualMarket.rawIngredientsOption.platform}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-amber-700 font-bold block mb-0.5">Regional / Delivered</span>
                    <span className="text-slate-800 font-medium block">{activeDay.dinner.dualMarket.restaurantOrMessOption.dishName}</span>
                    <span className="text-slate-500 font-mono">₹{activeDay.dinner.dualMarket.restaurantOrMessOption.costEstimateINR} · {activeDay.dinner.dualMarket.restaurantOrMessOption.platform}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="font-mono text-slate-600 tabular-nums">
              <strong className="text-slate-900">{activeDay.dinner.calories} kcal</strong> · <strong className="text-emerald-700">{activeDay.dinner.proteinG}g Protein</strong>
            </div>
            <button
              onClick={() => handleQuickLogFromPlan('Dinner', activeDay.dinner.name, activeDay.dinner.calories, activeDay.dinner.proteinG)}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
            >
              Log as Eaten
            </button>
          </div>
        </div>

        {/* Snack */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5">
              <span className="font-bold text-slate-700 uppercase tracking-wide">Late Snack / Study Fuel</span>
              <span className="font-mono">{activeDay.snack.prepTime}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {activeDay.snack.name}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {activeDay.snack.description}
            </p>

            <div className="text-[11px] text-emerald-800 font-medium bg-emerald-50/70 p-2 rounded mb-3">
              Tip: {activeDay.snack.practicalityTip}
            </div>

            {/* Dual Market Triangulation Details */}
            {activeDay.snack.dualMarket && (
              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-blue-700 font-bold block mb-0.5">Raw / Quick Commerce</span>
                    <span className="text-slate-800 font-medium block">{activeDay.snack.dualMarket.rawIngredientsOption.dishName}</span>
                    <span className="text-slate-500 font-mono">₹{activeDay.snack.dualMarket.rawIngredientsOption.costEstimateINR} · {activeDay.snack.dualMarket.rawIngredientsOption.platform}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-amber-700 font-bold block mb-0.5">Regional / Delivered</span>
                    <span className="text-slate-800 font-medium block">{activeDay.snack.dualMarket.restaurantOrMessOption.dishName}</span>
                    <span className="text-slate-500 font-mono">₹{activeDay.snack.dualMarket.restaurantOrMessOption.costEstimateINR} · {activeDay.snack.dualMarket.restaurantOrMessOption.platform}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="font-mono text-slate-600 tabular-nums">
              <strong className="text-slate-900">{activeDay.snack.calories} kcal</strong> · <strong className="text-emerald-700">{activeDay.snack.proteinG}g Protein</strong>
            </div>
            <button
              onClick={() => handleQuickLogFromPlan('Late Snack', activeDay.snack.name, activeDay.snack.calories, activeDay.snack.proteinG)}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
            >
              Log as Eaten
            </button>
          </div>
        </div>
      </div>

      {/* Leftover & PrepHack Strip */}
      <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px] font-mono">Practical Living & Zero-Waste Hack:</span>
          <span className="font-medium text-slate-200">{activeDay.leftoverOrPrepHack}</span>
        </div>
        <span className="text-slate-400 font-mono text-[11px] shrink-0">
          Day {selectedDayIndex + 1} of 7
        </span>
      </div>
    </div>
  );
};
