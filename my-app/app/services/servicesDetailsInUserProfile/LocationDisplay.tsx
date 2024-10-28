import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

interface LocationDisplayProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  distance?: number | null;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({
  latitude,
  longitude,
  address,
  distance
}) => {
  if (!latitude || !longitude) {
    return (
      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={20} color="#FFF" />
        <Text style={styles.infoText}>Adresse non disponible</Text>
      </View>
    );
  }

  const generateMapHTML = () => {
    const escapedAddress = address?.replace(/'/g, "\\'").replace(/"/g, '\\"') || '';
    
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
    <View>
      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={20} color="#FFF" />
        <Text style={styles.infoText}>
          {address || 'Adresse non disponible'}
          {distance && ` (${distance.toFixed(1)} km)`}
        </Text>
      </View>
      <View style={styles.mapContainer}>
        <WebView
          style={styles.map}
          source={{ html: generateMapHTML() }}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    color: '#FFF',
    fontSize: 14,
    flex: 1,
  },
  mapContainer: {
    height: 200,
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});

export default LocationDisplay;