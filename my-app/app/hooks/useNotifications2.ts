import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useUser } from '../UserContext';

export interface Notification {
  id: number;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface RequestNotification {
  id: number;
  status: 'pending' | 'accepted' | 'refused';
  created_at: string;
  is_read: boolean;
  is_action_read: boolean;
  user_id: string;
  event_id?: number;
  personal_id?: number;
  local_id?: number;
  material_id?: number;
  friend_id?: string;
}

export const useNotifications = () => {
  const { userId } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [requestNotifications, setRequestNotifications] = useState<RequestNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    // Fetch initial notifications
    const fetchNotifications = async () => {
      const { data: notifData, error: notifError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (notifError) {
        console.error('Error fetching notifications:', notifError);
        return;
      }

      const { data: requestData, error: requestError } = await supabase
        .from('request')
        .select('*')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (requestError) {
        console.error('Error fetching request notifications:', requestError);
        return;
      }

      setNotifications(notifData || []);
      setRequestNotifications(requestData || []);
      updateUnreadCount(notifData || [], requestData || []);
    };

    fetchNotifications();

    // Subscribe to notifications
    const notificationsSubscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [payload.new as Notification, ...prev]);
            setUnreadCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    // Subscribe to requests
    const requestsSubscription = supabase
      .channel('requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'request',
          filter: `or(user_id.eq.${userId},friend_id.eq.${userId},event:event_id(user_id.eq.${userId}))`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setRequestNotifications(prev => {
              const existing = prev.find(n => n.id === (payload.new as RequestNotification).id);
              if (existing) {
                return prev.map(n => n.id === existing.id ? payload.new as RequestNotification : n);
              }
              return [payload.new as RequestNotification, ...prev];
            });
            if (!(payload.new as RequestNotification).is_read) {
              setUnreadCount(prev => prev + 1);
            }
          }
        }
      )
      .subscribe();

    return () => {
      notificationsSubscription.unsubscribe();
      requestsSubscription.unsubscribe();
    };
  }, [userId]);

  const updateUnreadCount = (notifs: Notification[], requests: RequestNotification[]) => {
    const unreadNotifs = notifs.filter(n => !n.is_read).length;
    const unreadRequests = requests.filter(r => !r.is_read || !r.is_action_read).length;
    setUnreadCount(unreadNotifs + unreadRequests);
  };

  const markAsRead = async (notificationId: number, type: 'notification' | 'request') => {
    if (type === 'notification') {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } else {
      const { error } = await supabase
        .from('request')
        .update({ is_read: true, is_action_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking request as read:', error);
        return;
      }

      setRequestNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true, is_action_read: true } : n)
      );
    }
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return {
    notifications,
    requestNotifications,
    unreadCount,
    markAsRead,
  };
};