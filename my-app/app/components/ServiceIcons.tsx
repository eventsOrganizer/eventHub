import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const categories = [
  { name: 'Music', icon: 'musical-notes', color: '#E63946' },
  { name: 'Food', icon: 'restaurant', color: '#2A9D8F' },
  { name: 'Photo', icon: 'camera', color: '#0081A7' },
  { name: 'Sports', icon: 'basketball', color: '#F4A261' },
  { name: 'Politics', icon: 'megaphone', color: '#5C4D9A' },
  { name: 'Art', icon: 'color-palette', color: '#E63946' },
  { name: 'Home', icon: 'home', color: '#2A9D8F' },
  { name: 'Business', icon: 'briefcase', color: '#0081A7' },
  { name: 'Education', icon: 'school', color: '#F4A261' },
  { name: 'Tech', icon: 'hardware-chip', color: '#5C4D9A' },
];

const ServiceIcons: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={width / 5}
        snapToAlignment="center"
      >
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryContainer}>
            <LinearGradient
              colors={[category.color, category.color + 'AA']}
              style={styles.iconBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name={category.icon as keyof typeof Ionicons.glyphMap} size={35} color="white" />
            </LinearGradient>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Flat surface stand for all icons */}
      <View style={styles.flatSurface} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    position: 'relative',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  categoryContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
    width: width / 5 - 10,
  },
  iconBackground: {
    width: 70,
    height: 70,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },
  categoryName: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    color: '#222',
  },
  flatSurface: {
    position: 'absolute',
    bottom: -15, // Lowered to -15 to avoid text interference
    width: '90%',
    height: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    zIndex: -1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default ServiceIcons;
