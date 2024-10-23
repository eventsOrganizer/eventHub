import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { Calendar, DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../lib/supabase';

interface AvailabilityCalendarProps {
  materialId: string;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ materialId }) => {
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
        acc[date] = { selected: true, marked: true, selectedColor: '#4CAF50' };
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
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.titleContainer}>
          <Ionicons name="calendar-outline" size={24} color="#4A90E2" />
          <Title style={styles.title}>Availability</Title>
        </View>
        <Calendar
          markedDates={availableDates}
          onDayPress={onDayPress}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#4CAF50',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#4A90E2',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#4CAF50',
            selectedDotColor: '#ffffff',
            arrowColor: '#4A90E2',
            monthTextColor: '#4A90E2',
            indicatorColor: '#4A90E2',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16
          }}
        />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 4,
    borderRadius: 12,
    backgroundColor: 'white',
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