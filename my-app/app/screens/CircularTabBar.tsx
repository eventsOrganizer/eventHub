import React, { useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CircularTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const { width } = Dimensions.get('window');

const CircularTabBar: React.FC<CircularTabBarProps> = ({ state, descriptors, navigation }) => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  const rotate = (direction: string) => {
    Animated.timing(rotateValue, {
      toValue: direction === 'next' ? 1 : -1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      rotateValue.setValue(0);
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [
              {
                rotate: rotateValue.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: ['-30deg', '0deg', '30deg'],
                }),
              },
            ],
          },
        ]}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const iconName = options.tabBarIcon({ focused: isFocused, color: isFocused ? '#00FF00' : 'gray', size: 24 });

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={styles.tabButton}
            >
              <Ionicons name={iconName} size={24} color={isFocused ? '#00FF00' : 'gray'} />
            </TouchableOpacity>
          );
        })}
      </Animated.View>
      <TouchableOpacity style={styles.plusButton} onPress={() => {}}>
        <Ionicons name="add" size={48} color="#00FF00" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    width: width,
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.8,
    marginBottom: 20,
  },
  tabButton: {
    alignItems: 'center',
  },
  plusButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    padding: 10,
  },
});

export default CircularTabBar;