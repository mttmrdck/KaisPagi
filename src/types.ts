export enum GameStatus {
  WELCOME = 'WELCOME',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  START = 'START',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER',
  SUMMARY = 'SUMMARY',
  PROFILE = 'PROFILE',
  STATS = 'STATS',
  SETTINGS = 'SETTINGS',
  PERSONA_SELECT = 'PERSONA_SELECT'
}

export type PersonaType = 'hustler' | 'student' | 'family' | 'techie' | 'creative';

export interface Persona {
  type: PersonaType;
  name: string;
  description: string;
  startingMoney: number;
  startingStress: number;
  passiveAbility: string;
  icon: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export type RankType = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  memberSince: string;
  runsCompleted: number;
  bestSavings: number;
  bestDay: number;
  avgStress: number;
  totalStress: number;
  totalDecisions: number;
  survivalRate: number;
  failureCauses: Record<string, number>;
  eloScore: number;
  rank: RankType;
  achievements: Achievement[];
}

export interface UserSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  darkMode: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
}

export interface Choice {
  text: string;
  impact: {
    money?: number;
    stress?: number;
    debt?: number;
  };
  consequence: string;
}

export interface Scenario {
  title: string;
  description: string;
  choices: Choice[];
  category: 'health' | 'education' | 'work' | 'family' | 'unexpected' | 'loan' | 'debt_consequence';
}

export interface Loan {
  type: 'bank' | 'ahlong' | 'family';
  remainingAmount: number;
  dailyRepayment: number;
  daysLeft: number;
  totalBorrowed: number;
  dayBorrowed: number;
}

export interface GameState {
  day: number;
  money: number;
  debt: number;
  stress: number; // 0 to 100
  persona: PersonaType;
  loans: Loan[];
  isBlacklisted: boolean;
  history: {
    day: number;
    scenario: string;
    choice: string;
    consequence: string;
  }[];
}

export interface AIAnalysis {
  summary: string;
  structuralInsights: string[];
  povertyCycleExplanation: string;
}
