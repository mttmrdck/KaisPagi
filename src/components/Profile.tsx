import React from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { User, Trophy, Wallet, AlertCircle, TrendingUp, Trash2, Shield, Star } from 'lucide-react';
import { Counter } from './Counter';

interface ProfileProps {
  profile: UserProfile;
  onReset: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ profile, onReset }) => {
  const confirmReset = () => {
    if (window.confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
      onReset();
    }
  };

  return (
    <div className="max-w-md mx-auto w-full flex flex-col gap-8 p-6 pb-32">
      <div className="flex items-center justify-center mb-4">
        <h1 className="text-2xl font-serif font-bold">User Profile</h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[3rem] p-10 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-emerald-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="w-24 h-24 rounded-[2rem] bg-zinc-800 flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-2xl">
            <User size={48} className="text-emerald-500" />
          </div>
          
          <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
              <Shield size={12} />
              {profile.rank} Rank
            </span>
          </div>
          
          <h2 className="text-3xl font-serif font-bold text-white mb-2">{profile.username}</h2>
          <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest mb-6">Member since {profile.memberSince}</p>

          <div className="flex items-center justify-center gap-2">
            <Star size={14} className="text-amber-400" fill="currentColor" />
            <span className="text-xl font-mono font-black text-white">
              <Counter value={profile.eloScore} />
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">ELO</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={<Trophy size={16} className="text-amber-400" />}
          label="Runs Completed"
          value={profile.runsCompleted}
        />
        <StatCard 
          icon={<Wallet size={16} className="text-emerald-400" />}
          label="Best Savings"
          value={profile.bestSavings}
          prefix="RM"
        />
      </div>

      {/* Achievements Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Achievements ({profile.achievements.length})</h3>
        <div className="grid grid-cols-1 gap-3">
          {profile.achievements.length > 0 ? (
            profile.achievements.map((ach) => (
              <motion.div 
                key={ach.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass p-5 rounded-[2rem] flex items-center gap-5 border-emerald-500/10"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-2xl">
                  {ach.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{ach.name}</h4>
                  <p className="text-[10px] text-zinc-500 font-medium">{ach.description}</p>
                </div>
                <div className="ml-auto text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                  Unlocked
                </div>
              </motion.div>
            ))
          ) : (
            <div className="glass p-8 rounded-[2rem] text-center border-white/5">
              <p className="text-zinc-500 text-xs italic">No achievements unlocked yet. Start a run to earn them!</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <button 
          onClick={confirmReset}
          className="flex items-center justify-center gap-3 py-4 text-red-500 font-bold uppercase tracking-widest text-[10px] hover:bg-red-500/10 rounded-2xl transition-colors"
        >
          <Trash2 size={14} />
          Reset All Data
        </button>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, prefix, suffix }) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className="glass p-6 rounded-[2rem] border-white/5 shadow-xl"
  >
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{label}</span>
    </div>
    <div className="text-2xl font-mono font-black text-white flex items-baseline gap-1">
      {prefix && <span className="text-xs opacity-50">{prefix}</span>}
      <Counter value={value} />
      {suffix && <span className="text-xs opacity-50">{suffix}</span>}
    </div>
  </motion.div>
);
