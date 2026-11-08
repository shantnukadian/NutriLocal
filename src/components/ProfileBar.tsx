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
    if (val >= 80) return { title: 'Strict Clinical Focus', desc: 'Tight macro adherence, minimal dietary deviations' };
    if (val >= 55) return { title: '80/20 Balanced Life (Recommended)', desc: 'Embraces mess & family comfort, bridges gaps over 48h' };
    return { title: 'Mess Survival & Zero Restrictions', desc: 'Maximum empathy, micro-boosters only, zero guilt' };
  };

  const flexMeta = getFlexibilityLabel(flexibilityScale);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Profile Tabs */}
        <div className="space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active Community Cohort Profile
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {profiles.map((p) => {
              const isSelected = p.id === activeProfile.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectProfile(p)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p.name} · {p.avatarLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Flexibility Scale Slider */}
        <div className="lg:max-w-md w-full bg-slate-50 border border-slate-200 p-3.5 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              User-Defined Flexibility Scale:
            </span>
            <span className="font-mono font-bold text-emerald-700 tabular-nums">
              {flexibilityScale}%
            </span>
          </div>

          <input
            type="range"
            min={20}
            max={100}
            value={flexibilityScale}
            onChange={(e) => onChangeFlexibility(Number(e.target.value))}
            className="w-full accent-slate-900 cursor-pointer"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-600">
            <span className="font-semibold text-slate-900">{flexMeta.title}</span>
            <span className="text-slate-400">· {flexMeta.desc}</span>
          </div>
        </div>
      </div>

      {/* Profile Metadata Strip */}
      <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Living Context</span>
          <span className="font-medium text-slate-800">{activeProfile.householdContext}</span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Kitchen Equipment</span>
          <span className="font-medium text-slate-800">{activeProfile.kitchenEquipment.join(', ')}</span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Target Daily Nutrition & Budget</span>
          <span className="font-mono font-semibold text-slate-900 tabular-nums">
            {activeProfile.targetCalories} kcal · {activeProfile.targetProtein}g Protein · ₹{activeProfile.dailyBudgetINR}/day
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Health Objective</span>
          <span className="font-medium text-emerald-800">{activeProfile.healthFocus}</span>
        </div>
      </div>
    </div>
  );
};
