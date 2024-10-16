import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WheelNavigationProps {
  sections: string[];
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 80;
const ITEM_SPACING = 20;

const WheelNavigation: React.FC<WheelNavigationProps> = ({ sections, activeSection, onSectionChange }) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  const renderItem = (section: string, index: number) => {
    const inputRange = [
      (index - 2) * (ITEM_WIDTH + ITEM_SPACING),
      (index - 1) * (ITEM_WIDTH + ITEM_SPACING),
      index * (ITEM_WIDTH + ITEM_SPACING),
      (index + 1) * (ITEM_WIDTH + ITEM_SPACING),
      (index + 2) * (ITEM_WIDTH + ITEM_SPACING),
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 0.8, 1, 0.8, 0.6],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 0.5, 1, 0.5, 0.3],
      extrapolate: 'clamp',
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [20, 10, 0, 10, 20],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        key={section}
        onPress={() => onSectionChange(section)}
        style={styles.itemContainer}
      >
        <Animated.View
          style={[
            styles.item,
            {
              transform: [{ scale }, { translateY }],
              opacity,
            },
          ]}
        >
          <Text style={[styles.itemText, activeSection === section && styles.activeItemText]}>
            {section}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={sections}
        renderItem={({ item, index }) => renderItem(item, index)}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        snapToInterval={ITEM_WIDTH + ITEM_SPACING}
        decelerationRate="fast"
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      />
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 120,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingHorizontal: (width - ITEM_WIDTH) / 2,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    marginHorizontal: ITEM_SPACING / 2,
  },
  item: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    borderRadius: ITEM_WIDTH / 2,
    backgroundColor: '#2E2E2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  activeItemText: {
    color: '#FF4500',
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF4500',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WheelNavigation;