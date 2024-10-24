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

type ReviewScreenProps = StackScreenProps<RootStackParamList, 'ReviewScreen'>;

const ReviewScreen: React.FC<ReviewScreenProps> = ({ route, navigation }) => {
  const { materialId, sellOrRent } = route.params as { materialId: string; sellOrRent: 'sell' | 'rent' };
  const theme = sellOrRent === 'rent' ? themeColors.rent : themeColors.sale;
  const { userId } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [newReview, setNewReview] = useState({ rate: 0 });
  const [averageRating, setAverageRating] = useState(0);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchLikes();
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
      .eq('material_id', materialId)
      .order('id', { ascending: false });  // Assuming 'id' is auto-incrementing

    if (error) {
      console.error('Error fetching reviews:', error);
    } else {
      const formattedData = data.map(review => ({
        ...review,
        user: review.user || { firstname: 'Unknown', lastname: 'User' }
      }));
      setReviews(formattedData);
      calculateAverageRating(formattedData);
      setHasUserReviewed(formattedData.some(review => review.user_id === userId));
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

    if (hasUserReviewed) return;

    const { error } = await supabase
      .from('review')
      .insert({
        material_id: materialId,
        user_id: userId,
        rate: newReview.rate,
      });

    if (error) {
      console.error('Error submitting review:', error);
    } else {
      fetchReviews();
      setNewReview({ rate: 0 });
      setHasUserReviewed(true);
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
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
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
                primaryColor={theme.primary}
              />
              
              <View style={styles.divider} />
              
              <ReviewList 
                reviews={reviews} 
                primaryColor={theme.primary}
              />
            </View>
          </BlurView>
        </Animated.View>
      </ScrollView>

      <AuthenticationModal
        visible={isAuthModalVisible}
        onClose={() => setIsAuthModalVisible(false)}
        onLogin={() => {
          setIsAuthModalVisible(false);
          navigation.navigate('Signin');
        }}
        onSignup={() => {
          setIsAuthModalVisible(false);
          navigation.navigate('Signup');
        }}
        primaryColor={theme.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
    overflow: 'hidden',
    minHeight: '100%',
  },
  blurContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  content: {
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 20,
  },
});

export default ReviewScreen;