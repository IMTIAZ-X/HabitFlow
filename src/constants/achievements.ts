import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first', name: 'First Step', icon: '🎯', desc: 'Create your first habit', bg: 'rgba(13,150,104,0.15)', color: '#0d9668', unlockedAt: null },
  { id: 'week_warrior', name: 'Week Warrior', icon: '🔥', desc: '7-day streak', bg: 'rgba(249,115,22,0.15)', color: '#f97316', unlockedAt: null },
  { id: 'dedicated', name: 'Dedicated', icon: '🏆', desc: '14-day streak', bg: 'rgba(168,85,247,0.15)', color: '#a855f7', unlockedAt: null },
  { id: 'monthly_master', name: 'Monthly Master', icon: '👑', desc: '30-day streak', bg: 'rgba(230,168,23,0.15)', color: '#e6a817', unlockedAt: null },
  { id: 'marathon', name: 'Marathon', icon: '🏃', desc: '60-day streak', bg: 'rgba(220,38,38,0.15)', color: '#dc2626', unlockedAt: null },
  { id: 'collector', name: 'Collector', icon: '📦', desc: '5+ active habits', bg: 'rgba(99,102,241,0.15)', color: '#6366f1', unlockedAt: null },
  { id: 'perfect_day', name: 'Perfect Day', icon: '⭐', desc: 'Complete all due habits', bg: 'rgba(236,72,153,0.15)', color: '#ec4899', unlockedAt: null },
  { id: 'centurion', name: 'Centurion', icon: '💯', desc: '100 total completions', bg: 'rgba(34,197,94,0.15)', color: '#22c55e', unlockedAt: null },
  { id: 'streak_saver', name: 'Ice Shield', icon: '🧊', desc: 'Use a streak freeze', bg: 'rgba(56,189,248,0.15)', color: '#38bdf8', unlockedAt: null },
  { id: 'five_alive', name: 'Five Alive', icon: '🌟', desc: '5 active streaks at once', bg: 'rgba(251,146,60,0.15)', color: '#fb923c', unlockedAt: null },
  { id: 'focused', name: 'Deep Focus', icon: '⏱️', desc: 'Complete 5 timer sessions', bg: 'rgba(20,184,166,0.15)', color: '#14b8a6', unlockedAt: null },
  { id: 'noted', name: 'Journaler', icon: '📝', desc: 'Add notes to 10 entries', bg: 'rgba(244,114,182,0.15)', color: '#f472b6', unlockedAt: null },
];