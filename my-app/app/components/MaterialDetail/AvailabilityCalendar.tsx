import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { Calendar, DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../lib/supabase';
import { format } from 'date-fns';

interface AvailabilityCalendarProps {
  materialId: string;
  theme: any;
}

type MarkedDates = {
  [date: string]: {
    selected: boolean;
    marked: boolean;
    selectedColor: string;
    dotColor: string;
  };
};

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ materialId, theme }) => {
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});

  useEffect(() => {
    fetchAvailability();
  }, [materialId]);

  const fetchAvailability = async () => {
    try {
      // Fetch all availability entries for the material
      const { data, error } = await supabase
        .from('availability')
        .select('date, startdate, enddate, statusday')
        .eq('material_id', materialId)
        .not('statusday', 'is', null);

      if (error) throw error;

      const newMarkedDates: MarkedDates = {};

      data?.forEach((availability) => {
        // Handle single date
        if (availability.date) {
          const formattedDate = format(new Date(availability.date), 'yyyy-MM-dd');
          newMarkedDates[formattedDate] = {
            selected: true,
            marked: true,
            selectedColor: availability.statusday === 'available' ? '#4CAF50' : '#FF5252',
            dotColor: availability.statusday === 'available' ? '#4CAF50' : '#FF5252',
          };
        }
        
        // Handle date range
        if (availability.startdate && availability.enddate) {
          const start = new Date(availability.startdate);
          const end = new Date(availability.enddate);
          
          for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
            const formattedDate = format(date, 'yyyy-MM-dd');
            newMarkedDates[formattedDate] = {
              selected: true,
              marked: true,
              selectedColor: availability.statusday === 'available' ? '#4CAF50' : '#FF5252',
              dotColor: availability.statusday === 'available' ? '#4CAF50' : '#FF5252',
            };
          }
        }
      });

      setMarkedDates(newMarkedDates);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const onDayPress = (day: DateData) => {
    console.log('Selected day:', day);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.light }]}>
      <View style={styles.titleContainer}>
        <Ionicons name="calendar-outline" size={24} color={theme.primary} />
        <Title style={[styles.title, { color: theme.primary }]}>Availability</Title>
      </View>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
          <Title style={styles.legendText}>Available</Title>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF5252' }]} />
          <Title style={styles.legendText}>Reserved</Title>
        </View>
      </View>

      <Calendar
        markedDates={markedDates}
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
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
});

export default AvailabilityCalendar;