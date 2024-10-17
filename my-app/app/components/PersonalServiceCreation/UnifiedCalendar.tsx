import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface CalendarProps {
  startDate: Date;
  endDate: Date;
  selectedDates: Date[];
  onSelectDate: (date: Date) => void;
  interval: 'Yearly' | 'Monthly' | 'Weekly';
}

export const UnifiedCalendar: React.FC<CalendarProps> = ({ startDate, endDate, selectedDates, onSelectDate, interval }) => {
  const getDaysArray = (start: Date, end: Date) => {
    const arr = [];
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      arr.push(new Date(dt));
    }
    return arr;
  };

  const daysArray = getDaysArray(startDate, endDate);

  const isDateSelected = (date: Date) => {
    return selectedDates.some(selectedDate => 
      selectedDate.getFullYear() === date.getFullYear() &&
      selectedDate.getMonth() === date.getMonth() &&
      selectedDate.getDate() === date.getDate()
    );
  };

  const renderCalendar = () => {
    switch (interval) {
      case 'Yearly':
        return renderYearlyCalendar();
      case 'Monthly':
        return renderMonthlyCalendar();
      case 'Weekly':
        return renderWeeklyCalendar();
      default:
        return null;
    }
  };

  const renderYearlyCalendar = () => {
    const months = [];
    for (let m = 0; m < 12; m++) {
      const monthStart = new Date(startDate.getFullYear(), m, 1);
      const monthEnd = new Date(startDate.getFullYear(), m + 1, 0);
      months.push(
        <View key={m} style={styles.month}>
          <Text style={styles.monthTitle}>{monthStart.toLocaleString('default', { month: 'long' })}</Text>
          {renderDays(monthStart, monthEnd)}
        </View>
      );
    }
    return <ScrollView>{months}</ScrollView>;
  };

  const renderMonthlyCalendar = () => {
    return (
      <View style={styles.month}>
        <Text style={styles.monthTitle}>{startDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</Text>
        {renderDays(startDate, endDate)}
      </View>
    );
  };

  const renderWeeklyCalendar = () => {
    return (
      <View style={styles.week}>
        <Text style={styles.weekTitle}>Week of {startDate.toDateString()}</Text>
        {renderDays(startDate, endDate)}
      </View>
    );
  };

  const renderDays = (start: Date, end: Date) => {
    const days = getDaysArray(start, end);
    return (
      <View style={styles.daysContainer}>
        {days.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.day,
              isDateSelected(date) && styles.selectedDay
            ]}
            onPress={() => onSelectDate(date)}
          >
            <Text>{date.getDate()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.calendar}>
      {renderCalendar()}
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    flex: 1,
  },
  month: {
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  week: {
    marginBottom: 20,
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  day: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 20,
    backgroundColor: 'lightgray',
  },
  selectedDay: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)', // Light red for selected dates
  },
});