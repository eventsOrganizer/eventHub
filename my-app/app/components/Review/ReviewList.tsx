import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { ReviewItem } from './ReviewItem';
import { Review } from '../../types/review';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList = ({ reviews }: ReviewListProps) => {
  return (
    <Animated.View entering={FadeInDown.delay(300)} style={styles.container}>
      <Text style={styles.title}>All Reviews</Text>
      <FlatList
        data={reviews}
        renderItem={({ item, index }) => <ReviewItem item={item} index={index} />}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});