import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { addReview } from '../../services/personalService';
import { useUser } from '../../UserContext';
import { useToast } from '../../hooks/useToast';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddReviewScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { personalId } = route.params as { personalId: number };
  const { userId } = useUser();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmitReview = async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a review.",
        variant: "default",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Invalid Rating",
        description: "Please select at least one star.",
        variant: "destructive",
      });
      return;
    }

    const success = await addReview(personalId, userId, rating);
    if (success) {
      toast({
        title: "Success",
        description: "Your review has been submitted successfully.",
        variant: "default",
      });
      navigation.goBack();
    } else {
      toast({
        title: "Error",
        description: "Failed to submit the review. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Submit a Review</Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
            <Icon
              name={star <= rating ? 'star' : 'star-o'}
              size={40}
              color={star <= rating ? 'gold' : 'gray'}
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
        <Text style={styles.submitButtonText}>Submit Review</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  star: {
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddReviewScreen;