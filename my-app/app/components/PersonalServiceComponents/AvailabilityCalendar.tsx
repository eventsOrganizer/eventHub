import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { format, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, isBefore, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AvailabilityCalendarProps {
  personalId: number;
  onSelectDate: (date: string) => void;
  startDate: string;
  endDate: string;
  availability: Array<{
    date: string;
    statusday: 'exception' | 'reserved' | 'available';
  }>;
  interval: string;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  personalId,
  onSelectDate,
  startDate,
  endDate,
  availability,
  interval
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(startDate));

  const getDateStatus = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const availabilityItem = availability.find(item => item.date === dateString);
    if (availabilityItem) {
      return availabilityItem.statusday;
    }
    if (isBefore(date, new Date(startDate)) || isAfter(date, new Date(endDate))) {
      return 'disabled';
    }
    return 'available';
  };

  const getDateStyle = (status: string) => {
    switch (status) {
      case 'exception': return styles.exceptionDate;
      case 'reserved': return styles.reservedDate;
      case 'available': return styles.availableDate;
      default: return styles.disabledDate;
    }
  };

  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <View style={styles.calendarGrid}>
        {days.map((date) => {
          const status = getDateStatus(date);
          return (
            <TouchableOpacity
              key={date.toISOString()}
              style={[styles.day, getDateStyle(status)]}
              onPress={() => status !== 'disabled' && onSelectDate(format(date, 'yyyy-MM-dd'))}
              disabled={status === 'disabled'}
            >
              <Text style={[styles.dateText, status === 'disabled' && styles.disabledDateText]}>
                {format(date, 'd')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, -1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth}>
          <Text style={styles.navigationButton}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{format(currentMonth, 'MMMM yyyy', { locale: fr })}</Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <Text style={styles.navigationButton}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.weekDaysContainer}>
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day, index) => (
          <Text key={index} style={styles.weekDayText}>{day}</Text>
        ))}
      </View>
      <ScrollView>
        {renderCalendarDays()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  navigationButton: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    width: '14.28%',
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  day: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  dateText: {
    fontSize: 16,
    textAlign: 'center',
  },
  disabledDateText: {
    color: '#ccc',
  },
  availableDate: {
    backgroundColor: 'lightgreen',
  },
  reservedDate: {
    backgroundColor: 'yellow',
  },
  exceptionDate: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)', // Light red for exception dates
  },
  disabledDate: {
    backgroundColor: '#f0f0f0',
  },
});

export default AvailabilityCalendar;