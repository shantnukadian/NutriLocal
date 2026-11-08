import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProfileBar } from './components/ProfileBar';
import { AdaptivePlanView } from './components/AdaptivePlanView';
import { PreMealCheckinView } from './components/PreMealCheckinView';
import { NutrientDriftPanel } from './components/NutrientDriftPanel';
import { HouseholdManagerView } from './components/HouseholdManagerView';
import { LocalMarketBoard } from './components/LocalMarketBoard';
import { SupplementTriggerCard } from './components/SupplementTriggerCard';
import { MasterPromptView } from './components/MasterPromptView';
import { PMRulesSandbox } from './components/PMRulesSandbox';
import { PROFILES, STUDENT_WEEKLY_LOG, HOMEMAKER_WEEKLY_LOG } from './data/mockData';
import { UserProfile, WeeklyLogDay, NutrientDriftAnalysis, AdaptiveMealPlan, FoodLogItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'plan' | 'next_meal' | 'drift' | 'household' | 'market' | 'master_prompt' | 'pm_rules'>('plan');
  const [profiles] = useState<UserProfile[]>(PROFILES);
  const [activeProfile, setActiveProfile] = useState<UserProfile>(PROFILES[0]);
  const [flexibilityScale, setFlexibilityScale] = useState<number>(7); // Scale 1 to 10

  // Dual Theme (Light / Dark) State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nl_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('nl_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [studentLogs, setStudentLogs] = useState<WeeklyLogDay[]>(STUDENT_WEEKLY_LOG);
  const [homemakerLogs, setHomemakerLogs] = useState<WeeklyLogDay[]>(HOMEMAKER_WEEKLY_LOG);

  const currentLogs = activeProfile.role === 'hostel_student' ? studentLogs : homemakerLogs;
  const setCurrentLogs = activeProfile.role === 'hostel_student' ? setStudentLogs : setHomemakerLogs;

  const [driftAnalysis, setDriftAnalysis] = useState<NutrientDriftAnalysis | null>(null);
  const [adaptivePlan, setAdaptivePlan] = useState<AdaptiveMealPlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);

  // Fetch or calculate drift analysis
  const fetchDriftAnalysis = async () => {
    try {
      const res = await fetch('/api/analyze-drift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: activeProfile,
          weeklyLog: currentLogs,
          flexibilityScale
        })
      });
      if (res.ok) {
        const data = await res.json();
        setDriftAnalysis(data);
      }
    } catch (err) {
      console.warn('Using client fallback drift calculation:', err);
    }
  };

  // Fetch adaptive meal plan
  const fetchAdaptivePlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: activeProfile,
          weeklyDrift: driftAnalysis?.drift,
          flexibilityScale
        })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setAdaptivePlan(json.data);
        }
      }
    } catch (err) {
      console.warn('Error generating plan, fallback in place:', err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Debounced effect to prevent quota burn on range slider drag
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDriftAnalysis();
      fetchAdaptivePlan();
    }, 350);
    return () => clearTimeout(timer);
  }, [activeProfile.id, flexibilityScale]);

  const handleAddLogItem = (dayName: string, item: Omit<FoodLogItem, 'id'>) => {
    const newItem: FoodLogItem = {
      ...item,
      id: `m-${Date.now()}`
    };

    const updated = currentLogs.map(log => {
      if (log.dayName === dayName) {
        const updatedMeals = [newItem, ...log.meals];
        let c = 0, p = 0, cb = 0, f = 0;
        updatedMeals.forEach(m => {
          c += m.calories || 0;
          p += m.protein || 0;
          cb += m.carbs || 0;
          f += m.fat || 0;
        });
        return {
          ...log,
          meals: updatedMeals,
          totals: { calories: c, protein: p, carbs: cb, fat: f }
        };
      }
      return log;
    });

    setCurrentLogs(updated);
    setTimeout(fetchDriftAnalysis, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Header with Dark Mode Toggle */}
      <Header
        activeView={activeTab as any}
        setActiveView={(v) => setActiveTab(v as any)}
        onGeneratePlan={fetchAdaptivePlan}
        isGenerating={isGeneratingPlan}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Profile Switcher & Flexibility Scale Bar */}
        <ProfileBar
          profiles={profiles}
          activeProfile={activeProfile}
          onSelectProfile={setActiveProfile}
          flexibilityScale={flexibilityScale}
          onChangeFlexibility={setFlexibilityScale}
        />

        {/* 14-Day Persistent Deficit Supplement Trigger Banner */}
        {driftAnalysis?.supplementTriggerActive && (
          <SupplementTriggerCard
            recommendations={driftAnalysis.supplementRecommendations}
            deficiencyDays={driftAnalysis.deficiencyDaysCount}
          />
        )}

        {/* View Switcher Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'plan' 
                ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Adaptive Weekly Plan
          </button>

          <button
            onClick={() => setActiveTab('next_meal')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'next_meal' 
                ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
            }`}
          >
            What Should I Eat Next? (Pre-Meal Check-in)
          </button>

          <button
            onClick={() => setActiveTab('drift')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'drift' 
                ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Nutrient Drift & Food Log
          </button>

          {activeProfile.role === 'homemaker' && (
            <button
              onClick={() => setActiveTab('household')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'household' 
                  ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
              }`}
            >
              Multi-Member Household
            </button>
          )}

          <button
            onClick={() => setActiveTab('market')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'market' 
                ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Local Mandi Ingredients
          </button>

          <button
            onClick={() => setActiveTab('master_prompt')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'master_prompt' 
                ? 'bg-blue-700 text-white dark:bg-blue-600 shadow-xs' 
                : 'text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60'
            }`}
          >
            ★ Master Blueprint & PM Review
          </button>

          <button
            onClick={() => setActiveTab('pm_rules')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'pm_rules' 
                ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
            }`}
          >
            PM Rule Sandbox
          </button>
        </div>

        {/* View Panels */}
        {activeTab === 'plan' && adaptivePlan && (
          <AdaptivePlanView
            profile={activeProfile}
            plan={adaptivePlan}
            onLogMeal={handleAddLogItem}
            flexibilityScale={flexibilityScale}
          />
        )}

        {activeTab === 'next_meal' && (
          <PreMealCheckinView
            profile={activeProfile}
            weeklyLogs={currentLogs}
            onLogMeal={handleAddLogItem}
            flexibilityScale={flexibilityScale}
          />
        )}

        {activeTab === 'drift' && (
          <NutrientDriftPanel
            profile={activeProfile}
            weeklyLogs={currentLogs}
            driftAnalysis={driftAnalysis}
            onAddLogItem={handleAddLogItem}
            flexibilityScale={flexibilityScale}
          />
        )}

        {activeTab === 'household' && (
          <HouseholdManagerView profile={activeProfile} />
        )}

        {activeTab === 'market' && (
          <LocalMarketBoard />
        )}

        {activeTab === 'master_prompt' && (
          <MasterPromptView />
        )}

        {activeTab === 'pm_rules' && (
          <PMRulesSandbox
            profile={activeProfile}
            flexibilityScale={flexibilityScale}
            onChangeFlexibility={setFlexibilityScale}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-16 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">NutriLocal Studio</span>
            <span>·</span>
            <span>Zero Subscription & Zero Ads</span>
            <span>·</span>
            <span>Quick Commerce & Dining Affiliate Supported</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Theme: <strong className="capitalize text-slate-800 dark:text-slate-200">{theme}</strong></span>
            <span>·</span>
            <span>Production PM Framework</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
