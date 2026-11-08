import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { AppView } from '../types';

interface HeaderProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  onGeneratePlan: () => void;
  isGenerating: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  onGeneratePlan,
  isGenerating,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveView('plan')}
            className="text-left group cursor-pointer focus:outline-none flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              NL
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0">
              NutriLocal
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          <button
            onClick={() => setActiveView('plan')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-slate-100 ${
              activeView === 'plan' ? 'text-slate-900 dark:text-white font-semibold underline decoration-2 decoration-emerald-600 dark:decoration-emerald-400 underline-offset-8' : ''
            }`}
          >
            Adaptive Meal Plan
          </button>
          <button
            onClick={() => setActiveView('next_meal')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-slate-100 ${
              activeView === 'next_meal' ? 'text-slate-900 dark:text-white font-semibold underline decoration-2 decoration-emerald-600 dark:decoration-emerald-400 underline-offset-8' : ''
            }`}
          >
            Pre-Meal Check-in
          </button>
          <button
            onClick={() => setActiveView('drift')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-slate-100 ${
              activeView === 'drift' ? 'text-slate-900 dark:text-white font-semibold underline decoration-2 decoration-emerald-600 dark:decoration-emerald-400 underline-offset-8' : ''
            }`}
          >
            Nutrient Drift
          </button>
          <button
            onClick={() => setActiveView('market')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-slate-100 ${
              activeView === 'market' ? 'text-slate-900 dark:text-white font-semibold underline decoration-2 decoration-emerald-600 dark:decoration-emerald-400 underline-offset-8' : ''
            }`}
          >
            Local Mandi
          </button>
          <button
            onClick={() => setActiveView('master_prompt')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-slate-100 ${
              activeView === 'master_prompt' ? 'text-blue-700 dark:text-blue-400 font-semibold underline decoration-2 decoration-blue-600 dark:decoration-blue-400 underline-offset-8' : ''
            }`}
          >
            Master Blueprint
          </button>
          <button
            onClick={() => setActiveView('pm_rules')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-slate-100 ${
              activeView === 'pm_rules' ? 'text-slate-900 dark:text-white font-semibold underline decoration-2 decoration-emerald-600 dark:decoration-emerald-400 underline-offset-8' : ''
            }`}
          >
            PM Rules
          </button>
        </nav>

        {/* Zone 3: Actions + Dark Mode Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle Dark Mode"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
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
            className="px-3.5 sm:px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900 cursor-pointer shadow-xs"
          >
            {isGenerating ? 'Adapting Plan...' : 'Generate Plan'}
          </button>
        </div>
      </div>
    </header>
  );
};
