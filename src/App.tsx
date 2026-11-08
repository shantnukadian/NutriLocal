import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { ProfileBar } from './components/ProfileBar';
import { AdaptivePlanView } from './components/AdaptivePlanView';
import { PreMealCheckinView } from './components/PreMealCheckinView';
import { NutrientDriftPanel } from './components/NutrientDriftPanel';
import { HouseholdMandiView } from './components/HouseholdMandiView';
import { PMBlueprintWorkbenchView } from './components/PMBlueprintWorkbenchView';
import { PROFILES, STUDENT_WEEKLY_LOG, HOMEMAKER_WEEKLY_LOG } from './data/mockData';
import { UserProfile, WeeklyLogDay, NutrientDriftAnalysis, AdaptiveMealPlan, FoodLogItem, AppView } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppView>('plan');
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
    <div className="lg:h-screen min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors overflow-x-hidden lg:overflow-hidden">
      {/* Top Header with Dark Mode Toggle & Primary Nav Tabs */}
      <Header
        activeView={activeTab}
        setActiveView={setActiveTab}
        onGeneratePlan={fetchAdaptivePlan}
        isGenerating={isGeneratingPlan}
        theme={theme}
        onToggleTheme={toggleTheme}
        hasSupplementTrigger={Boolean(driftAnalysis?.supplementTriggerActive)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 min-h-0 flex flex-col max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 space-y-2.5 overflow-hidden">
        {/* Compact Sub-Header Toolbar: Profile Switcher & Flexibility Scale Bar */}
        <ProfileBar
          profiles={profiles}
          activeProfile={activeProfile}
          onSelectProfile={setActiveProfile}
          flexibilityScale={flexibilityScale}
          onChangeFlexibility={setFlexibilityScale}
        />

        {/* View Content Viewport Area with Smooth Transition */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.16 }}
              className="h-full flex flex-col"
            >
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

              {(activeTab === 'household' || activeTab === 'market') && (
                <HouseholdMandiView profile={activeProfile} />
              )}

              {(activeTab === 'master_prompt' || activeTab === 'pm_rules') && (
                <PMBlueprintWorkbenchView
                  profile={activeProfile}
                  flexibilityScale={flexibilityScale}
                  onChangeFlexibility={setFlexibilityScale}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slim, Quiet Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 py-1.5 px-4 sm:px-8 text-[11px] text-slate-500 dark:text-slate-400 transition-colors shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">NutriLocal Studio</span>
            <span>·</span>
            <span>Zero Subscription & Zero Ads</span>
            <span className="hidden sm:inline">· Quick Commerce & Dining Affiliates</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span>Score {flexibilityScale}/10</span>
            <span>·</span>
            <span className="capitalize">{theme}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

