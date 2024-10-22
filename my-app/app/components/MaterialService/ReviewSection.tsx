import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph, Button, TextInput } from 'react-native-paper';
import { supabase } from '../../../lib/supabase';
import { useToast } from "../../hooks/use-toast";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
interface Review {
  id: string;
  user_id: string;
  content: string;
  rating: number;
  created_at: string;
}

interface ReviewSectionProps {
  materialId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ materialId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('material_id', materialId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
    } else {
      setReviews(data || []);
    }
  };

  const submitReview = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        material_id: materialId,
        content: newReview,
        rating: newRating,
        user_id: 'user123', // Replace with actual user ID
      });

    if (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } else {
      fetchReviews();
      setNewReview('');
      setNewRating(5);
      toast({
        title: "Review Submitted",
        description: "Your review has been successfully added.",
      });
    }
  };

  const renderReviewItem = ({ item }: { item: Review }) => (
    <Card style={styles.reviewCard}>
      <Card.Content>
        <Paragraph>{item.content}</Paragraph>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <Ionicons
              key={index}
              name={index < item.rating ? 'star' : 'star-outline'}
              size={16}
              color="#FFD700"
            />
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Reviews</Title>
      <FlatList
        data={reviews}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Paragraph>No reviews yet.</Paragraph>}
      />
      <Card style={styles.newReviewCard}>
        <Card.Content>
          <TextInput
            label="Write a review"
            value={newReview}
            onChangeText={setNewReview}
            multiline
          />
          <View style={styles.ratingInput}>
            {[...Array(5)].map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setNewRating(index + 1)}
              >
                <Ionicons
                  name={index < newRating ? 'star' : 'star-outline'}
                  size={24}
                  color="#FFD700"
                />
              </TouchableOpacity>
            ))}
          </View>
          <Button mode="contained" onPress={submitReview} style={styles.submitButton}>
            Submit Review
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  reviewCard: {
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  newReviewCard: {
    marginTop: 16,
  },
  ratingInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  submitButton: {
    marginTop: 16,
  },
});

export default ReviewSection;