import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';

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

    const sequenceAnimation = Animated.sequence([animation, resetAnimation]);

    Animated.loop(sequenceAnimation).start();

    return () => {
      sequenceAnimation.stop();
    };
  }, [events]);

  return (
    <View style={styles.container}>
      <BlurView intensity={90} tint="dark" style={styles.blurContainer}>
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
    marginBottom: 15,
    overflow: 'hidden',
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
    marginRight: 20,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    fontFamily: 'System',
  },
  bullet: {
    color: '#FFA500',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default EventMarquee;