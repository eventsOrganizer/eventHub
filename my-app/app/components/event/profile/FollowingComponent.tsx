import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import UserAvatar from '../UserAvatar';
import { useUser } from '../../../UserContext';

interface Following {
  id: string;
  firstname: string;
  lastname: string;
}

const FollowingComponent: React.FC = () => {
  const [following, setFollowing] = useState<Following[]>([]);
  const { userId } = useUser();

  useEffect(() => {
    fetchFollowing();
  }, [userId]);

  const fetchFollowing = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('follower')
      .select('following_id')
      .eq('follower_id', userId);

    if (error) {
      console.error('Error fetching following:', error);
      return;
    }

    const followingIds = data.map(item => item.following_id);
    const { data: followingData, error: followingError } = await supabase
      .from('user')
      .select('id, firstname, lastname')
      .in('id', followingIds);

    if (followingError) {
      console.error('Error fetching following data:', followingError);
    } else {
      setFollowing(followingData as Following[]);
    }
  };

  const unfollow = async (followingId: string) => {
    const { error } = await supabase
      .from('follower')
      .delete()
      .match({ follower_id: userId, following_id: followingId });

    if (error) {
      console.error('Error unfollowing:', error);
    } else {
      setFollowing(following.filter(follow => follow.id !== followingId));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Following</Text>
      <FlatList
        data={following}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.followingItem}>
            <UserAvatar userId={item.id} size={50} />
            <Text style={styles.followingName}>{`${item.firstname} ${item.lastname}`}</Text>
            <TouchableOpacity onPress={() => unfollow(item.id)}>
              <Text style={styles.unfollowButton}>Unfollow</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  followingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  followingName: {
    marginLeft: 10,
    flex: 1,
  },
  unfollowButton: {
    color: 'red',
  },
});

export default FollowingComponent;