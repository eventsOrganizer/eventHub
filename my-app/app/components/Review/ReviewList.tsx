import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ReviewItem } from './ReviewItem';
import { Review } from '../../types/review';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ReviewListProps {
  reviews: Review[];
  theme: any;
}

export const ReviewList = ({ reviews, theme }: ReviewListProps) => {
  const renderItem = ({ item, index }: { item: Review; index: number }) => (
    <ReviewItem item={item} index={index} />
  );

  return (
    <Animated.View entering={FadeInDown.delay(300)} style={styles.container}>
      <FlatList
        data={reviews}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
});