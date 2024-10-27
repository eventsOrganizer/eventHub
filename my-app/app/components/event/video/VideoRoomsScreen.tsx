import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Animated, Dimensions, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import { Ionicons } from '@expo/vector-icons';
import CloudinaryUpload from '../CloudinaryUpload';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';

const DAILY_API_KEY = '731a44ab06649fabe8300c0f5d89fd8721f34d5f685549bc92a4b44b33f9401c';
const DAILY_API_URL = 'https://api.daily.co/v1/rooms';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const UNIT = 10; // Base unit for cloud sizes

interface Room {
  id: number;
  url: string;
  creator_id: string;
  is_connected: boolean;
  created_at: string;
  name: string;
  subcategory_id: number;
  details: string;
  image_url: string;
  subcategory: {
    id: number;
    name: string;
    category: {
      id: number;
      name: string;
    };
  };
}

const VideoRoomsScreen = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: '', subcategory_id: '', details: '', image_url: '' });
  const navigation = useNavigation();
  const { userId } = useUser();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const leftDoorAnim = useRef(new Animated.Value(0)).current;
  const rightDoorAnim = useRef(new Animated.Value(0)).current;
  const cloudAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (userId) {
      fetchRooms();
      animateEntrance();
    }
  }, [userId]);

  const animateEntrance = () => {
    Animated.parallel([
      Animated.timing(leftDoorAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(rightDoorAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(cloudAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        delay: 1500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('videoroom')
        .select(`
          *,
          media(url),
          subcategory(
            id,
            name,
            category(id, name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching rooms:', error);
      } else if (data) {
        setRooms(data.map(room => ({
          ...room,
          image_url: room.media?.[0]?.url || 'https://via.placeholder.com/150'
        })));
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const createRoom = async () => {
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to create a room.');
      return;
    }

    try {
      const response = await fetch(DAILY_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties: { enable_chat: true } }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Daily.co API error: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const newDailyRoom = await response.json();
      
      const { data, error } = await supabase
        .from('videoroom')
        .insert([{ 
          url: newDailyRoom.url, 
          creator_id: userId,
          name: newRoom.name,
          subcategory_id: parseInt(newRoom.subcategory_id),
          details: newRoom.details
        }])
        .select();

      if (error) {
        console.error('Error saving new room:', error);
        Alert.alert('Error', 'Failed to save the new room.');
      } else if (data) {
        if (newRoom.image_url) {
          await supabase
            .from('media')
            .insert([{ url: newRoom.image_url, videoroom_id: data[0].id }]);
        }
        setRooms((prevRooms) => [...data, ...prevRooms]);
        setIsCreating(false);
        setNewRoom({ name: '', subcategory_id: '', details: '', image_url: '' });
        Alert.alert('Success', 'Room created successfully. Click on it to join.');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      Alert.alert('Error', `Failed to create room: ${error.message}`);
    }
  };

  const deleteRoom = async (room: Room) => {
    if (room.creator_id !== userId) {
      Alert.alert('Error', 'You can only delete rooms you created.');
      return;
    }

    try {
      const response = await fetch(`${DAILY_API_URL}/${room.url.split('/').pop()}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Daily.co API error: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const { error } = await supabase
        .from('videoroom')
        .delete()
        .eq('id', room.id);

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }

      setRooms((prevRooms) => prevRooms.filter((r) => r.id !== room.id));
      Alert.alert('Success', 'Room deleted successfully.');
    } catch (error) {
      console.error('Error deleting room:', error);
      Alert.alert('Error', `Failed to delete room: ${error.message}`);
    }
  };

  const joinRoom = (room: Room) => {
    const isCreator = room.creator_id === userId;
    navigation.navigate('VideoCall', { roomUrl: room.url, isCreator, roomId: room.id });
  };

  const renderRoomItem = ({ item }: { item: Room }) => (
    <TouchableOpacity
      style={tw`w-full mb-6 rounded-xl overflow-hidden shadow-lg`}
      onPress={() => joinRoom(item)}
    >
      <Image source={{ uri: item.image_url }} style={tw`w-full h-48`} />
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
        style={tw`absolute inset-0`}
      />
      <View style={tw`absolute bottom-0 left-0 right-0 p-4`}>
        <Text style={tw`text-white text-xl font-bold mb-1`}>{item.name}</Text>
        <View style={tw`flex-row items-center`}>
          <Text style={tw`text-blue-300 text-sm mr-2`}>
            {item.subcategory?.category?.name}
          </Text>
          <Text style={tw`text-blue-200 text-sm`}>
            {item.subcategory?.name}
          </Text>
        </View>
      </View>
      <View style={tw`absolute top-2 right-2 bg-blue-500 px-2 py-1 rounded-full`}>
        <Text style={tw`text-white text-xs`}>Live</Text>
      </View>
      {item.creator_id === userId && (
        <TouchableOpacity
          style={tw`absolute top-2 left-2 bg-red-500 rounded-full p-2`}
          onPress={() => deleteRoom(item)}
        >
          <Ionicons name="close" size={16} color="#fff" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderCloud = (index: number) => {
    const translateX = cloudAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [SCREEN_WIDTH * (index % 2 === 0 ? -1 : 1), 0],
    });

    let size;
    const randomSize = Math.random();
    if (randomSize < 0.5) {
      size = UNIT + Math.random() * (UNIT * 4); // Small clouds
    } else if (randomSize < 0.8) {
      size = UNIT * 8 + Math.random() * (UNIT * 5); // Medium clouds
    } else {
      size = UNIT * 34 + Math.random() * (UNIT * 21); // Large clouds
    }

    return (
      <Animated.View
        key={index}
        style={[
          tw`absolute`,
          {
            transform: [{ translateX }],
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 80}%`,
          },
        ]}
      >
        <Ionicons name="cloud" size={size} color="rgba(255, 255, 255, 0.3)" />
      </Animated.View>
    );
  };

  return (
    <View style={tw`flex-1`}>
      <LinearGradient
        colors={['#FF5F00', '#FF0D95', '#4E00FF']}
        style={tw`absolute inset-0`}
      />
      {[...Array(30)].map((_, index) => renderCloud(index))}
      <Animated.View
        style={[
          tw`absolute top-0 bottom-0 left-0 bg-gray-900`,
          {
            width: SCREEN_WIDTH / 2,
            transform: [
              {
                translateX: leftDoorAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -SCREEN_WIDTH / 2],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          tw`absolute top-0 bottom-0 right-0 bg-gray-900`,
          {
            width: SCREEN_WIDTH / 2,
            transform: [
              {
                translateX: rightDoorAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, SCREEN_WIDTH / 2],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View style={[tw`flex-1 p-4`, { opacity: fadeAnim }]}>
        <Text style={tw`text-4xl font-bold text-white text-center my-6`}>
          Event Cloud
        </Text>
        {isCreating ? (
          <View style={tw`bg-gray-800 rounded-xl p-4 mb-6`}>
            <TextInput
              style={tw`bg-gray-700 text-white p-3 rounded-lg mb-4`}
              placeholder="Room Name"
              placeholderTextColor="#9CA3AF"
              value={newRoom.name}
              onChangeText={(text) => setNewRoom({ ...newRoom, name: text })}
            />
            <TextInput
              style={tw`bg-gray-700 text-white p-3 rounded-lg mb-4`}
              placeholder="Subcategory ID"
              placeholderTextColor="#9CA3AF"
              value={newRoom.subcategory_id}
              onChangeText={(text) => setNewRoom({ ...newRoom, subcategory_id: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={tw`bg-gray-700 text-white p-3 rounded-lg mb-4`}
              placeholder="Details"
              placeholderTextColor="#9CA3AF"
              value={newRoom.details}
              onChangeText={(text) => setNewRoom({ ...newRoom, details: text })}
              multiline
            />
            <CloudinaryUpload
              onImagesUploaded={(urls) => setNewRoom({ ...newRoom, image_url: urls[0] })}
              buttonStyle={tw`bg-blue-600 p-3 rounded-lg mb-4`}
              buttonTextStyle={tw`text-white text-center font-semibold`}
            />
            <TouchableOpacity
              style={tw`bg-blue-500 p-4 rounded-lg`}
              onPress={createRoom}
            >
              <Text style={tw`text-white text-center font-bold text-lg`}>
                Launch Room
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={tw`bg-blue-500 p-4 rounded-lg mb-6`}
            onPress={() => setIsCreating(true)}
          >
            <Text style={tw`text-white text-center font-bold text-lg`}>
              Create New Room
            </Text>
          </TouchableOpacity>
        )}
        <FlatList
          data={rooms}
          renderItem={renderRoomItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </View>
  );
};

export default VideoRoomsScreen;