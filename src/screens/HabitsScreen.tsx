import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useHabits } from '../context/HabitContext';
import HabitCard from '../components/HabitCard';
import StatsCards from '../components/StatsCards';
import { QUOTES } from '../constants/quotes';
import { EMOJIS } from '../constants/emojis';
import { TEMPLATES } from '../constants/templates';
import { Ionicons } from '@expo/vector-icons';

const HabitsScreen = () => {
  const { habits, addHabit, refreshData } = useHabits();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    emoji: '🎯',
    category: 'Other',
    frequency: 'daily' as 'daily' | 'custom',
    customDays: [] as number[],
  });
  const [quote, setQuote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  const activeHabits = habits.filter(h => !h.archived);
  const archivedHabits = habits.filter(h => h.archived);

  const filtered = activeHabits.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || h.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(activeHabits.map(h => h.category))];

  const handleAdd = () => {
    if (!newHabit.name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }
    if (newHabit.frequency === 'custom' && newHabit.customDays.length === 0) {
      Alert.alert('Error', 'Please select at least one day');
      return;
    }
    addHabit(newHabit);
    setAddModalVisible(false);
    setNewHabit({
      name: '',
      emoji: '🎯',
      category: 'Other',
      frequency: 'daily',
      customDays: [],
    });
  };

  const selectEmoji = (emoji: string) => {
    setNewHabit({ ...newHabit, emoji });
  };

  const toggleDay = (day: number) => {
    const days = newHabit.customDays.includes(day)
      ? newHabit.customDays.filter(d => d !== day)
      : [...newHabit.customDays, day];
    setNewHabit({ ...newHabit, customDays: days });
  };

  const addTemplate = (template: any) => {
    addHabit({
      name: template.name,
      emoji: template.emoji,
      category: template.category,
      frequency: template.frequency,
      customDays: template.customDays,
    });
    setTemplateModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <StatsCards />
      <View style={styles.quoteCard}>
        <Text style={styles.quote}>“{quote}”</Text>
      </View>

      <View style={styles.toolbar}>
        <TextInput
          style={styles.search}
          placeholder="Search habits..."
          value={search}
          onChangeText={setSearch}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          <TouchableOpacity
            style={[styles.categoryChip, categoryFilter === 'all' && styles.categoryChipActive]}
            onPress={() => setCategoryFilter('all')}
          >
            <Text>All</Text>
          </TouchableOpacity>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, categoryFilter === cat && styles.categoryChipActive]}
              onPress={() => setCategoryFilter(cat)}
            >
              <Text>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.addButtonText}>New Habit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.templateButton} onPress={() => setTemplateModalVisible(true)}>
          <Ionicons name="flash" size={20} color="#0d9668" />
          <Text style={styles.templateButtonText}>Templates</Text>
        </TouchableOpacity>
      </View>

      {filtered.map(habit => (
        <HabitCard key={habit.id} habit={habit} />
      ))}

      {archivedHabits.length > 0 && (
        <View style={styles.archiveSection}>
          <Text style={styles.archiveTitle}>Archived</Text>
          {archivedHabits.map(habit => (
            <HabitCard key={habit.id} habit={habit} archived />
          ))}
        </View>
      )}

      {/* Add Habit Modal */}
      <Modal visible={addModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create New Habit</Text>
            <TextInput
              style={styles.input}
              placeholder="Habit name"
              value={newHabit.name}
              onChangeText={text => setNewHabit({ ...newHabit, name: text })}
            />
            <Text>Emoji</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiRow}>
              {EMOJIS.map(emoji => (
                <TouchableOpacity
                  key={emoji}
                  style={[styles.emojiOption, newHabit.emoji === emoji && styles.emojiSelected]}
                  onPress={() => selectEmoji(emoji)}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text>Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Category"
              value={newHabit.category}
              onChangeText={text => setNewHabit({ ...newHabit, category: text })}
            />
            <Text>Frequency</Text>
            <View style={styles.freqRow}>
              <TouchableOpacity
                style={[styles.freqOption, newHabit.frequency === 'daily' && styles.freqSelected]}
                onPress={() => setNewHabit({ ...newHabit, frequency: 'daily', customDays: [] })}
              >
                <Text>Daily</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.freqOption, newHabit.frequency === 'custom' && styles.freqSelected]}
                onPress={() => setNewHabit({ ...newHabit, frequency: 'custom' })}
              >
                <Text>Custom Days</Text>
              </TouchableOpacity>
            </View>
            {newHabit.frequency === 'custom' && (
              <View style={styles.daysRow}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.dayChip, newHabit.customDays.includes(idx) && styles.dayChipActive]}
                    onPress={() => toggleDay(idx)}
                  >
                    <Text>{day}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAdd}>
                <Text style={styles.saveBtn}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Templates Modal */}
      <Modal visible={templateModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Choose a Template</Text>
            <FlatList
              data={TEMPLATES}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.templateItem} onPress={() => addTemplate(item)}>
                  <Text style={styles.templateEmoji}>{item.emoji}</Text>
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setTemplateModalVisible(false)}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f4f3' },
  quoteCard: { backgroundColor: 'rgba(255,255,255,0.82)', borderRadius: 20, padding: 12, marginVertical: 12, borderWidth: 1, borderColor: 'rgba(13,150,104,0.12)' },
  quote: { fontSize: 14, fontStyle: 'italic', color: '#5a6e65' },
  toolbar: { marginVertical: 12 },
  search: { backgroundColor: 'white', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginBottom: 8, borderWidth: 1, borderColor: '#ccc' },
  categoryScroll: { flexDirection: 'row', marginBottom: 8 },
  categoryChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#e5e7eb', marginRight: 8 },
  categoryChipActive: { backgroundColor: '#0d9668' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  addButton: { flexDirection: 'row', backgroundColor: '#0d9668', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 30, alignItems: 'center', gap: 8 },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  templateButton: { flexDirection: 'row', borderWidth: 1, borderColor: '#0d9668', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 30, alignItems: 'center', gap: 8 },
  templateButtonText: { color: '#0d9668', fontWeight: 'bold' },
  archiveSection: { marginTop: 20 },
  archiveTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#5a6e65' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: 'white', borderRadius: 20, padding: 20, width: '90%', maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 12 },
  emojiRow: { flexDirection: 'row', marginBottom: 12 },
  emojiOption: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f0f4f3', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  emojiSelected: { borderWidth: 2, borderColor: '#0d9668' },
  emojiText: { fontSize: 24 },
  freqRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  freqOption: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f4f3' },
  freqSelected: { backgroundColor: '#0d9668' },
  daysRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  dayChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#f0f4f3' },
  dayChipActive: { backgroundColor: '#0d9668' },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 12 },
  saveBtn: { color: '#0d9668', fontWeight: 'bold' },
  templateItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  templateEmoji: { fontSize: 24 },
});

export default HabitsScreen;