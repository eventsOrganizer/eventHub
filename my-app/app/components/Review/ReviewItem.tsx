import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { AirbnbRating } from 'react-native-ratings';
import { MessageCircle } from 'lucide-react-native';
import { Review } from '../../types/review';

interface ReviewItemProps {
  item: Review;
  index: number;
}

export const ReviewItem = ({ item, index }: ReviewItemProps) => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: 1,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
          opacity: animatedValue,
        },
      ]}
    >
      <View style={styles.header}>
        <Avatar.Image
          size={50}
          source={{ uri: `https://ui-avatars.com/api/?name=${item.user?.firstname}+${item.user?.lastname}&background=random` }}
        />
        <View style={styles.headerText}>
          <Text style={styles.name}>
            {`${item.user?.firstname || 'Unknown'} ${item.user?.lastname || 'User'}`}
          </Text>
          <AirbnbRating
            count={5}
            defaultRating={item.rate}
            size={16}
            showRating={false}
            isDisabled={true}
            starContainerStyle={styles.ratingContainer}
          />
        </View>
        <MessageCircle size={20} color="#666" style={styles.icon} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ratingContainer: {
    alignItems: 'flex-start',
  },
  icon: {
    opacity: 0.5,
  },
});