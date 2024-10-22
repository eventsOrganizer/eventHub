import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, FlatList, Text, ScrollView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
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
// type ServiceDetailsProps = {
//   personalData: Service;
//   onReviewPress: () => void;
//   onCommentPress: () => void;
//   onBookPress: () => void;
// };

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
    return (
      <LinearGradient
        colors={['#E6F2FF', '#C2E0FF', '#99CCFF', '#66B2FF']}
        style={styles.container}
      >
        <View style={styles.centeredContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </LinearGradient>
    );
  }

  const renderItem = () => (
    <ScrollView style={styles.content}>
      <View style={styles.card}>
        <PersonalInfo 
          personalData={personalData} 
          onLike={handleLike} 
          averageRating={averageRating}
          reviewCount={reviewCount}
        />
      </View>
      <View style={styles.card}>
      <ServiceDetails 
  personalData={personalData}
  onReviewPress={navigateToReviewScreen}
  onCommentPress={navigateToCommentScreen}
  onBookPress={navigateToBookingScreen}
/>
      </View>
    </ScrollView>
  );

  return (
    <LinearGradient
      colors={['#E6F2FF', '#C2E0FF', '#99CCFF', '#66B2FF']}
      style={styles.container}
    >
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: '#4A90E2',
  },
  card: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
});

export default PersonalDetail;