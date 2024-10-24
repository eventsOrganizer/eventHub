import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { AirbnbRating } from 'react-native-ratings';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ReviewFormProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  onSubmit: () => void;
  hasUserReviewed: boolean;
}

export const ReviewForm = ({ rating, onRatingChange, onSubmit, hasUserReviewed }: ReviewFormProps) => {
  return (
    <Animated.View 
      entering={FadeInDown.delay(200)}
      style={styles.container}
    >
      <Text style={styles.title}>Rate this item</Text>
      <AirbnbRating
        count={5}
        defaultRating={rating}
        size={30}
        showRating={false}
        onFinishRating={onRatingChange}
        starContainerStyle={styles.ratingStars}
      />
      <Button 
        mode="contained" 
        onPress={onSubmit} 
        style={[
          styles.submitButton,
          hasUserReviewed && styles.disabledButton
        ]}
        labelStyle={styles.submitButtonLabel}
        disabled={hasUserReviewed}
      >
        {hasUserReviewed ? 'Already Reviewed' : 'Submit Review'}
      </Button>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  ratingStars: {
    paddingVertical: 16,
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 12,
    elevation: 4,
  },
  submitButtonLabel: {
    fontSize: 16,
    paddingVertical: 4,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
});