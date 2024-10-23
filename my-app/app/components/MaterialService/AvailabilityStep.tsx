import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

interface AvailabilityStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

const AvailabilityStep: React.FC<AvailabilityStepProps> = ({ formData, setFormData }) => {
  const onDayPress = (day: DateData) => {
    const updatedDates = { ...formData.availableDates };
    updatedDates[day.dateString] = !updatedDates[day.dateString];
    setFormData({ ...formData, availableDates: updatedDates });
  };

  const markedDates: { [key: string]: { selected: boolean, selectedColor: string } } = Object.keys(formData.availableDates).reduce((acc: { [key: string]: { selected: boolean, selectedColor: string } }, date) => {
    if (formData.availableDates[date]) {
      acc[date] = { selected: true, selectedColor: '#4CAF50' };
    }
    return acc;
  }, {});

  return (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.container}>
      <Text style={styles.label}>Select Available Dates</Text>
      <Calendar
        markedDates={markedDates}
        onDayPress={onDayPress}
        markingType="multi-dot"
        theme={{
          backgroundColor: 'transparent',
          calendarBackground: 'transparent',
          textSectionTitleColor: '#ffffff',
          selectedDayBackgroundColor: '#4CAF50',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#4A90E2',
          dayTextColor: '#ffffff',
          textDisabledColor: 'rgba(255, 255, 255, 0.5)',
          dotColor: '#4CAF50',
          selectedDotColor: '#ffffff',
          arrowColor: '#ffffff',
          monthTextColor: '#ffffff',
          indicatorColor: '#ffffff',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16
        }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
  },
});

export default AvailabilityStep;
