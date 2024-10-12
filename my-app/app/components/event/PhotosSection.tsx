import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const PhotosSection: React.FC<{ eventId: number }> = ({ eventId }) => {
  // Fetch and display photos
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Photos</Text>
      <ScrollView horizontal>
        {/* Display photos here */}
      </ScrollView>
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

export default PhotosSection;