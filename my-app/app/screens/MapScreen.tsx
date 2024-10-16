import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

const MapScreen: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [markedLocation, setMarkedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ name: string; lat: number; lon: number }>>([]);
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

  const fetchSuggestions = async (query: string) => {
    if (query.length > 2) {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
        const data = await response.json();
        setSuggestions(data.map((item: any) => ({
          name: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
        })));
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = (item: { name: string; lat: number; lon: number }) => {
    setMarkedLocation({ latitude: item.lat, longitude: item.lon });
    setSearchQuery(item.name);
    setSuggestions([]);
    webViewRef.current?.injectJavaScript(`
      if (markedMarker) {
        map.removeLayer(markedMarker);
      }
      markedMarker = L.marker([${item.lat}, ${item.lon}]).addTo(map).bindPopup('Marked Location');
      map.setView([${item.lat}, ${item.lon}], 15);
    `);
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

            var currentMarker, markedMarker;

            function updateMap(lat, lon, isCurrentLocation) {
              var marker = isCurrentLocation ? currentMarker : markedMarker;
              if (marker) {
                map.removeLayer(marker);
              }
              marker = L.marker([lat, lon]).addTo(map)
                .bindPopup(isCurrentLocation ? 'Your Location' : 'Marked Location');
              if (isCurrentLocation) {
                currentMarker = marker;
                map.setView([lat, lon], 15);
              } else {
                markedMarker = marker;
              }
            }

            map.on('click', function(e) {
              window.ReactNativeWebView.postMessage(JSON.stringify(e.latlng));
            });

            map.setView([0, 0], 2);
          </script>
        </body>
      </html>
    `;
  };

  const handleMapMessage = (event: any) => {
    const coordinate = JSON.parse(event.nativeEvent.data);
    setMarkedLocation({ latitude: coordinate.lat, longitude: coordinate.lng });
    webViewRef.current?.injectJavaScript(`
      updateMap(${coordinate.lat}, ${coordinate.lng}, false);
    `);
  };

  useEffect(() => {
    if (currentLocation) {
      webViewRef.current?.injectJavaScript(`
        updateMap(${currentLocation.latitude}, ${currentLocation.longitude}, true);
      `);
    }
  }, [currentLocation]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            fetchSuggestions(text);
          }}
          placeholder="Search for a location"
        />
      </View>
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSearch(item)}>
              <Text style={styles.suggestionItem}>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionList}
        />
      )}
      <WebView
        ref={webViewRef}
        style={styles.map}
        source={{ html: generateMapHTML() }}
        onMessage={handleMapMessage}
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
      <Text style={styles.coordinatesText}>
        Current Location: {currentLocation?.latitude.toFixed(6)}, {currentLocation?.longitude.toFixed(6)}
      </Text>
      {markedLocation && (
        <Text style={styles.coordinatesText}>
          Marked Location: {markedLocation.latitude.toFixed(6)}, {markedLocation.longitude.toFixed(6)}
        </Text>
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
  searchContainer: {
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
  },
  suggestionList: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 3,
    zIndex: 1,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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

export default MapScreen;