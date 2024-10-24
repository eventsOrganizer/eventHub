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

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

type CommentScreenProps = StackScreenProps<RootStackParamList, 'CommentScreen'>;

const CommentScreen: React.FC<CommentScreenProps> = ({ route, navigation }) => {
  const { materialId } = route.params as { materialId: string };
  const { userId } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comment')
      .select(`
        id,
        user_id,
        details,
        created_at,
        user:user_id (firstname, lastname)
      `)
      .eq('material_id', materialId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setComments(data.map(comment => ({
        ...comment,
        user: comment.user?.[0] || { firstname: 'Unknown', lastname: 'User' }
      })));
    }
  };

  const handleSubmitComment = async () => {
    if (!userId) {
      setIsAuthModalVisible(true);
      return;
    }

    const { error } = await supabase
      .from('comment')
      .insert({
        material_id: materialId,
        user_id: userId,
        details: newComment,
      });

    if (error) {
      console.error('Error submitting comment:', error);
    } else {
      fetchComments();
      setNewComment('');
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
            <CommentItem item={item} index={index} />
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
          ListEmptyComponent={renderEmptyComponent}
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
