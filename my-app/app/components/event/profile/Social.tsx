import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import Subscriptions from './Subscriptions';
import FriendsList from './FriendsList';
import { useUser } from '../../../UserContext';

const Social: React.FC = () => {
  const { userId } = useUser();

  return (
    <SafeAreaView style={tw`flex-1`}>
      <LinearGradient
        colors={['#003791', '#0054A8', '#0072CE']} // PlayStation blue gradient
        style={tw`flex-1`}
      >
        <BlurView intensity={20} tint="dark" style={tw`flex-1`}>
          <View style={tw`p-4`}>
            {/* PS5-style header */}
            <View style={tw`mb-6`}>
              <Text style={tw`text-white text-3xl font-bold`}>Social Hub</Text>
              <View style={tw`h-1 w-20 bg-white/50 mt-2 rounded-full`} />
            </View>

            {/* Subscriptions Section */}
            <View style={[tw`mb-6 rounded-3xl overflow-hidden`, styles.psCard]}>
              <BlurView intensity={40} tint="dark" style={tw`p-4`}>
                <Text style={tw`text-white text-xl font-bold mb-4`}>Subscriptions</Text>
                <Subscriptions />
              </BlurView>
            </View>

            {/* Friends Section */}
            <View style={[tw`rounded-3xl overflow-hidden`, styles.psCard]}>
              <BlurView intensity={40} tint="dark" style={tw`p-4`}>
                <Text style={tw`text-white text-xl font-bold mb-4`}>Friends</Text>
                <FriendsList userId={userId} />
              </BlurView>
            </View>
          </View>
        </BlurView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  psCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  }
});

export default Social;