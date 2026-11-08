import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { UserProfile, PMConfigurationRule } from '../types';

interface PMRulesSandboxProps {
  profile: UserProfile;
  flexibilityScale: number;
  onChangeFlexibility: (val: number) => void;
}

export const PMRulesSandbox: React.FC<PMRulesSandboxProps> = ({
  profile,
  flexibilityScale,
  onChangeFlexibility,
}) => {
  const [driftRecovery, setDriftRecovery] = useState<'Gentle (48h-72h)' | 'Active (24h)' | 'Immediate'>('Gentle (48h-72h)');
  const [toolLock, setToolLock] = useState<'Strict Equipment Lock' | 'Flexible Alternatives'>('Strict Equipment Lock');
  const [budgetStrictness, setBudgetStrictness] = useState<number>(8);
  const [leftoverBonus, setLeftoverBonus] = useState<boolean>(true);
  const [messEmpathy, setMessEmpathy] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const activePrompt = `System: You are NutriLocal Engine, an adaptive nutrition system for Indian hostel students and homemakers.
CORE SYSTEM INVARIANTS:
1. Zero Subscription & Zero Ads (Affiliate monetization via Blinkit, Zepto, Instamart, Swiggy, Zomato).
2. Dual Market Triangulation: Always supply both Raw Quick-Commerce (10 min) and Regional Delivery alternatives.
3. Flexibility Engine: Scale ${flexibilityScale}/10 (${flexibilityScale >= 8 ? 'Strict macro adherence' : flexibilityScale >= 5 ? '80/20 balance, 48h compensation' : 'Max dietary freedom, mess survival'}).
4. Mandatory Pre-Meal Check-in: Enforce prior meal logging before answering "What should I eat next?".
5. 14-Day Deficit Supplement Trigger: Detect chronic deficits (>14 days) and recommend low-cost generic Indian supplements.
6. Target Profile: ${profile.name} (${profile.role === 'hostel_student' ? 'Hostel Student with kettle/induction' : 'Homemaker with multi-generational household'}).
7. Equipment Lock: ${toolLock}. Budget Weight: ${budgetStrictness}/10. Leftover Recycling: ${leftoverBonus ? 'Prioritized' : 'Standard'}.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(activePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>PM Rule Engine</span>
          <span aria-hidden="true">·</span>
          <span>Algorithmic Weight Configuration</span>
          <span aria-hidden="true">·</span>
          <span>Live Prompt Synthesis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Product Manager Rules & Constraint Sandbox
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Tune the operational rules governing the lightweight LLM. Adjust the Flexibility Engine (Scale 1–10), recovery speed, equipment constraints, and export the resulting production prompt.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Rule Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
              Rule Parameters & Weights
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Adjust how aggressively the engine compensates for nutrient drift.
            </p>
          </div>

          {/* Flexibility Scale Slider (1 to 10) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Flexibility Engine Scale (1 to 10)
              </label>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm tabular-nums">
                Score {flexibilityScale} / 10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={flexibilityScale}
              onChange={(e) => onChangeFlexibility(Number(e.target.value))}
              className="w-full accent-slate-900 dark:accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500">
              <span>Score 1: Max Freedom</span>
              <span>Score 6-7: 80/20 Balance</span>
              <span>Score 10: Strict Macros</span>
            </div>
          </div>

          {/* Drift Recovery Pace */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
              Drift Recovery Compensation Pace
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Gentle (48h-72h)', 'Active (24h)', 'Immediate'] as const).map(pace => (
                <button
                  key={pace}
                  onClick={() => setDriftRecovery(pace)}
                  className={`py-2 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                    driftRecovery === pace
                      ? 'border-slate-900 bg-slate-900 text-white dark:border-emerald-500 dark:bg-emerald-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {pace.split(' ')[0]}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Gentle recovery spreads calorie/protein compensation over 2-3 days without cutting meals.
            </p>
          </div>

          {/* Kitchen Tool Strictness */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
              Kitchen Equipment Strictness
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Strict Equipment Lock', 'Flexible Alternatives'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setToolLock(mode)}
                  className={`py-2 text-xs font-medium rounded border transition-colors cursor-pointer ${
                    toolLock === mode
                      ? 'border-slate-900 bg-slate-900 text-white font-semibold dark:border-emerald-500 dark:bg-emerald-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">Mess Empathy & Zero-Guilt Mode</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Never punishes or shames hostel students for eating mess food</span>
              </div>
              <input
                type="checkbox"
                checked={messEmpathy}
                onChange={(e) => setMessEmpathy(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">Homemaker Leftover Recycling Reward</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Awards zero-waste bonuses for repurposing noon dal or boiled chana</span>
              </div>
              <input
                type="checkbox"
                checked={leftoverBonus}
                onChange={(e) => setLeftoverBonus(e.target.checked)}
                className="w-4 h-4 accent-slate-900 dark:accent-emerald-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Right Column: Synthesized System Prompt (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Synthesized Prompt Header
                </h3>
                <span className="text-xs text-slate-400 dark:text-slate-500">Passed dynamically into Gemini 3.8 Flash</span>
              </div>

              <div className="flex items-center gap-2">
                {copied && <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1"><Check className="w-3 h-3" /> Copied!</span>}
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded cursor-pointer flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy Prompt
                </button>
              </div>
            </div>

            <div className="bg-slate-900 dark:bg-slate-950 text-slate-200 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-[380px] leading-relaxed border border-slate-800">
              <pre className="whitespace-pre-wrap">{activePrompt}</pre>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs text-slate-600 dark:text-slate-300 flex justify-between items-center">
              <span>Ready for cohort deployment in <strong>{profile.location}</strong></span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">Score {flexibilityScale}/10</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
