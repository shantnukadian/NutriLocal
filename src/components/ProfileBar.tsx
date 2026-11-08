import React from 'react';
import { SlidersHorizontal, Info } from 'lucide-react';
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
    if (val >= 8) return 'Score 8-10: Strict Clinical Adherence';
    if (val >= 5) return 'Score 5-7: 80/20 Balanced Life';
    return 'Score 1-4: Mess Survival & Freedom';
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 shadow-xs transition-colors shrink-0">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
        {/* Cohort Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden sm:inline">
            Cohort:
          </span>
          <div className="flex items-center gap-1.5 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {profiles.map((p) => {
              const isSelected = p.id === activeProfile.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectProfile(p)}
                  className={`px-3 py-1 rounded-md font-semibold text-xs transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200/80 dark:border-slate-700/80'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {p.name} · {p.avatarLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact Flexibility Engine Slider */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 px-3 py-1 rounded-lg flex-1 max-w-md">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 shrink-0">
            <SlidersHorizontal className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Flexibility:</span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold tabular-nums">
              {flexibilityScale}/10
            </span>
          </div>

          <input
            type="range"
            min={1}
            max={10}
            value={flexibilityScale}
            onChange={(e) => onChangeFlexibility(Number(e.target.value))}
            className="w-full accent-emerald-600 dark:accent-emerald-500 cursor-pointer h-1.5"
            title={getFlexibilityLabel(flexibilityScale)}
          />

          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap hidden sm:inline">
            {flexibilityScale >= 8 ? 'Strict' : flexibilityScale >= 5 ? '80/20 Life' : 'Freedom'}
          </span>
        </div>

        {/* Profile Snapshot Metrics (Single Row) */}
        <div className="hidden xl:flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
          <div>
            <span>Kitchen: </span>
            <strong className="text-slate-800 dark:text-slate-200">{activeProfile.kitchenEquipment.slice(0, 2).join(', ')}</strong>
          </div>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <div className="font-mono tabular-nums">
            <strong className="text-slate-900 dark:text-white">{activeProfile.targetCalories} kcal</strong>
            <span> · </span>
            <strong className="text-emerald-700 dark:text-emerald-400">{activeProfile.targetProtein}g P</strong>
            <span> · </span>
            <span>₹{activeProfile.dailyBudgetINR}/d</span>
          </div>
        </div>
      </div>
    </div>
  );
};
