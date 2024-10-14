import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface EventMarqueeProps {
  events: Array<{ name: string }>;
}

const { width } = Dimensions.get('window');

const EventMarquee: React.FC<EventMarqueeProps> = ({ events }) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const textWidth = events.reduce((acc, event) => acc + event.name.length * 15, 0);
    const duration = textWidth * 50;

    Animated.loop(
      Animated.timing(scrollX, {
        toValue: -textWidth,
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [events]);

  return (
    <LinearGradient
      colors={['#FF8C00', '#FF5722']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.marqueeContainer}>
        <Animated.View style={[styles.textContainer, { transform: [{ translateX: scrollX }] }]}>
          {events.concat(events).map((event, index) => (
            <Text key={index} style={styles.text}>
              {event.name.toUpperCase()} •
            </Text>
          ))}
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
  },
  marqueeContainer: {
    overflow: 'hidden',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
});

export default EventMarquee;