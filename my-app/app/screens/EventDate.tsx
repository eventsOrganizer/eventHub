import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { showAlert } from '../utils/util';
import { format, parse, isValid } from 'date-fns';

interface EventDateManagerProps {
  formData: any;
  setFormData: (data: any) => void;
}

const EventDateManager: React.FC<EventDateManagerProps> = ({ formData, setFormData }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [showExceptionCalendar, setShowExceptionCalendar] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd'); // Get today's date

  useEffect(() => {
    if (formData.startDate && formData.startDate.length === 10) {
      const parsedDate = parse(formData.startDate, 'yyyy-MM-dd', new Date());
      if (isValid(parsedDate)) {
        setShowCalendar(true);
      } else {
        setShowCalendar(false);
        showAlert('Error', 'Invalid start date. Please use the format YYYY-MM-DD.');
      }
    } else {
      setShowCalendar(false);
    }
  }, [formData.startDate]);

  const toggleExceptionDate = (date: string) => {
    const newExceptionDates = formData.exceptionDates || [];
    setFormData({
      ...formData,
      exceptionDates: newExceptionDates.includes(date)
        ? newExceptionDates.filter((d: string) => d !== date)
        : [...newExceptionDates, date],
    });
  };

  const markedExceptionDates = formData.exceptionDates?.reduce((acc: any, date: string) => {
    acc[date] = { selected: true, selectedColor: '#ff0000' }; // Red color for exception dates
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Start Date</Text>
      <TouchableOpacity onPress={() => setShowStartDateCalendar(!showStartDateCalendar)} style={styles.dateInput}>
        <Text style={styles.dateText}>{formData.startDate || 'Select Start Date'}</Text>
      </TouchableOpacity>
      {showStartDateCalendar && (
        <Calendar
          onDayPress={(day: { dateString: string }) => {
            setFormData({ ...formData, startDate: day.dateString });
            setShowStartDateCalendar(false);
          }}
          markedDates={{
            [formData.startDate]: { selected: true, selectedColor: '#4A90E2' },
          }}
          minDate={today}
        />
      )}

      <Text style={styles.label}>Select End Date</Text>
      <TouchableOpacity onPress={() => setShowEndDateCalendar(!showEndDateCalendar)} style={styles.dateInput}>
        <Text style={styles.dateText}>{formData.endDate || 'Select End Date'}</Text>
      </TouchableOpacity>
      {showEndDateCalendar && (
        <Calendar
          onDayPress={(day: { dateString: string }) => {
            setFormData({ ...formData, endDate: day.dateString });
            setShowEndDateCalendar(false);
          }}
          markedDates={{
            [formData.endDate]: { selected: true, selectedColor: '#4A90E2' },
          }}
          minDate={formData.startDate || today}
        />
      )}

      {showCalendar && (
        <View>
          <Text style={styles.label}>Select Exception Dates</Text>
          <TouchableOpacity onPress={() => setShowExceptionCalendar(!showExceptionCalendar)} style={styles.dateInput}>
            <Text style={styles.dateText}>Toggle Exception Calendar</Text>
          </TouchableOpacity>
          {showExceptionCalendar && (
            <Calendar
              onDayPress={(day: { dateString: string }) => toggleExceptionDate(day.dateString)}
              markedDates={markedExceptionDates}
              minDate={today}
              maxDate={formData.endDate} // Ensure this date is calculated before using
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
});

export default EventDateManager;
