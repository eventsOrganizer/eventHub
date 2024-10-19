import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BookingConfirmationProps {
  selectedDate: string | null;
  startHour: string;
  endHour: string;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ selectedDate, startHour, endHour }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Request Sent</Text>
      <Text style={styles.info}>Date: {selectedDate}</Text>
      <Text style={styles.info}>Time: {startHour} - {endHour}</Text>
      <Text style={styles.message}>Your booking request has been sent to the service provider. Please wait for confirmation.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e6f7ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0066cc',
  },
  info: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});

export default BookingConfirmation;