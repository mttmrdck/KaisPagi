import React from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { TrendingUp, AlertCircle, Target, Shield, Star } from 'lucide-react';
import { Counter } from './Counter';
import { RANKS } from '../constants';

interface StatsProps {
  profile: UserProfile;
}

export const Stats: React.FC<StatsProps> = ({ profile }) => {
  const nextRank = RANKS.find(r => r.minScore > profile.eloScore) || RANKS[RANKS.length - 1];
  const currentRank = RANKS.reduce((acc, rank) => profile.eloScore >= rank.minScore ? rank : acc, RANKS[0]);
  const progress = nextRank === currentRank ? 100 : ((profile.eloScore - currentRank.minScore) / (nextRank.minScore - currentRank.minScore)) * 100;

  return (
    <div className="max-w-md mx-auto w-full flex flex-col gap-8 p-6 pb-32">
      <div className="flex items-center justify-center mb-4">
        <h1 className="text-2xl font-serif font-bold">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* ELO & Rank Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[2.5rem] p-8 relative overflow-hidden border-amber-500/20 shadow-2xl shadow-amber-900/10"
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield size={14} className="text-amber-400" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Current Rank</p>
              </div>
              <h3 className="text-4xl font-serif font-bold text-white mb-2">{profile.rank}</h3>
              <div className="flex items-center gap-2">
                <Star size={14} className="text-amber-400" fill="currentColor" />
                <span className="text-xl font-mono font-black text-white">
                  <Counter value={profile.eloScore} />
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">ELO Points</span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-[2rem] bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
              <Shield size={32} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Progress to {nextRank.name}</span>
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-amber-500"
              />
            </div>
            <p className="text-[9px] text-zinc-600 text-center uppercase tracking-widest">
              {nextRank === currentRank ? 'Max Rank Achieved' : `${nextRank.minScore - profile.eloScore} ELO to next rank`}
            </p>
          </div>
        </motion.div>

        {/* Survival Rate Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[2.5rem] p-8 relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">Survival Rate</p>
              <h3 className="text-4xl font-mono font-black text-white">
                <Counter value={Math.round(profile.survivalRate * 100)} />%
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Target size={24} />
            </div>
          </div>
          <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${profile.survivalRate * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-emerald-500"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <StatMiniCard 
            label="Avg End Balance" 
            value={profile.bestSavings / (profile.runsCompleted || 1)} 
            prefix="RM" 
            color="emerald"
          />
          <StatMiniCard 
            label="Avg Stress" 
            value={profile.avgStress} 
            suffix="%" 
            color="orange"
          />
        </div>

        {/* Failure Causes */}
        <div className="glass rounded-[2.5rem] p-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle size={20} className="text-red-400" />
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Common Failure Causes</h3>
          </div>
          <div className="space-y-4">
            {profile.failureCauses && Object.entries(profile.failureCauses).length > 0 ? (
              Object.entries(profile.failureCauses).map(([cause, count], i) => (
                <div key={cause} className="flex flex-col gap-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-zinc-400">{cause}</span>
                    <span className="text-white">{count} times</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500/50" 
                      style={{ width: `${profile.runsCompleted > 0 ? (count / profile.runsCompleted) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 text-xs italic">No failures recorded yet. Keep it up!</p>
            )}
          </div>
        </div>

        {/* Trend Placeholder */}
        <div className="glass rounded-[2.5rem] p-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp size={20} className="text-blue-400" />
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Decision Tendencies</h3>
          </div>
          <div className="flex items-end justify-between h-32 gap-2 px-2">
            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.1 }}
                className="flex-1 bg-blue-500/20 rounded-t-lg border-t border-blue-500/30"
              />
            ))}
          </div>
          <p className="text-center text-[9px] text-zinc-500 uppercase tracking-widest mt-4">Risk Tolerance Over Time</p>
        </div>
      </div>
    </div>
  );
};

const StatMiniCard = ({ label, value, prefix, suffix, color }: any) => (
  <div className="glass p-6 rounded-[2rem] border-white/5">
    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2">{label}</p>
    <div className={`text-xl font-mono font-black text-white flex items-baseline gap-1`}>
      {prefix && <span className="text-xs opacity-50">{prefix}</span>}
      <Counter value={Math.round(value)} />
      {suffix && <span className="text-xs opacity-50">{suffix}</span>}
    </div>
  </div>
);
