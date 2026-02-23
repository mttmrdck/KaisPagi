import React from 'react';
import { motion } from 'motion/react';
import { Home, Play, BarChart2, User, Settings } from 'lucide-react';
import { GameStatus } from '../types';

interface BottomNavProps {
  activeTab: GameStatus;
  onTabChange: (tab: GameStatus) => void;
  isVisible: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, isVisible }) => {
  if (!isVisible) return null;

  const tabs = [
    { id: GameStatus.DASHBOARD, label: 'Home', icon: <Home size={20} /> },
    { id: GameStatus.PLAYING, label: 'Play', icon: <Play size={20} /> },
    { id: GameStatus.STATS, label: 'Stats', icon: <BarChart2 size={20} /> },
    { id: GameStatus.PROFILE, label: 'Profile', icon: <User size={20} /> },
    { id: GameStatus.SETTINGS, label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 z-[100] bg-zinc-950/90 backdrop-blur-xl border-t border-white/5 px-4 pb-8 pt-3 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
    >
      <div className="max-w-md mx-auto flex justify-between items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center gap-1.5 p-2 transition-all"
            >
              <div className={`transition-all duration-300 ${isActive ? 'text-emerald-500 scale-110' : 'text-zinc-500'}`}>
                {tab.icon}
                {isActive && (
                  <motion.div 
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full -z-10"
                  />
                )}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-emerald-500' : 'text-zinc-600'}`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="nav-dot"
                  className="w-1 h-1 bg-emerald-500 rounded-full absolute -bottom-1"
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
};
