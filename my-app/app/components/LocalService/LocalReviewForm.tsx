import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';

interface LocalReviewFormProps {
  localId: number;
  onReviewSubmitted: () => void;
}

const LocalReviewForm: React.FC<LocalReviewFormProps> = ({ localId, onReviewSubmitted }) => {
  const [rating, setRating] = useState('');
  const { userId } = useUser();

  const handleSubmitReview = async () => {
    if (!userId) {
      Alert.alert('Authentication Required', 'Please log in to submit a review.');
      return;
    }
  
    const ratingNumber = parseFloat(rating);
    if (isNaN(ratingNumber) || ratingNumber < 0 || ratingNumber > 5) {
      Alert.alert('Invalid Rating', 'Please enter a valid rating between 0 and 5.');
      return;
    }
  
    try {
      const { data, error } = await supabase
        .from('review')
        .insert({
          user_id: userId,
          local_id: localId,
          rate: ratingNumber,
        });
  
      if (error) throw error;
  
      console.log('Review submitted successfully');
      onReviewSubmitted(); // Call the function to refresh data in parent
      setRating('');
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    }
  };
  
  if (!userId) {
    return null; // Don't render the form if the user is not authenticated
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave a Review</Text>
      <TextInput
        style={styles.input}
        placeholder="Rating (0-5)"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
        <Text style={styles.submitButtonText}>Submit Review</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LocalReviewForm;