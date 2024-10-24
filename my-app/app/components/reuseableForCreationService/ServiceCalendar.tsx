import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UnifiedCalendar } from './UnifiedCalendar';

interface ServiceCalendarProps {
  startDate: Date;
  endDate: Date;
  exceptionDates: Date[];
  onSelectDate: (date: Date) => void;
  interval: 'Yearly' | 'Monthly' | 'Weekly';
}

const ServiceCalendar: React.FC<ServiceCalendarProps> = ({
  startDate,
  endDate,
  exceptionDates,
  onSelectDate,
  interval
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sélectionnez vos jours d'exception</Text>
      <UnifiedCalendar
        startDate={startDate}
        endDate={endDate}
        selectedDates={exceptionDates}
        onSelectDate={onSelectDate}
        interval={interval}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ServiceCalendar;
