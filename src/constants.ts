import { Persona, Achievement, RankType } from './types';

export const MAX_DAYS = 15;

export const PERSONAS: Record<string, Persona> = {
  hustler: {
    type: 'hustler',
    name: 'The Hustler',
    description: 'High risk, high reward. Focused on business and side gigs.',
    startingMoney: 3000,
    startingStress: 30,
    passiveAbility: 'Business decisions give +20% more income, but stress increases 15% faster.',
    icon: '💼'
  },
  student: {
    type: 'student',
    name: 'The Student',
    description: 'Slow build, long-term growth. Focused on education and future gains.',
    startingMoney: 1500,
    startingStress: 15,
    passiveAbility: 'Education decisions are 30% cheaper. Long-term bonuses are stronger.',
    icon: '🎓'
  },
  family: {
    type: 'family',
    name: 'The Family Person',
    description: 'Stable but vulnerable. Focused on security and family needs.',
    startingMoney: 2500,
    startingStress: 25,
    passiveAbility: 'Stress increases 20% slower. Emergency events cost 25% more.',
    icon: '👨‍👩‍👧'
  },
  techie: {
    type: 'techie',
    name: 'The Techie',
    description: 'Volatile but explosive. Focused on startups and innovation.',
    startingMoney: 2500,
    startingStress: 25,
    passiveAbility: 'Unlocks startup decisions. Random big money events possible.',
    icon: '💻'
  },
  creative: {
    type: 'creative',
    name: 'The Creative',
    description: 'Emotion-driven survival. Focused on passion and well-being.',
    startingMoney: 1800,
    startingStress: 15,
    passiveAbility: 'Happiness/Leisure reduces stress 25% faster. Income is inconsistent.',
    icon: '🎨'
  }
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_10k',
    name: 'First 10K',
    description: 'Reach RM 10,000 in savings.',
    icon: '💰'
  },
  {
    id: 'stress_master',
    name: 'Stress Master',
    description: 'Finish a 15-day run with less than 20 stress.',
    icon: '🧠'
  },
  {
    id: 'bankrupt_5',
    name: 'Serial Failure',
    description: 'Go bankrupt 5 times.',
    icon: '💀'
  },
  {
    id: 'debt_survivor',
    name: 'Debt Survivor',
    description: 'Survive a run after borrowing from an Ah Long.',
    icon: '🦈'
  },
  {
    id: 'survivor_30',
    name: 'True Survivor',
    description: 'Complete your first 15-day run.',
    icon: '🏆'
  }
];

export const RANKS: { name: RankType; minScore: number }[] = [
  { name: 'Bronze', minScore: 0 },
  { name: 'Silver', minScore: 1000 },
  { name: 'Gold', minScore: 2500 },
  { name: 'Platinum', minScore: 5000 },
  { name: 'Diamond', minScore: 10000 }
];
