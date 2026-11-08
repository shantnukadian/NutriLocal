import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { HouseholdManagerView } from './HouseholdManagerView';
import { LocalMarketBoard } from './LocalMarketBoard';

interface HouseholdMandiViewProps {
  profile: UserProfile;
}

export const HouseholdMandiView: React.FC<HouseholdMandiViewProps> = ({ profile }) => {
  const [activeSubTab, setActiveSubTab] = useState<'family' | 'mandi'>(
    profile.role === 'homemaker' ? 'family' : 'mandi'
  );

  return (
    <div className="h-full flex flex-col space-y-3 overflow-hidden">
      {/* Sub-tab switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Household Context & Local Mandi Catalog
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Multi-member meal adaptation and neighborhood market staples.
          </p>
        </div>

        <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setActiveSubTab('family')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeSubTab === 'family'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Cook Once, Adapt for Four
          </button>
          <button
            onClick={() => setActiveSubTab('mandi')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeSubTab === 'mandi'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Local Mandi Ingredients
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        <AnimatePresence mode="wait">
          {activeSubTab === 'family' ? (
            <motion.div
              key="family"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
            >
              <HouseholdManagerView profile={profile} />
            </motion.div>
          ) : (
            <motion.div
              key="mandi"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
            >
              <LocalMarketBoard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
