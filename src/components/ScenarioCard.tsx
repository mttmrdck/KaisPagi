import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Loader2, 
  Wrench, 
  Bus, 
  Users, 
  ShoppingBag, 
  HeartPulse, 
  Briefcase, 
  Banknote, 
  Zap, 
  ArrowRight 
} from 'lucide-react';
import { PERSONAS } from '../constants';
import { PersonaType, Scenario, Choice } from '../types';

interface ScenarioCardProps {
  scenario: Scenario | null;
  onChoice: (choice: Choice) => void;
  loading: boolean;
  personaType?: PersonaType;
}

const getChoiceIcon = (text: string) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('repair') || lowerText.includes('fix')) return <Wrench size={18} />;
  if (lowerText.includes('transport') || lowerText.includes('bus') || lowerText.includes('grab')) return <Bus size={18} />;
  if (lowerText.includes('borrow') || lowerText.includes('relative') || lowerText.includes('friend')) return <Users size={18} />;
  if (lowerText.includes('buy') || lowerText.includes('food') || lowerText.includes('grocery')) return <ShoppingBag size={18} />;
  if (lowerText.includes('hospital') || lowerText.includes('doctor') || lowerText.includes('clinic')) return <HeartPulse size={18} />;
  if (lowerText.includes('work') || lowerText.includes('job') || lowerText.includes('overtime')) return <Briefcase size={18} />;
  if (lowerText.includes('pay') || lowerText.includes('bill')) return <Banknote size={18} />;
  return <Zap size={18} />;
};

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onChoice, loading, personaType = 'hustler' }) => {
  const [pendingChoice, setPendingChoice] = React.useState<Choice | null>(null);
  const persona = PERSONAS[personaType];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-md mx-auto">
        <div className="relative">
          <Loader2 className="animate-spin text-emerald-500" size={64} />
          <div className="absolute inset-0 blur-2xl bg-emerald-500/30 animate-pulse rounded-full" />
        </div>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] mt-8 text-[10px]">Consulting the AI...</p>
      </div>
    );
  }

  if (!scenario) return null;

  // Split description into lines for tension
  const descriptionLines = scenario.description.split('. ').filter(line => line.length > 0);

  const handleConfirm = () => {
    if (pendingChoice) {
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      onChoice(pendingChoice);
      setPendingChoice(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto flex flex-col gap-10"
    >
      <div className="glass rounded-[3rem] overflow-hidden shadow-2xl border-white/5 relative">
        {/* Visual Header Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-emerald-500/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <span className="text-8xl">{persona.icon}</span>
        </div>
        
        <div className="p-8 pt-10 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <span className="px-3 py-1 rounded-full bg-zinc-800/80 text-zinc-400 text-[10px] uppercase tracking-[0.2em] font-black border border-white/5 backdrop-blur-sm">
              {scenario.category}
            </span>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-xs">{persona.icon}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">{persona.name}</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-serif font-bold mb-6 text-white leading-[1.1] tracking-tight">
            {scenario.title}
          </h2>
          
          <div className="space-y-4">
            {descriptionLines.map((line, i) => (
              <motion.p 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="text-zinc-300 leading-relaxed text-lg font-medium"
              >
                {line}{i === descriptionLines.length - 1 ? '' : '.'}
              </motion.p>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {scenario.choices.map((choice, index) => (
          <motion.button
            key={index}
            whileHover={{ y: -4, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPendingChoice(choice)}
            className="group flex items-center gap-6 p-7 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all text-left shadow-xl relative overflow-hidden min-h-[80px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              {getChoiceIcon(choice.text)}
            </div>
            
            <div className="flex-1">
              <span className="text-zinc-100 font-bold mb-1.5 block text-lg leading-tight group-hover:text-emerald-400 transition-colors">
                {choice.text}
              </span>
              <div className="flex gap-4 text-[11px] font-mono font-black uppercase tracking-wider">
                {choice.impact.money !== 0 && (
                  <span className={choice.impact.money! < 0 ? 'text-red-400' : 'text-emerald-400'}>
                    {choice.impact.money! < 0 ? '-' : '+'}RM{Math.abs(choice.impact.money!)}
                  </span>
                )}
                {choice.impact.stress !== 0 && (
                  <span className={choice.impact.stress! > 0 ? 'text-orange-400' : 'text-blue-400'}>
                    {choice.impact.stress! > 0 ? '+' : '-'}{Math.abs(choice.impact.stress!)} Stress
                  </span>
                )}
              </div>
            </div>

            <ArrowRight size={20} className="text-zinc-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </motion.button>
        ))}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {pendingChoice && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center p-6 bg-zinc-950/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="glass w-full max-w-md rounded-[3rem] p-8 shadow-2xl border-white/10 mb-4"
            >
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-6 text-center">Confirm Decision</h3>
              
              <div className="bg-white/5 rounded-[2rem] p-6 mb-8 border border-white/5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    {getChoiceIcon(pendingChoice.text)}
                  </div>
                  <span className="text-xl font-bold text-white leading-tight flex-1">{pendingChoice.text}</span>
                </div>
                
                <div className="flex gap-6 pt-4 border-t border-white/5">
                  {pendingChoice.impact.money !== 0 && (
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Money</span>
                      <span className={`text-lg font-mono font-black ${pendingChoice.impact.money! < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {pendingChoice.impact.money! < 0 ? '-' : '+'}RM{Math.abs(pendingChoice.impact.money!)}
                      </span>
                    </div>
                  )}
                  {pendingChoice.impact.stress !== 0 && (
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Stress</span>
                      <span className={`text-lg font-mono font-black ${pendingChoice.impact.stress! > 0 ? 'text-orange-400' : 'text-blue-400'}`}>
                        {pendingChoice.impact.stress! > 0 ? '+' : '-'}{Math.abs(pendingChoice.impact.stress!)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleConfirm}
                  className="btn-primary py-5 rounded-[2rem] text-lg shadow-2xl shadow-emerald-900/40"
                >
                  Confirm Decision
                </button>
                <button 
                  onClick={() => setPendingChoice(null)}
                  className="btn-secondary py-4 rounded-[2rem] text-zinc-400"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};