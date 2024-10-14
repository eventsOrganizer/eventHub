import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';

interface JoinEventButtonProps {
  eventId: number;
  privacy: boolean;
  organizerId: string;
  onJoinSuccess: () => void;
  onLeaveSuccess: () => void;
}

const JoinEventButton: React.FC<JoinEventButtonProps> = ({ eventId, privacy, organizerId, onJoinSuccess, onLeaveSuccess }) => {
  const { userId } = useUser();
  const [isJoined, setIsJoined] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    checkJoinStatus();
  }, []);

  const checkJoinStatus = async () => {
    if (!userId) return;

    if (!privacy) {
      const { data, error } = await supabase
        .from('event_has_user')
        .select()
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .single();

      if (data) setIsJoined(true);
    } else {
      const { data, error } = await supabase
        .from('request')
        .select()
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .single();

      if (data && data.status === 'pending') setIsPending(true);
      if (data && data.status === 'accepted') setIsJoined(true);
    }
  };

  const handleJoin = async () => {
    if (!userId) return;

    if (!privacy) {
      const { data, error } = await supabase
        .from('event_has_user')
        .insert({ user_id: userId, event_id: eventId });

      if (!error) {
        setIsJoined(true);
        onJoinSuccess();
      }
    } else {
      const { data, error } = await supabase
        .from('request')
        .insert({ user_id: userId, event_id: eventId, status: 'pending' });

      if (!error) {
        setIsPending(true);
        onJoinSuccess();
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
            if (!privacy) {
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
            } else {
              const { error } = await supabase
                .from('request')
                .delete()
                .eq('user_id', userId)
                .eq('event_id', eventId);
  
              if (!error) {
                setIsPending(false);
                setIsJoined(false);
                onLeaveSuccess();
              } else {
                console.error('Error canceling request:', error);
                Alert.alert('Error', 'Failed to cancel the request. Please try again.');
              }
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
      <TouchableOpacity style={styles.pendingButton} disabled>
        <Text style={styles.buttonText}>Request Pending</Text>
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
    padding: 4,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  joinedButton: {
    backgroundColor: 'rgba(158, 158, 158, 0.8)',
    padding: 4,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  pendingButton: {
    backgroundColor: 'rgba(255, 160, 0, 0.8)',
    padding: 4,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 8,
  },
});
export default JoinEventButton;