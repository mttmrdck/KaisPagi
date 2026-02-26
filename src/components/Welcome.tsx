import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, UserCircle, ChevronRight } from 'lucide-react';

interface WelcomeProps {
  onAction: (action: 'signup' | 'guest', username?: string) => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onAction }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onAction('signup', username.trim());
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 relative z-10"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12 border border-emerald-500/20"
        >
          Welcome to the Tightrope
        </motion.div>

        <h1 className="text-8xl font-serif font-bold mb-10 leading-[0.85] tracking-tighter">
          Kais<br />
          <span className="text-emerald-500 italic">Pagi</span>
        </h1>
        
        <p className="text-zinc-400 text-xl max-w-xs mx-auto leading-relaxed font-medium">
          Survive the financial tightrope of low-income life in Malaysia.
        </p>
      </motion.div>

      <div className="w-full max-w-sm relative z-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative group">
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] px-10 py-6 text-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-all text-center font-bold"
              required
            />
            <div className="absolute inset-0 rounded-[2.5rem] bg-emerald-500/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity" />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!username.trim()}
            className="btn-primary flex items-center justify-center gap-4 text-xl py-7 rounded-[2.5rem] shadow-2xl shadow-emerald-900/40 disabled:opacity-50 disabled:grayscale disabled:scale-100 group"
          >
            Begin Journey
            <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </form>
        
        <button 
          onClick={() => onAction('guest')}
          className="mt-10 text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px] hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <UserCircle size={14} />
          Continue as Guest
        </button>
      </div>
    </div>
  );
};