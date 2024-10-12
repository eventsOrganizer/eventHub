import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AttendeesSection: React.FC<{ eventId: number }> = ({ eventId }) => {
  return (
    <LinearGradient
      colors={['#FF8C00', '#FFA500']}
      style={styles.container}
    >
      <Text style={styles.title}>Attendees</Text>
      {/* Display attendees here */}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
});

export default AttendeesSection;