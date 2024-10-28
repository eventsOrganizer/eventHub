import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  address: string;
}

const LocationMap: React.FC<LocationMapProps> = ({ latitude, longitude, address }) => {
  // Vérification des coordonnées
  if (!latitude || !longitude) {
    return (
      <View style={styles.container}>
        <Text>Localisation non disponible</Text>
      </View>
    );
  }

  const generateMapHTML = () => {
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
            document.addEventListener('DOMContentLoaded', function() {
              var map = L.map('map', {
                zoomControl: true,
                attributionControl: false
              }).setView([${latitude}, ${longitude}], 15);
    
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
              }).addTo(map);
    
              var marker = L.marker([${latitude}, ${longitude}]).addTo(map);
              marker.bindPopup('${escapedAddress}').openPopup();
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
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});

export default LocationMap;
