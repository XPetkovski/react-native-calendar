// src/components/calendar/QCalendarDaysOfWeek.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './QCalendar.styles';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const QCalendarDaysOfWeek: React.FC = () => {
  return (
    <View style={styles.weekDaysContainer}>
      {WEEKDAYS.map(day => (
        <Text key={day} style={styles.weekDayText}>
          {day}
        </Text>
      ))}
    </View>
  );
};
