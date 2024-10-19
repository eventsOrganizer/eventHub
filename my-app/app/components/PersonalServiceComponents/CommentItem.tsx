import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CommentItemProps {
  comment: {
    details: string;
    created_at: string;
    user?: {
      username?: string;
    };
  };
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return 'Date inconnue';
  };

  return (
    <View style={styles.commentItem}>
      <Text style={styles.username}>{comment.user?.username || 'Utilisateur anonyme'}</Text>
      <Text style={styles.commentText}>{comment.details}</Text>
      <Text style={styles.commentDate}>
        {formatDate(comment.created_at)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  commentItem: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#4B5563',
  },
  commentText: {
    color: '#1f2937',
    marginBottom: 4,
  },
  commentDate: {
    color: '#6b7280',
    fontSize: 12,
  },
});

export default CommentItem;