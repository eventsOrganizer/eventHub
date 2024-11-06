import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../services/supabaseClient';
import UserAvatar from '../UserAvatar';
import { useUser } from '../../../UserContext';
import tw from 'twrnc';

interface Following {
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

const FollowingComponent: React.FC<Props> = ({ route }) => {
  const [following, setFollowing] = useState<Following[]>([]);
  const { userId: currentUserId } = useUser();
  
  // If we're coming from route params (organizer profile), use that userId
  // Otherwise, use the currentUserId (user profile)
  const targetUserId = route?.params?.userId || currentUserId;
  const isOwnProfile = route?.params?.isOwnProfile ?? true;

  useEffect(() => {
    fetchFollowing();
  }, [targetUserId]);

  const fetchFollowing = async () => {
    if (!targetUserId) return;

    const { data, error } = await supabase
      .from('follower')
      .select('following_id')
      .eq('follower_id', targetUserId);

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
      setFollowing(followingData || []);
    }
  };

  const unfollow = async (followingId: string) => {
    const { error } = await supabase
      .from('follower')
      .delete()
      .match({ follower_id: targetUserId, following_id: followingId });

    if (error) {
      console.error('Error unfollowing:', error);
    } else {
      setFollowing(following.filter(follow => follow.id !== followingId));
    }
  };

  const renderItem = ({ item }: { item: Following }) => (
    <BlurView intensity={30} tint="dark" style={styles.followingItem}>
      <TouchableOpacity style={styles.userContainer}>
        <UserAvatar userId={item.id} size={60} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{`${item.firstname} ${item.lastname}`}</Text>
          <Text style={styles.userSubtext}>
            {isOwnProfile ? 'Following' : `${item.firstname} is followed by them`}
          </Text>
        </View>
      </TouchableOpacity>
      {isOwnProfile && (
        <TouchableOpacity 
          style={styles.unfollowButton}
          onPress={() => unfollow(item.id)}
        >
          <Ionicons name="person-remove" size={20} color="#FF3B30" />
          <Text style={styles.unfollowText}>Unfollow</Text>
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
          <Text style={styles.title}>Following</Text>
          <View style={styles.headerLine} />
        </View>

        <FlatList
          data={following}
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
  followingItem: {
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
  unfollowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,59,48,0.15)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  unfollowText: {
    color: '#FF3B30',
    marginLeft: 5,
    fontWeight: '500',
  },
});

export default FollowingComponent;