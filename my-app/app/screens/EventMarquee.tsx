import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../../lib/theme';

interface EventMarqueeProps {
  events: Array<{ name: string }>;
}

const { width } = Dimensions.get('window');

const EventMarquee: React.FC<EventMarqueeProps> = ({ events }) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const textWidth = events.reduce((acc, event) => acc + event.name.length * 16 + 300, 0);
    const duration = textWidth * 50;

    const animation = Animated.timing(scrollX, {
      toValue: -textWidth,
      duration: duration,
      easing: Easing.linear,
      useNativeDriver: true,
    });

    const resetAnimation = Animated.timing(scrollX, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
    });

    Animated.loop(Animated.sequence([animation, resetAnimation])).start();

    return () => {
      animation.stop();
      resetAnimation.stop();
    };
  }, [events]);

  return (
    <View style={styles.container}>
      <BlurView intensity={90} tint="light" style={styles.blurContainer}>
        <View style={styles.marqueeContainer}>
          <Animated.View 
            style={[
              styles.textContainer, 
              { 
                transform: [{ translateX: scrollX }],
                width: events.reduce((acc, event) => acc + event.name.length * 16 + 30, 0) * 2,
              }
            ]}
          >
            {[...events, ...events].map((event, index) => (
              <View key={index} style={styles.eventContainer}>
                <Text style={styles.text}>{event.name.toUpperCase()}</Text>
                <Text style={styles.bullet}>•</Text>
              </View>
            ))}
          </Animated.View>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    justifyContent: 'center',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.overlay,
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  marqueeContainer: {
    overflow: 'hidden',
    width: width,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  text: {
    color: theme.colors.secondary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  bullet: {
    color: theme.colors.accent,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: theme.spacing.sm,
  },
});

export default EventMarquee;
