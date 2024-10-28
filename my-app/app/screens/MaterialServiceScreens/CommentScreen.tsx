import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, FlatList, SafeAreaView } from 'react-native';
import { StackScreenProps } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../../navigation/types';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';
import { Comment } from '../../types/comment';
import { CommentItem } from '../../components/Comments/CommentItem';
import { CommentHeader } from '../../components/Comments/CommentHeader';
import { AuthModal } from '../../components/Comments/AuthModal';
import { useToast } from '../../hooks/use-toast';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

type CommentScreenProps = StackScreenProps<RootStackParamList, 'CommentScreen'>;

const CommentScreen: React.FC<CommentScreenProps> = ({ route, navigation }) => {
  const { materialId } = route.params as { materialId: string };
  const { userId } = useUser();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('comment')
        .select(`
          id,
          details,
          created_at,
          user:user_id (
            id,
            firstname,
            lastname,
            email
          )
        `)
        .eq('material_id', materialId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedComments = data.map(comment => ({
        id: comment.id,
        details: comment.details,
        created_at: comment.created_at,
        user: {
          id: comment.user.id,
          firstname: comment.user.firstname || 'Anonymous',
          lastname: comment.user.lastname || 'User',
          email: comment.user.email,
          avatarUrl: `https://ui-avatars.com/api/?name=${
            encodeURIComponent(comment.user.firstname || 'A')
          }+${
            encodeURIComponent(comment.user.lastname || 'U')
          }&background=random&size=128`
        }
      }));

      setComments(formattedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!userId) {
      setIsAuthModalVisible(true);
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('comment')
        .insert({
          material_id: materialId,
          user_id: userId,
          details: newComment.trim(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment posted successfully",
      });
      
      await fetchComments();
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      {[1, 2, 3].map((_, index) => (
        <View key={index} style={styles.shimmer}>
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{ flex: 1 }}
          />
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient 
        colors={['#7E57C2', '#4A90E2']} 
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />
        <FlatList
          data={comments}
          renderItem={({ item, index }) => (
            <CommentItem 
              item={item} 
              index={index}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <CommentHeader
              onBack={() => navigation.goBack()}
              newComment={newComment}
              onChangeComment={setNewComment}
              onSubmitComment={handleSubmitComment}
            />
          }
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={isLoading ? renderEmptyComponent : null}
        />
        <AuthModal
          visible={isAuthModalVisible}
          onClose={() => setIsAuthModalVisible(false)}
          onSignIn={() => {
            setIsAuthModalVisible(false);
            navigation.navigate('signin' as never);
          }}
          onSignUp={() => {
            setIsAuthModalVisible(false);
            navigation.navigate('signup' as never);
          }}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#7E57C2',
  },
  container: {
    flex: 1,
  },
  emptyContainer: {
    padding: 20,
  },
  shimmer: {
    height: 100,
    borderRadius: 16,
    marginBottom: 16,
  },
  listContentContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 16,
    minHeight: '100%',
  },
});

export default CommentScreen;