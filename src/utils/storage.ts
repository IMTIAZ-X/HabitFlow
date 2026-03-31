import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, Entry, Achievement, TimerSession, Settings } from '../types';
import { ACHIEVEMENTS as defaultAchievements } from '../constants/achievements';

const KEYS = {
  HABITS: 'hf_habits',
  ENTRIES: 'hf_entries',
  ACHIEVEMENTS: 'hf_achievements',
  TIMER_SESSIONS: 'hf_timerSessions',
  SETTINGS: 'hf_settings',
};

export async function loadData() {
  try {
    const habits = await getItem<Habit[]>(KEYS.HABITS, []);
    const entries = await getItem<Entry[]>(KEYS.ENTRIES, []);
    let achievements = await getItem<Achievement[]>(KEYS.ACHIEVEMENTS, []);
    const timerSessions = await getItem<TimerSession[]>(KEYS.TIMER_SESSIONS, []);
    const settings = await getItem<Settings>(KEYS.SETTINGS, { accent: 'emerald', sound: true, onboarded: false });

    // Ensure achievements have all default entries (in case new ones added)
    if (!achievements.length || achievements.length !== defaultAchievements.length) {
      achievements = defaultAchievements.map(def => {
        const existing = achievements.find(a => a.id === def.id);
        return existing ? existing : { ...def, unlockedAt: null };
      });
      await saveAchievements(achievements);
    }

    return { habits, entries, achievements, timerSessions, settings };
  } catch (error) {
    console.error('Failed to load data', error);
    return { habits: [], entries: [], achievements: [], timerSessions: [], settings: { accent: 'emerald', sound: true, onboarded: false } };
  }
}

async function getItem<T>(key: string, defaultValue: T): Promise<T> {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : defaultValue;
}

async function setItem(key: string, value: any) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function saveHabits(habits: Habit[]) {
  await setItem(KEYS.HABITS, habits);
}
export async function saveEntries(entries: Entry[]) {
  await setItem(KEYS.ENTRIES, entries);
}
export async function saveAchievements(achievements: Achievement[]) {
  await setItem(KEYS.ACHIEVEMENTS, achievements);
}
export async function saveTimerSessions(sessions: TimerSession[]) {
  await setItem(KEYS.TIMER_SESSIONS, sessions);
}
export async function saveSettings(settings: Settings) {
  await setItem(KEYS.SETTINGS, settings);
}