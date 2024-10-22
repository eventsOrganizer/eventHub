import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Star } from 'lucide-react-native';

interface ReviewSectionProps {
  materialId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ materialId }) => {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmitReview = () => {
    // Implement review submission logic here
    console.log('Submitting review:', { materialId, review, rating });
    // Reset form after submission
    setReview('');
    setRating(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reviews</Text>
      <Text style={styles.subtitle}>No reviews yet.</Text>
      <TextInput
        mode="outlined"
        label="Write a review"
        value={review}
        onChangeText={setReview}
        multiline
        numberOfLines={4}
        style={styles.input}
      />
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            color={star <= rating ? '#FFD700' : '#E1E8ED'}
            onPress={() => setRating(star)}
          />
        ))}
      </View>
      <Button
        mode="contained"
        onPress={handleSubmitReview}
        style={styles.submitButton}
        labelStyle={styles.submitButtonLabel}
      >
        Submit Review
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#F0F4F8',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#7E57C2',
    borderRadius: 8,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ReviewSection;