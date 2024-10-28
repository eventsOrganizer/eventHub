import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ViewStyle, Alert } from 'react-native';
import { format, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, isBefore, isAfter } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { supabase } from '../../../services/supabaseClient';

interface LocalAvailabilityCalendarProps {
  localId: number;
  onSelectDate: (date: string) => void;
  startDate: string;
  endDate: string;
  availability: Array<{
    id: number;
    date: string;
    statusday: 'exception' | 'reserved' | 'available';
  }>;
  interval: string;
  selectedDate: string | null;
  userId: string | null;
}

type DateStatus = 'exception' | 'reserved' | 'available' | 'disabled' | 'pending';

const LocalAvailabilityCalendar: React.FC<LocalAvailabilityCalendarProps> = ({
  localId,
  onSelectDate,
  startDate,
  endDate,
  availability,
  interval,
  selectedDate,
  userId
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(startDate));
  const [dateStatuses, setDateStatuses] = useState<Record<string, DateStatus>>({});

  useEffect(() => {
    const fetchDateStatuses = async () => {
      console.log(`Fetching availability for localId: ${localId}`);
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('availability')
        .select('id, date, statusday')
        .eq('local_id', localId);

      if (availabilityError) {
        console.error('Error fetching availability:', availabilityError);
        return;
      }

      // Log availability data
      console.log('Availability Data:', availabilityData);

      console.log(`Fetching request data for localId: ${localId} and userId: ${userId}`);
      const { data: requestData, error: requestError } = await supabase
        .from('request')
        .select('availability_id, status')
        .eq('local_id', localId)
        .eq('user_id', userId);

      if (requestError) {
        console.error('Error fetching request data:', requestError);
        return;
      }

      // Log request data
      console.log('Request Data:', requestData);

      const newDateStatuses: Record<string, DateStatus> = {};

      availabilityData.forEach((item: { id: number; date: string; statusday: DateStatus }) => {
        newDateStatuses[item.date] = item.statusday;
      });

      requestData.forEach((item: { availability_id: number; status: string }) => {
        if (item.status === 'pending') {
          const pendingDate = availabilityData.find((a: { id: number; date: string }) => a.id === item.availability_id)?.date;
          if (pendingDate) {
            newDateStatuses[pendingDate] = 'pending';
          }
        }
      });

      // Log the constructed date statuses
      console.log('Date Statuses:', newDateStatuses);

      setDateStatuses(newDateStatuses);
    };

    fetchDateStatuses();
  }, [localId, userId]);

  const getDateStatus = (date: Date): DateStatus => {
    const dateString = format(date, 'yyyy-MM-dd');
    if (isBefore(date, new Date(startDate)) || isAfter(date, new Date(endDate))) {
      return 'disabled';
    }
    return dateStatuses[dateString] || 'available';
  };

  const getDateStyle = (status: DateStatus, date: Date): ViewStyle => {
    const baseStyle: ViewStyle = styles.day;
    const additionalStyles: ViewStyle = {};

    switch (status) {
      case 'exception':
        additionalStyles.backgroundColor = 'rgba(255, 0, 0, 0.5)'; // Make it more prominent
        break;
      case 'reserved':
        additionalStyles.backgroundColor = 'yellow';
        break;
      case 'available':
        additionalStyles.backgroundColor = 'lightgreen';
        break;
      case 'disabled':
        additionalStyles.backgroundColor = '#f0f0f0';
        break;
      case 'pending':
        additionalStyles.backgroundColor = 'lightgray';
        break;
    }

    if (selectedDate && isSameDay(date, new Date(selectedDate))) {
      additionalStyles.backgroundColor = 'lightblue';
    }

    return { ...baseStyle, ...additionalStyles };
  };

  const handleDatePress = (date: Date) => {
    const status = getDateStatus(date);
    const dateString = format(date, 'yyyy-MM-dd');

    switch (status) {
      case 'available':
        onSelectDate(dateString);
        break;
      case 'exception':
        Alert.alert('Date not available', 'This date is not available.');
        break;
      case 'reserved':
        Alert.alert('Date reserved', 'This date is already reserved.');
        break;
      case 'pending':
        Alert.alert('Pending request', 'You have already sent a request for this date. Please choose another available date (in green).');
        break;
      default:
        break;
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
              style={getDateStyle(status, date)}
              onPress={() => handleDatePress(date)}
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
        <Text style={styles.monthTitle}>{format(currentMonth, 'MMMM yyyy', { locale: enUS })}</Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <Text style={styles.navigationButton}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.weekDaysContainer}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
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
});

export default LocalAvailabilityCalendar;
