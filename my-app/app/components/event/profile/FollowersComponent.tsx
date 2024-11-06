import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../services/supabaseClient';
import UserAvatar from '../UserAvatar';
import { useUser } from '../../../UserContext';
import tw from 'twrnc';

interface Follower {
  id: string;
  firstname: string;
  lastname: string;
}

interface Props {
  route?: {
    params?: {
      userId?: string;
      isOwnProfile?: boolean;
    }
  }
}

const FollowersComponent: React.FC<Props> = ({ route }) => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const { userId: currentUserId } = useUser();
  
  // If we're coming from route params (organizer profile), use that userId
  // Otherwise, use the currentUserId (user profile)
  const targetUserId = route?.params?.userId || currentUserId;
  const isOwnProfile = route?.params?.isOwnProfile ?? true;

  useEffect(() => {
    fetchFollowers();
  }, [targetUserId]);

  const fetchFollowers = async () => {
    if (!targetUserId) return;

    const { data, error } = await supabase
      .from('follower')
      .select('follower_id')
      .eq('following_id', targetUserId);

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
      setFollowers(followersData || []);
    }
  };

  const removeFollower = async (followerId: string) => {
    const { error } = await supabase
      .from('follower')
      .delete()
      .match({ follower_id: followerId, following_id: targetUserId });

    if (error) {
      console.error('Error removing follower:', error);
    } else {
      setFollowers(followers.filter(follower => follower.id !== followerId));
    }
  };

  const renderItem = ({ item }: { item: Follower }) => (
    <BlurView intensity={30} tint="dark" style={styles.followerItem}>
      <TouchableOpacity style={styles.userContainer}>
        <UserAvatar userId={item.id} size={60} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{`${item.firstname} ${item.lastname}`}</Text>
          <Text style={styles.userSubtext}>
            {isOwnProfile ? 'Follows you' : `Follows ${item.firstname}`}
          </Text>
        </View>
      </TouchableOpacity>
      {isOwnProfile && (
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeFollower(item.id)}
        >
          <Ionicons name="close-circle" size={20} color="#FF3B30" />
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      )}
    </BlurView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#003791', '#0054A8', '#0072CE']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Followers</Text>
          <View style={styles.headerLine} />
        </View>

        <FlatList
          data={followers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003791',
  },
  gradient: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerLine: {
    height: 2,
    width: 40,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 2,
  },
  listContainer: {
    padding: 15,
  },
  followerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 12,
    borderRadius: 15,
    padding: 12,
    overflow: 'hidden',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,59,48,0.15)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  removeText: {
    color: '#FF3B30',
    marginLeft: 5,
    fontWeight: '500',
  },
});

export default FollowersComponent;