import React from 'react';
import { SupplementRecommendation } from '../types';

interface SupplementTriggerCardProps {
  recommendations: SupplementRecommendation[];
  deficiencyDays: number;
}

export const SupplementTriggerCard: React.FC<SupplementTriggerCardProps> = ({
  recommendations,
  deficiencyDays,
}) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
            ⚠
          </span>
          <div>
            <h3 className="text-sm font-bold text-amber-950">
              14-Day Deficit Supplement Trigger Active ({deficiencyDays} Days of Persistent Drift)
            </h3>
            <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
              When a specific nutrient deficit (like bioavailable protein or B12/Iron) persists beyond 14 continuous days despite diet tweaks, clinical guidelines recommend low-cost targeted supplementation rather than forcing unfeasible grocery changes.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded shrink-0">
          Clinical Guardrail
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {recommendations.map((supp) => (
          <div key={supp.id} className="bg-white p-4 rounded-lg border border-amber-200 text-xs space-y-2">
            <div className="flex justify-between items-start">
              <span className="font-bold text-slate-900">{supp.suggestedSupplement}</span>
              <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                ~₹{supp.estimatedCostINR} / dose
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              <strong>Rationale:</strong> {supp.clinicalReason}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Dosage: {supp.dosage}</span>
              <a
                href={`https://${supp.affiliatePlatform.toLowerCase()}.com`}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
              >
                Order on {supp.affiliatePlatform} →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
