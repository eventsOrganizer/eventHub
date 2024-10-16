import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, PanResponder, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface ResizableSectionProps {
  sections: string[];
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const { width, height } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.8;
const ITEM_SIZE = CIRCLE_SIZE / 5;

const ResizableSection: React.FC<ResizableSectionProps> = ({ sections, activeSection, onSectionChange }) => {
  const [size, setSize] = useState(CIRCLE_SIZE);
  const [isExpanded, setIsExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newSize = Math.max(CIRCLE_SIZE, Math.min(width, size + gestureState.dy));
        setSize(newSize);
      },
      onPanResponderRelease: () => {
        if (size > CIRCLE_SIZE + 50 && !isExpanded) {
          expandSection();
        } else if (size <= CIRCLE_SIZE + 50 && isExpanded) {
          collapseSection();
        }
      },
    })
  ).current;

  const expandSection = () => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: false,
    }).start(() => setIsExpanded(true));
  };

  const collapseSection = () => {
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: false,
    }).start(() => setIsExpanded(false));
  };

  const animatedSize = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCLE_SIZE, width],
  });

  const animatedBorderRadius = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCLE_SIZE / 2, 0],
  });

  const renderSections = () => {
    return sections.map((section, index) => {
      const angle = (index / sections.length) * 2 * Math.PI;
      const x = Math.cos(angle) * (CIRCLE_SIZE / 2 - ITEM_SIZE / 2);
      const y = Math.sin(angle) * (CIRCLE_SIZE / 2 - ITEM_SIZE / 2);

      return (
        <TouchableOpacity
          key={section}
          style={[
            styles.sectionButton,
            {
              transform: [
                { translateX: x },
                { translateY: y },
              ],
            },
          ]}
          onPress={() => onSectionChange(section)}
        >
          <LinearGradient
            colors={activeSection === section ? ['#FF4500', '#FF6347'] : ['#4B0082', '#8A2BE2']}
            style={styles.sectionGradient}
          >
            <Text style={styles.sectionText}>{section}</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: animatedSize,
          height: animatedSize,
          borderRadius: animatedBorderRadius,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <LinearGradient
        colors={['#1E90FF', '#00BFFF', '#87CEFA']}
        style={StyleSheet.absoluteFill}
      />
      {renderSections()}
      <TouchableOpacity style={styles.centerButton} onPress={isExpanded ? collapseSection : expandSection}>
        <Ionicons name={isExpanded ? 'contract' : 'expand'} size={32} color="#fff" />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.expandedText}>{activeSection} Content</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  sectionButton: {
    position: 'absolute',
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionGradient: {
    width: '100%',
    height: '100%',
    borderRadius: ITEM_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  centerButton: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    backgroundColor: '#FF4500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ResizableSection;