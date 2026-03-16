import React, { useState, useMemo } from 'react';
import { View } from 'react-native';
import { styles } from './QCalendar.styles';
import { QCalendarHeader } from './QCalendarHeader';
import { QCalendarDaysOfWeek } from './QCalendarDaysOfWeek';
import { QCalendarGrid } from './QCalendarGrid';

interface QCalendarProps {
  onDateSelect?: (date: Date) => void;
}

export const QCalendar: React.FC<QCalendarProps> = ({ onDateSelect }) => {
  const [calendarState, setCalendarState] = useState({
    currentDate: new Date(),
    selectedDate: new Date() as Date | null,
  });

  // Destructure for cleaner usage below
  const { currentDate, selectedDate } = calendarState;

  // Date Math Helpers (Memoized for performance finesse)
  // math only runs when the user changes the month/year!
  const { year, month, daysInMonth, firstDayOfMonth } = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    return {
      year: y,
      month: m,
      daysInMonth: new Date(y, m + 1, 0).getDate(),
      firstDayOfMonth: new Date(y, m, 1).getDay(),
    };
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCalendarState(prev => ({
      ...prev,
      currentDate: new Date(year, month - 1, 1),
    }));
  };

  const handleNextMonth = () => {
    setCalendarState(prev => ({
      ...prev,
      currentDate: new Date(year, month + 1, 1),
    }));
  };

  const handleDayPress = (day: number) => {
    const newSelectedDate = new Date(year, month, day);

    setCalendarState(prev => ({
      ...prev,
      selectedDate: newSelectedDate,
    }));

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
