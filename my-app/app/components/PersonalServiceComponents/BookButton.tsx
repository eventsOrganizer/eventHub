import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const BookButton = () => (
  <TouchableOpacity style={styles.bookButton}>
    <Text style={styles.bookButtonText}>Book Now</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  bookButton: {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookButton;