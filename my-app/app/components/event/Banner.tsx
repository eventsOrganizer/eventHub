import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '../../../lib/theme';
import tw from 'twrnc';

interface BannerProps {
  title: string;
}

const Banner: React.FC<BannerProps> = ({ title }) => {
  return (
    <View style={tw`px-4 py-2 mb-4 bg-[${theme.colors.overlay}] rounded-lg`}>
      <Text style={[
        tw`text-lg font-bold`,
        { color: theme.colors.secondary }
      ]}>
        {title}
      </Text>
    </View>
  );
};

export default Banner;