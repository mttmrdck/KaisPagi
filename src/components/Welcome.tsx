import React from 'react';
import { motion } from 'motion/react';
import { Play, UserPlus, LogIn, UserCircle } from 'lucide-react';

interface WelcomeProps {
  onAction: (action: 'login' | 'signup' | 'guest') => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onAction }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 relative z-10"
      >
        <h1 className="text-7xl font-serif font-bold mb-8 leading-[0.9] tracking-tighter">
          Kais<br />
          <span className="text-emerald-500 italic">Pagi</span>
        </h1>
        
        <p className="text-zinc-400 text-xl max-w-xs mx-auto leading-relaxed font-medium">
          Survive the financial tightrope of low-income life in Malaysia.
        </p>
      </motion.div>

      <div className="flex flex-col gap-4 w-full max-w-sm relative z-10">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction('signup')} 
          className="btn-primary flex items-center justify-center gap-4 text-xl py-6 rounded-[2rem] shadow-2xl shadow-emerald-900/40"
        >
          <UserPlus size={24} />
          Create Account
        </motion.button>
        
        <button 
          onClick={() => onAction('login')}
          className="btn-secondary flex items-center justify-center gap-3 text-lg py-5 rounded-[2rem] border border-white/5"
        >
          <LogIn size={20} />
          Login
        </button>

        <button 
          onClick={() => onAction('guest')}
          className="mt-4 text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px] hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <UserCircle size={14} />
          Continue as Guest
        </button>
      </div>
    </div>
  );
};
