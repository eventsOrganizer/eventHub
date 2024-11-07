import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import tw from 'twrnc';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, selected, onPress }) => (
  <TouchableOpacity
    style={tw`${
      selected 
        ? 'bg-blue-50 border-blue-100' 
        : 'bg-gray-50 border-gray-100'
    } px-4 py-2 rounded-xl mr-2 border`}
    onPress={onPress}
  >
    <Text style={tw`${
      selected 
        ? 'text-blue-600' 
        : 'text-gray-600'
    } font-medium`}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default FilterChip;