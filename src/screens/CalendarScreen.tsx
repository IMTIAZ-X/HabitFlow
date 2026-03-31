import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useHabits } from '../context/HabitContext';
import { isDueToday, isDone } from '../utils/streaks';
import Heatmap from '../components/Heatmap';

LocaleConfig.locales['en'] = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today',
};
LocaleConfig.defaultLocale = 'en';

const CalendarScreen = () => {
  const { habits, entries } = useHabits();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  const activeHabits = habits.filter(h => !h.archived);

  const markedDates: any = {};
  // We'll mark each date with a dot color based on completion percentage
  const dateMap: Record<string, { due: number; done: number }> = {};
  activeHabits.forEach(habit => {
    // For each day we need to check due and done, but that's heavy. Instead, we'll just mark dates with entries.
    // For simplicity, we'll mark dates with a green dot if at least one habit completed.
  });
  // Better: iterate over entries and mark dates with a dot
  entries.forEach(entry => {
    if (entry.completed) {
      if (!markedDates[entry.date]) {
        markedDates[entry.date] = { dots: [] };
      }
      markedDates[entry.date].dots.push({ key: entry.habitId.toString(), color: '#0d9668' });
    }
  });

  return (
    <ScrollView style={styles.container}>
      <Calendar
        current={selectedDate}
        onDayPress={(day: any) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        markingType={'multi-dot'}
        theme={{
          calendarBackground: 'transparent',
          textSectionTitleColor: '#5a6e65',
          selectedDayBackgroundColor: '#0d9668',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#0d9668',
          dayTextColor: '#2d2d2d',
          textDisabledColor: '#d9e1e8',
          dotColor: '#0d9668',
          selectedDotColor: '#ffffff',
          arrowColor: '#0d9668',
          monthTextColor: '#0d9668',
          textMonthFontWeight: 'bold',
        }}
      />
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Yearly Overview</Text>
        <Heatmap />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f4f3' },
  legend: { marginTop: 20, backgroundColor: 'rgba(255,255,255,0.82)', borderRadius: 20, padding: 12, borderWidth: 1, borderColor: 'rgba(13,150,104,0.12)' },
  legendTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
});

export default CalendarScreen;