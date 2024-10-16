import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import UserAvatar from '../UserAvatar';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';

interface FriendRequestItemProps {
  request: {
    id: number;
    user: { id: string; email: string };
  };
  onRequestHandled: () => void;
}

const FriendRequestItem: React.FC<FriendRequestItemProps> = ({ request, onRequestHandled }) => {
  const { userId } = useUser();

  const handleAccept = async () => {
    try {
      // Add to friends table
      await supabase
        .from('friend')
        .insert([
          { user_id: request.user.id, friend_id: userId },
          { user_id: userId, friend_id: request.user.id }
        ]);

      // Update request status
      await supabase
        .from('request')
        .update({ status: 'accepted' })
        .eq('id', request.id);

      onRequestHandled();
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleReject = async () => {
    try {
      await supabase
        .from('request')
        .update({ status: 'rejected' })
        .eq('id', request.id);

      onRequestHandled();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  return (
    <View style={styles.container}>
      <UserAvatar userId={request.user.id} size={50} />
      <View style={styles.infoContainer}>
        <Text style={styles.email}>{request.user.email}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={handleAccept}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={handleReject}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoContainer: {
    marginLeft: 10,
    flex: 1,
  },
  email: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 8,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FriendRequestItem;