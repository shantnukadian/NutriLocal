import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  onGeneratePlan: () => void;
  isGenerating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  onGeneratePlan,
  isGenerating,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setActiveView('plan')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0">
              NutriLocal Studio
            </span>
          </button>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveView('plan')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeView === 'plan' ? 'text-slate-900 font-semibold underline decoration-2 decoration-emerald-600 underline-offset-8' : ''
            }`}
          >
            Adaptive Meal Plan
          </button>
          <button
            onClick={() => setActiveView('next_meal')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeView === 'next_meal' ? 'text-slate-900 font-semibold underline decoration-2 decoration-emerald-600 underline-offset-8' : ''
            }`}
          >
            Pre-Meal Check-in
          </button>
          <button
            onClick={() => setActiveView('drift')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeView === 'drift' ? 'text-slate-900 font-semibold underline decoration-2 decoration-emerald-600 underline-offset-8' : ''
            }`}
          >
            Nutrient Drift
          </button>
          <button
            onClick={() => setActiveView('market')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeView === 'market' ? 'text-slate-900 font-semibold underline decoration-2 decoration-emerald-600 underline-offset-8' : ''
            }`}
          >
            Local Mandi
          </button>
          <button
            onClick={() => setActiveView('master_prompt')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeView === 'master_prompt' ? 'text-blue-700 font-semibold underline decoration-2 decoration-blue-600 underline-offset-8' : ''
            }`}
          >
            Master Prompt & Review
          </button>
          <button
            onClick={() => setActiveView('pm_rules')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeView === 'pm_rules' ? 'text-slate-900 font-semibold underline decoration-2 decoration-emerald-600 underline-offset-8' : ''
            }`}
          >
            PM Rules
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onGeneratePlan}
            disabled={isGenerating}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900 cursor-pointer"
          >
            {isGenerating ? 'Adapting Plan with AI...' : 'Generate Adaptive Plan'}
          </button>
        </div>
      </div>
    </header>
  );
};
