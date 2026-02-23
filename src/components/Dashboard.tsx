import React from 'react';
import { motion } from 'motion/react';
import { Wallet, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import { GameState } from '../types';

interface DashboardProps {
  state: GameState;
}

export const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const getStressColor = () => {
    if (state.stress > 80) return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
    if (state.stress > 50) return 'bg-orange-500';
    return 'bg-emerald-500';
  };

  const getStressAnimation = () => {
    if (state.stress > 90) return {
      scale: [1, 1.05, 1],
      x: [0, -1, 1, -1, 1, 0],
      transition: { duration: 0.2, repeat: Infinity }
    };
    if (state.stress > 70) return {
      scale: [1, 1.03, 1],
      transition: { duration: 0.5, repeat: Infinity }
    };
    if (state.stress > 40) return {
      scale: [1, 1.01, 1],
      transition: { duration: 1.5, repeat: Infinity }
    };
    return {};
  };

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto mb-8 shrink-0">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="stat-card py-4 px-5"
      >
        <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase tracking-[0.15em] font-black">
          <AlertCircle size={12} className={state.stress > 70 ? 'text-red-500 animate-pulse' : ''} />
          <span className={state.stress > 70 ? 'text-red-500' : ''}>Stress</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex-1 bg-zinc-800/50 h-2 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ 
                width: `${state.stress}%`,
                ...getStressAnimation()
              }}
              className={`h-full transition-colors duration-700 ${getStressColor()}`}
            />
          </div>
          <span className={`text-xs font-mono font-black ${state.stress > 80 ? 'text-red-500' : 'text-zinc-300'}`}>
            {state.stress}%
          </span>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="stat-card py-4 px-5"
      >
        <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase tracking-[0.15em] font-black">
          <TrendingUp size={12} className="text-blue-400" />
          <span>Opportunity</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex-1 bg-zinc-800/50 h-2 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${state.opportunity}%` }}
              className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
            />
          </div>
          <span className="text-xs font-mono font-black text-blue-400">{state.opportunity}%</span>
        </div>
      </motion.div>
    </div>
  );
};
