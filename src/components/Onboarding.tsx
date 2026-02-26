import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X, Wallet, AlertCircle, TrendingUp, Flag, ChevronsRightLeft, ChevronLeft } from 'lucide-react';

interface OnboardingProps {
  onClose: () => void;
}

const steps = [
  {
    title: "The Objective",
    description: "Survive 15 days on a limited monthly income of the Persona that you choose. Every ringgit counts in the B40 reality.",
    icon: <Flag className="text-emerald-500" size={32} />,
    color: "emerald"
  },
  {
    title: "Core Stats",
    description: "Money: Your lifeline.  \nStress: High level leads to burned out.  \nDebt: Taking loans increases your debt burden.",
    icon: <Wallet className="text-blue-500" size={32} />,
    color: "blue"
  },
  {
    title: "Decision System",
    description: "Every choice has a cost. Balancing immediate needs against long-term stability is the key to survival.",
    icon: <TrendingUp className="text-orange-500" size={32} />,
    color: "orange"
  },
  {
    title: "End Condition",
    description: "Reach Day 15 without going bankrupt or collapsing from stress. Can you break the cycle?",
    icon: <AlertCircle className="text-red-500" size={32} />,
    color: "red"
  }
];

export const Onboarding: React.FC<OnboardingProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };
  const prevStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onClose();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex justify-center p-4 sm:p-6 bg-zinc-950/95 overflow-y-auto"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass w-full max-w-md rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border-white/10 my-auto relative"
      >
        <div className="p-8 pt-12 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-zinc-500 transition-colors"
          >
            <X size={20} />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center"
            >
              <div className={`w-20 h-20 rounded-3xl bg-zinc-900 flex items-center justify-center mb-8 border border-white/5`}>
                {steps[currentStep].icon}
              </div>
              
              <h2 className="text-3xl font-serif font-bold mb-4 text-white">
                {steps[currentStep].title}
              </h2>
              
              <p className="text-zinc-400 text-lg leading-relaxed mb-10 px-4">
                {steps[currentStep].description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center gap-4">
            <button 
              onClick={prevStep}
              className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div 
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentStep ? 'w-6 bg-emerald-500' : 'w-1.5 bg-zinc-800'
                  }`}
                />
              ))}
            </div>

            <button 
              onClick={nextStep}
              className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
