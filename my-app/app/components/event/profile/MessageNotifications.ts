// app/hooks/useMessageNotifications.ts
import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabaseClient';

export const useMessageNotifications = (userId: string | null) => {
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [unreadByUser, setUnreadByUser] = useState<{[key: string]: number}>({});

  const fetchUnreadMessages = async () => {
    if (!userId) return;

    const { data: chatrooms, error: chatroomError } = await supabase
      .from('chatroom')
      .select(`
        id,
        user1_id,
        user2_id,
        messages:message!inner (
          id,
          user_id,
          seen
        )
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('type', 'private');

    if (chatroomError) {
      console.error('Error fetching unread messages:', chatroomError);
      return;
    }

    const unreadCounts: {[key: string]: number} = {};
    let total = 0;

    chatrooms?.forEach(chatroom => {
      const unreadMessages = chatroom.messages.filter(msg => 
        msg.user_id !== userId && !msg.seen
      );

      unreadMessages.forEach(msg => {
        unreadCounts[msg.user_id] = (unreadCounts[msg.user_id] || 0) + 1;
        total++;
      });
    });

    setUnreadByUser(unreadCounts);
    setTotalUnreadCount(total);
  };

  const markChatAsRead = async (chatroomId: number) => {
    const { error } = await supabase
      .from('message')
      .update({ seen: true })
      .eq('chatroom_id', chatroomId)
      .neq('user_id', userId);

    if (error) {
      console.error('Error marking messages as read:', error);
    } else {
      fetchUnreadMessages();
    }
  };

  useEffect(() => {
    if (!userId) return;

    fetchUnreadMessages();

    const subscription = supabase
      .channel('message_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'message' },
        fetchUnreadMessages
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return { totalUnreadCount, unreadByUser, markChatAsRead };
};