import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Image, 
  Dimensions,
  Text 
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useUser } from '../../UserContext';
import { useToast } from '../../hooks/useToast';
import ServiceInfo from './servicesInfos';
import ServiceDetails from './serviceDetail';
import CommentsList from './CommentsList';
import LocationMap from '../../screens/PersonalServiceScreen/components/LocationMap';
import { fetchServiceDetail } from '../serviceQueries';

interface ServiceWithLocation {
  id: number;
  name: string;
  details: string;
  user_id: string;
  location?: {
    latitude: number;
    longitude: number;
  };  // Supprimer | null pour éviter l'erreur de type
}

interface MediaItem {
  url: string;
  type?: string;
}

type RootStackParamList = {
  CommentsScreen: { serviceId: number; userId: string | null };
  ServiceDetail: { serviceId: number; serviceType: 'Personal' | 'Local' | 'Material' };
};
interface ServiceDetailsProps {
  serviceData: ServiceWithLocation;
  serviceType: 'Personal' | 'Local' | 'Material';
  onCommentPress: () => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ServiceDetailRouteProp = RouteProp<RootStackParamList, 'ServiceDetail'>;

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.75;

const ServiceDetail: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ServiceDetailRouteProp>();
  const { serviceId, serviceType } = route.params;
  const { userId } = useUser();
  const { toast } = useToast();

  const [serviceData, setServiceData] = useState<ServiceWithLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('Chargement de l\'adresse...');
  const [images, setImages] = useState<string[]>([]);

  const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'YourApp/1.0',
            'Accept-Language': 'fr'
          }
        }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
      const data = await fetchServiceDetail(serviceId, serviceType);
      
      if (data) {
        setServiceData(data);
        
        if (data.media && Array.isArray(data.media)) {
          const imageUrls = data.media
            .filter((item: MediaItem) => item.type === 'image' || !item.type)
            .map((item: MediaItem) => item.url);
          setImages(imageUrls);
        }

        if (data.location && 'latitude' in data.location && 'longitude' in data.location) {
          const { latitude, longitude } = data.location;
          const addressResult = await getAddressFromCoordinates(latitude, longitude);
          setAddress(addressResult);
          
          if (userLocation?.coords) {
            const dist = calculateDistance(
              userLocation.coords.latitude,
              userLocation.coords.longitude,
              latitude,
              longitude
            );
            setDistance(dist);
          }
        }
      }
    } catch (error) {
      console.error('Erreur dans fetchData:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des données.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [serviceId, serviceType, userLocation]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
      }
    })();
  }, []);

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
    setShowMap(prev => !prev);
  }, []);

  // const navigateToCommentScreen = useCallback(() => {
  //   navigation.navigate('CommentsScreen', { serviceId, userId });
  // }, [navigation, serviceId, userId]);

  return (
    <LinearGradient
      colors={['#E6F2FF', '#C2E0FF', '#99CCFF', '#66B2FF']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Chargement...</Text>
          </View>
        ) : (
          <ScrollView style={styles.content}>
            {serviceData && (
              <>
                <View style={styles.card}>
                  <View style={styles.imageContainer}>
                    <ScrollView 
                      horizontal 
                      pagingEnabled 
                      showsHorizontalScrollIndicator={false}
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
                          <Text style={styles.noImageText}>
                            Aucune image disponible
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>

                  <ServiceInfo 
                    data={serviceData}
                    distance={distance}
                    address={address}
                    onToggleMap={toggleMap}
                  />

                  {showMap && serviceData.location && (
                    <View style={styles.mapContainer}>
                      <LocationMap
                        latitude={serviceData.location.latitude}
                        longitude={serviceData.location.longitude}
                        address={address}
                      />
                    </View>
                  )}
                </View>

                <View style={styles.card}>
                  <ServiceDetails 
                    serviceData={serviceData}
                    serviceType={serviceType}
                  
                  />
                </View>

                <View style={styles.card}>
                  <CommentsList serviceId={serviceId} serviceType={serviceType} />
                </View>
              </>
            )}
          </ScrollView>
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
  mapContainer: {
    height: 300,
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ServiceDetail;
