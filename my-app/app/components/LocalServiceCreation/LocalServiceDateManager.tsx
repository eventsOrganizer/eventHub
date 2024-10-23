import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import ServiceCalendar from '../reuseableForCreationService/ServiceCalendar';
import { showAlert } from '../../utils/util';
import { addYears, addMonths, addWeeks, format, parse, isValid } from 'date-fns';

interface LocalServiceDateManagerProps {
  formData: any;
  setFormData: (data: any) => void;
}

const LocalServiceDateManager: React.FC<LocalServiceDateManagerProps> = ({ formData, setFormData }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);

  useEffect(() => {
    if (formData.startDate && formData.startDate.length === 10 && formData.interval) {
      const parsedDate = parse(formData.startDate, 'yyyy-MM-dd', new Date());
      if (isValid(parsedDate)) {
        let end;
        switch (formData.interval) {
          case 'Yearly':
            end = addYears(parsedDate, 1);
            break;
          case 'Monthly':
            end = addMonths(parsedDate, 1);
            break;
          case 'Weekly':
            end = addWeeks(parsedDate, 1);
            break;
          default:
            return;
        }
        setFormData({ ...formData, endDate: format(end, 'yyyy-MM-dd') });
        setShowCalendar(true);
      } else {
        setShowCalendar(false);
        showAlert('Error', 'Invalid start date. Please use the format YYYY-MM-DD.');
      }
    } else {
      setShowCalendar(false);
    }
  }, [formData.startDate, formData.interval]);

  const handleIntervalSelect = (interval: 'Yearly' | 'Monthly' | 'Weekly') => {
    setFormData({ ...formData, interval });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Availability Interval</Text>
      <View style={styles.intervalContainer}>
        {['Weekly', 'Monthly', 'Yearly'].map((interval) => (
          <TouchableOpacity
            key={interval as "Yearly" | "Monthly" | "Weekly"} // Type assertion added
            onPress={() => handleIntervalSelect(interval)}
            style={[styles.iconButton, formData.interval === interval && styles.selectedButton]}>
            <View style={styles.iconWithBubble}>
              <Ionicons name={formData.interval === interval ? 'calendar' : 'calendar-outline'} size={40} color="#fff" />
              <Text style={styles.iconLabel}>{interval}</Text>
              <View style={[
                styles.bubble,
                formData.interval === interval ? styles.selectedBubble : {}
              ]}>
                <Text style={[
                  styles.bubbleText,
                  formData.interval === interval ? styles.selectedBubbleText : {}
                ]}>
                  {interval === 'Weekly' ? '7' : interval === 'Monthly' ? '30' : '365'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

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
        />
      )}

      <Text style={styles.label}>End Date</Text>
      <Text style={styles.dateText}>{formData.endDate ? formData.endDate : 'End Date will be calculated'}</Text>

      {showCalendar && formData.interval && (
        <ServiceCalendar
          startDate={new Date(formData.startDate)}
          endDate={new Date(formData.endDate)}
          exceptionDates={formData.exceptionDates || []}
          onSelectDate={(date) => {
            const newExceptionDates = formData.exceptionDates || [];
            setFormData({
              ...formData,
              exceptionDates: newExceptionDates.some((d: Date) => d.toDateString() === date.toDateString())
                ? newExceptionDates.filter((d: Date) => d.toDateString() !== date.toDateString())
                : [...newExceptionDates, date],
            });
          }}
          interval={formData.interval}
        />
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
  intervalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A90E2',
    elevation: 5, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#0056b3', // Highlight selected button
    transform: [{ scale: 1.1 }], // Slightly increase size
  },
  iconWithBubble: {
    position: 'relative',
    alignItems: 'center',
  },
  bubble: {
    position: 'absolute',
    top: -15,
    right: -15,
    width: 23,
    height: 23,
    borderRadius: 15,
    backgroundColor: '#fff', // Notification bubble white
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBubble: {
    backgroundColor: '#000', // Black background for selected bubble
  },
  bubbleText: {
    color: '#000', // Black text in the bubble
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedBubbleText: {
    color: '#fff', // White text for selected bubble
  },
  iconLabel: {
    marginTop: 2, // Adjust space between icon and label
    fontSize: 12, // Smaller text
    color: '#fff',
    fontWeight: 'bold', // Make text bold
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

export default LocalServiceDateManager;
