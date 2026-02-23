import React from 'react';
import { motion } from 'motion/react';
import { Play, Info, AlertCircle } from 'lucide-react';

interface IntroProps {
  onStart: () => void;
  onShowOnboarding: () => void;
}

export const Intro: React.FC<IntroProps> = ({ onStart, onShowOnboarding }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 relative z-10"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-black uppercase tracking-[0.3em] mb-8 border border-emerald-500/20 backdrop-blur-sm"
        >
          Simulation
        </motion.div>
        
        <h1 className="text-7xl font-serif font-bold mb-8 leading-[0.9] tracking-tighter">
          Kais<br />
          <span className="text-emerald-500 italic">Pagi</span>
        </h1>
        
        <p className="text-zinc-400 text-lg max-w-xs mx-auto leading-relaxed font-medium">
          Experience the financial tightrope of low-income life in Malaysia.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 mb-16 w-full max-w-sm relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 rounded-[2rem] text-left flex items-center gap-5 border-white/5 shadow-2xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <span className="text-emerald-500 font-black text-lg">RM</span>
          </div>
          <div>
            <h3 className="font-black text-lg text-white leading-tight">RM 2,500</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.15em] font-black mt-1">Monthly Budget</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass p-6 rounded-[2rem] text-left flex items-center gap-5 border-white/5 shadow-2xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
            <AlertCircle className="text-orange-500" size={24} />
          </div>
          <div>
            <h3 className="font-black text-lg text-white leading-tight">Stress & Debt</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.15em] font-black mt-1">Manage Vitals</p>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-sm relative z-10">
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: '#10b981' }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart} 
          className="btn-primary flex items-center justify-center gap-4 text-xl py-6 rounded-[2rem] shadow-2xl shadow-emerald-900/40"
        >
          <Play size={24} fill="currentColor" />
          Start Simulation
        </motion.button>
        
        <button 
          onClick={onShowOnboarding}
          className="btn-secondary flex items-center justify-center gap-3 text-base py-5 rounded-[2rem] border border-white/5"
        >
          <Info size={20} />
          How it Works
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]"
      >
        Powered by Gemini AI
      </motion.div>
    </div>
  );
};
