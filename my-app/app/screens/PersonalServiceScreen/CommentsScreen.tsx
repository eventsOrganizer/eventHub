import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';
import { useToast } from '../../hooks/useToast';
import { LinearGradient } from 'expo-linear-gradient';

interface Comment {
  id: number;
  details: string;
  user_id: string;
  created_at: string;
  user: { 
    username: string;
    media: { 
      url: string;
    }[] | null;
  };
}

const CommentsScreen = () => {
  const route = useRoute();
  const { personalId } = route.params as { personalId: number };
  const { userId } = useUser();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comment')
      .select(`
        id,
        details,
        user_id,
        created_at,
        user:user_id (
          username,
          media:media(url)
        )
      `)
      .eq('personal_id', personalId)
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments.",
        variant: "destructive",
      });
    } else {
      setComments(data as unknown as Comment[]);
    }
  };

  const handleSubmitComment = async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to leave a comment.",
        variant: "default",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Empty Comment",
        description: "Please enter a comment.",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from('comment')
      .insert({
        personal_id: personalId,
        user_id: userId,
        details: newComment.trim(),
      })
      .select();

    if (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Error",
        description: "Failed to submit comment. Please try again.",
        variant: "destructive",
      });
    } else {
      setNewComment('');
      fetchComments();
      toast({
        title: "Success",
        description: "Your comment has been submitted.",
        variant: "default",
      });
    }
  };

  const formatRelativeTime = (date: string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return commentDate.toLocaleDateString();
    }
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <Image 
          source={{ uri: item.user.media && item.user.media[0] ? item.user.media[0].url : 'https://via.placeholder.com/40' }} 
          style={styles.avatar} 
        />
        <View style={styles.commentInfo}>
          <Text style={styles.commentUser}>{item.user.username}</Text>
          <Text style={styles.commentDate}>{formatRelativeTime(item.created_at)}</Text>
        </View>
      </View>
      <Text style={styles.commentText}>{item.details}</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={['#F0F4F8', '#E1E8ED', '#D2DCE5', '#C3D0D9']}
      style={styles.container}
    >
      <Text style={styles.title}>Comments</Text>
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No comments yet.</Text>}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitComment}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4A90E2',
  },
  commentItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
    paddingBottom: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  commentInfo: {
    flex: 1,
  },
  commentUser: {
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  commentDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  commentText: {
    marginLeft: 48,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#8E8E93',
  },
  inputContainer: {
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E8ED',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default CommentsScreen;