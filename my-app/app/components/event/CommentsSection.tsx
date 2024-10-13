import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../services/supabaseClient';
import UserAvatar from './UserAvatar';
import { useUser } from '../../UserContext';

interface Comment {
  id: number;
  user_id: string;
  details: string;
  event_id: number;
  parent_id: number | null;
  replies?: Comment[];
}

const CommentsSection: React.FC<{ eventId: number }> = ({ eventId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const { userId } = useUser();

  useEffect(() => {
    fetchComments();
  }, [eventId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comment')
      .select('*')
      .eq('event_id', eventId)
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      const commentsTree = buildCommentsTree(data as Comment[]);
      setComments(commentsTree);
    }
  };

  const buildCommentsTree = (flatComments: Comment[]): Comment[] => {
    const commentMap = new Map<number, Comment>();
    const rootComments: Comment[] = [];

    flatComments.forEach(comment => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
      
      if (comment.parent_id === null) {
        rootComments.push(comment);
      } else {
        const parentComment = commentMap.get(comment.parent_id);
        if (parentComment) {
          parentComment.replies?.push(comment);
        }
      }
    });

    return rootComments;
  };

  const handleSubmitComment = async () => {
    if (!userId || !newComment.trim()) return;

    const { data, error } = await supabase
      .from('comment')
      .insert({
        event_id: eventId,
        user_id: userId,
        details: newComment.trim(),
        parent_id: replyingTo
      })
      .select();

    if (error) {
      console.error('Error submitting comment:', error);
    } else if (data) {
      setNewComment('');
      setReplyingTo(null);
      fetchComments();
    }
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <UserAvatar userId={item.user_id} size={40} />
      <View style={styles.commentContent}>
        <Text style={styles.commentText}>{item.details}</Text>
        <TouchableOpacity onPress={() => setReplyingTo(item.id)}>
          <Text style={styles.replyButton}>Reply</Text>
        </TouchableOpacity>
        {item.replies && item.replies.length > 0 && (
          <FlatList
            data={item.replies}
            renderItem={renderComment}
            keyExtractor={(reply) => reply.id.toString()}
            style={styles.repliesList}
          />
        )}
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#FF8C00', '#FFA500']}
      style={styles.container}
    >
      <Text style={styles.title}>Comments</Text>
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id.toString()}
        style={styles.commentList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
          placeholderTextColor="#fff"
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitComment}>
          <Text style={styles.submitButtonText}>{replyingTo ? "Reply" : "Submit"}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  commentList: {
    maxHeight: 300,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  commentContent: {
    marginLeft: 10,
    flex: 1,
  },
  commentText: {
    color: '#fff',
  },
  replyButton: {
    color: '#eee',
    fontSize: 12,
    marginTop: 5,
  },
  replyItem: {
    flexDirection: 'row',
    marginTop: 5,
    marginLeft: 20,
  },
  replyContent: {
    marginLeft: 5,
    flex: 1,
  },
  replyText: {
    color: '#fff',
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    padding: 10,
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FF8C00',
    fontWeight: 'bold',
  },
  repliesList: {
    marginLeft: 20,
    marginTop: 10,
  },
});

export default CommentsSection;