import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';
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
  const webViewRef = useRef<WebView>(null);

  const getLocation = useCallback(async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      setErrorMessage('Failed to get current location');
    }
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

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

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
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

  const generateMapHTML = () => {
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
            });

            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
              maxZoom: 19,
              attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            }).addTo(map);

            var eventMarker = L.marker([${eventLatitude}, ${eventLongitude}]).addTo(map);
            ${currentLocation ? `var userMarker = L.marker([${currentLocation.latitude}, ${currentLocation.longitude}]).addTo(map);` : ''}

            // Set view to event location with a slightly farther zoom level
            map.setView([${eventLatitude}, ${eventLongitude}], 15);

            // If we have the user's location, adjust the view to show both markers
            ${currentLocation ? `
              var group = L.featureGroup([eventMarker, userMarker]);
              map.fitBounds(group.getBounds().pad(0.1));
            ` : ''}

            // Ensure minimum zoom level
            var currentZoom = map.getZoom();
            if (currentZoom > 16) {
              map.setZoom(16);
            }
          </script>
        </body>
      </html>
    `;
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={styles.map}
        source={{ html: generateMapHTML() }}
        scrollEnabled={false}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
        }}
      />
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