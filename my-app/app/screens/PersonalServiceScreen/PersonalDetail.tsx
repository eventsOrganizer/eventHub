import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, FlatList, Text, ScrollView } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import * as Location from 'expo-location';
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

interface ServiceWithLocation extends Service {
  location?: {
    latitude: number;
    longitude: number;
  };
}

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

  const [personalData, setPersonalData] = useState<ServiceWithLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('Chargement de l\'adresse...');

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
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchPersonalDetail(personalId);
      
      if (data?.location?.latitude && data?.location?.longitude) {
        const addr = await getAddressFromCoordinates(
          data.location.latitude,
          data.location.longitude
        );
        setAddress(addr);
      }
      
      setPersonalData(data as ServiceWithLocation | null);
      const availability = await fetchAvailabilityData(personalId);
      setAvailabilityData(availability);
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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        toast({
          title: "Permission refusée",
          description: "L'accès à la localisation est nécessaire pour afficher la distance.",
          variant: "destructive",
        });
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);

      if (personalData?.location?.latitude && personalData?.location?.longitude) {
        const dist = calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          personalData.location.latitude,
          personalData.location.longitude
        );
        if (dist !== undefined) {
          setDistance(dist);
        }
      }
    })();
  }, [personalData, toast]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const toggleMap = useCallback(() => {
    setShowMap(prevShowMap => !prevShowMap);
  }, []);

  const generateMapHTML = () => {
    if (!personalData?.location?.latitude || !personalData?.location?.longitude) {
      return '<p>Localisation non disponible</p>';
    }
    
    // Escape special characters in address for the popup
    const escapedAddress = address.replace(/'/g, "\\'").replace(/"/g, '\\"');
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
          <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
          <style>
            body { margin: 0; padding: 0; }
            #map { height: 100vh; width: 100vw; }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            var map = L.map('map', {
              zoomControl: false,
              attributionControl: false
            }).setView([${personalData.location.latitude}, ${personalData.location.longitude}], 15);
  
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
            }).addTo(map);
  
            var marker = L.marker([${personalData.location.latitude}, ${personalData.location.longitude}]).addTo(map);
            marker.bindPopup('${escapedAddress}').openPopup();
          </script>
        </body>
      </html>
    `;
  };

  const renderItem = () => (
    <ScrollView style={styles.content}>
      <View style={styles.card}>
        <PersonalInfo 
          data={personalData as Service} 
          onLike={handleLike}
          onToggleMap={toggleMap}
          distance={distance}
          address={address}
        />
        {showMap && (
          <View style={styles.mapContainer}>
            {personalData?.location ? (
              <WebView
                style={styles.map}
                source={{ html: generateMapHTML() }}
                scrollEnabled={false}
              />
            ) : (
              <Text>Données de localisation non disponibles</Text>
            )}
          </View>
        )}
      </View>
      <View style={styles.card}>
        <ServiceDetails 
          personalData={personalData as Service}
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
  mapContainer: {
    height: 300,
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default PersonalDetail;