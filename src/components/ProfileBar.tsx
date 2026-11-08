import React from 'react';
import { UserProfile } from '../types';

interface ProfileBarProps {
  profiles: UserProfile[];
  activeProfile: UserProfile;
  onSelectProfile: (profile: UserProfile) => void;
  flexibilityScale: number;
  onChangeFlexibility: (val: number) => void;
}

export const ProfileBar: React.FC<ProfileBarProps> = ({
  profiles,
  activeProfile,
  onSelectProfile,
  flexibilityScale,
  onChangeFlexibility,
}) => {
  const getFlexibilityLabel = (val: number) => {
    if (val >= 8) return { title: 'Score 8-10: Strict Clinical Adherence', desc: 'Tight macro compliance, minimal deviations' };
    if (val >= 5) return { title: 'Score 5-7: 80/20 Balanced Life (Recommended)', desc: 'Embraces mess & family comfort, bridges gaps over 48h' };
    return { title: 'Score 1-4: Mess Survival & Maximum Freedom', desc: 'Maximum empathy, micro-boosters only, zero guilt' };
  };

  const flexMeta = getFlexibilityLabel(flexibilityScale);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Profile Tabs */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Active Community Cohort Profile
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {profiles.map((p) => {
              const isSelected = p.id === activeProfile.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectProfile(p)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {p.name} · {p.avatarLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Flexibility Scale Slider (1 to 10) */}
        <div className="lg:max-w-md w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 p-3.5 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Flexibility Engine (Scale 1–10):
            </span>
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

          <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-slate-100">{flexMeta.title}</span>
            <span className="text-slate-400 dark:text-slate-500">· {flexMeta.desc}</span>
          </div>
        </div>
      </div>

      {/* Profile Metadata Strip */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Living Context</span>
          <span className="font-medium text-slate-800 dark:text-slate-200">{activeProfile.householdContext}</span>
        </div>

        <div>
          <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Kitchen Equipment</span>
          <span className="font-medium text-slate-800 dark:text-slate-200">{activeProfile.kitchenEquipment.join(', ')}</span>
        </div>

        <div>
          <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Target Daily Nutrition & Budget</span>
          <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
            {activeProfile.targetCalories} kcal · {activeProfile.targetProtein}g Protein · ₹{activeProfile.dailyBudgetINR}/day
          </span>
        </div>

        <div>
          <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Health Objective</span>
          <span className="font-medium text-emerald-800 dark:text-emerald-400">{activeProfile.healthFocus}</span>
        </div>
      </div>
    </div>
  );
};
