import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { NotificationIcon } from './Notifications/NotificationIcon';
import { NotificationsModal } from './Notifications/NotificationsModal';

interface NavBarProps {
  selectedFilter: string | null;
  setSelectedFilter: (value: string | null) => void;
  onSearch: (searchTerm: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ selectedFilter, setSelectedFilter, onSearch }) => {
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
            style={tw`p-2`}
            onPress={() => navigation.navigate('ChatList' as never)}
          >
            <Ionicons name="chatbubbles-outline" size={24} color="#1a2a4a" />
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

export default NavBar;