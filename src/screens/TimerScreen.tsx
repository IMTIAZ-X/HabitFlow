import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useHabits } from '../context/HabitContext';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const TimerScreen = () => {
  const { habits, addTimerSession, settings } = useHabits();
  const [seconds, setSeconds] = useState(25 * 60);
  const [active, setActive] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);
  const [preset, setPreset] = useState(25);

  const activeHabits = habits.filter(h => !h.archived);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (active && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0 && active) {
      setActive(false);
      playSound();
      if (selectedHabitId) {
        addTimerSession(selectedHabitId, preset * 60);
        Alert.alert('Session Complete!', `Great focus session for ${preset} minutes.`);
      } else {
        Alert.alert('Timer Complete!', 'Well done.');
      }
    }
    return () => clearInterval(interval);
  }, [active, seconds]);

  const playSound = async () => {
    if (!settings.sound) return;
    const { sound } = await Audio.Sound.createAsync(require('../../assets/timer.mp3'));
    await sound.playAsync();
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const setPresetTime = (minutes: number) => {
    if (active) return;
    setPreset(minutes);
    setSeconds(minutes * 60);
  };

  const startPause = () => {
    if (seconds === 0) return;
    setActive(!active);
  };

  const reset = () => {
    setActive(false);
    setSeconds(preset * 60);
  };

  const selectHabit = (id: number | null) => {
    setSelectedHabitId(id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerRing}>
        <Text style={styles.timerText}>{formatTime(seconds)}</Text>
      </View>

      <View style={styles.presetRow}>
        {[5, 15, 25, 45, 60].map(min => (
          <TouchableOpacity
            key={min}
            style={[styles.presetBtn, preset === min && styles.presetActive]}
            onPress={() => setPresetTime(min)}
            disabled={active}
          >
            <Text style={styles.presetText}>{min}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.habitPicker}>
        <Text style={styles.label}>Link to Habit (optional)</Text>
        <View style={styles.habitOptions}>
          <TouchableOpacity
            style={[styles.habitOption, selectedHabitId === null && styles.habitActive]}
            onPress={() => selectHabit(null)}
          >
            <Text>None</Text>
          </TouchableOpacity>
          {activeHabits.map(h => (
            <TouchableOpacity
              key={h.id}
              style={[styles.habitOption, selectedHabitId === h.id && styles.habitActive]}
              onPress={() => selectHabit(h.id)}
            >
              <Text>{h.emoji} {h.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn} onPress={startPause}>
          <Ionicons name={active ? 'pause' : 'play'} size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={reset}>
          <Ionicons name="refresh" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f3', padding: 16 },
  timerRing: { width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.82)', justifyContent: 'center', alignItems: 'center', marginBottom: 32, borderWidth: 1, borderColor: 'rgba(13,150,104,0.12)' },
  timerText: { fontSize: 48, fontWeight: 'bold', color: '#0d9668' },
  presetRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  presetBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 30, backgroundColor: 'white', borderWidth: 1, borderColor: '#ccc' },
  presetActive: { backgroundColor: '#0d9668' },
  presetText: { fontWeight: 'bold' },
  habitPicker: { width: '100%', marginBottom: 32 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  habitOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  habitOption: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: 'white', borderWidth: 1, borderColor: '#ccc' },
  habitActive: { backgroundColor: '#0d9668', borderColor: '#0d9668' },
  controls: { flexDirection: 'row', gap: 24 },
  controlBtn: { backgroundColor: '#0d9668', borderRadius: 40, padding: 12, width: 64, height: 64, justifyContent: 'center', alignItems: 'center' },
});

export default TimerScreen;