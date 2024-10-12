import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PhotosSection: React.FC<{ eventId: number }> = ({ eventId }) => {
  return (
    <LinearGradient
      colors={['#FF8C00', '#FFA500']}
      style={styles.container}
    >
      <Text style={styles.title}>Photos</Text>
      <ScrollView horizontal>
        {/* Display photos here */}
      </ScrollView>
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

export default PhotosSection;