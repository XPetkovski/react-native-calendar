// src/components/calendar/QCalendar.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { styles } from './QCalendar.styles';

// Import our new sub-components
import { QCalendarHeader } from './QCalendarHeader';
import { QCalendarDaysOfWeek } from './QCalendarDaysOfWeek';
import { QCalendarGrid } from './QCalendarGrid';

interface QCalendarProps {
  onDateSelect?: (date: Date) => void;
}

export const QCalendar: React.FC<QCalendarProps> = ({ onDateSelect }) => {
  // --- State ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // --- Date Math Helpers ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // --- Handlers ---
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayPress = (day: number) => {
    const newSelectedDate = new Date(year, month, day);
    setSelectedDate(newSelectedDate);
    if (onDateSelect) {
      onDateSelect(newSelectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <QCalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
      <QCalendarDaysOfWeek />
      <QCalendarGrid
        year={year}
        month={month}
        daysInMonth={daysInMonth}
        firstDayOfMonth={firstDayOfMonth}
        selectedDate={selectedDate}
        onDayPress={handleDayPress}
      />
    </View>
  );
};
