import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';
import { Heart } from 'lucide-react-native';

interface EventLikeProps {
  eventId: number;
}

const EventLike: React.FC<EventLikeProps> = ({ eventId }) => {
  const { userId } = useUser();
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchLikes();
  }, []);

  const fetchLikes = async () => {
    const { data: likes, error } = await supabase
      .from('like')
      .select('*')
      .eq('event_id', eventId);

    if (error) {
      console.error('Error fetching likes:', error);
    } else {
      setLikeCount(likes.length);
      setIsLiked(likes.some(like => like.user_id === userId));
    }
  };

  const toggleLike = async () => {
    if (!userId) return;

    if (isLiked) {
      const { error } = await supabase
        .from('like')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId);

      if (!error) {
        setLikeCount(prev => prev - 1);
        setIsLiked(false);
      }
    } else {
      const { error } = await supabase
        .from('like')
        .insert({ event_id: eventId, user_id: userId });

      if (!error) {
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
      }
    }
  };

  return (
    <TouchableOpacity onPress={toggleLike} style={styles.container}>
      <Heart fill={isLiked ? '#FF6B6B' : 'none'} color={isLiked ? '#FF6B6B' : '#000'} />
      <Text style={styles.likeCount}>{likeCount}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  likeCount: {
    marginLeft: 5,
    fontSize: 16,
  },
});

export default EventLike;