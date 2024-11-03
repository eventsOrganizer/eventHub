import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';
import { useToast } from '../../hooks/useToast';
import { LinearGradient } from 'expo-linear-gradient';

// Define the Comment interface
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

const LocalCommentsScreen = () => {
  const route = useRoute();
  const { localId } = route.params as { localId: number };
  console.log('localId:', localId); // Log the localId to check its value
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
      .select(`id, details, user_id, created_at, user:user_id (username, media:media(url))`)
      .eq('local_id', localId)
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
        local_id: localId,
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
      return `Il y a ${diffInSeconds} seconde${diffInSeconds > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    } else {
      return commentDate.toLocaleDateString('fr-FR');
    }
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <Image 
          source={{ 
            uri: item.user.media?.[0]?.url || 'https://via.placeholder.com/40'
          }} 
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
      <Text style={styles.title}>Commentaires</Text>
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucun commentaire pour le moment.</Text>}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Écrivez un commentaire..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity 
          style={[styles.submitButton, !newComment.trim() && styles.submitButtonDisabled]}
          onPress={handleSubmitComment}
          disabled={!newComment.trim()}
        >
          <Text style={styles.submitButtonText}>Envoyer</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    borderWidth: 2,
    borderColor: '#4A90E2',
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 16,
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
  submitButtonDisabled: {
    backgroundColor: '#A0A0A0',
    opacity: 0.7,
  },
});

export default LocalCommentsScreen;
