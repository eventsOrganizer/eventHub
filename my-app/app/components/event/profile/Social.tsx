import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import Subscriptions from './Subscriptions';
import FriendsList2 from './FriendsList2';
import { useUser } from '../../../UserContext';
import { useNavigation } from '@react-navigation/native';

const Social: React.FC = () => {
  const { userId } = useUser();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={tw`flex-1`}>
      <LinearGradient
        colors={['#003791', '#0054A8', '#0072CE']}
        style={tw`flex-1`}
      >
        <BlurView intensity={20} tint="dark" style={tw`flex-1`}>
          <View style={tw`p-4`}>
            {/* PS5-style header */}
            <View style={tw`mb-6`}>
              <Text style={tw`text-white text-3xl font-bold`}>Social Hub</Text>
              <View style={tw`h-1 w-20 bg-white/50 mt-2 rounded-full`} />
            </View>

            {/* Space before Subscriptions and Friends Section */}
            <View style={tw`flex-1`} />

            {/* Subscriptions Section */}
            <View style={[tw`mb-6 rounded-3xl overflow-hidden`, styles.psCard]}>
              <BlurView intensity={40} tint="dark" style={tw`p-4`}>
                <Text style={tw`text-white text-xl font-bold mb-4`}>Subscriptions</Text>
                <View style={tw`flex-row justify-around`}>
                  <Subscriptions type="followers" />
                  <View style={tw`w-px bg-white/20 mx-4`} />
                  <Subscriptions type="following" />
                </View>
              </BlurView>
            </View>

            {/* Friends Section */}
            <View style={[tw`rounded-3xl overflow-hidden`, styles.psCard]}>
              <BlurView intensity={40} tint="dark" style={tw`p-4`}>
                <Text style={tw`text-white text-xl font-bold mb-4`}>Friends</Text>
                <FriendsList2 userId={userId} />
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
    marginTop: '20%', // Move down by 20% from the top of the available space
  }
});

export default Social;
