import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';

const ChatRoomScreen: React.FC<{ route: { params: { organizerId: string } } }> = ({ route }) => {
  const { organizerId } = route.params;
  const { userId } = useUser();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const fetchOrCreateChatRoom = useCallback(async () => {
    if (!userId) {
      console.error('No user ID available');
      return;
    }

    console.log('Fetching or creating chat room for:', { userId, organizerId });

    let { data: chatRoom, error } = await supabase
      .from('chatroom')
      .select('*')
      .eq('type', 'private')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .or(`user1_id.eq.${organizerId},user2_id.eq.${organizerId}`)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching chat room:', error);
      return;
    }

    if (!chatRoom) {
      console.log('Chat room not found, creating a new one');
      const { data: newChatRoom, error: createError } = await supabase
        .from('chatroom')
        .insert([
          { type: 'private', user1_id: userId, user2_id: organizerId }
        ])
        .select()
        .single();

      if (createError) {
        console.error('Error creating chat room:', createError);
        return;
      }

      chatRoom = newChatRoom;
    }

    console.log('Chat room:', chatRoom);
    setChatRoomId(chatRoom.id);
  }, [userId, organizerId]);

  const fetchMessages = useCallback(async (roomId: string) => {
    const { data, error } = await supabase
      .from('message')
      .select('*')
      .eq('chatroom_id', roomId)
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data);
    }
  }, []);

  useEffect(() => {
    fetchOrCreateChatRoom();
  }, [fetchOrCreateChatRoom]);

  useEffect(() => {
    if (!chatRoomId) return;
  
    fetchMessages(chatRoomId);
  
    const channel = supabase
      .channel(`chatroom:${chatRoomId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'message', filter: `chatroom_id=eq.${chatRoomId}` }, payload => {
        console.log('Received real-time update:', payload);
        if (payload.eventType === 'INSERT') {
          setMessages(prevMessages => [...prevMessages, payload.new]);
          flatListRef.current?.scrollToEnd({ animated: true });
        }
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });
  
    return () => {
      console.log('Unsubscribing from channel');
      supabase.removeChannel(channel);
    };
  }, [chatRoomId, fetchMessages]);

  const sendMessage = async () => {
    if (newMessage.trim() === '' || !chatRoomId || !userId) {
      console.log('Cannot send message: ', { newMessage, chatRoomId, userId });
      return;
    }
  
    console.log('Sending message:', { chatRoomId, userId, content: newMessage });
  
    const { error } = await supabase
      .from('message')
      .insert([
        { chatroom_id: chatRoomId, user_id: userId, content: newMessage }
      ]);
  
    if (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
    } else {
      console.log('Message sent successfully');
      setNewMessage('');
    }
  };

  const renderMessage = ({ item }: { item: any }) => (
    <View style={item.user_id === userId ? styles.sentMessage : styles.receivedMessage}>
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#FFA500',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    maxWidth: '70%',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    maxWidth: '70%',
  },
  messageText: {
    fontSize: 16,
  },
});

export default ChatRoomScreen;