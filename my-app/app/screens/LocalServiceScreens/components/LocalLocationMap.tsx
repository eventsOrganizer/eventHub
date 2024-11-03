import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface LocalLocationMapProps {
  latitude: number;
  longitude: number;
}

const LocalLocationMap: React.FC<LocalLocationMapProps> = ({ latitude, longitude }) => {
  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return (
      <View style={styles.container}>
        <Text>Localisation non disponible</Text>
      </View>
    );
  }

  const region = {
    latitude: Number(latitude),
    longitude: Number(longitude),
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        initialRegion={region}
      >
        <Marker coordinate={region} title="Localisation" />
      </MapView>
      <Text style={styles.addressText}>Localisation</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    height: 200,
  },
  addressText: {
    padding: 8,
    backgroundColor: 'white',
    fontSize: 14,
  },
});

export default LocalLocationMap;