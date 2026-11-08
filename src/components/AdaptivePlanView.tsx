import React, { useState } from 'react';
import { ShoppingBag, Utensils, Check, ArrowRight, Sparkles, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  const [activeSubTab, setActiveSubTab] = useState<'meals' | 'market' | 'hacks'>('meals');
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

    setLoggedAlert(`Logged "${name}" for ${activeDay.dayName}!`);
    setTimeout(() => setLoggedAlert(''), 2500);
  };

  const dayMeals = [
    { type: 'Breakfast' as const, data: activeDay.breakfast },
    { type: 'Lunch' as const, data: activeDay.lunch },
    { type: 'Dinner' as const, data: activeDay.dinner },
    { type: 'Late Snack' as const, data: activeDay.snack },
  ];

  return (
    <div className="h-full flex flex-col space-y-3 overflow-hidden">
      {/* Plan Control Header (Single Row with Days & Sub-tabs) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800 shrink-0">
        {/* Day Selector Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {plan.days.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            return (
              <button
                key={day.dayName}
                onClick={() => setSelectedDayIndex(idx)}
                className={`relative px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeDayPill"
                    className="absolute inset-0 bg-slate-900 dark:bg-emerald-600 rounded-md shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span>{day.dayName.slice(0, 3)}</span>
              </button>
            );
          })}
        </div>

        {/* Section View Tabs */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setActiveSubTab('meals')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeSubTab === 'meals'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Meal Schedule
          </button>
          <button
            onClick={() => setActiveSubTab('market')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeSubTab === 'market'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Dual Market
          </button>
          <button
            onClick={() => setActiveSubTab('hacks')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeSubTab === 'hacks'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Zero-Waste Hacks
          </button>
        </div>
      </div>

      {/* Logged feedback toast */}
      {loggedAlert && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center justify-between shrink-0"
        >
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            {loggedAlert}
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">Nutrient drift updated</span>
        </motion.div>
      )}

      {/* Content Container with Animation */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        <AnimatePresence mode="wait">
          {/* TAB 1: 4-MEAL VIEWPORT-FITTED GRID */}
          {activeSubTab === 'meals' && (
            <motion.div
              key={`meals-${selectedDayIndex}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-3.5"
            >
              {dayMeals.map((meal) => (
                <div
                  key={meal.type}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between space-y-2.5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                        {meal.type}
                      </span>
                      <span className="font-mono text-slate-400 dark:text-slate-500">{meal.data.prepTime}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {meal.data.name}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                      {meal.data.description}
                    </p>

                    <div className="mt-2 text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 px-2.5 py-1.5 rounded-lg line-clamp-1">
                      <strong>Tip:</strong> {meal.data.practicalityTip}
                    </div>
                  </div>

                  {/* Card Bottom: Tabular Macros + Log Action */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      <strong className="text-slate-900 dark:text-white">{meal.data.calories} kcal</strong>
                      <span> · </span>
                      <strong className="text-emerald-700 dark:text-emerald-400">{meal.data.proteinG}g P</strong>
                    </div>

                    <button
                      onClick={() => handleQuickLogFromPlan(meal.type, meal.data.name, meal.data.calories, meal.data.proteinG)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
                    >
                      Log as Eaten
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* TAB 2: DUAL MARKET TRIANGULATION COMPARISON */}
          {activeSubTab === 'market' && (
            <motion.div
              key={`market-${selectedDayIndex}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="space-y-3"
            >
              <div className="p-3 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>
                  <strong>Dual Market Triangulation:</strong> Grounding every meal in 10-minute grocery delivery vs. regional dining.
                </span>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">100% Free · Affiliate Supported</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {dayMeals.map((meal) => {
                  const dm = meal.data.dualMarket;
                  if (!dm) return null;
                  return (
                    <div
                      key={`dm-${meal.type}`}
                      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs"
                    >
                      <div className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="font-bold text-slate-900 dark:text-white uppercase">{meal.type}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{meal.data.name}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {/* Quick Commerce */}
                        <div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 flex flex-col justify-between space-y-2">
                          <div>
                            <div className="flex items-center gap-1 text-blue-700 dark:text-blue-400 font-bold text-[11px]">
                              <ShoppingBag className="w-3 h-3" /> Quick Commerce (10m)
                            </div>
                            <span className="text-slate-900 dark:text-slate-100 font-medium block text-xs mt-1">
                              {dm.rawIngredientsOption.dishName}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px] block mt-0.5">
                              ₹{dm.rawIngredientsOption.costEstimateINR} · {dm.rawIngredientsOption.platform}
                            </span>
                          </div>

                          <a
                            href={`https://${dm.rawIngredientsOption.platform.toLowerCase()}.com`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-center py-1 text-[11px] font-semibold text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 rounded transition-colors"
                          >
                            Order Ingredients →
                          </a>
                        </div>

                        {/* Regional Dining */}
                        <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 flex flex-col justify-between space-y-2">
                          <div>
                            <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold text-[11px]">
                              <Utensils className="w-3 h-3" /> Regional Dining
                            </div>
                            <span className="text-slate-900 dark:text-slate-100 font-medium block text-xs mt-1">
                              {dm.restaurantOrMessOption.dishName}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px] block mt-0.5">
                              ₹{dm.restaurantOrMessOption.costEstimateINR} · {dm.restaurantOrMessOption.platform}
                            </span>
                          </div>

                          <a
                            href="https://swiggy.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-center py-1 text-[11px] font-semibold text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 rounded transition-colors"
                          >
                            Order Food →
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 3: ZERO-WASTE & PANTRY HACKS */}
          {activeSubTab === 'hacks' && (
            <motion.div
              key={`hacks-${selectedDayIndex}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="space-y-4"
            >
              <div className="p-5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white border border-slate-800 dark:border-slate-700 space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold">
                  <ChefHat className="w-4 h-4" />
                  <span>{activeDay.dayName} Zero-Waste & Prep Hack</span>
                </div>
                <p className="text-sm font-medium text-slate-100 leading-relaxed">
                  {activeDay.leftoverOrPrepHack}
                </p>
                <div className="pt-2 text-xs text-slate-400 font-mono">
                  Weekly Grocery Budget Estimate: <strong className="text-white">₹{plan.weeklyBudgetEstimateINR}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">Hostel Electric Kettle Cooking</span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    0.8L kettle safely cooks 2-3 eggs, Maggi protein twists, and steamed sprouted moong. Never fry or add oil inside kettle heating coils.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">Homemaker Modular Cooker Base</span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    Pressure cook a double batch of plain dal/chana. Divide into 2 bowls before tadka to create a mild low-GI bowl for elders and a spicy one for kids.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
