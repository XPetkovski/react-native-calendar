// src/components/calendar/QCalendarGrid.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './QCalendar.styles';

interface QCalendarGridProps {
  year: number;
  month: number;
  daysInMonth: number;
  firstDayOfMonth: number;
  selectedDate: Date | null;
  onDayPress: (day: number) => void;
}

export const QCalendarGrid: React.FC<QCalendarGridProps> = ({
  year,
  month,
  daysInMonth,
  firstDayOfMonth,
  selectedDate,
  onDayPress,
}) => {
  const grid = [];

  // 1. Fill empty slots before the 1st with PREVIOUS month's ghost days
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  for (let i = 0; i < firstDayOfMonth; i++) {
    const prevDay = daysInPrevMonth - firstDayOfMonth + i + 1;
    grid.push(
      <View key={`prev-${i}`} style={styles.dayCell}>
        <Text style={styles.disabledDayText}>{prevDay}</Text>
      </View>,
    );
  }

  // 2. Fill the actual active days
  for (let day = 1; day <= daysInMonth; day++) {
    const isSelected =
      selectedDate?.getDate() === day &&
      selectedDate?.getMonth() === month &&
      selectedDate?.getFullYear() === year;

    const today = new Date();
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    grid.push(
      <TouchableOpacity
        key={day}
        style={[styles.dayCell, isSelected && styles.selectedDayCell]}
        onPress={() => onDayPress(day)}
      >
        <Text
          style={[
            styles.dayText,
            isToday && !isSelected && styles.todayText,
            isSelected && styles.selectedDayText,
          ]}
        >
          {day}
        </Text>
      </TouchableOpacity>,
    );
  }

  // 3. Fill the remaining slots with NEXT month's ghost days
  const totalRendered = firstDayOfMonth + daysInMonth;
  const remainingSlots = 42 - totalRendered;

  for (let i = 1; i <= remainingSlots; i++) {
    grid.push(
      <View key={`next-${i}`} style={styles.dayCell}>
        <Text style={styles.disabledDayText}>{i}</Text>
      </View>,
    );
  }

  return <View style={styles.grid}>{grid}</View>;
};
