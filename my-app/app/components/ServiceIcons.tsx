import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const categories = [
  { name: 'Music', icon: 'musical-notes', color: '#FF2D55' },
  { name: 'Food', icon: 'restaurant', color: '#FF9500' },
  { name: 'Photo', icon: 'camera', color: '#5856D6' },
  { name: 'Sports', icon: 'basketball', color: '#FF3B30' },
  { name: 'Politics', icon: 'megaphone', color: '#5AC8FA' },
  { name: 'Art', icon: 'color-palette', color: '#4CD964' },
  { name: 'Home', icon: 'home', color: '#007AFF' },
  { name: 'Business', icon: 'briefcase', color: '#FF2D55' },
  { name: 'Education', icon: 'school', color: '#FFCC00' },
  { name: 'Tech', icon: 'hardware-chip', color: '#5856D6' },
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
            <View style={[styles.iconBackground, { backgroundColor: category.color }]}>
              <Ionicons name={category.icon as keyof typeof Ionicons.glyphMap} size={30} color="#FFFFFF" />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <LinearGradient
        colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.2)']}
        style={styles.flatSurface}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
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
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  categoryName: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    color: '#000000',
  },
  flatSurface: {
    position: 'absolute',
    bottom: -15,
    width: '95%',
    height: 15,
    borderRadius: 10,
    zIndex: -1,
  },
});

export default ServiceIcons;