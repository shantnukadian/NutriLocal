import React from 'react';
import { Sun, Moon, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { AppView } from '../types';

interface HeaderProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  onGeneratePlan: () => void;
  isGenerating: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  hasSupplementTrigger?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  onGeneratePlan,
  isGenerating,
  theme,
  onToggleTheme,
  hasSupplementTrigger,
}) => {
  const navTabs: { id: AppView; label: string }[] = [
    { id: 'plan', label: 'Adaptive Plan' },
    { id: 'next_meal', label: 'Pre-Meal Check-in' },
    { id: 'drift', label: 'Nutrient Drift' },
    { id: 'household', label: 'Household & Mandi' },
    { id: 'master_prompt', label: 'PM Blueprint & Rules' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveView('plan')}
            className="group cursor-pointer focus:outline-none flex items-center gap-2.5 text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-xs">
              NL
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors whitespace-nowrap">
                NutriLocal
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Primary Navigation Tabs with Smooth Animated Pill */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
          {navTabs.map((tab) => {
            const isActive = activeView === tab.id || (tab.id === 'household' && activeView === 'market') || (tab.id === 'master_prompt' && activeView === 'pm_rules');
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`relative px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer z-10 ${
                  isActive
                    ? 'text-slate-950 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-white dark:bg-slate-900 rounded-md shadow-xs -z-10 border border-slate-200/80 dark:border-slate-700/80"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions + Dark Mode Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick trigger indicator if 14-day supplement deficit is active */}
          {hasSupplementTrigger && (
            <button
              onClick={() => setActiveView('drift')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors cursor-pointer"
              title="14-Day Chronic Deficit Trigger active"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>14-Day Clinical Alert</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle Dark Mode"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Primary Action CTA */}
          <button
            onClick={onGeneratePlan}
            disabled={isGenerating}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900 cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Adapting...' : 'Adapt Plan'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
