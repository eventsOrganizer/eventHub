import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator 
} from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';
import { useMessageNotifications } from '../../hooks/useMessageNotifications';
import debounce from 'lodash/debounce';
import { useNavigation } from '@react-navigation/native';
interface Message {
  id: string;
  content: string;
  user_id: string;
  chatroom_id: string;
  created_at: string;
  seen: boolean;
}

interface User {
  id: string;
  firstname: string;
  lastname: string;
}

const ChatRoomScreen: React.FC<{ route: { params: { organizerId: string } } }> = ({ route }) => {
  const { organizerId } = route.params;
  const { userId } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const messageUpdateQueue = useRef<string[]>([]);
  const lastFetch = useRef<number>(0);
  const [otherUser, setOtherUser] = useState<User | null>(null);

  const { markChatAsRead } = useMessageNotifications(userId);
  const navigation = useNavigation();


  const fetchOrCreateChatRoom = useCallback(async () => {
    if (!userId) {
      console.error('No user ID available');
      return;
    }

    try {
      let { data: chatRoom, error } = await supabase
        .from('chatroom')
        .select('*')
        .eq('type', 'private')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .or(`user1_id.eq.${organizerId},user2_id.eq.${organizerId}`)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!chatRoom) {
        const { data: newChatRoom, error: createError } = await supabase
          .from('chatroom')
          .insert([
            { type: 'private', user1_id: userId, user2_id: organizerId }
          ])
          .select()
          .single();

        if (createError) throw createError;
        chatRoom = newChatRoom;
      }

      setChatRoomId(chatRoom.id);
    } catch (error) {
      console.error('Error in fetchOrCreateChatRoom:', error);
    }
  }, [userId, organizerId]);


  const fetchOtherUserDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('user')
        .select('id, firstname, lastname')
        .eq('id', organizerId)
        .single();

      if (error) throw error;
      if (data) setOtherUser(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    fetchOtherUserDetails();
    
    // Set the navigation header
    if (otherUser) {
      navigation.setOptions({
        headerTitle: () => (
          <Text style={{ color: '#2563eb', fontSize: 24, fontWeight: 'bold' }}>
            {`${otherUser.firstname} ${otherUser.lastname}`}
          </Text>
        ),
      });
    }
  }, [otherUser, navigation]);

  const fetchMessages = useCallback(async () => {
    if (!chatRoomId) return;
    
    const now = Date.now();
    if (now - lastFetch.current < 1000) return;
    lastFetch.current = now;

    try {
      const { data, error } = await supabase
        .from('message')
        .select('*')
        .eq('chatroom_id', chatRoomId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      if (data) {
        setMessages(data);
        const unseenMessages = data
          .filter(msg => msg.user_id !== userId && !msg.seen)
          .map(msg => msg.id);
        
        if (unseenMessages.length > 0) {
          messageUpdateQueue.current = unseenMessages;
          debouncedUpdateSeenStatus();
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [chatRoomId, userId]);

  const debouncedUpdateSeenStatus = useCallback(
    debounce(async () => {
      if (messageUpdateQueue.current.length === 0) return;
      
      const messageIds = [...messageUpdateQueue.current];
      messageUpdateQueue.current = [];

      try {
        await supabase
          .from('message')
          .update({ seen: true })
          .in('id', messageIds);
        await markChatAsRead(chatRoomId!);
      } catch (error) {
        console.error('Error updating seen status:', error);
      }
    }, 1000),
    [chatRoomId, markChatAsRead]
  );

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatRoomId || isSending) return;

    setIsSending(true);
    try {
      const messageContent = newMessage.trim();
      setNewMessage('');

      const { data, error } = await supabase
        .from('message')
        .insert([{
          content: messageContent,
          chatroom_id: chatRoomId,
          user_id: userId,
          seen: false
        }])
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(newMessage); // Restore message if send fails
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    fetchOrCreateChatRoom();
  }, [fetchOrCreateChatRoom]);

  useEffect(() => {
    if (!chatRoomId) return;

    fetchMessages();
    
    const channel = supabase
      .channel(`chatroom:${chatRoomId}`)
// Update the subscription handler (around line 175-190)
.on('postgres_changes', { 
  event: '*', 
  schema: 'public', 
  table: 'message', 
  filter: `chatroom_id=eq.${chatRoomId}` 
}, payload => {
  if (payload.eventType === 'INSERT') {
    setMessages(prev => {
      // Check if message already exists
      const messageExists = prev.some(msg => msg.id === payload.new.id);
      if (messageExists) return prev;
      return [...prev, payload.new];
    });
    flatListRef.current?.scrollToEnd({ animated: true });
    
    if (payload.new.user_id !== userId) {
      messageUpdateQueue.current.push(payload.new.id);
      debouncedUpdateSeenStatus();
    }
  }
})
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatRoomId, fetchMessages, userId, debouncedUpdateSeenStatus]);

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={item.user_id === userId ? styles.sentMessage : styles.receivedMessage}>
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={isSending || !newMessage.trim()}
        >
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    paddingVertical: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
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
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#00CED1',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#FFD700',
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

export default ChatRoomScreen