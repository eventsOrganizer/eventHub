import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';
import { createEventNotificationSystem } from '../../services/eventNotificationService';

interface JoinEventButtonProps {
  eventId: number;
  privacy: boolean;
  organizerId: string;
  onJoinSuccess: () => void;
  onLeaveSuccess: () => void;
}

const JoinEventButton: React.FC<JoinEventButtonProps> = ({ 
  eventId, 
  privacy, 
  organizerId, 
  onJoinSuccess, 
  onLeaveSuccess 
}) => {
  const { userId } = useUser();
  const [isJoined, setIsJoined] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { handleNewEventJoinRequest } = createEventNotificationSystem();

  useEffect(() => {
    checkJoinStatus();
  }, []);

  const checkJoinStatus = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('event_has_user')
      .select()
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .single();

    if (data) {
      setIsJoined(true);
    } else if (privacy) {
      const { data: requestData, error: requestError } = await supabase
        .from('request')
        .select()
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .single();

      if (requestData && requestData.status === 'pending') {
        setIsPending(true);
      }
    }
  };



  const handleCancelRequest = async () => {
    try {
      const { error } = await supabase
        .from('request')
        .delete()
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .eq('status', 'pending');
  
      if (error) throw error;
      setIsPending(false);
      Alert.alert('Success', 'Request cancelled successfully');
    } catch (error) {
      console.error('Error cancelling request:', error);
      Alert.alert('Error', 'Failed to cancel request');
    }
  };


  const handleJoin = async () => {
    if (!userId) return;

    if (userId === organizerId) {
      setIsJoined(true);
      return;
    }
    
    if (!privacy) {
      const { data, error } = await supabase
        .from('event_has_user')
        .insert({ user_id: userId, event_id: eventId });

      if (!error) {
        setIsJoined(true);
        onJoinSuccess();
      } else {
        console.error('Error joining event:', error);
        Alert.alert('Error', 'Failed to join the event. Please try again.');
      }
    } else {
      try {
        console.log('Creating join request...');
        const { data: requestData, error } = await supabase
          .from('request')
          .insert({
            user_id: userId,
            event_id: eventId,
            status: 'pending',
            personal_id: null,
            local_id: null,
            material_id: null,
            is_read: false,
            is_action_read: false
          })
          .select()
          .single();
  
        if (error) throw error;
        if (!requestData) throw new Error('No request data returned');
  
        console.log('Request created:', requestData);
        console.log('Sending notification to owner:', organizerId);
        
        // Send notification to event owner
        await handleNewEventJoinRequest(requestData.id);
        
        setIsPending(true);
        Alert.alert('Success', 'Your request to join this event has been sent to the organizer.');
      } catch (error) {
        console.error('Error sending join request:', error);
        Alert.alert('Error', 'Failed to send join request. Please try again.');
      }
    }
  };


  

  const handleLeave = async () => {
    Alert.alert(
      "Leave Event",
      "Are you sure you want to leave this event?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            const { error } = await supabase
              .from('event_has_user')
              .delete()
              .eq('user_id', userId)
              .eq('event_id', eventId);

            if (!error) {
              setIsJoined(false);
              onLeaveSuccess();
            } else {
              console.error('Error leaving event:', error);
              Alert.alert('Error', 'Failed to leave the event. Please try again.');
            }
          }
        }
      ]
    );
  };

  if (isJoined) {
    return (
      <TouchableOpacity style={styles.joinedButton} onPress={handleLeave}>
        <Text style={styles.buttonText}>Joined</Text>
      </TouchableOpacity>
    );
  }

  if (isPending) {
    return (
      <TouchableOpacity 
        style={styles.pendingButton} 
        onPress={handleCancelRequest}
      >
        <Text style={styles.buttonText}>Request Pending (Tap to Cancel)</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.joinButton} onPress={handleJoin}>
      <Text style={styles.buttonText}>{privacy ? 'Request to Join' : 'Join Event'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  joinButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
  },
  joinedButton: {
    backgroundColor: 'rgba(158, 158, 158, 0.8)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
  },
  pendingButton: {
    backgroundColor: 'rgba(255, 160, 0, 0.8)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default JoinEventButton;