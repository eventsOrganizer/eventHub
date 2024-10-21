import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000 }) => {
  const [visible, setVisible] = useState(true);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(duration),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  }, [duration, opacity]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, styles[type], { opacity }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  success: {
    backgroundColor: '#4CAF50',
  },
  error: {
    backgroundColor: '#F44336',
  },
  info: {
    backgroundColor: '#2196F3',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});

export default Toast;