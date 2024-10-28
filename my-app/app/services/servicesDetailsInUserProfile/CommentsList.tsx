import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { fetchServiceComments } from '../../services/serviceQueries';
import { useToast } from '../../hooks/useToast';

interface CommentListProps {
  serviceId: number;
  serviceType: 'Personal' | 'Local' | 'Material';
}

interface Comment {
  id: number;
  details: string;
  created_at: string;
  user?: {
    id?: number; 
    username?: string;
    firstname?: string;
    lastname?: string;
  };
}

const CommentList: React.FC<CommentListProps> = ({ serviceId, serviceType }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchServiceComments(serviceId, serviceType);
        setComments(data.map(comment => ({
          ...comment,
          user: Array.isArray(comment.user) ? comment.user[0] : comment.user
        })) || []);
      } catch (error) {
        console.error('Error loading comments:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les commentaires",
          variant: "destructive"
        });
      }
    };

    loadComments();
  }, [serviceId, serviceType]);

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <Text style={styles.username}>
          {item.user?.username || `${item.user?.firstname} ${item.user?.lastname}` || 'Utilisateur anonyme'}
        </Text>
        <Text style={styles.date}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.commentText}>{item.details}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Commentaires ({comments.length})</Text>
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucun commentaire pour le moment</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  commentItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  username: {
    fontWeight: 'bold',
  },
  date: {
    color: '#666',
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#666',
  },
});

export default CommentList;