import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';

const DAILY_API_KEY = '731a44ab06649fabe8300c0f5d89fd8721f34d5f685549bc92a4b44b33f9401c';
const DAILY_API_URL = 'https://api.daily.co/v1/rooms';

interface Room {
  id: number;
  url: string;
  creator_id: string;
  is_connected: boolean;
  created_at: string;
}

const VideoRoomsScreen = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigation = useNavigation();
  const { userId } = useUser();

  useEffect(() => {
    if (userId) {
      fetchRooms();
    }
  }, [userId]);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('videoroom')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching rooms:', error);
      } else if (data) {
        setRooms(data);
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

      const newRoom = await response.json();
      
      const { data, error } = await supabase
        .from('videoroom')
        .insert([{ url: newRoom.url, creator_id: userId }])
        .select();

      if (error) {
        console.error('Error saving new room:', error);
        Alert.alert('Error', 'Failed to save the new room.');
      } else if (data) {
        setRooms((prevRooms) => [...data, ...prevRooms]);
        navigation.navigate('VideoCall', { roomUrl: newRoom.url, isCreator: true, roomId: data[0].id });
      }
    } catch (error) {
      console.error('Error creating room:', error);
      Alert.alert('Error', `Failed to create room: ${error.message}`);
    }
  };

  const joinRoom = (room: Room) => {
    const isCreator = room.creator_id === userId;
    navigation.navigate('VideoCall', { roomUrl: room.url, isCreator, roomId: room.id });
  };

  return (
    <View style={styles.container}>
      <Button title="Create Stream" onPress={createRoom} />
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => joinRoom(item)}>
            <Text style={styles.roomName}>Room {item.id}</Text>
            <Text>Created at: {new Date(item.created_at).toLocaleString()}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  roomName: {
    fontSize: 18,
    marginVertical: 8,
  },
});

export default VideoRoomsScreen;