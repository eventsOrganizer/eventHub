import React, { useState, useCallback, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { View, StyleSheet, KeyboardAvoidingView, Platform, FlatList, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { fetchLocalDetail, toggleLikeLocal } from '../../services/localService';
import { fetchLocalAvailabilityData, LocalAvailabilityData } from '../../services/availabilityService';
import { useUser } from '../../UserContext';
import { useToast } from '../../hooks/useToast';
import LocalInfo from './LocalInfo';
import LocalBookingForm from './LocalBookingForm';
import { LocalService } from '../../services/serviceTypes';
import LocalDetails from './LocalDetails';
import LocalReviewForm from './LocalReviewForm';
import LocalCommentSection from './LocalCommentSection';

const LocalServiceDetailScreen = () => {
  const route = useRoute();
  const { localServiceId } = route.params as { localServiceId: number };
  const { userId } = useUser();
  const { toast, ToastComponent } = useToast();

  const [localServiceData, setLocalServiceData] = useState<LocalService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availabilityData, setAvailabilityData] = useState<LocalAvailabilityData | null>(null);
  const [likes, setLikes] = useState(0);
  const [userHasLiked, setUserHasLiked] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('local')
        .select(`*, 
          subcategory (name),
          media (url),
          availability (id, start, end, daysofweek, date),
          comment (id, details, user_id, created_at),
          like (user_id),
          review (id) 
        `)
        .eq('id', localServiceId)
        .single();
  
      if (error) throw error;
      if (!data) {
        throw new Error('No data returned from the query');
      }
  
      // Ensure 'data' is of type 'LocalService | null' before calling setLocalServiceData
      if (isValidLocalServiceData(data)) {
        // Ensure 'review' is an array
        data.review = Array.isArray(data.review) ? data.review : [];
        setLocalServiceData(data);
      } else {
        console.error("Invalid data received:", data);
        setLocalServiceData(null); // or handle the error appropriately
      }
  
      // Fetch availability data
      const availability = await fetchLocalAvailabilityData(localServiceId);
      setAvailabilityData(availability);
  
      // Fetch the number of likes
      const { count: likesCount } = await supabase
        .from('like')
        .select('id', { count: 'exact' })
        .eq('local_id', localServiceId);
  
      setLikes(likesCount || 0);
  
      // Check if the current user has liked
      const { data: userLike } = await supabase
        .from('like')
        .select('*')
        .eq('local_id', localServiceId)
        .eq('user_id', userId)
        .single();
  
      setUserHasLiked(!!userLike);
    } catch (error) {
      console.error('Error fetching local service details:', error);
      toast({
        title: "Error",
        description: "Impossible de charger les détails du service. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [localServiceId, userId, toast]);
  

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLike = async () => {
    if (!userId) {
      toast({
        title: "Authentification requise",
        description: "Veuillez vous connecter pour aimer un service.",
        variant: "default",
      });
      return;
    }

    const result = await toggleLikeLocal(localServiceId, userId);

    if (result !== null) {
      setUserHasLiked(result);
      setLikes(prev => (result ? prev + 1 : prev - 1));
    }
  };

  const handleReviewSubmitted = () => {
    toast({
      title: "Succès",
      description: "Votre avis a été soumis avec succès.",
      variant: "default",
    });
    fetchData();
  };

  if (isLoading || !localServiceData || !availabilityData) {
    return <View style={styles.centeredContainer}><Text style={styles.loadingText}>Chargement...</Text></View>;
  }

  const renderItem = () => (
     <View style={styles.content}>
    {localServiceData && (
      <LocalInfo
        localData={localServiceData}
        likes={likes}
        reviewsCount={Array.isArray(localServiceData.review) ? localServiceData.review.length : 0} // Ensure this is present
        userHasLiked={userHasLiked}
        onLike={handleLike}
      />

    )}
     
      <LocalDetails localData={localServiceData} />
      <LocalBookingForm
        localId={localServiceId}
        userId={userId}
        availabilityData={availabilityData}
        onBookingComplete={fetchData}
      />
      <LocalReviewForm localId={localServiceData.id} onReviewSubmitted={handleReviewSubmitted} />
      <LocalCommentSection 
        comments={localServiceData.comment.map(comment => ({
          ...comment,
          user: (comment as any).user || { username: "anonymous" }
        }))}
        localId={localServiceData.id}
        userId={userId}
      />
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
      {ToastComponent}
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
});

export default LocalServiceDetailScreen;

// Helper function to validate data type
function isValidLocalServiceData(data: any): data is LocalService {
    // Implement validation logic here
    return true; // Replace with actual validation
}
