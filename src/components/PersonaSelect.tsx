import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PERSONAS } from '../constants';
import { PersonaType } from '../types';
import { ArrowLeft, ChevronRight, Zap, Shield, TrendingUp, Briefcase, GraduationCap, Users, Laptop, Palette } from 'lucide-react';

interface PersonaSelectProps {
  onSelect: (type: PersonaType) => void;
  onBack: () => void;
}

const PERSONA_ICONS: Record<string, React.ReactNode> = {
  hustler: <Briefcase size={32} />,
  student: <GraduationCap size={32} />,
  family: <Users size={32} />,
  techie: <Laptop size={32} />,
  creative: <Palette size={32} />,
};

export const PersonaSelect: React.FC<PersonaSelectProps> = ({ onSelect, onBack }) => {
  const [selected, setSelected] = useState<PersonaType>('hustler');

  const persona = PERSONAS[selected];

  return (
    <div className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full pb-32">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 transition-colors border border-white/5"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-serif font-bold">Choose Persona</h1>
        <div className="w-10" />
      </div>

      <div className="grid grid-cols-5 gap-3 mb-8">
        {(Object.keys(PERSONAS) as PersonaType[]).map((type) => (
          <button
            key={type}
            onClick={() => setSelected(type)}
            className={`aspect-square rounded-2xl flex items-center justify-center transition-all border ${
              selected === type 
                ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-900/40 scale-110 z-10' 
                : 'bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10'
            }`}
          >
            {PERSONA_ICONS[type]}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex-1 flex flex-col"
        >
          <div className="glass rounded-[3rem] p-8 mb-8 flex-1 border-emerald-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              {PERSONA_ICONS[selected]}
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                  {PERSONA_ICONS[selected]}
                </div>
                <div>
                  <h2 className="text-3xl font-serif font-bold text-white">{persona.name}</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Active Ability</p>
                </div>
              </div>

              <p className="text-zinc-400 text-lg mb-8 leading-relaxed italic">
                "{persona.description}"
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <Zap size={18} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Passive Trait</h4>
                    <p className="text-sm text-zinc-200 font-medium leading-relaxed">{persona.passiveAbility}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Starting Money</p>
                    <p className="text-xl font-mono font-black text-white">RM {persona.startingMoney}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Base Stress</p>
                    <p className="text-xl font-mono font-black text-white">{persona.startingStress}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onSelect(selected)}
            className="btn-primary w-full py-6 rounded-[2.5rem] text-xl shadow-2xl shadow-emerald-900/40 flex items-center justify-center gap-3"
          >
            Start Journey
            <ChevronRight size={24} />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
