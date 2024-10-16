import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import UserAvatar from '../UserAvatar';
import { useUser } from '../../../UserContext';

interface Follower {
  id: string;
  firstname: string;
  lastname: string;
}

const FollowersComponent: React.FC = () => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const { userId } = useUser();

  useEffect(() => {
    fetchFollowers();
  }, [userId]);

  const fetchFollowers = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('follower')
      .select('follower_id')
      .eq('following_id', userId);

    if (error) {
      console.error('Error fetching followers:', error);
      return;
    }

    const followerIds = data.map(item => item.follower_id);
    const { data: followersData, error: followersError } = await supabase
      .from('user')
      .select('id, firstname, lastname')
      .in('id', followerIds);

    if (followersError) {
      console.error('Error fetching followers data:', followersError);
    } else {
      setFollowers(followersData as Follower[]);
    }
  };

  const removeFollower = async (followerId: string) => {
    const { error } = await supabase
      .from('follower')
      .delete()
      .match({ follower_id: followerId, following_id: userId });

    if (error) {
      console.error('Error removing follower:', error);
    } else {
      setFollowers(followers.filter(follower => follower.id !== followerId));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Followers</Text>
      <FlatList
        data={followers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.followerItem}>
            <UserAvatar userId={item.id} size={50} />
            <Text style={styles.followerName}>{`${item.firstname} ${item.lastname}`}</Text>
            <TouchableOpacity onPress={() => removeFollower(item.id)}>
              <Text style={styles.removeButton}>Remove</Text>
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
  followerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  followerName: {
    marginLeft: 10,
    flex: 1,
  },
  removeButton: {
    color: 'red',
  },
});

export default FollowersComponent;