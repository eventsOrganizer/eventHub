import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, ViewProps } from 'react-native';

interface AnimatedBackgroundProps extends ViewProps {}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ children, style, ...props }) => {
  const backgroundColor = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundColor, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundColor, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const interpolatedColor = backgroundColor.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#f0f8ff', '#e6f3ff', '#d9edff'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: interpolatedColor },
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});