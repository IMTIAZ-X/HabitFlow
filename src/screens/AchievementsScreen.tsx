import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useHabits } from '../context/HabitContext';

const AchievementsScreen = () => {
  const { achievements } = useHabits();

  return (
    <FlatList
      data={achievements}
      numColumns={2}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={[styles.card, !item.unlockedAt && styles.locked]}>
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.desc}>{item.desc}</Text>
          {item.unlockedAt && <Text style={styles.date}>{new Date(item.unlockedAt).toLocaleDateString()}</Text>}
        </View>
      )}
      keyExtractor={item => item.id}
    />
  );
};

const styles = StyleSheet.create({
  list: { padding: 16 },
  card: { flex: 1, margin: 8, backgroundColor: 'rgba(255,255,255,0.82)', borderRadius: 20, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(13,150,104,0.12)' },
  locked: { opacity: 0.5 },
  icon: { fontSize: 40, marginBottom: 8 },
  name: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  desc: { fontSize: 10, textAlign: 'center', color: '#5a6e65', marginBottom: 4 },
  date: { fontSize: 10, color: '#0d9668' },
});

export default AchievementsScreen;