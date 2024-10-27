import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, FlatList, Text, ScrollView, Image, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchLocalDetail, toggleLikeLocal } from '../../services/localService';
import { fetchLocalAvailabilityData, LocalAvailabilityData } from '../../services/availabilityService';
import { useUser } from '../../UserContext';
import { useToast } from '../../hooks/useToast';
import LocalInfo from './LocalInfo';
import LocalDetails from './LocalDetails';
import LocalBookingForm from './LocalBookingForm';
import LocalReviewForm from './LocalReviewForm';
import LocalCommentSection from './LocalCommentSection';
import { LocalService } from '../../services/serviceTypes';
import { supabase } from '../../services/supabaseClient';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.75;

const LocalServiceDetailScreen: React.FC = () => {
  const route = useRoute();
  const { localServiceId } = route.params as { localServiceId: number };
  const { userId } = useUser();
  const { toast } = useToast();

  const [localServiceData, setLocalServiceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availabilityData, setAvailabilityData] = useState<LocalAvailabilityData | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('Chargement de l\'adresse...');
  const [likes, setLikes] = useState(0);
  const [userHasLiked, setUserHasLiked] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchLocalDetail(localServiceId);
      if (data) {
        setLocalServiceData(data);
        setImages(data.media?.map((item: any) => item.url) || []);
        if (data.location) {
          setAddress(await getAddressFromCoordinates(data.location.latitude, data.location.longitude));
        }
        const availability = await fetchLocalAvailabilityData(localServiceId);
        setAvailabilityData(availability);
        const { count: likesCount } = await supabase
          .from('like')
          .select('id', { count: 'exact' })
          .eq('local_id', localServiceId);
        setLikes(likesCount || 0);
        const { data: userLike } = await supabase
          .from('like')
          .select('*')
          .eq('local_id', localServiceId)
          .eq('user_id', userId)
          .single();
        setUserHasLiked(!!userLike);
      } else {
        console.log('No data received from fetchLocalDetail');
      }
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

  const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'ChakerApp/1.0',
            'Accept-Language': 'fr'
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.display_name || 'Adresse non trouvée';
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'adresse:', error);
      return 'Erreur lors de la récupération de l\'adresse';
    }
  };

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

  const renderItem = () => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={width}
        >
          {images.length > 0 ? (
            images.map((imageUrl, index) => (
              <Image 
                key={index} 
                source={{ uri: imageUrl }} 
                style={styles.image} 
                resizeMode="cover"
              />
            ))
          ) : (
            <View style={styles.noImageContainer}>
              <Text style={styles.noImageText}>Aucune image disponible</Text>
            </View>
          )}
        </ScrollView>
      </View>
      <LocalInfo 
        localData={localServiceData} 
        likes={likes}
        userHasLiked={userHasLiked}
        onLike={handleLike}
        distance={distance}
        address={address}
      />
      <LocalDetails localData={localServiceData} />
      <LocalBookingForm
        localId={localServiceId}
        userId={userId}
        availabilityData={availabilityData}
        onBookingComplete={fetchData}
      />
      <LocalReviewForm localId={localServiceData?.id} onReviewSubmitted={handleReviewSubmitted} />
      <LocalCommentSection 
        comments={localServiceData?.comment.map(comment => ({
          ...comment,
          user: (comment as any).user || { username: "anonymous" }
        })) || []}
        localId={localServiceData?.id}
        userId={userId}
      />
    </View>
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
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Chargement...</Text>
          </View>
        ) : (
          <FlatList
            data={[{ key: 'content' }]}
            renderItem={renderItem}
            keyExtractor={(item) => item.key}
          />
        )}
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
  card: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: width,
    height: IMAGE_HEIGHT,
    borderRadius: 10,
  },
  noImageContainer: {
    width: width,
    height: IMAGE_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  noImageText: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LocalServiceDetailScreen;
