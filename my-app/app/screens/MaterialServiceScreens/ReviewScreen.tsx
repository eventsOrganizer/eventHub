import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../../navigation/types';
import { supabase } from '../../../lib/supabase';
import { useUser } from '../../UserContext';
import { ReviewHeader } from '../../components/Review/ReviewHeader';
import { RatingHeader } from '../../components/Review/RatingHeader';
import { ReviewForm } from '../../components/Review/ReviewForm';
import { ReviewList } from '../../components/Review/ReviewList';
import { AuthenticationModal } from '../../components/Review/AuthenticationModal';
import { Review, Like } from '../../types/review';
import { themeColors } from '../../utils/themeColors';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useToast } from '../../hooks/use-toast';

type ReviewScreenProps = StackScreenProps<RootStackParamList, 'ReviewScreen'>;

const ReviewScreen: React.FC<ReviewScreenProps> = ({ route, navigation }) => {
  const { materialId, sellOrRent } = route.params;
  const theme = sellOrRent === 'rent' ? themeColors.rent : themeColors.sale;
  const { userId } = useUser();
  const { toast } = useToast();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [newReview, setNewReview] = useState({ rate: 0 });
  const [averageRating, setAverageRating] = useState(0);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchLikes();
  }, [materialId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('review')
        .select(`
          id,
          user_id,
          rate,
          user:user_id (
            firstname,
            lastname
          )
        `)
        .eq('material_id', materialId)
        .order('id', { ascending: false });

      if (error) throw error;

      const formattedReviews = data.map(review => ({
        id: review.id,
        user_id: review.user_id,
        rate: review.rate,
        user: {
          firstname: review.user?.firstname || 'Unknown',
          lastname: review.user?.lastname || 'User'
        }
      }));

      setReviews(formattedReviews);
      calculateAverageRating(formattedReviews);
      setHasUserReviewed(formattedReviews.some(review => review.user_id === userId));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reviews. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const fetchLikes = async () => {
    const { data, error } = await supabase
      .from('like')
      .select('*')
      .eq('material_id', materialId);

    if (error) {
      console.error('Error fetching likes:', error);
    } else {
      setLikes(data);
    }
  };

  const calculateAverageRating = (reviewsData: Review[]) => {
    if (reviewsData.length === 0) return;
    const sum = reviewsData.reduce((acc, review) => acc + review.rate, 0);
    setAverageRating(sum / reviewsData.length);
  };

  const handleSubmitReview = async () => {
    if (!userId) {
      setIsAuthModalVisible(true);
      return;
    }

    if (hasUserReviewed) {
      toast({
        title: "Error",
        description: "You have already reviewed this item",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('review')
        .insert({
          material_id: materialId,
          user_id: userId,
          rate: newReview.rate,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review submitted successfully",
      });
      
      fetchReviews();
      setNewReview({ rate: 0 });
      setHasUserReviewed(true);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      });
    }
  };

  const handleLike = async () => {
    if (!userId) {
      setIsAuthModalVisible(true);
      return;
    }

    const existingLike = likes.find(like => like.user_id === userId);

    if (existingLike) {
      const { error } = await supabase
        .from('like')
        .delete()
        .eq('id', existingLike.id);

      if (error) {
        console.error('Error unliking:', error);
      } else {
        fetchLikes();
      }
    } else {
      const { error } = await supabase
        .from('like')
        .insert({ material_id: materialId, user_id: userId });

      if (error) {
        console.error('Error liking:', error);
      } else {
        fetchLikes();
      }
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={theme.background} 
        style={StyleSheet.absoluteFill} 
      />
      <StatusBar barStyle="light-content" />
      
      <ReviewHeader 
        onBack={() => navigation.goBack()}
        onLike={handleLike}
        isLiked={likes.some(like => like.user_id === userId)}
        theme={theme}
      />
      
      <Animated.View 
        entering={FadeInDown}
        style={styles.contentContainer}
      >
        <BlurView 
          intensity={20} 
          tint="light" 
          style={[
            styles.blurContainer,
            { backgroundColor: 'rgba(255, 255, 255, 0.95)' }
          ]}
        >
          <View style={[styles.content, { backgroundColor: theme.light }]}>
            <RatingHeader 
              averageRating={averageRating} 
              totalReviews={reviews.length}
            />
            
            <View style={styles.divider} />
            
            <ReviewForm
              rating={newReview.rate}
              onRatingChange={(rate) => setNewReview({ rate })}
              onSubmit={handleSubmitReview}
              hasUserReviewed={hasUserReviewed}
              theme={theme}
            />
            
            <View style={styles.divider} />
            
            <ReviewList reviews={reviews} theme={theme} />
          </View>
        </BlurView>
      </Animated.View>

      <AuthenticationModal
        visible={isAuthModalVisible}
        onClose={() => setIsAuthModalVisible(false)}
        onLogin={() => {
          setIsAuthModalVisible(false);
          navigation.navigate('MaterialScreen');
        }}
        onSignup={() => {
          setIsAuthModalVisible(false);
          navigation.navigate('MaterialScreen');
        }}
        theme={theme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
    overflow: 'hidden',
  },
  blurContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  content: {
    flex: 1,
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 20,
  },
});

export default ReviewScreen;