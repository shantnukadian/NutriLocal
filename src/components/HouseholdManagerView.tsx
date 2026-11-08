import React, { useState } from 'react';
import { UserProfile, FamilyMember } from '../types';

interface HouseholdManagerViewProps {
  profile: UserProfile;
}

export const HouseholdManagerView: React.FC<HouseholdManagerViewProps> = ({ profile }) => {
  const isHomemaker = profile.role === 'homemaker';

  const defaultFamily: FamilyMember[] = [
    {
      id: 'fam-1',
      name: 'Sunita (Self)',
      relation: 'Self',
      age: 46,
      dietaryNeed: 'Sustained energy, iron density, prevent late afternoon fatigue',
      targetProtein: 65,
      targetCalories: 1850,
      specialRules: ['Loves seasonal vegetables', 'Light oil cooking']
    },
    {
      id: 'fam-2',
      name: 'Babuji (Father-in-law)',
      relation: 'Elder (Diabetic / BP)',
      age: 72,
      dietaryNeed: 'Strict low glycemic index, soft texture, sodium cap (<1500mg), anti-inflammatory',
      targetProtein: 55,
      targetCalories: 1550,
      specialRules: ['Zero white potatoes / refined flour', 'Fenugreek/Methi infusion', 'Easy to chew']
    },
    {
      id: 'fam-3',
      name: 'Rajesh (Spouse)',
      relation: 'Spouse',
      age: 48,
      dietaryNeed: 'High fiber, cholesterol conscious, long workday satiety',
      targetProtein: 75,
      targetCalories: 2100,
      specialRules: ['Tiffin friendly', 'Prefers whole wheat phulkas']
    },
    {
      id: 'fam-4',
      name: 'Ananya (Daughter / Student)',
      relation: 'Child / Student',
      age: 19,
      dietaryNeed: 'High protein for college workouts, calcium, zero junk cravings',
      targetProtein: 70,
      targetCalories: 1950,
      specialRules: ['Enjoys spicy chaat & wraps', 'Paneer & sprout lover']
    }
  ];

  const [activeMemberId, setActiveMemberId] = useState<string>('fam-2');
  const activeMember = defaultFamily.find(m => m.id === activeMemberId) || defaultFamily[0];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Multi-Member Household Context</span>
          <span aria-hidden="true">·</span>
          <span>Shared Kitchen Matrix</span>
          <span aria-hidden="true">·</span>
          <span>"Cook Once, Adapt for Four"</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Multi-Member Household Dietary Engine
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
          The biggest pain point for Indian homemakers is being expected to cook 3 separate meals for elderly diabetic in-laws, growing kids, and working partners. NutriLocal solves this via <strong>Modular Family Adaptation</strong>—cooking one primary base dish in a single cooker or kadai with zero-friction adjustments.
        </p>
      </div>

      {/* Member Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {defaultFamily.map((member) => {
          const isSelected = member.id === activeMemberId;
          return (
            <div
              key={member.id}
              onClick={() => setActiveMemberId(member.id)}
              className={`p-5 rounded-xl border text-xs cursor-pointer transition-all ${
                isSelected
                  ? 'border-slate-900 bg-white shadow-xs ring-1 ring-slate-900'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-center text-slate-500 mb-2">
                <span className="font-semibold text-slate-700">{member.relation}</span>
                <span className="font-mono tabular-nums">{member.age} yrs</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {member.name}
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                {member.dietaryNeed}
              </p>

              <div className="pt-2 border-t border-slate-100 flex justify-between font-mono text-[11px] text-slate-700 tabular-nums">
                <span>{member.targetCalories} kcal</span>
                <span className="text-emerald-700 font-bold">{member.targetProtein}g Protein</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* "Cook Once, Adapt for Four" Concrete Meal Architecture */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide block mb-1">
            Production Culinary Architecture
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            Case Study: Monday Lunch (Base Dish: Lauki-Chana Dal)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            How one 20-minute pressure cooker preparation feeds all 4 members without cooking separate menus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Member 1: Homemaker */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block">Sunita (Homemaker)</span>
            <div className="text-slate-700 font-medium">Standard Plate</div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              1.5 katori dal + 2 whole wheat phulkas + kachumber salad + dahi.
            </p>
            <div className="text-[10px] text-emerald-700 font-mono font-semibold pt-1">
              Zero extra effort · 19g Protein
            </div>
          </div>

          {/* Member 2: Diabetic Elder */}
          <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-amber-950">Babuji (Elder)</span>
              <span className="text-[10px] text-amber-800 font-mono font-bold">Low-GI Cap</span>
            </div>
            <div className="text-amber-900 font-medium">Adapted Plate</div>
            <p className="text-[11px] text-amber-950 leading-relaxed">
              Scoop dal before spicy tadka is added. Pair with 1 ragi-methi roti instead of wheat + extra bowl of cucumber raita.
            </p>
            <div className="text-[10px] text-amber-800 font-mono font-semibold pt-1">
              Glycemic load halved · 17g Protein
            </div>
          </div>

          {/* Member 3: Working Partner */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block">Rajesh (Spouse)</span>
            <div className="text-slate-700 font-medium">Office Tiffin</div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Dal packed in thermos container + 3 ghee phulkas + lemon pickle slice + roasted chana snack box.
            </p>
            <div className="text-[10px] text-slate-700 font-mono font-semibold pt-1">
              High satiety · 22g Protein
            </div>
          </div>

          {/* Member 4: College Student */}
          <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200 space-y-2">
            <span className="font-bold text-blue-950 block">Ananya (Student)</span>
            <div className="text-blue-900 font-medium">High Protein Boost</div>
            <p className="text-[11px] text-blue-950 leading-relaxed">
              Same dal + cube 50g fresh raw paneer directly into the hot bowl + 2 chapatis.
            </p>
            <div className="text-[10px] text-blue-800 font-mono font-semibold pt-1">
              Boosted to 28g Protein in 10 secs
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
