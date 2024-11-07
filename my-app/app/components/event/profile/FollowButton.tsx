import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';

interface FollowButtonProps {
  targetUserId: string;
  onFollowStateChange?: (isFollowing: boolean) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({ targetUserId, onFollowStateChange }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const { userId } = useUser();

  useEffect(() => {
    checkFollowStatus();
  }, [userId, targetUserId]);

  const checkFollowStatus = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('follower')
      .select('*')
      .match({ follower_id: userId, following_id: targetUserId });

    if (error) {
      console.error('Error checking follow status:', error);
    } else {
      setIsFollowing(data && data.length > 0);
    }
  };

  const handleFollow = async () => {
    if (!userId) return;

    if (isFollowing) {
      const { error } = await supabase
        .from('follower')
        .delete()
        .match({ follower_id: userId, following_id: targetUserId });

      if (error) {
        console.error('Error unfollowing user:', error);
      } else {
        setIsFollowing(false);
        onFollowStateChange?.(false); // Notify parent component
      }
    } else {
      const { error } = await supabase
        .from('follower')
        .insert({ follower_id: userId, following_id: targetUserId });

      if (error) {
        console.error('Error following user:', error);
      } else {
        setIsFollowing(true);
        onFollowStateChange?.(true); // Notify parent component
      }
    }
  };

  

  return (
    <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
      <Text style={styles.followButtonText}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  followButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    height: 88,
    width: 100, // This matches the height of the FollowerStats container
    justifyContent: 'center',
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FollowButton;