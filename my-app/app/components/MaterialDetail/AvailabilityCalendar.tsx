import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { Calendar, DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../lib/supabase';

interface AvailabilityCalendarProps {
  materialId: string;
  theme: any;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ materialId, theme }) => {
  const [availableDates, setAvailableDates] = useState<{ [date: string]: { selected: boolean, marked: boolean, selectedColor: string } }>({});

  useEffect(() => {
    fetchAvailability();
  }, [materialId]);

  const fetchAvailability = async () => {
    const { data, error } = await supabase
      .from('availability')
      .select('date')
      .eq('material_id', materialId);
    if (error) {
      console.error('Error fetching availability:', error);
    } else {
      const dates = data.reduce<{ [date: string]: { selected: boolean, marked: boolean, selectedColor: string } }>((acc, { date }) => {
        acc[date] = { selected: true, marked: true, selectedColor: theme.primary };
        return acc;
      }, {});
      setAvailableDates(dates);
    }
  };

  const onDayPress = (day: DateData) => {
    console.log('Selected day', day);
    // Implement date selection logic here
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.light }]}>
      <View style={styles.titleContainer}>
        <Ionicons name="calendar-outline" size={24} color={theme.primary} />
        <Title style={[styles.title, { color: theme.primary }]}>Availability</Title>
      </View>
      <Calendar
        markedDates={availableDates}
        onDayPress={onDayPress}
        theme={{
          backgroundColor: theme.light,
          calendarBackground: theme.light,
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: theme.primary,
          selectedDayTextColor: '#ffffff',
          todayTextColor: theme.primary,
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: theme.primary,
          selectedDotColor: '#ffffff',
          arrowColor: theme.primary,
          monthTextColor: theme.primary,
          indicatorColor: theme.primary,
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    padding: 16,
    elevation: 2,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default AvailabilityCalendar;