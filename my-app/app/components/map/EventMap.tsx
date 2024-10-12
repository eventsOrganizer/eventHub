import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

interface EventMapProps {
  eventLatitude: number;
  eventLongitude: number;
  onDistanceCalculated: (distance: number) => void;
  onAddressFound: (address: string) => void;
}



const EventMap: React.FC<EventMapProps> = ({ eventLatitude, eventLongitude, onDistanceCalculated, onAddressFound }) => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);




  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  
  const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      return data.display_name || 'Address not found';
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Error fetching address';
    }
  };
  useEffect(() => {
    let isMounted = true;

    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      if (isMounted) {
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    };

    getLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && currentLocation) {
      mapRef.current.fitToCoordinates(
        [
          { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
          { latitude: eventLatitude, longitude: eventLongitude },
        ],
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        }
      );
    }
  }, [currentLocation, eventLatitude, eventLongitude]);

  useEffect(() => {
    if (currentLocation) {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        eventLatitude,
        eventLongitude
      );
      onDistanceCalculated(distance);
    }
  }, [currentLocation, eventLatitude, eventLongitude, onDistanceCalculated]);

  useEffect(() => {
    const fetchAddress = async () => {
      const address = await getAddressFromCoordinates(eventLatitude, eventLongitude);
      onAddressFound(address);
    };

    fetchAddress();
  }, [eventLatitude, eventLongitude, onAddressFound]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: eventLatitude,
          longitude: eventLongitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: eventLatitude,
            longitude: eventLongitude,
          }}
          pinColor="red"
        />
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            pinColor="blue"
          />
        )}
        
      </MapView>
      {errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 200,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  errorContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default EventMap;