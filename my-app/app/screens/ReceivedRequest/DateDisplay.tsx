import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DateDisplayProps {
  date: string;
  startTime: string;
  endTime: string;
}

const DateDisplay: React.FC<DateDisplayProps> = ({ date, startTime, endTime }) => {
  return (
    <View style={styles.dateContainer}>
      <Text style={styles.dateText}>Date: {date}</Text>
      <Text style={styles.dateText}>From {startTime} to {endTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dateContainer: {
    marginTop: 16,
  },
  dateText: {
    fontSize: 14,
  },
});

export default DateDisplay;