import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
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
    <div className="bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl p-6 space-y-4 shadow-xs transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200">
              14-Day Deficit Supplement Trigger Active ({deficiencyDays} Days of Persistent Drift)
            </h3>
            <p className="text-xs text-amber-900 dark:text-amber-300/90 mt-0.5 leading-relaxed">
              When a specific nutrient deficit (like bioavailable protein or B12/Iron) persists beyond 14 continuous days despite diet tweaks, clinical guidelines recommend low-cost targeted supplementation rather than forcing unfeasible grocery changes.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700 px-2.5 py-1 rounded shrink-0">
          Clinical Guardrail
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {recommendations.map((supp) => (
          <div key={supp.id} className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-amber-200 dark:border-amber-900/60 text-xs space-y-2 shadow-xs">
            <div className="flex justify-between items-start">
              <span className="font-bold text-slate-900 dark:text-white">{supp.suggestedSupplement}</span>
              <span className="font-mono text-emerald-800 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 px-2 py-0.5 rounded">
                ~₹{supp.estimatedCostINR} / dose
              </span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Rationale:</strong> {supp.clinicalReason}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">Dosage: {supp.dosage}</span>
              <a
                href={`https://${supp.affiliatePlatform.toLowerCase()}.com`}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 cursor-pointer flex items-center gap-1"
              >
                Order on {supp.affiliatePlatform} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
