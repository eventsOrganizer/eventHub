import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../services/supabaseClient';
import { useUser } from '.././UserContext';
import UserAvatar from '../components/event/UserAvatar';

interface Message {
  id: number;
  user_id: string;
  content: string;
  created_at: string;
}

const EventChat: React.FC<{ eventId: number }> = ({ eventId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { userId } = useUser();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchOrCreateChatRoom();
  }, [eventId]);

  const fetchOrCreateChatRoom = async () => {
    let { data: chatroom, error } = await supabase
      .from('chatroom')
      .select('id')
      .eq('event_id', eventId)
      .eq('type', 'public')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching chatroom:', error);
      return;
    }

    if (!chatroom) {
      const { data: newChatroom, error: createError } = await supabase
        .from('chatroom')
        .insert({ event_id: eventId, type: 'public' })
        .select()
        .single();

      if (createError) {
        console.error('Error creating chatroom:', createError);
        return;
      }

      chatroom = newChatroom;
    }

    if (chatroom) {
      fetchMessages(chatroom.id);
      subscribeToMessages(chatroom.id);
    }
  };

  const fetchMessages = async (chatroomId: number) => {
    const { data, error } = await supabase
      .from('message')
      .select('*')
      .eq('chatroom_id', chatroomId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data.reverse());
    }
  };

  const subscribeToMessages = (chatroomId: number) => {
    const channel = supabase
      .channel(`public:${chatroomId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'message', filter: `chatroom_id=eq.${chatroomId}` }, (payload: any) => {
        setMessages(prevMessages => [...prevMessages, payload.new as Message]);
        flatListRef.current?.scrollToEnd({ animated: true });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!userId || !newMessage.trim()) return;

    const { data: chatroom } = await supabase
      .from('chatroom')
      .select('id')
      .eq('event_id', eventId)
      .eq('type', 'public')
      .single();

    if (!chatroom) return;

    const { error } = await supabase
      .from('message')
      .insert({ chatroom_id: chatroom.id, user_id: userId, content: newMessage.trim() });

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={styles.messageContainer}>
      <UserAvatar userId={item.user_id} size={30} />
      <View style={styles.messageContent}>
        <Text style={styles.messageText}>{item.content}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Chat</Text>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        style={styles.chatList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chatList: {
    flex: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  messageContent: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 10,
    marginLeft: 10,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EventChat;