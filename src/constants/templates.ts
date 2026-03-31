export const TEMPLATES = [
  { name: 'Morning Run', emoji: '🏃', category: 'Running', frequency: 'daily' as const, customDays: [] },
  { name: 'Read 30 min', emoji: '📖', category: 'Study', frequency: 'daily' as const, customDays: [] },
  { name: 'Meditation', emoji: '🧘', category: 'Health', frequency: 'daily' as const, customDays: [] },
  { name: 'Deep Work', emoji: '💼', category: 'Work', frequency: 'custom' as const, customDays: [1, 2, 3, 4, 5] },
  { name: 'Gym Workout', emoji: '💪', category: 'Fitness', frequency: 'custom' as const, customDays: [1, 3, 5] },
  { name: 'Journaling', emoji: '✍️', category: 'Mindfulness', frequency: 'daily' as const, customDays: [] },
  { name: 'Drink 8 Glasses', emoji: '💧', category: 'Health', frequency: 'daily' as const, customDays: [] },
  { name: 'Learn Language', emoji: '🌍', category: 'Study', frequency: 'custom' as const, customDays: [1, 2, 4, 5] },
  { name: 'No Social Media', emoji: '📵', category: 'Mindfulness', frequency: 'daily' as const, customDays: [] },
  { name: 'Cook Healthy', emoji: '🍳', category: 'Health', frequency: 'custom' as const, customDays: [1, 3, 5, 6] },
  { name: 'Walk 10K Steps', emoji: '🚶', category: 'Fitness', frequency: 'daily' as const, customDays: [] },
  { name: 'Code Practice', emoji: '💻', category: 'Study', frequency: 'custom' as const, customDays: [1, 2, 3, 4, 5] },
];