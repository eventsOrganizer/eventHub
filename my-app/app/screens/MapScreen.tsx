import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapScreen: React.FC = ({ route, navigation }: any) => {
  const { eventName, eventDescription, eventType, budget, calculatedCost, musicAndEntertainment } = route.params;
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [markedLocation, setMarkedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setMarkedLocation(coordinate);
  };

  const handleSubmitLocation = () => {
    // After selecting a location, navigate to the next step or confirm event creation
    navigation.navigate('EventSummary', {
      eventName,
      eventDescription,
      eventType,
      budget,
      calculatedCost,
      musicAndEntertainment,
      markedLocation,
    });
  };

  return (
    <View style={styles.container}>
      {currentLocation && (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={handleMapPress}
          >
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Your Location"
              pinColor="blue"
            />
            {markedLocation && (
              <Marker
                coordinate={markedLocation}
                title="Marked Location"
                pinColor="red"
              />
            )}
          </MapView>
          <Text style={styles.coordinatesText}>
            Current Location: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
          </Text>
          {markedLocation && (
            <Text style={styles.coordinatesText}>
              Marked Location: {markedLocation.latitude.toFixed(6)}, {markedLocation.longitude.toFixed(6)}
            </Text>
          )}
          {/* Button to proceed with the selected location */}
          <View style={styles.buttonContainer}>
            <Button title="Confirm Location" onPress={handleSubmitLocation} />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  coordinatesText: {
    fontSize: 16,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  buttonContainer: {
    padding: 10,
  },
});

export default MapScreen;
