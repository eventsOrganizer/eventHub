import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CircularNavigationProps {
  sections: string[];
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const CircularNavigation: React.FC<CircularNavigationProps> = ({ sections, activeSection, onSectionChange }) => {
  const rotateValue = new Animated.Value(0);

  const rotate = (index: number) => {
    Animated.spring(rotateValue, {
      toValue: index,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {sections.map((section, index) => {
        const angle = (index / sections.length) * 2 * Math.PI;
        const x = Math.cos(angle) * 120;
        const y = Math.sin(angle) * 120;

        return (
          <TouchableOpacity
            key={section}
            style={[styles.sectionButton, { transform: [{ translateX: x }, { translateY: y }] }]}
            onPress={() => {
              onSectionChange(section);
              rotate(index);
            }}
          >
            <Text style={[styles.sectionText, activeSection === section && styles.activeSectionText]}>
              {section}
            </Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity style={styles.centerButton}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  activeSectionText: {
    color: '#FF4500',
  },
  centerButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF4500',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CircularNavigation;