import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, FlatList, Text, ScrollView, Image, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { LocalService } from '../../services/localService'; // Adjust import based on your actual type
import { fetchLocalDetail, toggleLikeLocal } from '../../services/localService'; // Adjust import based on your actual service
import { fetchLocalAvailabilityData, LocalAvailabilityData } from '../../services/availabilityService';
import { useUser } from '../../UserContext';
import { useToast } from '../../hooks/useToast';
import LocalServiceDetails from './components/LocalServiceDetails'; // Adjust import based on your actual component
import LocalInfo from './LocalInfo';

type RootStackParamList = {
  AddLocalReviewScreen: { localId: number; userId: string | null };
  LocalCommentsScreen: { localId: number; userId: string | null };
  LocalBookingScreen: { localId: number; userId: string | null; availabilityData: LocalAvailabilityData | null };
  LocalDetail: { localId: number };
  Signin: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type LocalDetailRouteProp = RouteProp<RootStackParamList, 'LocalDetail'>;

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.75;

const LocalDetail: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<LocalDetailRouteProp>();
  const { localId } = route.params;
  const { userId } = useUser();
  const { toast } = useToast();

  const [localData, setLocalData] = useState<LocalService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availabilityData, setAvailabilityData] = useState<LocalAvailabilityData | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('Loading address...');
  const [images, setImages] = useState<string[]>([]);

  const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
    try {
      // Add delay to respect rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'YourAppName/1.0', // Replace with your app name
            'Accept-Language': 'fr'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.display_name || 'Address not found';
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Address not available';
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchLocalDetail(localId);
      
      if (data) {
        setLocalData(data as LocalService);
        
        // Check for media
        if (data.media && Array.isArray(data.media)) {
          const imageUrls = data.media
            .filter(item => item.url)
            .map(item => item.url);
          setImages(imageUrls);
        } else {
          setImages([]);
          console.log('No images found in data');
        }

        // Check for location
        if (data.location) {
          setAddress(await getAddressFromCoordinates(
            data.location.latitude, 
            data.location.longitude
          ));
        } else {
          setAddress('Address not available');
        }

        const availabilityData = await fetchLocalAvailabilityData(localId);
        setAvailabilityData(availabilityData);
      } else {
        console.log('No data received from fetchLocalDetail');
      }
    } catch (error) {
      console.error('Error in fetchData:', error);
      toast({
        title: "Error",
        description: "An error occurred while loading data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [localId, toast]);

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
    const result = await toggleLikeLocal(localId, userId);
    if (result !== null) {
      setLocalData(prevData => {
        if (!prevData) return null;
        const newLikes = result
          ? [...(prevData.like || []), { user_id: userId }]
          : (prevData.like || []).filter(like => like.user_id !== userId);
        return { ...prevData, like: newLikes };
      });
    }
  }, [userId, localId, handleAuthenticatedAction]);

  const navigateToReviewScreen = useCallback(() => {
    handleAuthenticatedAction(() => {
      navigation.navigate('LocalAddReviewScreen', { localId, userId });
    });
  }, [handleAuthenticatedAction, navigation, localId, userId]);

  const navigateToCommentScreen = useCallback(() => {
    handleAuthenticatedAction(() => {
      navigation.navigate('LocalCommentsScreen', { localId, userId });
    });
  }, [handleAuthenticatedAction, navigation, localId, userId]);

  const navigateToBookingScreen = useCallback(() => {
    handleAuthenticatedAction(() => {
      if (userId && availabilityData) {
        navigation.navigate('LocalBookingScreen', { localId, userId, availabilityData });
      }
    });
  }, [handleAuthenticatedAction, navigation, localId, availabilityData, userId]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        toast({
          title: "Permission denied",
          description: "Location access is required to display distance.",
          variant: "destructive",
        });
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);

      if (localData?.location?.latitude && localData?.location?.longitude) {
        const dist = calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          localData.location.latitude,
          localData.location.longitude
        );
        if (dist !== undefined) {
          setDistance(dist);
        }
      }
    })();
  }, [localData, toast]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  const toggleMap = useCallback(() => {
    setShowMap(prevShowMap => !prevShowMap);
  }, []);

  const generateMapHTML = () => {
    if (!localData?.location?.latitude || !localData?.location?.longitude) {
      return '<p>Location not available</p>';
    }
    
    const escapedAddress = address.replace(/'/g, "\\'").replace(/"/g, '\\"');
    const lat = localData.location.latitude;
    const lng = localData.location.longitude;
    
    if (!lat || !lng) {
      return '<p>Invalid location coordinates</p>';
    }
    
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
              zoomControl: true,
              attributionControl: true
            }).setView([${lat}, ${lng}], 15);
  
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
            }).addTo(map);
  
            var marker = L.marker([${lat}, ${lng}]).addTo(map);
            marker.bindPopup('${escapedAddress}').openPopup();
          </script>
        </body>
      </html>
    `;
  };

  const renderItem = () => (
    <ScrollView style={styles.content}>
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
                <Text style={styles.noImageText}>No images available</Text>
              </View>
            )}
          </ScrollView>
        </View>
        <LocalInfo 
          localData={localData as LocalService} 
          onLike={handleLike}
          onToggleMap={toggleMap} // Pass the toggleMap function
          distance={distance}
          address={address}
        />
        {showMap && (
          <View style={styles.mapContainer}>
            {localData?.location ? (
              <WebView
                style={styles.map}
                source={{ html: generateMapHTML() }}
                scrollEnabled={false}
              />
            ) : (
              <Text>Location data not available</Text>
            )}
          </View>
        )}
      </View>
      <View style={styles.card}>
        <LocalServiceDetails 
          localServiceDetails={localData as LocalService}
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
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
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
  mapContainer: {
    height: 300,
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LocalDetail;
