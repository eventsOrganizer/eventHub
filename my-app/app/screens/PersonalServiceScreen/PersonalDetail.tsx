import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Service } from '../../services/serviceTypes';
import { fetchPersonalDetail, toggleLike } from '../../services/personalService';
import { fetchAvailabilityData, AvailabilityData } from '../../services/availabilityService';
import { useUser } from '../../UserContext';
import PersonalInfo from '../../components/PersonalServiceComponents/PersonalInfo';
import CommentSection from '../../components/PersonalServiceComponents/CommentSection';
import ReviewForm from '../../components/PersonalServiceComponents/ReviewForm';
import BookingForm from './components/BookingForm';
import ServiceDetails from './components/ServiceDetails';
import { useToast } from '../../hooks/useToast';

type RenderItemData = {
  key: 'personalInfo' | 'serviceDetails' | 'bookingForm' | 'reviewForm' | 'commentSection';
};

const PersonalDetail = () => {
  const route = useRoute();
  const { personalId } = route.params as { personalId: number };
  const { userId } = useUser();
  const { toast, ToastComponent } = useToast();

  const [personalData, setPersonalData] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchPersonalDetail(personalId);
      setPersonalData(data);
      const availability = await fetchAvailabilityData(personalId);
      setAvailabilityData(availability);
    } catch (error) {
      console.error('Error fetching personal detail:', error);
      toast({
        title: "Error",
        description: "Impossible de charger les détails du service. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [personalId, toast]);

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
  };

  const handleReviewSubmitted = () => {
    toast({
      title: "Succès",
      description: "Votre avis a été soumis avec succès.",
      variant: "default",
    });
    fetchData();
  };

  if (isLoading) {
    return <View style={styles.centeredContainer}><Text style={styles.loadingText}>Chargement...</Text></View>;
  }

  if (!personalData || !availabilityData) {
    return <View style={styles.centeredContainer}><Text style={styles.loadingText}>Aucune donnée disponible</Text></View>;
  }

  const renderItem = ({ item }: { item: RenderItemData }) => (
    <View style={styles.content}>
      {item.key === 'personalInfo' && <PersonalInfo personalData={personalData} onLike={handleLike} />}
      {item.key === 'serviceDetails' && <ServiceDetails personalData={personalData} />}
      {item.key === 'bookingForm' && (
        <BookingForm
          personalId={personalId}
          userId={userId}
          availabilityData={availabilityData}
          onBookingComplete={fetchData}
        />
      )}
      {item.key === 'reviewForm' && <ReviewForm personalId={personalData.id} onReviewSubmitted={handleReviewSubmitted} />}
      {item.key === 'commentSection' && (
        <CommentSection 
          comments={personalData.comment} 
          personalId={personalData.id}
          userId={userId}
        />
      )}
    </View>
  );

  const data: RenderItemData[] = [
    { key: 'personalInfo' },
    { key: 'serviceDetails' },
    { key: 'bookingForm' },
    { key: 'reviewForm' },
    { key: 'commentSection' },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
      />
      {ToastComponent}
    </View>
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

export default PersonalDetail;