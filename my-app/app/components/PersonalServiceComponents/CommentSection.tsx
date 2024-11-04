import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { useToast } from '../../hooks/useToast';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';
import { theme } from '../../../lib/theme';
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
  comments: Array<{
    user: { username: string };
    id: number;
    details: string;
    user_id: string;
    created_at: string;
    personal_id: number;
  }>;
  personalId: number;
  userId: string | null;
}

const CommentSection: React.FC<CommentSectionProps> = ({ personalId, userId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const { toast } = useToast();
  const flatListRef = useRef<FlatList>(null);

  const fetchComments = useCallback(async () => {
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
  }, [personalId, toast]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const renderComment = useCallback(({ item }: { item: Comment }) => (
    <CommentItem comment={item} />
  ), []);

  const handleCommentAdded = useCallback((newComment: Comment) => {
    setComments(prevComments => [newComment, ...prevComments]);
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, []);

  const ListHeaderComponent = useCallback(() => (
    <Text style={styles.title}>Commentaires</Text>
  ), []);

  const ListEmptyComponent = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Aucun commentaire pour le moment.</Text>
    </View>
  ), []);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <FlatList
            ref={flatListRef}
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.commentList}
            ListHeaderComponent={ListHeaderComponent}
            ListEmptyComponent={ListEmptyComponent}
          />
          <View style={styles.inputWrapper}>
            <CommentInput 
              personalId={personalId} 
              userId={userId} 
              toast={toast} 
              onCommentAdded={handleCommentAdded} 
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gradientStart,
  },
  inner: {
    flex: 1,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.personalDetailTitle,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  commentList: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.cardDescription,
    textAlign: 'center',
  },
  inputWrapper: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.personalDetailBg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.personalDetailBorder,
    shadowColor: theme.colors.personalDetailShadow,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default CommentSection;