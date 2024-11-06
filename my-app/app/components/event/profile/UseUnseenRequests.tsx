import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../../services/supabaseClient';

type RequestType = 'sent_events' | 'received_events' | 'sent_services' | 'received_services';

export const useUnseenRequests = (userId: string | null, requestType: RequestType) => {
  const [unseenCount, setUnseenCount] = useState(0);

  const fetchUnseenCount = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .rpc('count_unseen_requests', {
          p_user_id: userId,
          p_request_type: requestType
        });

      if (error) {
        console.error('Error fetching unseen count:', error);
        return;
      }

      setUnseenCount(data || 0);
    } catch (error) {
      console.error('Error in fetchUnseenCount:', error);
    }
  }, [userId, requestType]);

  const markAsSeen = useCallback(async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .rpc('mark_requests_as_seen', {
          p_user_id: userId,
          p_request_type: requestType
        });

      if (error) {
        console.error('Error marking as seen:', error);
        return;
      }

      setUnseenCount(0);
    } catch (error) {
      console.error('Error in markAsSeen:', error);
    }
  }, [userId, requestType]);

  useEffect(() => {
    fetchUnseenCount();

    let filter;
    if (requestType.startsWith('sent_')) {
      // For sent requests, only listen to status changes from pending to accepted/refused
      filter = `user_id=eq.${userId} and old_status=eq.pending and (new_status=eq.accepted or new_status=eq.refused)`;
    } else {
      // For received requests, listen to all changes where seen_by_receiver is false
      filter = requestType === 'received_events' 
        ? `event:event_id(user_id.eq.${userId}) and seen_by_receiver=eq.false`
        : `or(personal.user_id.eq.${userId},local.user_id.eq.${userId},material.user_id.eq.${userId}) and seen_by_receiver=eq.false`;
    }

    const subscription = supabase
      .channel('request_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'request',
        filter
      }, () => {
        fetchUnseenCount();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUnseenCount, userId, requestType]);

  return { unseenCount, markAsSeen };
};