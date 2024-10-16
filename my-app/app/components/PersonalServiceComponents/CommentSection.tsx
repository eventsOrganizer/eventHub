import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { addComment } from '../../services/interactionService';

interface CommentType {
  details: string;
  user_id: string;
  user?: {
    username: string;
  };
}

interface CommentSectionProps {
  comments: CommentType[] | undefined;
  personalId: number;
  userId: string | null;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, personalId, userId }) => {
  const [comment, setComment] = useState('');

  const handleAddComment = async () => {
    if (comment.trim() && userId) {
      const result = await addComment(personalId, userId, comment);
      if (result) {
        // Update comments locally or refetch data
        setComment('');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Comments</Text>
      {comments?.map((comment, index) => (
        <View key={index} style={styles.commentContainer}>
          <Text style={styles.commentUser}>{comment.user?.username || 'Anonymous'}</Text>
          <Text>{comment.details}</Text>
        </View>
      ))}
      {userId && (
        <View style={styles.addCommentContainer}>
          <TextInput
            style={styles.commentInput}
            value={comment}
            onChangeText={setComment}
            placeholder="Add a comment..."
          />
          <TouchableOpacity onPress={handleAddComment} style={styles.addCommentButton}>
            <Text style={styles.addCommentButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  commentContainer: {
    marginBottom: 8,
  },
  commentUser: {
    fontWeight: 'bold',
  },
  addCommentContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  addCommentButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCommentButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CommentSection;