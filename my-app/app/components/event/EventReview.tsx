import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';
import { AirbnbRating } from 'react-native-ratings';

interface Review {
  id: number;
  user_id: string;
  rate: number;
  user: {
    firstname: string;
    lastname: string;
  };
}

interface EventReviewProps {
  eventId: number;
}

const EventReview: React.FC<EventReviewProps> = ({ eventId }) => {
  const { userId } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('review')
      .select(`
        id,
        user_id,
        rate,
        user:user_id (firstname, lastname)
      `)
      .eq('event_id', eventId);

    if (error) {
      console.error('Error fetching reviews:', error);
    } else {
      setReviews(data as any);
      calculateAverageRating(data as any);
      checkUserReview(data as any);
    }
  };

  const calculateAverageRating = (reviewsData: Review[]) => {
    if (reviewsData.length === 0) return;
    const sum = reviewsData.reduce((acc, review) => acc + review.rate, 0);
    setAverageRating(sum / reviewsData.length);
  };

  const checkUserReview = (reviewsData: Review[]) => {
    const userReview = reviewsData.find(review => review.user_id === userId);
    if (userReview) {
      setHasUserReviewed(true);
      setUserRating(userReview.rate);
    }
  };

  const handleRating = async (rating: number) => {
    if (!userId) {
      // Handle user not logged in
      return;
    }

    if (hasUserReviewed) {
      // Update existing review
      const { error } = await supabase
        .from('review')
        .update({ rate: rating })
        .eq('event_id', eventId)
        .eq('user_id', userId);

      if (!error) {
        setUserRating(rating);
        fetchReviews();
      }
    } else {
      // Create new review
      const { error } = await supabase
        .from('review')
        .insert({ event_id: eventId, user_id: userId, rate: rating });

      if (!error) {
        setHasUserReviewed(true);
        setUserRating(rating);
        fetchReviews();
      }
    }
  };

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View style={styles.reviewItem}>
      <Text style={styles.reviewerName}>{`${item.user.firstname} ${item.user.lastname}`}</Text>
      <AirbnbRating
        count={5}
        defaultRating={item.rate}
        size={15}
        showRating={false}
        isDisabled
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.overallRating}>
        <Text style={styles.averageRating}>{averageRating.toFixed(1)}</Text>
        <AirbnbRating
          count={5}
          defaultRating={averageRating}
          size={20}
          showRating={false}
          isDisabled
        />
        <Text style={styles.totalReviews}>{`(${reviews.length} reviews)`}</Text>
      </View>

      <View style={styles.userRating}>
        <Text style={styles.rateText}>Rate this event:</Text>
        <AirbnbRating
          count={5}
          defaultRating={userRating}
          size={30}
          showRating={false}
          onFinishRating={handleRating}
        />
      </View>

      <FlatList
        data={reviews}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={<Text style={styles.reviewsHeader}>Reviews:</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  overallRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  averageRating: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  totalReviews: {
    marginLeft: 10,
    color: '#666',
  },
  userRating: {
    marginBottom: 20,
  },
  rateText: {
    fontSize: 18,
    marginBottom: 5,
  },
  reviewsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewItem: {
    marginBottom: 10,
  },
  reviewerName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default EventReview;