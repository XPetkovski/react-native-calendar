// src/components/calendar/QCalendarHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './QCalendar.styles';

interface QCalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const QCalendarHeader: React.FC<QCalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
}) => {
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onPrevMonth} style={styles.arrowButton}>
        <Text style={styles.arrowText}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.monthText}>{`${monthName} ${year}`}</Text>
      <TouchableOpacity onPress={onNextMonth} style={styles.arrowButton}>
        <Text style={styles.arrowText}>{'>'}</Text>
      </TouchableOpacity>
    </View>
  );
};
