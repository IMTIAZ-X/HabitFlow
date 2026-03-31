import { Habit, Entry } from '../types';
import { today } from './dates';

export const isDueToday = (habit: Habit, date = today()) => {
  const dow = new Date(date).getDay();
  if (habit.frequency === 'daily') return true;
  return habit.customDays.includes(dow);
};

export const isDone = (habitId: number, entries: Entry[], date: string) => {
  const entry = entries.find(e => e.habitId === habitId && e.date === date);
  return entry ? entry.completed : false;
};

export const isFrozen = (habitId: number, entries: Entry[], date: string) => {
  const entry = entries.find(e => e.habitId === habitId && e.date === date);
  return entry ? !!entry.frozen : false;
};

export const getStreak = (habitId: number, entries: Entry[], habits: Habit[]) => {
  const habit = habits.find(h => h.id === habitId);
  if (!habit) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  while (true) {
    const dateStr = currentDate.toISOString().slice(0, 10);
    if (!isDueToday(habit, dateStr)) {
      currentDate.setDate(currentDate.getDate() - 1);
      continue;
    }
    if (isDone(habitId, entries, dateStr) || isFrozen(habitId, entries, dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
};

export const getLongestStreak = (habitId: number, entries: Entry[], habits: Habit[]) => {
  const habit = habits.find(h => h.id === habitId);
  if (!habit) return 0;

  const allDates = entries
    .filter(e => e.habitId === habitId && e.completed)
    .map(e => e.date)
    .sort();

  if (allDates.length === 0) return 0;

  let longest = 1;
  let current = 1;
  for (let i = 1; i < allDates.length; i++) {
    const diff = (new Date(allDates[i]).getTime() - new Date(allDates[i - 1]).getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else if (diff > 1) {
      current = 1;
    }
  }
  return longest;
};