import React from 'react';
import { motion } from 'motion/react';
import { GameState, AIAnalysis } from '../types';
import { MAX_DAYS } from '../constants';
import ReactMarkdown from 'react-markdown';
import { RefreshCw, Share2, BookOpen, Star, Shield, TrendingUp } from 'lucide-react';
import { Counter } from './Counter';

interface GameOverProps {
  state: GameState;
  analysis: AIAnalysis | null;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ state, analysis, onRestart, onBackToMenu }) => {
  const getRating = () => {
    if (state.day > MAX_DAYS) {
      if (state.money > 1000) return { label: 'Financial Master', color: 'text-emerald-400', elo: 800 };
      if (state.money > 0) return { label: 'Survivor', color: 'text-blue-400', elo: 500 };
      return { label: 'Barely Made It', color: 'text-orange-400', elo: 300 };
    }
    if (state.stress >= 100) return { label: 'Burned Out', color: 'text-red-400', elo: state.day * 10 };
    return { label: 'Bankrupt', color: 'text-red-500', elo: state.day * 10 };
  };

  const rating = getRating();

  return (
    <div className="max-w-md mx-auto w-full flex flex-col gap-8">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <h1 className="text-5xl font-serif font-bold mb-3 tracking-tight">
          {state.day > MAX_DAYS ? 'Journey Complete' : 'Journey Ended'}
        </h1>
        <p className="text-zinc-500 text-[11px] uppercase tracking-[0.3em] font-black mb-8">
          Day {state.day} of {MAX_DAYS}
        </p>
        
        <div className="flex flex-col items-center gap-4">
          <div className="inline-block px-6 py-2 rounded-full bg-white/5 border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mr-2">Rating:</span>
            <span className={`text-sm font-bold uppercase tracking-widest ${rating.color}`}>{rating.label}</span>
          </div>

          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.5 }}
            className="flex items-center gap-3 px-6 py-3 rounded-3xl bg-amber-500/10 border border-amber-500/20 shadow-xl shadow-amber-900/20"
          >
            <Star size={20} className="text-amber-400" fill="currentColor" />
            <div className="flex flex-col items-start">
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-500/60">ELO Earned</span>
              <span className="text-2xl font-mono font-black text-white">+{rating.elo}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="glass rounded-[3rem] p-10 shadow-2xl border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-emerald-500/5 to-transparent pointer-events-none" />
        
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-8 flex items-center gap-3 relative z-10">
          <BookOpen size={16} className="text-emerald-500" />
          Final Household Stats
        </h3>
        
        <div className="grid grid-cols-2 gap-10 relative z-10">
          <div className="flex flex-col">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-black mb-2">Savings</span>
            <div className={`text-3xl font-mono font-black flex items-baseline gap-1 ${state.money < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              <span className="text-sm opacity-60">RM</span>
              <Counter value={state.money} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-black mb-2">Total Debt</span>
            <div className="text-3xl font-mono font-black text-red-400 flex items-baseline gap-1">
              <span className="text-sm opacity-60">RM</span>
              <Counter value={state.debt} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-black mb-2">Stress</span>
            <div className="text-3xl font-mono font-black text-orange-400 flex items-baseline gap-1">
              <Counter value={state.stress} />
              <span className="text-sm opacity-60">%</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-black mb-2">Active Loans</span>
            <div className="text-3xl font-mono font-black text-blue-400 flex items-baseline gap-1">
              <Counter value={state.loans.filter(l => l.remainingAmount > 0).length} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: '#10b981' }}
          whileTap={{ scale: 0.98 }}
          onClick={onRestart} 
          className="btn-primary flex items-center justify-center gap-4 py-6 rounded-[2rem] shadow-2xl shadow-emerald-900/40 text-xl"
        >
          <RefreshCw size={24} />
          Restart Simulation
        </motion.button>
        <button 
          onClick={onBackToMenu}
          className="btn-secondary flex items-center justify-center gap-3 py-5 rounded-[2rem] border border-white/5"
        >
          <Share2 size={20} />
          Back to Main Menu
        </button>
      </div>

      {analysis ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-[3rem] p-10 mt-4 border-emerald-500/10"
        >
          <h2 className="text-3xl font-serif font-bold mb-8 text-emerald-400 leading-tight">AI Deep Dive</h2>
          
          <div className="space-y-10">
            <div className="text-zinc-300 leading-relaxed text-base font-medium">
              <ReactMarkdown>{analysis.summary}</ReactMarkdown>
            </div>
            
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-6">Structural Barriers</h3>
              <div className="flex flex-col gap-4">
                {analysis.structuralInsights.map((insight, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="p-6 bg-white/5 rounded-[2rem] border border-white/5 text-zinc-400 text-sm leading-relaxed font-medium"
                  >
                    {insight}
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-6">The Poverty Trap</h3>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="text-zinc-200 text-base leading-relaxed bg-emerald-900/10 p-8 rounded-[2.5rem] border border-emerald-500/20 italic font-medium"
              >
                <ReactMarkdown>{analysis.povertyCycleExplanation}</ReactMarkdown>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 glass rounded-[3rem] mt-4">
          <RefreshCw className="animate-spin text-emerald-500 mb-6" size={48} />
          <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.3em]">Analyzing Journey...</p>
        </div>
      )}
    </div>
  );
};
