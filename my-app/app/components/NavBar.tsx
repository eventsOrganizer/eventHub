import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { NotificationIcon } from './Notifications/NotificationIcon';
import { NotificationsModal } from './Notifications/NotificationsModal';
import { useMessageNotifications } from '../hooks/useMessageNotifications';
import { useUser } from '../UserContext';


interface NavBarProps {
  selectedFilter: string | null;
  setSelectedFilter: (value: string | null) => void;
  onSearch: (searchTerm: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ selectedFilter, setSelectedFilter, onSearch }) => {
  const { userId } = useUser();
  const { totalUnreadCount } = useMessageNotifications(userId);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const navigation = useNavigation();

  const handleSearch = () => {
    onSearch(searchTerm);
    navigation.navigate('SearchResultsScreen' as never, { initialSearchTerm: searchTerm } as never);
  };

  return (
    <>
      <LinearGradient
        colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)', 'transparent']}
        style={tw`py-4 px-3 rounded-b-lg`}
      >
        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-1 flex-row items-center bg-white bg-opacity-20 rounded-full px-3 py-2 mr-2`}>
            <Ionicons name="search" size={20} color="#1a2a4a" style={tw`mr-2`} />
            <TextInput
              style={tw`flex-1 text-[#1a2a4a] text-base`}
              placeholder="Search events and services..."
              placeholderTextColor="#4a5a7a"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <TouchableOpacity onPress={handleSearch} style={tw`ml-2`}>
              <Ionicons name="arrow-forward" size={20} color="#1a2a4a" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity onPress={() => navigation.navigate('UserProfile' as never)} style={tw`p-2`}>
            <Ionicons name="person-outline" size={24} color="#1a2a4a" />
          </TouchableOpacity>

          <NotificationIcon onPress={() => setShowNotifications(true)} />

          <TouchableOpacity 
  style={tw`p-2 relative`}
  onPress={() => navigation.navigate('ChatList')}
>
  <Ionicons name="chatbubbles-outline" size={24} color="#1a2a4a" />
  {totalUnreadCount > 0 && (
    <View style={tw`absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 justify-center items-center`}>
      <Text style={tw`text-white text-xs font-bold`}>{totalUnreadCount}</Text>
    </View>
  )}
</TouchableOpacity>

          <View style={tw`w-30`}>
            <RNPickerSelect
              onValueChange={setSelectedFilter}
              items={[
                { label: 'All', value: 'all' },
                { label: 'This Week', value: 'this_week' },
                { label: 'This Month', value: 'this_month' },
              ]}
              style={{
                inputIOS: tw`text-[#1a2a4a] text-base pr-8`,
                inputAndroid: tw`text-[#1a2a4a] text-base pr-8`,
              }}
              value={selectedFilter}
              Icon={() => <Ionicons name="chevron-down" size={20} color="#1a2a4a" style={tw`absolute right-0 top-2`} />}
            />
          </View>
        </View>
      </LinearGradient>

      <NotificationsModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1a2a4a',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default NavBar;