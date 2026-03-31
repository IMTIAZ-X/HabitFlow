import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitContext';
import { isDueToday, isDone, getStreak } from '../utils/streaks';
import { today } from '../utils/dates';
import MoodPicker from './MoodPicker';
import { EMOJIS } from '../constants/emojis';

interface Props {
  habit: any;
  archived?: boolean;
}

const HabitCard: React.FC<Props> = ({ habit, archived = false }) => {
  const { habits, entries, toggleHabit, deleteHabit, archiveHabit, unarchiveHabit, updateHabit, addHabit } = useHabits();
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [backdateModalVisible, setBackdateModalVisible] = useState(false);
  const [note, setNote] = useState('');
  const [mood, setMood] = useState('');
  const [backdate, setBackdate] = useState('');
  const [freeze, setFreeze] = useState(false);

  const todayStr = today();
  const due = isDueToday(habit, todayStr);
  const done = isDone(habit.id, entries, todayStr);
  const streak = getStreak(habit.id, entries, habits);

  const openNoteModal = () => {
    const entry = entries.find(e => e.habitId === habit.id && e.date === todayStr);
    setNote(entry?.note || '');
    setMood(entry?.mood || '');
    setNoteModalVisible(true);
  };

  const saveNote = () => {
    toggleHabit(habit.id, todayStr, true, false, note, mood);
    setNoteModalVisible(false);
  };

  const openBackdateModal = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setBackdate(yesterday.toISOString().slice(0, 10));
    setFreeze(false);
    setBackdateModalVisible(true);
  };

  const saveBackdate = () => {
    if (!backdate) return;
    if (isDone(habit.id, entries, backdate)) {
      Alert.alert('Already done', 'This habit is already completed on that day.');
      return;
    }
    toggleHabit(habit.id, backdate, true, freeze, '', '');
    setBackdateModalVisible(false);
  };

  const openEditModal = () => {
    setEditModalVisible(true);
  };

  const saveEdit = () => {
    updateHabit(habit);
    setEditModalVisible(false);
  };

  const confirmDelete = () => {
    Alert.alert('Delete Habit', 'Are you sure? This will delete all entries.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteHabit(habit.id) },
    ]);
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.left}>
          <Text style={styles.emoji}>{habit.emoji}</Text>
          <View>
            <Text style={styles.name}>{habit.name}</Text>
            <View style={styles.meta}>
              <Text style={styles.category}>{habit.category}</Text>
              {streak > 0 && <Text style={styles.streak}>🔥 {streak}d</Text>}
            </View>
          </View>
        </View>
        <View style={styles.right}>
          {!archived && due && (
            <TouchableOpacity
              style={[styles.toggleBtn, done && styles.toggleBtnDone]}
              onPress={() => toggleHabit(habit.id, todayStr, !done)}
            >
              <Text style={styles.toggleText}>{done ? '✓ Done' : '○'}</Text>
            </TouchableOpacity>
          )}
          {!archived && done && (
            <TouchableOpacity onPress={openNoteModal}>
              <Ionicons name="happy-outline" size={20} color="#5a6e65" />
            </TouchableOpacity>
          )}
          {!archived && (
            <TouchableOpacity onPress={openBackdateModal}>
              <Ionicons name="calendar-outline" size={20} color="#5a6e65" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={openEditModal}>
            <Ionicons name="create-outline" size={20} color="#5a6e65" />
          </TouchableOpacity>
          {!archived ? (
            <TouchableOpacity onPress={() => archiveHabit(habit.id)}>
              <Ionicons name="archive-outline" size={20} color="#5a6e65" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => unarchiveHabit(habit.id)}>
              <Ionicons name="refresh-outline" size={20} color="#5a6e65" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={confirmDelete}>
            <Ionicons name="trash-outline" size={20} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Note Modal */}
      <Modal visible={noteModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Note & Mood</Text>
            <TextInput
              style={styles.input}
              placeholder="Write a note..."
              value={note}
              onChangeText={setNote}
              multiline
            />
            <MoodPicker selected={mood} onSelect={setMood} />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setNoteModalVisible(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveNote}>
                <Text style={styles.saveBtn}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Backdate Modal */}
      <Modal visible={backdateModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Backdate Entry</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={backdate}
              onChangeText={setBackdate}
            />
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setFreeze(!freeze)}
            >
              <Ionicons name={freeze ? 'checkbox' : 'square-outline'} size={20} />
              <Text>Use Streak Freeze</Text>
            </TouchableOpacity>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setBackdateModalVisible(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveBackdate}>
                <Text style={styles.saveBtn}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal - simplified; full implementation would include all fields */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Habit</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={habit.name}
              onChangeText={(text) => (habit.name = text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Emoji"
              value={habit.emoji}
              onChangeText={(text) => (habit.emoji = text)}
            />
            {/* Add other fields */}
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveEdit}>
                <Text style={styles.saveBtn}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: 20,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(13,150,104,0.12)',
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  emoji: { fontSize: 28 },
  name: { fontWeight: 'bold', fontSize: 16 },
  meta: { flexDirection: 'row', gap: 8, marginTop: 4 },
  category: { fontSize: 12, color: '#5a6e65', backgroundColor: 'rgba(13,150,104,0.1)', paddingHorizontal: 6, borderRadius: 20 },
  streak: { fontSize: 12, color: '#e6a817', backgroundColor: 'rgba(230,168,23,0.1)', paddingHorizontal: 6, borderRadius: 20 },
  right: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#ccc' },
  toggleBtnDone: { backgroundColor: '#0d9668', borderColor: '#0d9668' },
  toggleText: { color: '#2d2d2d' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: 'white', borderRadius: 20, padding: 20, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 12 },
  saveBtn: { color: '#0d9668', fontWeight: 'bold' },
  checkbox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
});

export default HabitCard;