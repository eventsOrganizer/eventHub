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
    style={[
      tw`px-4 py-2 rounded-full mr-2`,
      selected ? tw`bg-purple-500` : tw`bg-white/20`
    ]}
    onPress={onPress}
  >
    <Text style={[
      tw`text-sm`,
      selected ? tw`text-white` : tw`text-white/70`
    ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default FilterChip;