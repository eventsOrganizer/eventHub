import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const categories = [
  { name: 'Music', icon: 'musical-notes', gradient: ['#FF6B6B', '#FF8E8E'] },
  { name: 'Food', icon: 'restaurant', gradient: ['#4ECDC4', '#45B7AF'] },
  { name: 'Photo', icon: 'camera', gradient: ['#F7B733', '#FC913A'] },
  { name: 'Sports', icon: 'basketball', gradient: ['#6A82FB', '#FC5C7D'] },
  { name: 'Politics', icon: 'megaphone', gradient: ['#4776E6', '#8E54E9'] },
  { name: 'Art', icon: 'color-palette', gradient: ['#FF8008', '#FFC837'] },
  { name: 'Home', icon: 'home', gradient: ['#56CCF2', '#2F80ED'] },
  { name: 'Business', icon: 'briefcase', gradient: ['#11998E', '#38EF7D'] },
  { name: 'Education', icon: 'school', gradient: ['#ED4264', '#FFEDBC'] },
  { name: 'Tech', icon: 'hardware-chip', gradient: ['#4568DC', '#B06AB3'] },
];

const ServiceIcons: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryContainer}>
            <LinearGradient
              colors={category.gradient}
              style={styles.iconBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name={category.icon as keyof typeof Ionicons.glyphMap} size={30} color="white" />
            </LinearGradient>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  categoryContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  iconBackground: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryName: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ServiceIcons;