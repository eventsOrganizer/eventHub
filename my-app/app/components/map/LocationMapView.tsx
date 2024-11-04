import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface LocationMapViewProps {
  latitude: number;
  longitude: number;
  onAddressFound?: (address: string) => void;
}

const LocationMapView: React.FC<LocationMapViewProps> = ({ 
  latitude, 
  longitude,
  onAddressFound 
}) => {
  useEffect(() => {
    console.log('LocationMapView received props:', {
      latitude: typeof latitude, 
      longitude: typeof longitude,
      values: { latitude, longitude }
    });
  }, [latitude, longitude]);

  const isValidCoordinate = (coord: number): boolean => {
    const valid = typeof coord === 'number' && !isNaN(coord) && Math.abs(coord) > 0;
    console.log('Coordinate validation:', { coord, valid });
    return valid;
  };

  const areValidCoordinates = isValidCoordinate(latitude) && isValidCoordinate(longitude);

  useEffect(() => {
    console.log('LocationMapView coordinates:', { latitude, longitude });
  }, [latitude, longitude]);

  if (!areValidCoordinates) {
    console.log('Invalid coordinates:', { latitude, longitude });
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Localisation non disponible</Text>
      </View>
    );
  }

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
            document.addEventListener('DOMContentLoaded', function() {
              var map = L.map('map', {
                zoomControl: true,
                attributionControl: false
              }).setView([${latitude}, ${longitude}], 15);
    
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
              }).addTo(map);
    
              var marker = L.marker([${latitude}, ${longitude}]).addTo(map);
            });
          </script>
        </body>
      </html>
    `;
  };

  return (
    <View style={styles.container}>
      <WebView
        style={styles.map}
        source={{ html: generateMapHTML() }}
        scrollEnabled={false}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        height: 300, // Augmenté de 200 à 300
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
      },
  map: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    color: '#666',
    fontSize: 14,
  },
});

export default LocationMapView;