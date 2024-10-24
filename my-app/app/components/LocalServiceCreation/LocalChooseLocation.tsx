import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapScreen from '../../screens/MapScreen';
import tw from 'twrnc';

const LocalChooseLocation: React.FC<{
  onLocationSelected: (location: { latitude: number; longitude: number }) => void;
  onContinue: () => void; // Add onContinue prop to handle moving to the next step
}> = ({ onLocationSelected, onContinue }) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleLocationSelected = (selectedLocation: { latitude: number; longitude: number }) => {
    setLocation(selectedLocation);
    onLocationSelected(selectedLocation);
  };

  // Effect to load the map directly when the component mounts
  useEffect(() => {
    // You can add any initialization logic here if needed
  }, []);

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

      {/* Continue Button to move to the next step */}
      <TouchableOpacity
        style={tw`bg-blue-500 p-3 rounded-lg items-center`}
        onPress={onContinue} // Call the onContinue function passed as a prop
      >
        <Text style={tw`text-white font-semibold`}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LocalChooseLocation;
