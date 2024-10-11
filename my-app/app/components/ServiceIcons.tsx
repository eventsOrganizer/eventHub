import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ServiceIcons: React.FC = () => {
  return (
    <View style={styles.services}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Ionicons name="musical-notes-outline" size={40} style={styles.serviceIcon} />
        <Ionicons name="restaurant-outline" size={40} style={styles.serviceIcon} />
        <Ionicons name="camera-outline" size={40} style={styles.serviceIcon} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  services: {
    marginBottom: 20,
  },
  serviceIcon: {
    marginHorizontal: 10,
    color: '#4CAF50',
  },
});

export default ServiceIcons;