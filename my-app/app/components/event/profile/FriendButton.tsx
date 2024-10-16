import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';

interface FriendButtonProps {
  targetUserId: string;
}

const FriendButton: React.FC<FriendButtonProps> = ({ targetUserId }) => {
  const [isFriend, setIsFriend] = useState(false);
  const [isPendingFriendRequest, setIsPendingFriendRequest] = useState(false);
  const { userId } = useUser();

  useEffect(() => {
    checkFriendshipStatus();
  }, [userId, targetUserId]);

  const checkFriendshipStatus = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('friend')
      .select('*')
      .match({ user_id: userId, friend_id: targetUserId });

    if (error) {
      console.error('Error checking friendship status:', error);
    } else {
      setIsFriend(data && data.length > 0);
    }

    const { data: requestData, error: requestError } = await supabase
      .from('request')
      .select('*')
      .match({ user_id: userId, friend_id: targetUserId, status: 'pending' });

    if (requestError) {
      console.error('Error checking friend request status:', requestError);
    } else {
      setIsPendingFriendRequest(requestData && requestData.length > 0);
    }
  };

  const handleAddFriend = async () => {
    if (!userId) return;

    const { error } = await supabase
      .from('request')
      .insert({ user_id: userId, friend_id: targetUserId, status: 'pending', event_id: null });

    if (error) {
      console.error('Error sending friend request:', error);
    } else {
      setIsPendingFriendRequest(true);
    }
  };

  const handleRemoveFriend = async () => {
    if (!userId) return;

    const { error } = await supabase
      .from('friend')
      .delete()
      .match({ user_id: userId, friend_id: targetUserId });

    if (error) {
      console.error('Error removing friend:', error);
    } else {
      setIsFriend(false);
    }
  };

  if (isFriend) {
    return (
      <TouchableOpacity style={styles.friendButton} onPress={handleRemoveFriend}>
        <Text style={styles.friendButtonText}>Remove Friend</Text>
      </TouchableOpacity>
    );
  } else if (isPendingFriendRequest) {
    return <Text style={styles.pendingText}>Friend Request Pending</Text>;
  } else {
    return (
      <TouchableOpacity style={styles.friendButton} onPress={handleAddFriend}>
        <Text style={styles.friendButtonText}>Add Friend</Text>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  friendButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  friendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pendingText: {
    color: '#FFA500',
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default FriendButton;