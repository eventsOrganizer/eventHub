import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface Notification {
  id: number;
  user_id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export const useNotifications = (userId: string | null) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }
    };

    fetchNotifications();

    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications(current => [payload.new as Notification, ...current]);
            setUnreadCount(count => count + 1);
          } else if (payload.eventType === 'UPDATE') {
            setNotifications(current =>
              current.map(n =>
                n.id === (payload.new as Notification).id ? payload.new as Notification : n
              )
            );
            fetchNotifications(); // Refresh unread count
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return { notifications, unreadCount };
};