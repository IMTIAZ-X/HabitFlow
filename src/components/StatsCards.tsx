import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useHabits } from '../context/HabitContext';
import { isDueToday, isDone } from '../utils/streaks';
import { today } from '../utils/dates';
import { getStreak } from '../utils/streaks';
import { Svg, Circle } from 'react-native-svg';

const Ring = ({ percentage, color }: { percentage: number; color: string }) => {
  const size = 48;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        fill="none"
        rotation="-90"
        originX={size / 2}
        originY={size / 2}
      />
    </Svg>
  );
};

const StatsCards = () => {
  const { habits, entries } = useHabits();
  const active = habits.filter(h => !h.archived);
  const dueToday = active.filter(h => isDueToday(h));
  const doneToday = dueToday.filter(h => isDone(h.id, entries, today())).length;
  const duePct = dueToday.length ? Math.round((doneToday / dueToday.length) * 100) : 0;
  const bestStreak = Math.max(...active.map(h => getStreak(h.id, entries, habits)), 0);
  const totalCompletions = entries.filter(e => e.completed).length;

  return (
    <View style={styles.row}>
      <View style={styles.card}>
        <Ring percentage={duePct} color="#0d9668" />
        <View>
          <Text style={styles.value}>{doneToday}/{dueToday.length}</Text>
          <Text style={styles.label}>Today</Text>
        </View>
      </View>
      <View style={styles.card}>
        <Ring percentage={Math.min(bestStreak / 30 * 100, 100)} color="#e6a817" />
        <View>
          <Text style={styles.value}>{bestStreak}</Text>
          <Text style={styles.label}>Best Streak</Text>
        </View>
      </View>
      <View style={styles.card}>
        <Ring percentage={Math.min(totalCompletions / 200 * 100, 100)} color="#6366f1" />
        <View>
          <Text style={styles.value}>{totalCompletions}</Text>
          <Text style={styles.label}>Total Done</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: 20,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(13,150,104,0.12)',
  },
  value: { fontSize: 20, fontWeight: 'bold' },
  label: { fontSize: 12, color: '#5a6e65' },
});

export default StatsCards;