import React from 'react';
import { motion } from 'motion/react';
import { Play, Wallet, AlertCircle, TrendingUp, Shield, Star } from 'lucide-react';
import { UserProfile, GameState } from '../types';
import { MAX_DAYS } from '../constants';
import { Counter } from './Counter';

interface HomeProps {
  profile: UserProfile;
  ongoingRun: GameState | null;
  onStart: () => void;
  onContinue: () => void;
}

export const Home: React.FC<HomeProps> = ({ profile, ongoingRun, onStart, onContinue }) => {
  return (
    <div className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full gap-8 pb-32">
      <header className="flex justify-between items-start">
        <div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Welcome back,</p>
          <h2 className="text-3xl font-serif font-bold text-white">{profile.username}</h2>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-1">
            <Shield size={12} className="text-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">{profile.rank}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={10} className="text-amber-400" fill="currentColor" />
            <span className="text-[10px] font-mono font-black text-zinc-400">{profile.eloScore}</span>
          </div>
        </div>
      </header>

      {/* Control Center Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[3rem] p-10 relative overflow-hidden border-emerald-500/20 shadow-2xl"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Wallet size={100} className="text-emerald-500" />
        </div>
        
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-6">Current Balance</p>
          <div className="flex items-baseline gap-2 mb-10">
            <span className="text-zinc-500 text-lg font-bold">RM</span>
            <span className="text-5xl font-mono font-black text-white">
              <Counter value={ongoingRun ? ongoingRun.money : 2500} />
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2">Stress Level</p>
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className={ongoingRun && ongoingRun.stress > 70 ? 'text-red-400' : 'text-orange-400'} />
                <span className="text-xl font-mono font-black text-white">
                  <Counter value={ongoingRun ? ongoingRun.stress : 20} />%
                </span>
              </div>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2">Opportunity</p>
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-blue-400" />
                <span className="text-xl font-mono font-black text-white">
                  <Counter value={ongoingRun ? ongoingRun.opportunity : 50} />%
                </span>
              </div>
            </div>
          </div>

          {ongoingRun ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Day {ongoingRun.day} of {MAX_DAYS}</span>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{Math.round((ongoingRun.day / MAX_DAYS) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${(ongoingRun.day / MAX_DAYS) * 100}%` }}
                   className="h-full bg-emerald-500"
                />
              </div>
            </div>
          ) : (
            <p className="text-zinc-500 text-xs italic text-center">No active journey. Ready to start?</p>
          )}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4">
        {ongoingRun ? (
          <button 
            onClick={onContinue}
            className="btn-primary flex items-center justify-center gap-4 py-6 rounded-[2.5rem] text-xl shadow-2xl shadow-emerald-900/40"
          >
            <Play size={24} fill="currentColor" />
            Continue Journey
          </button>
        ) : (
          <button 
            onClick={onStart}
            className="btn-primary flex items-center justify-center gap-4 py-6 rounded-[2.5rem] text-xl shadow-2xl shadow-emerald-900/40"
          >
            <Play size={24} fill="currentColor" />
            Start New Run
          </button>
        )}
        
        {ongoingRun && (
          <button 
            onClick={onStart}
            className="btn-secondary py-5 rounded-[2.5rem] text-zinc-400 font-bold uppercase tracking-widest text-[10px]"
          >
            Restart Journey
          </button>
        )}
      </div>
    </div>
  );
};
