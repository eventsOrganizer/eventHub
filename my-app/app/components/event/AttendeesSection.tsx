import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AttendeesSection: React.FC<{ eventId: number }> = ({ eventId }) => {
  // Fetch and display attendees
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendees</Text>
      {/* Display attendees here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});

export default AttendeesSection;