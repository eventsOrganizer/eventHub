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
  interval,
}) => {
  return (
    <View>
      <Text style={styles.label}>Sélectionnez les dates d'exception</Text>
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
  label: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    marginTop: 15 
  },
});

export default ServiceCalendar;