import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';
interface FABProps {
  isFabOpen: boolean;
  toggleFab: () => void;
  onCreateService: () => void;
  onCreateEvent: () => void;
}
const FAB: React.FC<FABProps> = ({ isFabOpen, toggleFab, onCreateService, onCreateEvent }) => {
  return (
    <View style={tw`absolute bottom-20 right-5 items-end`}>
      {isFabOpen && (
        <View style={tw`mb-2`}>
          <TouchableOpacity
            style={tw`flex-row items-center p-3 rounded-full mb-2`}
            onPress={onCreateService}
          >
            <BlurView intensity={80} tint="light" style={tw`absolute inset-0 rounded-full`} />
            <Ionicons name="briefcase-outline" size={24} color="#fff" />
            <Text style={tw`text-white ml-2 font-bold`}>Create Service</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-row items-center p-3 rounded-full mb-2`}
            onPress={onCreateEvent}
          >
            <BlurView intensity={80} tint="light" style={tw`absolute inset-0 rounded-full`} />
            <Ionicons name="calendar-outline" size={24} color="#fff" />
            <Text style={tw`text-white ml-2 font-bold`}>Create Event</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        style={tw`w-15 h-15 rounded-full justify-center items-center shadow-lg overflow-hidden`}
        onPress={toggleFab}
      >
        <BlurView intensity={80} tint="light" style={tw`absolute inset-0`} />
        <Ionicons name={isFabOpen ? 'close' : 'add'} size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};
export default FAB;