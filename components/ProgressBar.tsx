import React from 'react';
import { motion } from 'framer-motion';
import { getFormattedCurrency } from '../services/storage';

interface ProgressBarProps {
  current: number;
  target: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, target }) => {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-end mb-2">
        <div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Raised so far</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {getFormattedCurrency(current)}
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Goal</span>
          <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">
            {getFormattedCurrency(target)}
          </div>
        </div>
      </div>
      
      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-400 to-brand-600"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
      <div className="mt-2 text-xs text-center text-brand-600 dark:text-brand-400 font-medium">
        {percentage.toFixed(1)}% Funded
      </div>
    </div>
  );
};