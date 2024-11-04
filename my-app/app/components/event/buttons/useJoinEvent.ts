import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../../services/supabaseClient';

interface UseJoinEventProps {
  eventId: number;
  privacy: boolean;
  userId: string | null;
  organizerId: string;
  onJoinSuccess: () => void;
  onLeaveSuccess: () => void;
}

export const useJoinEvent = ({
  eventId,
  privacy,
  userId,
  organizerId,
  onJoinSuccess,
  onLeaveSuccess,
}: UseJoinEventProps) => {
  const [isJoined, setIsJoined] = useState(false);
  const [isPending, setIsPending] = useState(false);

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
      const { data: requestData } = await supabase
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

  const handleJoin = async () => {
    if (!userId) return;

    if (userId === organizerId) {
      setIsJoined(true);
      return;
    }
    
    if (!privacy) {
      const { error } = await supabase
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
      const { error } = await supabase
        .from('request')
        .insert({
          user_id: userId,
          event_id: eventId,
          status: 'pending',
          personal_id: null,
          local_id: null,
          material_id: null
        });

      if (!error) {
        setIsPending(true);
        Alert.alert('Request Sent', 'Your request to join this event has been sent to the organizer.');
      } else {
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

  return {
    isJoined,
    isPending,
    handleJoin,
    handleLeave,
  };
};