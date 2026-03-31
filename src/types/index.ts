export interface Habit {
  id: number;
  name: string;
  emoji: string;
  category: string;
  frequency: 'daily' | 'custom';
  customDays: number[]; // 0 = Sunday, 1 = Monday...
  archived: boolean;
  createdAt: number;
}

export interface Entry {
  id: number;
  habitId: number;
  date: string; // YYYY-MM-DD
  completed: boolean;
  frozen: boolean;
  note: string;
  mood: string;
}

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  desc: string;
  bg: string;
  color: string;
  unlockedAt: number | null;
}

export interface TimerSession {
  id: number;
  habitId: number | null;
  date: string;
  duration: number; // seconds
}

export interface Settings {
  accent: 'emerald' | 'amber' | 'rose' | 'cyan' | 'violet';
  sound: boolean;
  onboarded: boolean;
}