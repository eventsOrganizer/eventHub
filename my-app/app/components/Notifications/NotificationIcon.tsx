import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useNotifications } from '../../hooks/useNotifications2';

interface NotificationIconProps {
  onPress: () => void;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({ onPress }) => {
  const { unreadCount } = useNotifications();

  return (
    <TouchableOpacity style={tw`p-2 relative`} onPress={onPress}>
      <Ionicons name="notifications" size={24} color="#1a2a4a" />
      {unreadCount > 0 && (
        <View style={tw`absolute top-1 right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center`}>
          <Text style={tw`text-white text-xs font-bold`}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};