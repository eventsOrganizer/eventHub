import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import FilterAdvanced from './FilterAdvanced';





const MapScreen: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [events, setEvents] = useState<Array<any>>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const handleEventsLoaded = (loadedEvents: any[]) => {
    console.log('Received events in MapScreen:', loadedEvents.length);
    setEvents(loadedEvents);
    clearEventMarkersFromMap();
    addEventMarkersToMap(loadedEvents);
  };

  const clearEventMarkersFromMap = () => {
    webViewRef.current?.injectJavaScript(`
      if (typeof eventMarkers !== 'undefined') {
        eventMarkers.forEach(marker => map.removeLayer(marker));
        eventMarkers = [];
      }
    `);
  };

  const addEventMarkersToMap = (events: Array<any>) => {
    const markersScript = events.map((event) => {
      if (!event.location || !event.location[0] || !event.location[0].latitude || !event.location[0].longitude) {
        console.log('Event missing location data:', event.id);
        return '';
      }
      return `
        var marker = L.marker([${event.location[0].latitude}, ${event.location[0].longitude}], {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: "<div style='background-color:#4838cc;' class='marker-pin'></div><img src='${event.media[0]?.url || 'https://via.placeholder.com/150'}' class='marker-image'/>",
            iconSize: [30, 42],
            iconAnchor: [15, 42]
          })
        }).addTo(map).bindPopup("${event.name}");
        marker.on('click', function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({type: 'eventSelected', eventId: ${event.id}}));
        });
        eventMarkers.push(marker);
      `;
    }).filter(Boolean).join('');
  
    webViewRef.current?.injectJavaScript(`
      if (typeof eventMarkers === 'undefined') {
        eventMarkers = [];
      }
      ${markersScript}
    `);
  };


  const handleEventSelection = async (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    if (event && event.location && event.location[0]) {
      setSelectedEvent(event);
      const address = await fetchAddress(event.location[0].latitude, event.location[0].longitude);
      setSelectedEvent((prev: any) => ({ ...prev, address }));
    } else {
      console.log('Selected event has missing location data:', eventId);
    }
  };

  const fetchAddress = async (lat: number, lon: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Address not available';
    }
  };

  const startNavigation = () => {
    if (currentLocation && selectedEvent) {
      webViewRef.current?.injectJavaScript(`
        if (typeof routingControl !== 'undefined') {
          map.removeControl(routingControl);
        }
        routingControl = L.Routing.control({
          waypoints: [
            L.latLng(${currentLocation.latitude}, ${currentLocation.longitude}),
            L.latLng(${selectedEvent.location[0].latitude}, ${selectedEvent.location[0].longitude})
          ],
          routeWhileDragging: true,
          lineOptions: {
            styles: [{color: '#4838cc', opacity: 0.6, weight: 4}]
          },
          show: false,
          addWaypoints: false,
          routeWhileDragging: false,
          draggableWaypoints: false,
          fitSelectedRoutes: true,
          showAlternatives: false
        }).addTo(map);

        routingControl.on('routesfound', function(e) {
          var routes = e.routes;
          var summary = routes[0].summary;
          map.fitBounds(routes[0].bounds);
        });
      `);
    }
  };

  const generateMapHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css" />
          <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
          <script src="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js"></script>
          <style>
            body { margin: 0; padding: 0; }
            #map { height: 100vh; width: 100vw; }
            .custom-div-icon .marker-pin { width: 30px; height: 30px; border-radius: 50% 50% 50% 0; background: #c30b82; position: absolute; transform: rotate(-45deg); left: 50%; top: 50%; margin: -15px 0 0 -15px; }
            .custom-div-icon .marker-image { width: 24px; height: 24px; border-radius: 50%; position: absolute; left: 3px; top: 3px; }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            var map = L.map('map', { zoomControl: false, attributionControl: false });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            var blueIcon = L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });

            var currentMarker;
            var eventMarkers = [];

            function updateMap(lat, lon) {
              if (currentMarker) {
                map.removeLayer(currentMarker);
              }
              currentMarker = L.marker([lat, lon], {icon: blueIcon}).addTo(map);
              map.setView([lat, lon], 14);
            }

            map.on('click', function(e) {
              window.ReactNativeWebView.postMessage(JSON.stringify({type: 'mapClick', latlng: e.latlng}));
            });
          </script>
        </body>
      </html>
    `;
  };

  const handleMapMessage = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'eventSelected') {
      handleEventSelection(data.eventId);
    } else if (data.type === 'mapClick') {
      console.log('Map clicked at:', data.latlng);
    }
  };

  useEffect(() => {
    if (currentLocation) {
      webViewRef.current?.injectJavaScript(`
        updateMap(${currentLocation.latitude}, ${currentLocation.longitude});
      `);
    }
  }, [currentLocation]);

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <TouchableOpacity
        style={tw`absolute top-12 right-4 z-10 bg-white p-2 rounded-full shadow-md`}
        onPress={() => setShowFilter(true)}
      >
        <Ionicons name="filter" size={24} color="#4838cc" />
      </TouchableOpacity>
      <WebView
        ref={webViewRef}
        style={tw`flex-1`}
        source={{ html: generateMapHTML() }}
        onMessage={handleMapMessage}
        scrollEnabled={false}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
        }}
      />
      {errorMessage && (
        <View style={tw`absolute bottom-4 left-4 right-4 bg-red-500 p-4 rounded-lg`}>
          <Text style={tw`text-white text-center`}>{errorMessage}</Text>
        </View>
      )}
      {selectedEvent && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedEvent}
          onRequestClose={() => setSelectedEvent(null)}
        >
          <View style={tw`flex-1 justify-end`}>
            <View style={tw`bg-white rounded-t-3xl p-6 h-3/4`}>
              <Image
                source={{ uri: selectedEvent.media[0]?.url || 'https://via.placeholder.com/150' }}
                style={tw`w-full h-40 rounded-lg mb-4`}
              />
              <Text style={tw`text-2xl font-bold mb-2`}>{selectedEvent.name}</Text>
              <Text style={tw`text-gray-600 mb-2`}>{selectedEvent.subcategory.category.name} - {selectedEvent.subcategory.name}</Text>
              <Text style={tw`text-gray-600 mb-2`}>Organizer: {selectedEvent.user.email}</Text>
              <Text style={tw`text-gray-600 mb-2`}>Date: {selectedEvent.availability[0]?.date || 'N/A'}</Text>
              <Text style={tw`text-gray-600 mb-2`}>Time: {selectedEvent.availability[0]?.start || 'N/A'} - {selectedEvent.availability[0]?.end || 'N/A'}</Text>
              <Text style={tw`text-gray-600 mb-2`}>Address: {selectedEvent.address}</Text>
              <Text style={tw`text-gray-600 mb-4`}>{selectedEvent.details}</Text>
              <TouchableOpacity
                style={tw`bg-blue-500 p-4 rounded-full`}
                onPress={startNavigation}
              >
                <Text style={tw`text-white text-center font-bold`}>Navigate to Event</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`mt-4 p-4 rounded-full border border-gray-300`}
                onPress={() => setSelectedEvent(null)}
              >
                <Text style={tw`text-center`}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
     <Modal
  animationType="slide"
  transparent={true}
  visible={showFilter}
  onRequestClose={() => setShowFilter(false)}
>
  <View style={tw`flex-1 justify-start mt-20 bg-white rounded-t-3xl`}>
    <FilterAdvanced 
      onEventsLoaded={handleEventsLoaded} 
      currentLocation={currentLocation}
    />
    <TouchableOpacity
      style={tw`bg-blue-500 p-4 m-4 rounded-full`}
      onPress={() => setShowFilter(false)}
    >
      <Text style={tw`text-white text-center font-bold`}>Close Filter</Text>
    </TouchableOpacity>
  </View>
</Modal>
    </View>
  );
};

export default MapScreen;