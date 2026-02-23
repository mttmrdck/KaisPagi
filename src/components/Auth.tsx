import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Lock, User, ShieldCheck } from 'lucide-react';

interface AuthProps {
  mode: 'login' | 'signup';
  onBack: () => void;
  onSuccess: (userData: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ mode, onBack, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    difficulty: 'normal'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    onSuccess({
      username: formData.username || formData.email.split('@')[0],
      email: formData.email
    });
  };

  return (
    <div className="flex-1 flex flex-col p-8 max-w-md mx-auto w-full">
      <button 
        onClick={onBack}
        className="self-start p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 transition-colors mb-8 border border-white/5"
      >
        <ArrowLeft size={20} />
      </button>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h2 className="text-4xl font-serif font-bold mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-zinc-500 text-sm mb-10">
          {isLogin ? 'Enter your details to continue your journey.' : 'Join the simulation and test your survival skills.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Username</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-white focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all"
                  placeholder="Your name"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-white focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all"
                placeholder="email@example.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-white focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Difficulty</label>
              <div className="grid grid-cols-3 gap-3">
                {['easy', 'normal', 'hard'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setFormData({...formData, difficulty: d as any})}
                    className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      formData.difficulty === d 
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' 
                        : 'bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary w-full py-5 rounded-[2rem] text-lg shadow-2xl shadow-emerald-900/40 mt-4">
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-zinc-500 text-sm hover:text-white transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
