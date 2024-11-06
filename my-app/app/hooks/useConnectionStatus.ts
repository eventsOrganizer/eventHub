import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export const useConnectionStatus = (userId: string | null) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastSeen, setLastSeen] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const subscription = supabase
      .from(`user:id=eq.${userId}`)
      .on('UPDATE', payload => {
        setIsConnected(payload.new.is_connected);
        setLastSeen(payload.new.last_seen);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return { isConnected, lastSeen };
};