import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { useToast } from '../../hooks/useToast';

interface Comment {
  id: number;
  details: string;
  user_id: string;
  created_at: string;
}

interface CommentSectionProps {
  comments: Comment[];
  personalId: number;
  userId: string | null;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, personalId, userId }) => {
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();

  const handleAddComment = async () => {
    if (!userId) {
      toast({
        title: "Authentification requise",
        description: "Please log in to add a comment.",
        variant: "default",
      });
      return;
    }

    if (newComment.trim() === '') {
      toast({
        title: "Error",
        description: "Comment cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('comment')
        .insert({
          personal_id: personalId,
          user_id: userId,
          details: newComment.trim()
        })
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your comment has been added successfully.",
        variant: "default",
      });
      setNewComment('');
      // Vous devriez probablement mettre à jour la liste des commentaires ici
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "An error occurred while adding the comment.",
        variant: "destructive",
      });
    }
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentText}>{item.details}</Text>
      <Text style={styles.commentDate}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments</Text>
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No comments yet.</Text>}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddComment}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  commentItem: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  commentText: {
    color: '#1f2937',
  },
  commentDate: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    color: '#6b7280',
  },
  inputContainer: {
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CommentSection;