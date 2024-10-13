import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { supabase } from '../../services/supabaseClient';

interface UserAvatarProps {
  userId: string;
  size?: number;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ userId, size = 50 }) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserAvatar();
  }, [userId]);

  const fetchUserAvatar = async () => {
    const { data, error } = await supabase
      .from('media')
      .select('url')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user avatar:', error);
    } else {
      setAvatarUrl(data?.url || null);
    }
    setLoading(false);
  };

  const handlePress = () => {
    navigation.navigate('OrganizerProfile' as any, { organizerId: userId } as never);
  };

  if (loading) {
    return <ActivityIndicator size="small" color="#FFA500" />;
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <Image
        source={{ uri: avatarUrl || 'https://via.placeholder.com/50' }}
        style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatar: {
    resizeMode: 'cover',
  },
});

export default UserAvatar;