import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { HabitProvider } from './src/context/HabitContext';
import HabitsScreen from './src/screens/HabitsScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import TimerScreen from './src/screens/TimerScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <HabitProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap = 'list';
              if (route.name === 'Habits') iconName = 'list';
              else if (route.name === 'Calendar') iconName = 'calendar';
              else if (route.name === 'Analytics') iconName = 'bar-chart';
              else if (route.name === 'Timer') iconName = 'timer';
              else if (route.name === 'Achievements') iconName = 'trophy';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#0d9668',
            tabBarInactiveTintColor: '#5a6e65',
            headerStyle: { backgroundColor: '#f0f4f3' },
            headerTitleStyle: { fontWeight: '600' },
          })}
        >
          <Tab.Screen name="Habits" component={HabitsScreen} />
          <Tab.Screen name="Calendar" component={CalendarScreen} />
          <Tab.Screen name="Analytics" component={AnalyticsScreen} />
          <Tab.Screen name="Timer" component={TimerScreen} />
          <Tab.Screen name="Achievements" component={AchievementsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </HabitProvider>
  );
}