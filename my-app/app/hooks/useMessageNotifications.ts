import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import debounce from 'lodash/debounce';

interface Message {
  id: string;
  user_id: string;
  seen: boolean;
  chatroom_id: string;
}

interface Chatroom {
  id: string;
  user1_id: string;
  user2_id: string;
  messages?: Message[];
}

export const useMessageNotifications = (userId: string | null) => {
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [unreadByUser, setUnreadByUser] = useState<{[key: string]: number}>({});
  const lastFetchTime = useRef<number>(0);
  const cacheTimeout = 1000; // 1 second cache
  const pendingUpdates = useRef<Set<string>>(new Set());

  // Cache the unread counts in memory
  const countsCache = useRef<{
    counts: {[key: string]: number};
    total: number;
    timestamp: number;
  }>({
    counts: {},
    total: 0,
    timestamp: 0
  });

  const fetchUnreadMessages = async () => {
    if (!userId) return;

    // Check if we can use cached data
    const now = Date.now();
    if (now - lastFetchTime.current < cacheTimeout) {
      console.log('Using cached unread counts');
      return;
    }

    console.log('Fetching unread messages for user:', userId);
    lastFetchTime.current = now;

    const { data: chatrooms, error } = await supabase
      .from('chatroom')
      .select(`
        id,
        user1_id,
        user2_id,
        messages:message (
          id,
          user_id,
          seen,
          chatroom_id
        )
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('type', 'private');

    if (error) {
      console.error('Error fetching chatrooms:', error);
      return;
    }

    const counts: {[key: string]: number} = {};
    let total = 0;

    chatrooms?.forEach(chatroom => {
      if (!chatroom.messages) return;
      
      const unreadMessages = chatroom.messages.filter(msg => 
        msg.user_id !== userId && 
        !msg.seen && 
        !pendingUpdates.current.has(msg.id)
      );

      if (unreadMessages.length > 0) {
        const senderId = unreadMessages[0].user_id;
        counts[senderId] = (counts[senderId] || 0) + unreadMessages.length;
        total += unreadMessages.length;
      }
    });

    // Update cache
    countsCache.current = {
      counts,
      total,
      timestamp: now
    };

    setUnreadByUser(counts);
    setTotalUnreadCount(total);
  };

  // Debounced version of fetchUnreadMessages
  const debouncedFetch = useCallback(
    debounce(fetchUnreadMessages, 500, { maxWait: 2000 }),
    [userId]
  );

  const markChatAsRead = async (chatroomId: string) => {
    if (!userId || !chatroomId) return;

    // Optimistically update UI
    const { data: messages } = await supabase
      .from('message')
      .select('id, user_id')
      .eq('chatroom_id', chatroomId)
      .neq('user_id', userId)
      .eq('seen', false);

    if (messages) {
      messages.forEach(msg => pendingUpdates.current.add(msg.id));
      
      // Optimistically update counts
      const senderId = messages[0]?.user_id;
      if (senderId) {
        const newCounts = { ...unreadByUser };
        const messageCount = messages.length;
        newCounts[senderId] = Math.max(0, (newCounts[senderId] || 0) - messageCount);
        setUnreadByUser(newCounts);
        setTotalUnreadCount(prev => Math.max(0, prev - messageCount));
      }
    }

    // Perform actual update
    const { error } = await supabase
      .from('message')
      .update({ seen: true })
      .eq('chatroom_id', chatroomId)
      .neq('user_id', userId)
      .eq('seen', false);

    if (error) {
      console.error('Error marking messages as read:', error);
      // Revert optimistic update on error
      fetchUnreadMessages();
    } else {
      // Clear pending updates
      messages?.forEach(msg => pendingUpdates.current.delete(msg.id));
    }
  };

  const forceRefreshUnreadCounts = useCallback(async () => {
    if (!userId) return;
    
    lastFetchTime.current = 0; // Reset cache
    const { data: chatrooms, error } = await supabase
      .from('chatroom')
      .select(`
        id,
        user1_id,
        user2_id,
        messages:message (
          id,
          user_id,
          seen,
          chatroom_id
        )
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('type', 'private');

    if (error) {
      console.error('Error fetching chatrooms:', error);
      return;
    }

    const counts: {[key: string]: number} = {};
    let total = 0;

    chatrooms?.forEach(chatroom => {
      if (!chatroom.messages) return;
      const unreadMessages = chatroom.messages.filter(msg => 
        msg.user_id !== userId && !msg.seen
      );
      if (unreadMessages.length > 0) {
        const senderId = unreadMessages[0].user_id;
        counts[senderId] = (counts[senderId] || 0) + unreadMessages.length;
        total += unreadMessages.length;
      }
    });

    setUnreadByUser(counts);
    setTotalUnreadCount(total);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    // Initial fetch
    fetchUnreadMessages();

    const channel = supabase
      .channel('message_notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'message' },
        (payload) => {
          console.log('Message change detected');
          debouncedFetch();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
      debouncedFetch.cancel();
    };
  }, [userId, debouncedFetch]);

  return { 
    totalUnreadCount, 
    unreadByUser, 
    markChatAsRead,
    refreshUnreadCount: fetchUnreadMessages ,
    forceRefreshUnreadCounts 
  };
};