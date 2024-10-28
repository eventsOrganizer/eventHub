import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../services/supabaseClient';
import { Ionicons } from '@expo/vector-icons';
import UserAvatar from './UserAvatar';
import { useUser } from '../../UserContext';
import tw from 'twrnc';

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

  return (
    <LinearGradient
      colors={['#4B0082', '#0066CC']}
      style={tw`p-4 rounded-xl mt-4 shadow-lg`}
    >
      <View style={tw`flex-row items-center mb-4`}>
        <Ionicons name="chatbubbles" size={24} color="white" />
        <Text style={tw`text-lg font-bold text-white ml-2`}>
          Comments ({comments.length})
        </Text>
      </View>

      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <View style={tw`mb-4`}>
            <View style={tw`flex-row`}>
              <UserAvatar 
                userId={item.user_id} 
                size={40} 
                style={tw`border-2 border-white shadow-lg`}
              />
              <View style={tw`ml-3 flex-1`}>
                <View style={tw`bg-white/20 p-3 rounded-lg`}>
                  <Text style={tw`text-white`}>{item.details}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => setReplyingTo(item.id)}
                  style={tw`mt-1.5`}
                >
                  <Text style={tw`text-white/70 text-sm`}>Reply</Text>
                </TouchableOpacity>
              </View>
            </View>

            {item.replies && item.replies.length > 0 && (
              <View style={tw`ml-12 mt-2`}>
                {item.replies.map(reply => (
                  <View key={reply.id} style={tw`flex-row mb-3`}>
                    <UserAvatar 
                      userId={reply.user_id} 
                      size={32} 
                      style={tw`border-2 border-white shadow-lg`}
                    />
                    <View style={tw`ml-2 flex-1`}>
                      <View style={tw`bg-white/10 p-2.5 rounded-lg`}>
                        <Text style={tw`text-white text-sm`}>{reply.details}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        style={tw`max-h-80`}
      />

      <View style={tw`flex-row items-center mt-4`}>
        <TextInput
          style={tw`flex-1 bg-white/20 px-4 py-3 rounded-lg text-white`}
          placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity 
          style={tw`ml-2 bg-white/20 px-4 py-3 rounded-lg`}
          onPress={handleSubmitComment}
        >
          <Text style={tw`text-white font-medium`}>
            {replyingTo ? "Reply" : "Send"}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default CommentsSection;