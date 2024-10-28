import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';
import { Star } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import tw from 'twrnc';

interface EventReviewProps {
  eventId: number;
  showOnlyInput?: boolean;
}

const EventReview: React.FC<EventReviewProps> = ({ eventId }) => {
  const { userId } = useUser();
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hasReviewed, setHasReviewed] = useState(false);

  const fetchData = async () => {
    const [reviewsResponse, userReviewResponse] = await Promise.all([
      supabase.from('review').select('rate').eq('event_id', eventId),
      supabase.from('review').select('rate').eq('event_id', eventId).eq('user_id', userId).single()
    ]);

    if (reviewsResponse.data) {
      const total = reviewsResponse.data.length;
      const sum = reviewsResponse.data.reduce((acc, curr) => acc + curr.rate, 0);
      setAverageRating(total > 0 ? sum / total : 0);
      setTotalReviews(total);
    }

    if (userReviewResponse.data) {
      setHasReviewed(true);
      setUserRating(userReviewResponse.data.rate);
    } else {
      setHasReviewed(false);
      setUserRating(0);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eventId, userId]);

  const handleRating = async (rating: number) => {
    try {
      if (hasReviewed) {
        await supabase
          .from('review')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', userId);
        
        setHasReviewed(false);
        setUserRating(0);
      } else {
        await supabase
          .from('review')
          .insert({ 
            event_id: eventId, 
            user_id: userId, 
            rate: rating 
          });
      }
      await fetchData();
    } catch (error) {
      console.error('Error handling review:', error);
    }
  };

  const renderStar = (index: number) => {
    const displayRating = averageRating;
    const filled = Math.min(Math.max(displayRating - index, 0), 1);
    
    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleRating(index + 1)}
        style={tw`px-0.5`}
      >
        <View style={tw`relative`}>
          {/* Empty star with bright white contour */}
          <Star
            size={22}
            color="white"
            strokeWidth={1.2}
            style={[
              tw`opacity-90`,
              { 
                shadowColor: "white",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
              }
            ]}
          />
          {/* Yellow filled star overlay without white shadow */}
          <View style={[
            tw`absolute top-0 left-0 overflow-hidden`,
            { width: `${filled * 100}%` }
          ]}>
            <Star
              size={22}
              color="#FFD700"
              fill="#FFD700"
              strokeWidth={1.2}
              style={tw`opacity-90`}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View 
      entering={FadeIn}
      style={tw`items-center justify-center`}
    >
      <View style={tw`flex-row items-center`}>
        <View style={tw`flex-row`}>
          {[0, 1, 2, 3, 4].map((index) => renderStar(index))}
        </View>
        <Text style={tw`text-sm text-white/80 ml-2`}>
          {averageRating.toFixed(1)} ({totalReviews})
        </Text>
      </View>
    </Animated.View>
  );
};

export default EventReview;