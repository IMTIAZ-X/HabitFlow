import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

const MOODS = ['😄', '😃', '😐', '😔', '😤', '🥱'];

interface Props {
  selected: string;
  onSelect: (mood: string) => void;
}

const MoodPicker: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <View style={styles.row}>
      {MOODS.map(mood => (
        <TouchableOpacity
          key={mood}
          style={[styles.mood, selected === mood && styles.selected]}
          onPress={() => onSelect(mood)}
        >
          <Text style={styles.emoji}>{mood}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

import { Text } from 'react-native';

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, marginVertical: 12 },
  mood: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#f0f4f3', justifyContent: 'center', alignItems: 'center' },
  selected: { borderWidth: 2, borderColor: '#0d9668' },
  emoji: { fontSize: 24 },
});

export default MoodPicker;