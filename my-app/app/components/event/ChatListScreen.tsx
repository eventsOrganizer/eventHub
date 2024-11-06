import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

interface ChatRoomItemProps {
  item: any;
  userId: string;
  onPress: () => void;
}

const ChatRoomItem = React.memo(({ item, userId, onPress }: ChatRoomItemProps) => {
  const otherUser = item.user1_id === userId ? item.user2 : item.user1;
  const [isConnected, setIsConnected] = useState(false);
  const [lastSeen, setLastSeen] = useState<string | null>(null);

  useEffect(() => {
    if (!otherUser.id) return;

    const channel = supabase
      .channel(`public:user:${otherUser.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user',
          filter: `id=eq.${otherUser.id}`
        },
        (payload) => {
          if (payload.new) {
            const online = Boolean(payload.new.is_connected);
            console.log(`User ${otherUser.email} status update:`, online ? 'ONLINE' : 'OFFLINE');
            
            // If user disconnects, immediately update status and last seen
            if (!online) {
              setIsConnected(false);
              setLastSeen(payload.new.last_seen);
            } else {
              setIsConnected(true);
              setLastSeen(null);
            }
          }
        }
      )
      .subscribe();

    // Initial fetch
    fetchUserStatus();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [otherUser.id]);

  const fetchUserStatus = async () => {
    const { data, error } = await supabase
      .from('user')
      .select('is_connected, last_seen')
      .eq('id', otherUser.id)
      .single();

    if (!error && data) {
      const online = Boolean(data.is_connected);
      console.log(`Initial status for ${otherUser.email}:`, online ? 'ONLINE' : 'OFFLINE');
      
      if (!online) {
        setIsConnected(false);
        setLastSeen(data.last_seen);
      } else {
        setIsConnected(true);
        setLastSeen(null);
      }
    }
  };

  // Rest of the component remains the same
  return (
    <TouchableOpacity onPress={onPress} style={tw`mb-4 overflow-hidden rounded-xl`}>
      <BlurView intensity={20} style={tw`p-4`}>
        <View style={tw`flex-row items-center`}>
          <View style={tw`relative`}>
            <View style={tw`w-12 h-12 rounded-full bg-gray-700 items-center justify-center`}>
              <Text style={tw`text-white text-lg`}>
                {otherUser.email.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={tw`absolute bottom-0 right-0 w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
          </View>
          
          <View style={tw`ml-4 flex-1`}>
            <Text style={tw`text-white text-lg font-bold`}>
              {otherUser.email}
            </Text>
            {!isConnected && lastSeen && (
              <Text style={tw`text-gray-400 text-sm`}>
                Last seen {new Date(lastSeen).toLocaleString()}
              </Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </View>
      </BlurView>
    </TouchableOpacity>
  );
});

const ChatListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useUser();

  useEffect(() => {
    if (userId) {
      fetchChatRooms();
    }
  }, [userId]);

  const fetchChatRooms = async () => {
    if (!userId) {
      console.error('No user ID available');
      return;
    }

    console.log('Fetching chat rooms for user:', userId);

    const { data, error } = await supabase
      .from('chatroom')
      .select(`
        *,
        user1:user1_id(id, email),
        user2:user2_id(id, email)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('type', 'private');

    if (error) {
      console.error('Error fetching chat rooms:', error);
    } else {
      console.log('Fetched chat rooms:', data);
      setChatRooms(data);
    }
    setLoading(false);
  };

  const renderChatRoom = ({ item }: { item: any }) => {
    if (!userId) return null;
    return (
      <ChatRoomItem
        item={item}
        userId={userId}
        onPress={() => {
          const otherUser = item.user1_id === userId ? item.user2 : item.user1;
          navigation.navigate('ChatRoom', { organizerId: otherUser.id });
        }}
      />
    );
  };

  return (
    <LinearGradient
      colors={['#1e1e1e', '#0f0f0f']}
      style={tw`flex-1`}
    >
      <View style={tw`flex-1 px-4 pt-4`}>
        <Text style={tw`text-white text-2xl font-bold mb-6`}>Messages</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={tw`mt-8`} />
        ) : chatRooms.length === 0 ? (
          <View style={tw`flex-1 items-center justify-center`}>
            <Ionicons name="chatbubbles-outline" size={48} color="#666" />
            <Text style={tw`text-gray-400 text-lg mt-4`}>No conversations yet</Text>
          </View>
        ) : (
          <FlatList
            data={chatRooms}
            renderItem={renderChatRoom}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </LinearGradient>
  );
};

export default ChatListScreen;




