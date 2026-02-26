import React from 'react';
import { motion } from 'motion/react';
import { Wallet, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import { GameState } from '../types';

interface DashboardProps {
  state: GameState;
}

export const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const getStressColor = () => {
    if (state.stress > 80) return 'bg-red-500';
    if (state.stress > 50) return 'bg-orange-500';
    return 'bg-emerald-500';
  };


  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto mb-8 shrink-0">
      {/* Top Row: Balance & Day */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="stat-card py-3 px-4"
        >
          <div className="flex items-center gap-2 text-zinc-500 text-[9px] uppercase tracking-[0.15em] font-black">
            <Wallet size={12} className="text-emerald-500" />
            <span>Balance</span>
          </div>
          <div className={`mt-1 font-mono font-black text-lg ${state.money < 100 ? 'text-red-400' : 'text-emerald-400'}`}>
            <span className="text-xs opacity-70 mr-1">RM</span>
            {state.money}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="stat-card py-3 px-4"
        >
          <div className="flex items-center gap-2 text-zinc-500 text-[9px] uppercase tracking-[0.15em] font-black">
            <Calendar size={12} className="text-zinc-400" />
            <span>Timeline</span>
          </div>
          <div className="mt-1 font-mono font-black text-lg text-white">
            Day {state.day}<span className="text-xs text-zinc-500 ml-1">/15</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row: Stress & Debt */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="stat-card py-3 px-4"
        >
          <div className="flex items-center gap-2 text-zinc-500 text-[9px] uppercase tracking-[0.15em] font-black">
            <AlertCircle size={12} className={state.stress > 70 ? 'text-red-500' : ''} />
            <span className={state.stress > 70 ? 'text-red-500' : ''}>Stress</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 bg-zinc-800/50 h-1.5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${state.stress}%` }}
                className={`h-full transition-colors duration-700 ${getStressColor()}`}
              />
            </div>
            <span className={`text-[10px] font-mono font-black ${state.stress > 80 ? 'text-red-500' : 'text-zinc-300'}`}>
              {state.stress}%
            </span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="stat-card py-3 px-4"
        >
          <div className="flex items-center gap-2 text-zinc-500 text-[9px] uppercase tracking-[0.15em] font-black">
            <TrendingUp size={12} className="text-orange-400" />
            <span>Debt</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 bg-zinc-800/50 h-1.5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (state.debt / 2000) * 100)}%` }}
                className={`h-full ${state.debt > 1500 ? 'bg-red-500' : 'bg-orange-500'}`}
              />
            </div>
            <span className={`text-[10px] font-mono font-black ${state.debt > 1500 ? 'text-red-400' : 'text-orange-400'}`}>
              RM{state.debt}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
