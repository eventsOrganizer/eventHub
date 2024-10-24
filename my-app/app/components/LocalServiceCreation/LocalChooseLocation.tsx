import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapScreen from '../../screens/MapScreen';
import tw from 'twrnc';

const LocalChooseLocation: React.FC<{
  onLocationSelected: (location: { latitude: number; longitude: number }) => void;
  setIsButtonDisabled: (disabled: boolean) => void; // Add this prop to control the button state
}> = ({ onLocationSelected, setIsButtonDisabled }) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleLocationSelected = (selectedLocation: { latitude: number; longitude: number }) => {
    setLocation(selectedLocation);
    onLocationSelected(selectedLocation);
    setIsButtonDisabled(false); // Enable the button when a location is selected
  };

  // Effect to load the map directly when the component mounts
  useEffect(() => {
    // Initially disable the button until a location is selected
    setIsButtonDisabled(true);
  }, [setIsButtonDisabled]);

  return (
    <View style={tw`mb-4`}>
      <Text style={tw`text-lg font-semibold mb-2 text-gray-700`}>Location</Text>
      {location && (
        <Text style={tw`mt-2 text-gray-600`}>
          Latitude: {location.latitude.toFixed(6)}, Longitude: {location.longitude.toFixed(6)}
        </Text>
      )}

      <View style={tw`w-full aspect-square mb-4 rounded-lg overflow-hidden`}>
        <MapScreen onLocationSelected={handleLocationSelected} />
      </View>

      {/* Button to set location to current location */}
      <TouchableOpacity
        style={tw`bg-blue-500 p-3 rounded-lg items-center`}
        onPress={() => {
          // You can implement functionality to set the current location here
        }}
      >
        <Text style={tw`text-white font-semibold`}>Set Location to Current Location</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LocalChooseLocation;
