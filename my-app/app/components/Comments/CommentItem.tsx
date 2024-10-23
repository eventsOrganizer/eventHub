import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Avatar, IconButton } from 'react-native-paper';
import { Heart, Share2, MoreVertical } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Comment } from '../../types/comment';

interface CommentItemProps {
  item: Comment;
  index: number;
}

export const CommentItem = ({ item, index }: CommentItemProps) => {
  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 100)}
      style={styles.commentItem}
    >
      <View style={styles.commentHeader}>
        <Avatar.Image 
          size={45} 
          source={{ uri: `https://ui-avatars.com/api/?name=${item.user?.firstname}+${item.user?.lastname}&background=random` }} 
        />
        <View style={styles.commentHeaderText}>
          <Text style={styles.commenterName}>
            {`${item.user?.firstname || 'Unknown'} ${item.user?.lastname || 'User'}`}
          </Text>
          <Text style={styles.commentTime}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <IconButton
          icon={() => <MoreVertical size={20} color="#666" />}
          onPress={() => {}}
          style={styles.moreButton}
        />
      </View>
      <Text style={styles.commentText}>{item.details}</Text>
      <View style={styles.commentActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Heart size={18} color="#666" />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Share2 size={18} color="#666" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  commentItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  commenterName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  moreButton: {
    marginLeft: 'auto',
  },
  commentActions: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    padding: 4,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
});