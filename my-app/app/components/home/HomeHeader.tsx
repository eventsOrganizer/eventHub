import React from 'react';
import { View } from 'react-native';
import { BlurView } from 'expo-blur';
import NavBar from '../NavBar';
import { MotiView } from 'moti';
import tw from 'twrnc';

interface HomeHeaderProps {
  selectedFilter: string | null;
  setSelectedFilter: (filter: string | null) => void;
  onSearch: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ selectedFilter, setSelectedFilter, onSearch }) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: -20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
    >
      <BlurView intensity={100} tint="dark" style={tw`py-4`}>
        <NavBar 
          selectedFilter={selectedFilter} 
          setSelectedFilter={setSelectedFilter} 
          onSearch={onSearch}
        />
      </BlurView>
    </MotiView>
  );
};

export default HomeHeader;