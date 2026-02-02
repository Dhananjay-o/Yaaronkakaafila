import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, User, ShieldCheck } from 'lucide-react';
import { Donation, SortOption } from '../types';
import { getFormattedCurrency } from '../services/storage';

interface ScoreboardProps {
  donations: Donation[];
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ donations }) => {
  const [sortBy, setSortBy] = useState<SortOption>(SortOption.LATEST);

  // Strictly filter only verified donations
  const verifiedDonations = donations.filter(d => d.status === 'verified');

  const sortedDonations = [...verifiedDonations].sort((a, b) => {
    if (sortBy === SortOption.HIGHEST) {
      return b.amount - a.amount;
    }
    return b.timestamp - a.timestamp; // Latest
  });

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return '1d+ ago';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-accent-500" />
          Community Heroes
        </h2>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setSortBy(SortOption.LATEST)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              sortBy === SortOption.LATEST
                ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => setSortBy(SortOption.HIGHEST)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              sortBy === SortOption.HIGHEST
                ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            Highest
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {sortedDonations.length === 0 ? (
          <div className="text-center py-10 text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <p>No verified donations yet.</p>
            <p className="text-sm mt-1">Be the first to join the Kaafila!</p>
          </div>
        ) : (
          sortedDonations.slice(0, 10).map((d, index) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index < 3 && sortBy === SortOption.HIGHEST ? 'bg-accent-100 text-accent-600' : 'bg-brand-50 dark:bg-slate-700 text-brand-600 dark:text-brand-400'
                }`}>
                  {index === 0 && sortBy === SortOption.HIGHEST ? (
                    <Trophy className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white text-sm">
                    {d.donorName}
                    <ShieldCheck className="w-3 h-3 text-green-500" />
                  </div>
                  {d.message && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-1">
                      "{d.message}"
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-slate-900 dark:text-white">
                  {getFormattedCurrency(d.amount)}
                </div>
                <div className="flex items-center justify-end text-xs text-slate-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {getTimeAgo(d.timestamp)}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};