import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

interface CalendarProps {
  availableDates: string[];
  onSelectDate: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ availableDates, onSelectDate }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const screenWidth = Dimensions.get('window').width;

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const isDateAvailable = (date: string) => {
    return availableDates.includes(date);
  };

  const renderMonth = (month: number) => {
    const daysInMonth = getDaysInMonth(month, currentYear);
    const firstDayOfMonth = new Date(currentYear, month, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${currentYear}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const isAvailable = isDateAvailable(date);
      days.push(
        <TouchableOpacity
          key={date}
          style={[styles.day, isAvailable ? styles.availableDay : styles.unavailableDay]}
          onPress={() => isAvailable && onSelectDate(date)}
          disabled={!isAvailable}
        >
          <Text style={isAvailable ? styles.availableDayText : styles.unavailableDayText}>{day}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.month}>
        <Text style={styles.monthTitle}>{months[month]} {currentYear}</Text>
        <View style={styles.daysContainer}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Text key={day} style={styles.dayHeader}>{day}</Text>
          ))}
          {days}
        </View>
      </View>
    );
  };

  return (
    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
      {months.map((_, index) => (
        <View key={index} style={[styles.monthContainer, { width: screenWidth }]}>
          {renderMonth(index)}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  monthContainer: {
    padding: 10,
    alignItems: 'center',
  },
  month: {
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  dayHeader: {
    width: '14.28%',
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  day: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
  },
  availableDay: {
    backgroundColor: '#e6fff2',
  },
  unavailableDay: {
    backgroundColor: '#ffe6e6',
  },
  availableDayText: {
    color: 'green',
  },
  unavailableDayText: {
    color: 'red',
  },
});

export default Calendar;