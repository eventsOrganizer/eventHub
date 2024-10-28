import React, { useState, useCallback, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { supabase } from '../../services/supabaseClient';

interface LocalCommentInputProps {
  localId: number;
  userId: string | null;
  toast: (props: { title: string; description: string; variant: "default" | "destructive" }) => void;
  onCommentAdded: (newComment: any) => void;
}

const LocalCommentInput: React.FC<LocalCommentInputProps> = ({ localId, userId, toast, onCommentAdded }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleAddComment = useCallback(async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
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

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('comment')
        .insert({
          local_id: localId,
          user_id: userId,
          details: newComment.trim()
        })
        .select('*, user:user_id (username)')
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your comment has been added successfully.",
        variant: "default",
      });
      setNewComment('');
      onCommentAdded(data);
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "An error occurred while adding the comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [newComment, localId, userId, toast, onCommentAdded]);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Add a comment..."
        value={newComment}
        onChangeText={setNewComment}
        multiline
        editable={!isSubmitting}
      />
      <TouchableOpacity 
        style={[styles.addButton, isSubmitting && styles.disabledButton]}
        onPress={handleAddComment}
        disabled={isSubmitting}
      >
        <Text style={styles.addButtonText}>
          {isSubmitting ? 'Sending...' : 'Add'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LocalCommentInput;