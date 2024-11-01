import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export const useRequestNotifications = (userId: string | null) => {
  const [unreadReceivedRequestsCount, setUnreadReceivedRequestsCount] = useState(0);
  const [unreadSentActionsCount, setUnreadSentActionsCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const fetchUnreadCounts = async () => {
      // Fetch unread received requests
      const { data: receivedRequests, error: receivedError } = await supabase
        .from('request')
        .select('id')
        .eq('status', 'pending')
        .eq('is_read', false)
        .or(`
          personal.user_id.eq.${userId},
          local.user_id.eq.${userId},
          material.user_id.eq.${userId},
          event:event_id(user_id.eq.${userId})
        `);
    
      if (!receivedError) {
        setUnreadReceivedRequestsCount(receivedRequests?.length || 0);
      }

      // Fetch unread actions on sent requests
      const { data: sentActions, error: sentError } = await supabase
        .from('request')
        .select('id')
        .eq('user_id', userId)
        .eq('is_action_read', false)
        .or('status.eq.confirmed,status.eq.rejected');

      if (!sentError) {
        setUnreadSentActionsCount(sentActions?.length || 0);
      }
    };

    fetchUnreadCounts();

    // Subscribe to changes
    const subscription = supabase
      .channel('request_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'request',
        filter: `user_id=eq.${userId}` 
      }, () => {
        fetchUnreadCounts();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return {
    unreadReceivedRequestsCount,
    unreadSentActionsCount
  };
};