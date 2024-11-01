import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import tw from 'twrnc';

export const LoadingPlaceholder = () => (
  <SkeletonPlaceholder>
    <View style={tw`p-4 space-y-4`}>
      <View style={tw`h-40 rounded-3xl`} />
      <View style={tw`h-20 rounded-3xl`} />
      <View style={tw`h-60 rounded-3xl`} />
    </View>
  </SkeletonPlaceholder>
);

