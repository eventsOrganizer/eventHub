import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { useToast } from '../../hooks/useToast';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';

interface Comment {
  id: number;
  details: string;
  user_id: string;
  created_at: string;
  user: {
    username: string;
  };
}

interface CommentSectionProps {
  personalId: number;
  userId: string | null;
}

const CommentSection: React.FC<CommentSectionProps> = ({ personalId, userId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [personalId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comment')
        .select(`
          id,
          details,
          user_id,
          created_at,
          user:user_id (username)
        `)
        .eq('personal_id', personalId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure that the data matches the Comment interface
      const typedComments: Comment[] = (data || []).map(comment => ({
        id: comment.id,
        details: comment.details,
        user_id: comment.user_id,
        created_at: comment.created_at,
        user: {
          username: comment.user[0]?.username || 'Anonymous'
        }
      }));
      
      setComments(typedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commentaires.",
        variant: "destructive",
      });
    }
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <CommentItem comment={item} />
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <Text style={styles.title}>Commentaires</Text>
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucun commentaire pour le moment.</Text>}
        style={styles.commentList}
        contentContainerStyle={styles.commentListContent}
      />
      <CommentInput personalId={personalId} userId={userId} toast={toast} onCommentAdded={fetchComments} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  commentList: {
    flex: 1,
  },
  commentListContent: {
    flexGrow: 1,
  },
  emptyText: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CommentSection;