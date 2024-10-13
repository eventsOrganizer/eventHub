import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';

const ChatListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [chatRooms, setChatRooms] = useState<any[]>([]);
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
  };

  const renderChatRoom = ({ item }: { item: any }) => {
    if (!userId) return null;
    const otherUser = item.user1_id === userId ? item.user2 : item.user1;

    console.log('Rendering chat room:', item);
    console.log('Other user:', otherUser);

    return (
      <TouchableOpacity
        style={styles.chatRoomItem}
        onPress={() => navigation.navigate('ChatRoom', { organizerId: otherUser.id })}
      >
        <Text style={styles.chatRoomName}>{ otherUser.email}</Text>
        <Text style={styles.chatRoomEmail}>{otherUser.email}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Conversations</Text>
      {chatRooms.length === 0 ? (
        <Text style={styles.emptyText}>No conversations yet</Text>
      ) : (
        <FlatList
          data={chatRooms}
          renderItem={renderChatRoom}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  chatRoomItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  chatRoomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chatRoomEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ChatListScreen;