import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { MasterPromptView } from './MasterPromptView';
import { PMRulesSandbox } from './PMRulesSandbox';

interface PMBlueprintWorkbenchViewProps {
  profile: UserProfile;
  flexibilityScale: number;
  onChangeFlexibility: (val: number) => void;
}

export const PMBlueprintWorkbenchView: React.FC<PMBlueprintWorkbenchViewProps> = ({
  profile,
  flexibilityScale,
  onChangeFlexibility,
}) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'sandbox'>('prompt');

  return (
    <div className="h-full flex flex-col space-y-3 overflow-hidden">
      {/* Top Header Strip with Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Product Management Blueprint & Rules Engine
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Consolidated AI Studio master prompt, PM gap audit, and live rule tuning.
          </p>
        </div>

        <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'prompt'
                ? 'bg-blue-700 text-white dark:bg-blue-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            ★ Master Prompt & Review
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'sandbox'
                ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Live Rule Sandbox
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        <AnimatePresence mode="wait">
          {activeTab === 'prompt' ? (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
            >
              <MasterPromptView />
            </motion.div>
          ) : (
            <motion.div
              key="sandbox"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
            >
              <PMRulesSandbox
                profile={profile}
                flexibilityScale={flexibilityScale}
                onChangeFlexibility={onChangeFlexibility}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
