import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Text, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useUser } from '../../UserContext';
import { useToast } from '../../hooks/useToast';
import { supabase } from '../../services/supabaseClient';
import { toggleLikeLocal } from '../../services/localService';
import { fetchLocalAvailabilityData } from '../../services/availabilityService';
import LocalServiceDetails from './components/LocalServiceDetails';
import LocalInfo from './LocalInfo';
import ImageSection from './components/ImageSection';
import { LocationSection } from './components/LocationSection';
import { getAddressFromCoordinates, calculateDistance } from '../../services/locationService';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  LocalAddReviewScreen: { localId: number };
  LocalCommentsScreen: { localId: number };
  LocalBookingScreen: { 
    localId: number; 
    userId: string;
    availabilityData: {
      startDate: string;
      endDate: string;
      availability: any[];
      interval: number;
    }
  };
};

const LocalDetail = () => {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { localId } = route.params as { localId: number };
  const { userId } = useUser();
  const { toast } = useToast();

  const [localServiceData, setLocalServiceData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [likes, setLikes] = useState(0);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('Chargement de l\'adresse...');
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [isMapVisible, setIsMapVisible] = useState(false);


  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Fetching data for localId:', localId);
      
      const { data, error } = await supabase
        .from('local')
        .select(`
          *,
          media (url),
          review (id, rate, user_id),
          location!inner (latitude, longitude)
        `)
        .eq('id', localId)
        .single();

      console.log('Raw data:', data);

      if (error) throw error;

      if (data) {
        if (data.media && Array.isArray(data.media)) {
          const imageUrls = data.media.map((item: { url: string }) => item.url);
          console.log('Images trouvées:', imageUrls);
          setImages(imageUrls);
        }

        const locationData = Array.isArray(data.location) ? data.location[0] : data.location;
        console.log('Processed location data:', locationData);
        
        if (locationData) {
          const lat = parseFloat(locationData.latitude);
          const lon = parseFloat(locationData.longitude);
          console.log('Parsed coordinates:', { lat, lon });
          
          if (!isNaN(lat) && !isNaN(lon)) {
            const addressResult = await getAddressFromCoordinates(lat, lon);
            setAddress(addressResult);
            
            setLocalServiceData({
              ...data,
              location: locationData
            });
          }
        }
      }
    } catch (error) {
      console.error('Error in fetchData:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [localId, toast]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
      }
    })();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    console.log('Current images:', images);
  }, [images]);

  const handleLike = async () => {
    if (!userId) {
      toast({
        title: "Authentification requise",
        description: "Veuillez vous connecter pour aimer un service.",
        variant: "default",
      });
      return;
    }

    const result = await toggleLikeLocal(localId, userId);
    if (result !== null) {
      setUserHasLiked(result);
      setLikes(prev => (result ? prev + 1 : prev - 1));
    }
  };

  const navigateToReviewScreen = () => {
    if (!userId || !localServiceData?.id) return;
    navigation.navigate('LocalAddReviewScreen', { localId: localServiceData.id });
  };

  const navigateToCommentScreen = () => {
    if (!userId || !localServiceData?.id) return;
    navigation.navigate('LocalCommentsScreen', { localId: localServiceData.id });
  };

  const navigateToBookingScreen = async () => {
    if (!userId || !localServiceData?.id) return;
    
    try {
      const availabilityData = await fetchLocalAvailabilityData(localServiceData.id);
      
      navigation.navigate('LocalBookingScreen', { 
        localId: localServiceData.id, 
        userId,
        availabilityData: {
          startDate: (availabilityData?.startDate || new Date()).toString(),
          endDate: (availabilityData?.endDate || new Date()).toString(),
          availability: availabilityData?.availability || [],
          interval: availabilityData?.interval || 60
        }
      });
    } catch (error) {
      console.error('Error fetching availability data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les disponibilités.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement...</Text>
      </View>
    );
  }

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
        <ScrollView style={styles.scrollContent}>
          <View style={styles.card}>
            <ImageSection images={images} />

            <LocalInfo
              localData={localServiceData}
              likes={likes}
              userHasLiked={userHasLiked}
              onLike={handleLike}
              distance={distance}
              address={address}
              onToggleMap={() => setIsMapVisible(!isMapVisible)}
              onAddressFound={setAddress}
            />
          </View>

          <View style={styles.card}>
            <LocalServiceDetails 
              localData={localServiceData}
              onReviewPress={navigateToReviewScreen}
              onCommentPress={navigateToCommentScreen}
              onBookPress={navigateToBookingScreen}
              address={address}
              distance={distance}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 16,
  },
});

export default LocalDetail;