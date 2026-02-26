/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameStatus, GameState, Scenario, Choice, AIAnalysis, UserProfile, UserSettings, PersonaType, RankType } from './types';
import { generateScenario, analyzeGame } from './services/gemini';
import { Welcome } from './components/Welcome';
import { Home } from './components/Home';
import { Intro } from './components/Intro';
import { Dashboard } from './components/Dashboard';
import { ScenarioCard } from './components/ScenarioCard';
import { GameOver } from './components/GameOver';
import { Profile } from './components/Profile';
import { Stats } from './components/Stats';
import { Settings } from './components/Settings';
import { Onboarding } from './components/Onboarding';
import { BottomNav } from './components/BottomNav';
import { PersonaSelect } from './components/PersonaSelect';
import { AlertCircle, TrendingUp, Wallet, User, LayoutDashboard } from 'lucide-react';
import { Counter } from './components/Counter';

import { PERSONAS, ACHIEVEMENTS, RANKS, MAX_DAYS } from './constants';

const INITIAL_PROFILE: UserProfile = {
  id: "guest",
  username: "Guest",
  memberSince: new Date().toLocaleDateString(),
  runsCompleted: 0,
  bestSavings: 0,
  bestDay: 0,
  avgStress: 0,
  totalStress: 0,
  totalDecisions: 0,
  survivalRate: 0,
  failureCauses: {},
  eloScore: 0,
  rank: 'Bronze',
  achievements: []
};

const INITIAL_SETTINGS: UserSettings = {
  soundEnabled: true,
  hapticEnabled: true,
  darkMode: true,
  difficulty: 'normal'
};

const INITIAL_STATE: GameState = {
  day: 1,
  money: 2500,
  debt: 0,
  stress: 20,
  persona: 'hustler',
  loans: [],
  isBlacklisted: false,
  history: []
};

export default function App() {
  const [status, setStatus] = useState<GameStatus>(() => {
    const saved = localStorage.getItem('kaispagi_auth');
    return saved ? GameStatus.DASHBOARD : GameStatus.WELCOME;
  });
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [ongoingRun, setOngoingRun] = useState<GameState | null>(() => {
    const saved = localStorage.getItem('kaispagi_ongoing');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [consequence, setConsequence] = useState<string | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('kaispagi_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...INITIAL_PROFILE, ...parsed };
    }
    return INITIAL_PROFILE;
  });

  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('kaispagi_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...INITIAL_SETTINGS, ...parsed };
    }
    return INITIAL_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('kaispagi_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('kaispagi_settings', JSON.stringify(userSettings));
  }, [userSettings]);

  useEffect(() => {
    if (ongoingRun) {
      localStorage.setItem('kaispagi_ongoing', JSON.stringify(ongoingRun));
    } else {
      localStorage.removeItem('kaispagi_ongoing');
    }
  }, [ongoingRun]);

  const isCrisis = gameState.money < 300 || gameState.stress > 80;
  const showBottomNav = [
    GameStatus.DASHBOARD, 
    GameStatus.PLAYING, 
    GameStatus.STATS, 
    GameStatus.PROFILE, 
    GameStatus.SETTINGS
  ].includes(status) && !consequence;

  const startGame = (personaType: PersonaType = 'hustler') => {
    const persona = PERSONAS[personaType];
    const startingState: GameState = {
      ...INITIAL_STATE,
      money: persona.startingMoney,
      stress: persona.startingStress,
      persona: personaType
    };
    setGameState(startingState);
    setOngoingRun(startingState);
    setStatus(GameStatus.PLAYING);
    fetchNextScenario(startingState);
  };

  const continueGame = () => {
    if (ongoingRun) {
      setGameState(ongoingRun);
      setStatus(GameStatus.PLAYING);
      fetchNextScenario(ongoingRun);
    }
  };

  const fetchNextScenario = async (state: GameState) => {
    setLoading(true);
    try {
      // Check for Debt Consequences first
      if (state.debt > 2000) {
        setCurrentScenario({
          title: "Debt Collectors at the Door",
          description: "Your total debt has reached a critical level. Debt collectors have started calling your workplace and showing up at your home.",
          category: "debt_consequence",
          choices: [
            {
              text: "Beg for more time",
              impact: { stress: 20, money: -100 },
              consequence: "They give you a few more days, but the stress is eating you alive."
            },
            {
              text: "Pay a small amount (RM 200)",
              impact: { money: -200, debt: -200, stress: 10 },
              consequence: "They leave for now, but your wallet is even thinner."
            }
          ]
        });
        setLoading(false);
        return;
      }

      // Check for Ah Long threats
      const ahlongLoan = state.loans.find(l => l.type === 'ahlong');
      if (ahlongLoan && ahlongLoan.daysLeft <= 0 && ahlongLoan.remainingAmount > 0) {
        setCurrentScenario({
          title: "Ah Long Threat",
          description: "You missed the deadline for the Ah Long repayment. They've splashed red paint on your door and sent threatening messages to your family.",
          category: "debt_consequence",
          choices: [
            {
              text: "Hide and hope they go away",
              impact: { stress: 40 },
              consequence: "You live in constant fear. Every knock on the door makes you jump."
            },
            {
              text: "Sell your belongings to pay (RM 500)",
              impact: { money: -500, debt: -500, stress: 15 },
              consequence: "You manage to scrape some money together to appease them for now."
            }
          ]
        });
        setLoading(false);
        return;
      }

      // Check for Loan Trigger
      if (state.money < 500 && !state.isBlacklisted) {
        setCurrentScenario({
          title: "Financial Desperation",
          description: "Your bank account is nearly empty. You need money to survive the coming days. Where will you turn?",
          category: "loan",
          choices: [
            {
              text: `Bank Loan (Borrow RM 1000, repay RM 1200)`,
              impact: { money: 1000, debt: 1200, stress: 5 },
              consequence: "The bank approves your micro-loan. You have some breathing room, but the monthly installments will be tough."
            },
            {
              text: "Ah Long (Borrow RM 1000, repay RM 1500)",
              impact: { money: 1000, debt: 1500, stress: 25 },
              consequence: "The money is in your hands instantly. No questions asked. But you know the risks."
            },
            {
              text: "Borrow from Family (Borrow RM 300)",
              impact: { money: 300, debt: 300, stress: 20 },
              consequence: "Your sister gives you some cash. She says don't worry about the interest, but the guilt weighs heavy."
            },
            {
              text: "Refuse Loan",
              impact: { stress: 10 },
              consequence: "You decide to struggle through. It's going to be a very difficult week."
            }
          ]
        });
        setLoading(false);
        return;
      }

      // If blacklisted, fewer options
      if (state.money < 500 && state.isBlacklisted) {
        setCurrentScenario({
          title: "Blacklisted and Broke",
          description: "Your credit score is ruined from the missed bank payments. No legitimate bank will touch you now. Your options are narrowing.",
          category: "loan",
          choices: [
            {
              text: "Ah Long (Borrow RM 1000, repay RM 1500)",
              impact: { money: 1000, debt: 1500, stress: 25 },
              consequence: "The loan shark doesn't care about your credit score. But they care about their money."
            },
            {
              text: "Borrow from Family (Borrow RM 300)",
              impact: { money: 300, debt: 300, stress: 20 },
              consequence: "You swallow your pride and ask family again. It's getting harder to look them in the eye."
            },
            {
              text: "Refuse Loan",
              impact: { stress: 15 },
              consequence: "You're on your own. Good luck."
            }
          ]
        });
        setLoading(false);
        return;
      }

      const scenario = await generateScenario(state);
      setCurrentScenario(scenario);
    } catch (error) {
      console.error("Failed to generate scenario", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = (choice: Choice) => {
    const persona = PERSONAS[gameState.persona];
    
    // Apply Persona Passive Bonuses
    let moneyImpact = choice.impact.money || 0;
    let stressImpact = choice.impact.stress || 0;
    
    if (gameState.persona === 'hustler' && moneyImpact > 0) {
      moneyImpact *= 1.2; // +20% income
    }
    if (gameState.persona === 'hustler' && stressImpact > 0) {
      stressImpact *= 1.15; // +15% stress increase
    }
    if (gameState.persona === 'student' && currentScenario?.category === 'education') {
      moneyImpact *= 0.7; // 30% cheaper
    }
    if (gameState.persona === 'family' && stressImpact > 0) {
      stressImpact *= 0.8; // 20% slower stress
    }
    if (gameState.persona === 'creative' && stressImpact < 0) {
      stressImpact *= 1.25; // 25% faster stress reduction
    }

    const nextDay = gameState.day + 1;
    let nextMoney = gameState.money + moneyImpact;
    let nextStress = Math.min(100, Math.max(0, gameState.stress + stressImpact));
    let nextDebt = gameState.debt + (choice.impact.debt || 0);
    let nextLoans = [...gameState.loans];
    let nextIsBlacklisted = gameState.isBlacklisted;

    // Handle Loan Creation
    if (currentScenario?.category === 'loan') {
      if (choice.text.includes('Bank Loan')) {
        nextLoans.push({
          type: 'bank',
          totalBorrowed: 1000,
          remainingAmount: 1200,
          dailyRepayment: 240,
          daysLeft: 5,
          dayBorrowed: gameState.day
        });
      } else if (choice.text.includes('Ah Long')) {
        nextLoans.push({
          type: 'ahlong',
          totalBorrowed: 1000,
          remainingAmount: 1500,
          dailyRepayment: 500,
          daysLeft: 3,
          dayBorrowed: gameState.day
        });
      } else if (choice.text.includes('Family')) {
        nextLoans.push({
          type: 'family',
          totalBorrowed: 300,
          remainingAmount: 300,
          dailyRepayment: 50,
          daysLeft: 6,
          dayBorrowed: gameState.day
        });
      }
    }

    // Daily Debt Deduction
    nextLoans = nextLoans.map(loan => {
      if (loan.daysLeft > 0 && loan.remainingAmount > 0) {
        const repayment = Math.min(loan.dailyRepayment, loan.remainingAmount);
        if (nextMoney >= repayment) {
          nextMoney -= repayment;
          nextDebt -= repayment;
          return {
            ...loan,
            remainingAmount: loan.remainingAmount - repayment,
            daysLeft: loan.daysLeft - 1
          };
        } else {
          // Missed repayment
          if (loan.type === 'bank') {
            nextIsBlacklisted = true;
          }
          return {
            ...loan,
            daysLeft: loan.daysLeft - 1 // Still counts down
          };
        }
      }
      return loan;
    });

    if (moneyImpact < 0) {
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 500);
    }

    const newState = {
      ...gameState,
      day: nextDay,
      money: nextMoney,
      stress: nextStress,
      debt: Math.max(0, nextDebt),
      loans: nextLoans,
      isBlacklisted: nextIsBlacklisted,
      history: [
        ...gameState.history,
        {
          day: gameState.day,
          scenario: currentScenario?.title || "",
          choice: choice.text,
          consequence: choice.consequence
        }
      ]
    };

    setGameState(newState);
    setOngoingRun(newState);
    setConsequence(choice.consequence);

    if (nextDay > MAX_DAYS || nextStress >= 100 || nextMoney < -5000) {
      setStatus(GameStatus.GAMEOVER);
      performAnalysis(newState);
      updateProfile(newState);
      setOngoingRun(null);
    }
  };

  const updateProfile = (finalState: GameState) => {
    const cause = finalState.stress >= 100 ? 'Stress Collapse' : 
                  finalState.money < -5000 ? 'Bankruptcy' : 
                  finalState.day > MAX_DAYS ? 'Success' : 'Unknown';

    // Calculate ELO Gain
    let eloGain = 0;
    if (cause === 'Success') {
      eloGain += 500;
      eloGain += Math.max(0, finalState.money / 10);
      eloGain += (100 - finalState.stress) * 2;
    } else {
      eloGain += finalState.day * 10;
    }

    setUserProfile(prev => {
      const newRuns = prev.runsCompleted + 1;
      const newSurvival = cause === 'Success' ? (prev.survivalRate * prev.runsCompleted + 1) / newRuns : (prev.survivalRate * prev.runsCompleted) / newRuns;
      
      const newFailureCauses = { ...prev.failureCauses };
      if (cause !== 'Success') {
        newFailureCauses[cause] = (newFailureCauses[cause] || 0) + 1;
      }

      const newEloScore = prev.eloScore + eloGain;
      const newRank = RANKS.reduce((acc, rank) => newEloScore >= rank.minScore ? rank.name : acc, 'Bronze' as RankType);

      // Check Achievements
      const newAchievements = [...prev.achievements];
      const checkAndAdd = (id: string) => {
        if (!newAchievements.find(a => a.id === id)) {
          const ach = ACHIEVEMENTS.find(a => a.id === id);
          if (ach) newAchievements.push({ ...ach, unlockedAt: new Date().toLocaleDateString() });
        }
      };

      if (finalState.money >= 10000) checkAndAdd('first_10k');
      if (cause === 'Success' && finalState.stress < 20) checkAndAdd('stress_master');
      if (newFailureCauses['Bankruptcy'] >= 5) checkAndAdd('bankrupt_5');
      if (finalState.loans.some(l => l.type === 'ahlong') && cause === 'Success') checkAndAdd('debt_survivor');
      if (cause === 'Success') checkAndAdd('survivor_30');

      return {
        ...prev,
        runsCompleted: newRuns,
        bestDay: Math.max(prev.bestDay, finalState.day),
        bestSavings: Math.max(prev.bestSavings, finalState.money),
        totalStress: prev.totalStress + finalState.stress,
        totalDecisions: prev.totalDecisions + finalState.history.length,
        avgStress: (prev.totalStress + finalState.stress) / newRuns,
        survivalRate: newSurvival,
        failureCauses: newFailureCauses,
        eloScore: newEloScore,
        rank: newRank,
        achievements: newAchievements
      };
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('kaispagi_auth');
    setStatus(GameStatus.WELCOME);
  };

  const resetProfile = () => {
    setUserProfile(INITIAL_PROFILE);
    localStorage.removeItem('kaispagi_profile');
    setStatus(GameStatus.START);
  };

  const nextDay = () => {
    setConsequence(null);
    if (status === GameStatus.PLAYING) {
      fetchNextScenario(gameState);
    }
  };

  const performAnalysis = async (state: GameState) => {
    try {
      const result = await analyzeGame(state);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed", error);
    }
  };

  return (
    <div className={`fixed inset-0 transition-colors duration-1000 flex flex-col overflow-hidden font-sans ${isCrisis ? 'bg-zinc-950' : 'bg-zinc-950'}`}>
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: isCrisis ? [0.05, 0.1, 0.05] : [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-emerald-500/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: isCrisis ? [0.05, 0.1, 0.05] : [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-red-500/10 blur-[120px] rounded-full"
        />
      </div>

      {/* Crisis Vignette */}
      <AnimatePresence>
        {isCrisis && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_150px_rgba(220,38,38,0.2)]"
          />
        )}
      </AnimatePresence>

      {/* Impact Flash */}
      <AnimatePresence>
        {showFlash && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-50 bg-red-500/10"
          />
        )}
      </AnimatePresence>

      {/* Mobile Status Bar Simulation / Header */}
      <header className="shrink-0 px-6 py-4 flex justify-between items-center border-b border-white/5 bg-zinc-950/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-emerald-900/20">K</div>
          <span className="font-serif font-bold text-lg tracking-tight">KaisPagi</span>
        </div>
        <div className="flex items-center gap-3">
          {status === GameStatus.PLAYING && (
            <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              Live
            </div>
          )}
        </div>
      </header>

      {/* Onboarding Modal */}
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding onClose={() => setShowOnboarding(false)} />
        )}
      </AnimatePresence>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
        <AnimatePresence mode="wait">
          {status === GameStatus.WELCOME && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-full flex flex-col"
            >
              <Welcome onAction={(action, username) => {
                if (action === 'signup' && username) {
                  setUserProfile(prev => ({ ...prev, username }));
                  localStorage.setItem('kaispagi_auth', 'true');
                  setStatus(GameStatus.DASHBOARD);
                } else if (action === 'guest') {
                  localStorage.setItem('kaispagi_auth', 'true');
                  setStatus(GameStatus.DASHBOARD);
                }
              }} />
            </motion.div>
          )}

          {status === GameStatus.DASHBOARD && (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="min-h-full flex flex-col"
            >
              <Home 
                profile={userProfile} 
                ongoingRun={ongoingRun}
                onStart={() => setStatus(GameStatus.PERSONA_SELECT)}
                onContinue={continueGame}
              />
            </motion.div>
          )}

          {status === GameStatus.PERSONA_SELECT && (
            <motion.div
              key="persona_select"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="min-h-full flex flex-col"
            >
              <PersonaSelect onSelect={startGame} onBack={() => setStatus(GameStatus.DASHBOARD)} />
            </motion.div>
          )}

          {status === GameStatus.START && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="min-h-full flex flex-col"
            >
              <Intro onStart={() => setStatus(GameStatus.PERSONA_SELECT)} onShowOnboarding={() => setShowOnboarding(true)} />
            </motion.div>
          )}

          {status === GameStatus.PROFILE && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="min-h-full flex flex-col"
            >
              <Profile 
                profile={userProfile} 
                onReset={resetProfile}
              />
            </motion.div>
          )}

          {status === GameStatus.STATS && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="min-h-full flex flex-col"
            >
              <Stats 
                profile={userProfile} 
              />
            </motion.div>
          )}

          {status === GameStatus.SETTINGS && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="min-h-full flex flex-col"
            >
              <Settings 
                settings={userSettings}
                onUpdate={setUserSettings}
                onLogout={handleLogout}
                onDeleteAccount={resetProfile}
              />
            </motion.div>
          )}

          {status === GameStatus.PLAYING && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-full flex flex-col p-4 pb-24"
            >
              <Dashboard state={gameState} />
              
              <div className="flex-1 flex flex-col justify-center py-4">
                {consequence ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-[2rem] p-8 w-full max-w-md mx-auto text-center shadow-2xl border-emerald-500/20"
                  >
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                      <AlertCircle className="text-emerald-500" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 font-serif">The Result</h3>
                    <p className="text-zinc-300 text-lg mb-10 leading-relaxed">
                      {consequence}
                    </p>
                    <button 
                      onClick={nextDay} 
                      className="btn-primary w-full py-4 text-lg rounded-2xl shadow-lg shadow-emerald-900/40"
                    >
                      Continue to Day {gameState.day}
                    </button>
                  </motion.div>
                ) : (
                  <ScenarioCard 
                    scenario={currentScenario} 
                    onChoice={handleChoice} 
                    loading={loading} 
                    personaType={gameState.persona}
                  />
                )}
              </div>
            </motion.div>
          )}

          {status === GameStatus.GAMEOVER && (
            <motion.div
              key="gameover"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-h-full p-4 pb-12"
            >
              <GameOver 
                state={gameState} 
                analysis={analysis} 
                onRestart={() => setStatus(GameStatus.PERSONA_SELECT)} 
                onBackToMenu={() => setStatus(GameStatus.DASHBOARD)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile-style Bottom Navigation / Info Bar */}
      {status === GameStatus.PLAYING && (
        <footer className="shrink-0 border-t border-white/5 bg-zinc-950/90 backdrop-blur-xl px-6 py-4 flex justify-between items-center z-50">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Current Balance</span>
            <div className={`flex items-baseline gap-1 font-mono font-bold text-xl ${gameState.money < 100 ? 'text-red-400' : 'text-emerald-400'}`}>
              <span className="text-sm opacity-70">RM</span>
              <Counter value={gameState.money} />
            </div>
          </div>
          
          <div className="flex flex-col items-end flex-1 max-w-[120px] ml-4">
            <div className="flex justify-between w-full mb-1.5 px-0.5">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Day {gameState.day}</span>
              <span className="text-[10px] text-zinc-400 font-bold">{MAX_DAYS}</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden flex gap-0.5">
              {Array.from({ length: MAX_DAYS }).map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 h-full rounded-full transition-all duration-500 ${
                    i < gameState.day ? 'bg-white' : 'bg-zinc-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </footer>
      )}
      {/* Bottom Navigation */}
      <BottomNav 
        activeTab={status} 
        onTabChange={(tab) => {
          if (tab === GameStatus.PLAYING && !ongoingRun) {
            setStatus(GameStatus.START);
          } else {
            setStatus(tab);
          }
        }}
        isVisible={showBottomNav}
      />
    </div>
  );
}
