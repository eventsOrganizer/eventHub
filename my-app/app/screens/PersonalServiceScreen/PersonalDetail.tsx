import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, FlatList, Text, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Service } from '../../services/serviceTypes';
import { fetchPersonalDetail, toggleLike } from '../../services/personalService';
import { fetchAvailabilityData, AvailabilityData } from '../../services/availabilityService';
import { useUser } from '../../UserContext';
import { useToast } from '../../hooks/useToast';
import PersonalInfo from '../../components/PersonalServiceComponents/PersonalInfo';
import ServiceDetails from './components/ServiceDetails';

type RootStackParamList = {
  AddReviewScreen: { personalId: number; userId: string | null };
  CommentsScreen: { personalId: number; userId: string | null };
  BookingScreen: { personalId: number; userId: string | null; availabilityData: AvailabilityData | null };
  PersonalDetail: { personalId: number };
  Signin: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type PersonalDetailRouteProp = RouteProp<RootStackParamList, 'PersonalDetail'>;

const PersonalDetail: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PersonalDetailRouteProp>();
  const { personalId } = route.params;
  const { userId } = useUser();
  const { toast } = useToast();

  const [personalData, setPersonalData] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchPersonalDetail(personalId);
      setPersonalData(data);
      const availability = await fetchAvailabilityData(personalId);
      setAvailabilityData(availability);
      
      if (data?.review && data.review.length > 0) {
        const totalRating = data.review.reduce((sum, review) => sum + review.rate, 0);
        setAverageRating(totalRating / data.review.length);
        setReviewCount(data.review.length);
      }
    } catch (error) {
      console.error('Error fetching personal detail:', error);
      toast({
        title: "Error",
        description: "Unable to load service details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [personalId, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAuthenticatedAction = useCallback((action: () => void) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to perform this action.",
        variant: "default",
      });
      navigation.navigate('Signin');
    } else {
      action();
    }
  }, [userId, toast, navigation]);

  const handleLike = useCallback(async () => {
    if (!userId) {
      handleAuthenticatedAction(() => {});
      return;
    }
    const result = await toggleLike(personalId, userId);
    if (result !== null) {
      setPersonalData(prevData => {
        if (!prevData) return null;
        const newLikes = result
          ? [...(prevData.like || []), { user_id: userId }]
          : (prevData.like || []).filter(like => like.user_id !== userId);
        return { ...prevData, like: newLikes };
      });
    }
  }, [userId, personalId, handleAuthenticatedAction]);

  const navigateToReviewScreen = useCallback(() => {
    handleAuthenticatedAction(() => {
      navigation.navigate('AddReviewScreen', { personalId, userId });
    });
  }, [handleAuthenticatedAction, navigation, personalId, userId]);

  const navigateToCommentScreen = useCallback(() => {
    handleAuthenticatedAction(() => {
      navigation.navigate('CommentsScreen', { personalId, userId });
    });
  }, [handleAuthenticatedAction, navigation, personalId, userId]);

  const navigateToBookingScreen = useCallback(() => {
    handleAuthenticatedAction(() => {
      if (userId && availabilityData) {
        navigation.navigate('BookingScreen', { personalId, userId, availabilityData });
      }
    });
  }, [handleAuthenticatedAction, navigation, personalId, availabilityData, userId]);

  if (isLoading || !personalData || !availabilityData) {
    return <View style={styles.centeredContainer}><Text style={styles.loadingText}>Loading...</Text></View>;
  }

  const renderItem = () => (
    <View style={styles.content}>
      <PersonalInfo 
        personalData={personalData} 
        onLike={handleLike} 
        averageRating={averageRating}
        reviewCount={reviewCount}
      />
      <ServiceDetails personalData={personalData} />
      <TouchableOpacity style={styles.button} onPress={navigateToReviewScreen}>
        <Text style={styles.buttonText}>Submit a Review</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={navigateToCommentScreen}>
        <Text style={styles.buttonText}>View & Leave Comments</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={navigateToBookingScreen}>
        <Text style={styles.buttonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <FlatList
        data={[{ key: 'content' }]}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PersonalDetail;