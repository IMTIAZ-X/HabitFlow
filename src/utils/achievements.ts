import { Habit, Entry, TimerSession, Achievement } from '../types';
import { ACHIEVEMENTS } from '../constants/achievements';
import { getStreak } from './streaks';
import { today } from './dates';

export const checkAchievements = (
  habits: Habit[],
  entries: Entry[],
  timerSessions: TimerSession[],
  currentAchievements: Achievement[]
): Achievement[] => {
  const activeHabits = habits.filter(h => !h.archived);
  const completedCount = entries.filter(e => e.completed).length;
  const todayStr = today();

  // Helper to unlock an achievement
  const unlock = (id: string) => {
    const ach = currentAchievements.find(a => a.id === id);
    if (ach && !ach.unlockedAt) {
      ach.unlockedAt = Date.now();
    }
  };

  // First habit
  if (habits.length >= 1) unlock('first');

  // Collector: 5+ active habits
  if (activeHabits.length >= 5) unlock('collector');

  // Centurion: 100 completions
  if (completedCount >= 100) unlock('centurion');

  // Journaler: notes on 10 entries
  const notesCount = entries.filter(e => e.note && e.note.trim().length > 0).length;
  if (notesCount >= 10) unlock('noted');

  // Focused: 5 timer sessions today
  const todaySessions = timerSessions.filter(s => s.date === todayStr).length;
  if (todaySessions >= 5) unlock('focused');

  // Streak achievements
  const streaks = activeHabits.map(h => getStreak(h.id, entries, habits));
  if (streaks.some(s => s >= 7)) unlock('week_warrior');
  if (streaks.some(s => s >= 14)) unlock('dedicated');
  if (streaks.some(s => s >= 30)) unlock('monthly_master');
  if (streaks.some(s => s >= 60)) unlock('marathon');
  if (streaks.filter(s => s >= 1).length >= 5) unlock('five_alive');

  // Perfect day: all due habits completed today
  const dueToday = activeHabits.filter(h => {
    const dow = new Date(todayStr).getDay();
    return h.frequency === 'daily' || h.customDays.includes(dow);
  });
  const doneToday = dueToday.filter(h => entries.some(e => e.habitId === h.id && e.date === todayStr && e.completed));
  if (dueToday.length > 0 && doneToday.length === dueToday.length) unlock('perfect_day');

  // Streak saver: any frozen entry
  if (entries.some(e => e.frozen)) unlock('streak_saver');

  return currentAchievements;
};