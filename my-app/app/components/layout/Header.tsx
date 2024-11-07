import React from 'react';
import { View } from 'react-native';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';
import NavBar from '../NavBar';
import ServiceIcons from '../ServiceIcons';
import { theme } from '../../../lib/theme';

interface HeaderProps {
  selectedFilter: string | null;
  setSelectedFilter: (filter: string | null) => void;
  onSearch: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedFilter, setSelectedFilter, onSearch }) => {
  return (
    <View style={tw`absolute top-0 left-0 right-0 z-50`}>
      <BlurView intensity={100} tint="light" style={tw`py-4 bg-white/80`}>
        <NavBar 
          selectedFilter={selectedFilter} 
          setSelectedFilter={setSelectedFilter} 
          onSearch={onSearch} 
        />
      </BlurView>
      <View style={tw`bg-white/90 py-4 px-2 shadow-lg`}>
        <ServiceIcons />
      </View>
    </View>
  );
};

export default Header;