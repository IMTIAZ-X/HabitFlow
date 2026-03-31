import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useHabits } from '../context/HabitContext';
import { isDueToday, isDone } from '../utils/streaks';
import { addDays, today } from '../utils/dates';
import { Svg, Rect } from 'react-native-svg';

const YEAR_DAYS = 364; // 52 weeks

const Heatmap = () => {
  const { habits, entries } = useHabits();
  const endDate = today();
  const startDate = addDays(endDate, -YEAR_DAYS);

  const activeHabits = habits.filter(h => !h.archived);

  const getColor = (date: string) => {
    let due = 0, done = 0;
    activeHabits.forEach(h => {
      if (isDueToday(h, date)) {
        due++;
        if (isDone(h.id, entries, date)) done++;
      }
    });
    if (due === 0) return '#e5e7eb';
    const ratio = done / due;
    if (ratio === 1) return '#0d9668';
    if (ratio >= 0.75) return '#2dd4bf';
    if (ratio >= 0.5) return '#86efac';
    if (ratio > 0) return '#bbf7d0';
    return '#f0f4f3';
  };

  // Build array of dates from startDate to endDate
  const dates: string[] = [];
  let cur = new Date(startDate);
  const end = new Date(endDate);
  while (cur <= end) {
    dates.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }

  // Group by week: first column is Sunday? We'll do a standard grid: 7 rows, columns = weeks
  // For simplicity, we'll just display a vertical list of weeks, each week as a row of 7 squares.
  const weeks: string[][] = [];
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }

  const cellSize = 16;
  const gap = 4;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View>
        {/* Month labels would require more complex mapping */}
        {weeks.map((week, weekIdx) => (
          <View key={weekIdx} style={styles.weekRow}>
            {week.map((date, dayIdx) => (
              <View
                key={date}
                style={[
                  styles.cell,
                  { backgroundColor: getColor(date), width: cellSize, height: cellSize, marginRight: gap, marginBottom: gap },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  weekRow: { flexDirection: 'row' },
  cell: { borderRadius: 3 },
});

export default Heatmap;