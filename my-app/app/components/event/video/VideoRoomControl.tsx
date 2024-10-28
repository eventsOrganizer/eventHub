import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const DAILY_API_KEY = '731a44ab06649fabe8300c0f5d89fd8721f34d5f685549bc92a4b44b33f9401c';
const DAILY_API_URL = 'https://api.daily.co/v1/rooms';

interface VideoRoomControlProps {
  eventId: number;
  eventType: string;
  organizerId: string;
  isPrivate: boolean;
}



const VideoRoomControl: React.FC<VideoRoomControlProps> = ({ eventId, eventType, organizerId, isPrivate }) => {
const navigation = useNavigation();
const [room, setRoom] = useState<any>(null);
const [isReady, setIsReady] = useState(false);
const [hasTicket, setHasTicket] = useState(false);
const [isAuthorized, setIsAuthorized] = useState(false);
const { userId } = useUser();



  useEffect(() => {
    fetchRoom();
    checkAuthorization();
  }, [eventId, userId]);

  const fetchRoom = async () => {
    const { data, error } = await supabase
      .from('videoroom')
      .select('*')
      .eq('event_id', eventId)
      .maybeSingle();
  
    if (error) {
      console.error('Error fetching room:', error);
    } else {
      setRoom(data);
      setIsReady(data?.is_ready || false);
    }
  };

  const checkAuthorization = async () => {
    if (userId === organizerId) {
      setIsAuthorized(true);
      return;
    }

    // Check if the event requires a ticket
    const { data: ticketData } = await supabase
      .from('ticket')
      .select('id')
      .eq('event_id', eventId)
      .single();

    if (ticketData) {
      // Event requires a ticket, check if user has one
      const { data: orderData } = await supabase
        .from('order')
        .select('id')
        .eq('ticket_id', ticketData.id)
        .eq('user_id', userId)
        .single();

      setHasTicket(!!orderData);
      setIsAuthorized(!!orderData);
    } else if (isPrivate) {
      // Event is free but private, check if user is invited
      const { data: invitationData } = await supabase
        .from('event_has_user')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();

      setIsAuthorized(!!invitationData);
    } else {
      // Event is free and public
      setIsAuthorized(true);
    }
  };

  const createRoom = async () => {
    if (eventType !== 'online') {
      Alert.alert('Error', 'Video rooms can only be created for online events.');
      return;
    }
  
    try {
      console.log('Attempting to create room with Daily.co');
      console.log('DAILY_API_URL:', DAILY_API_URL);
      console.log('DAILY_API_KEY:', DAILY_API_KEY.substring(0, 5) + '...');
  
      const response = await fetch(DAILY_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties: { enable_chat: true } }),
      });
  
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Daily.co API error:', errorText);
        throw new Error(`Daily.co API error: ${response.status} ${response.statusText}\n${errorText}`);
      }
  
      const newRoom = await response.json();
      console.log('New room created:', newRoom);
  
      // Insert the room into Supabase
      const { data, error } = await supabase
        .from('videoroom')
        .insert([{ 
          event_id: eventId, 
          url: newRoom.url, 
          creator_id: userId, 
          is_ready: false,
          is_connected: false
        }])
        .select()
        .single();
  
      if (error) {
        console.error('Error saving room to Supabase:', error);
        throw error;
      }
  
      console.log('Room saved to Supabase:', data);
      setRoom(data);
      Alert.alert('Success', 'Video room created successfully.');
    } catch (error) {
      console.error('Error creating room:', error);
      console.error('Error stack:', error.stack);
      Alert.alert('Error', `Failed to create room: ${error.message}`);
    }
  };
  const deleteRoom = async () => {
    try {
      const { error } = await supabase
        .from('videoroom')
        .delete()
        .eq('id', room.id);

      if (error) throw error;

      setRoom(null);
      setIsReady(false);
    } catch (error) {
      console.error('Error deleting room:', error);
      Alert.alert('Error', 'Failed to delete video room.');
    }
  };

  const toggleReady = async () => {
    try {
      const newReadyState = !isReady;
      const { error } = await supabase
        .from('videoroom')
        .update({ is_ready: newReadyState })
        .eq('id', room.id);

      if (error) throw error;

      setIsReady(newReadyState);
    } catch (error) {
      console.error('Error toggling ready state:', error);
      Alert.alert('Error', 'Failed to update room status.');
    }
  };

  const joinRoom = async () => {
    if (!isReady) {
      Alert.alert('Not Ready', 'The video room is not ready yet.');
      return;
    }
  
    try {
      // Check if the event requires a ticket
      const { data: ticketData, error: ticketError } = await supabase
        .from('ticket')
        .select('id')
        .eq('event_id', eventId)
        .single();
  
      if (ticketError && ticketError.code !== 'PGRST116') {
        throw ticketError;
      }
  
      const isPaidEvent = !!ticketData;
  
      // Check if the user has a ticket (for paid events)
      let hasTicket = false;
      if (isPaidEvent) {
        console.log('Checking for user ticket purchase...');
        console.log('Looking for order with:', {
          ticket_id: ticketData?.id,
          user_id: userId
        });
      
        const { data: orderData, error: orderError } = await supabase
          .from('order')
          .select('id')
          .eq('ticket_id', ticketData?.id)
          .eq('user_id', userId);  // Removed .single()
      
        console.log('Order check result:', { orderData, orderError });
      
        if (orderError) {
          throw orderError;
        }
      
        hasTicket = orderData && orderData.length > 0;  // Check if any orders exist
        console.log('Has ticket:', hasTicket);
      }
  
      // Check if the user is a member (for private events)
      const { data: memberData, error: memberError } = await supabase
        .from('event_has_user')
        .select('user_id')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();
  
      if (memberError && memberError.code !== 'PGRST116') {
        throw memberError;
      }
  
      const isMember = !!memberData;
  
      // Determine if the user can join based on all conditions
      let canJoin = false;
      let message = '';
  
      if (!isPaidEvent && !isPrivate) {
        // Free and Public Event
        canJoin = true;
      } else if (!isPaidEvent && isPrivate) {
        // Free and Private Event
        canJoin = isMember;
        message = 'You need to be a member of this event to join the video room.';
      } else if (isPaidEvent && !isPrivate) {
        // Paid and Public Event
        canJoin = hasTicket;
        message = 'You need to purchase a ticket to join this video room.';
      } else if (isPaidEvent && isPrivate) {
        // Paid and Private Event
        canJoin = hasTicket && isMember;
        message = 'You need to be a member and have a ticket to join this video room.';
      }
  
      if (canJoin) {
        // Navigate to VideoCall screen
        navigation.navigate('VideoCall', { roomUrl: room.url, isCreator: userId === organizerId, roomId: room.id });
      } else {
        Alert.alert('Access Denied', message);
      }
    } catch (error) {
      console.error('Error checking room access:', error);
      Alert.alert('Error', 'An error occurred while checking room access. Please try again.');
    }
  };

  if (userId === organizerId) {
    return (
      <View style={styles.container}>
        {!room ? (
          <TouchableOpacity style={styles.button} onPress={createRoom}>
            <Text style={styles.buttonText}>Create Video Room</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={joinRoom}>
              <Text style={styles.buttonText}>Join Video Room</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={deleteRoom}>
              <Text style={styles.buttonText}>Delete Video Room</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.readyButton} onPress={toggleReady}>
              <Ionicons name={isReady ? "checkmark-circle" : "close-circle"} size={24} color={isReady ? "green" : "red"} />
              <Text style={styles.readyButtonText}>{isReady ? "Ready" : "Not Ready"}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {room && (
          <TouchableOpacity 
            style={[styles.button, !isReady && styles.disabledButton]} 
            onPress={joinRoom}
            disabled={!isReady}
          >
            <Text style={styles.buttonText}>
              {isReady ? "Join Video Room" : "Video Room Not Available"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  readyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  readyButtonText: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
});

export default VideoRoomControl;