import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { supabase } from '../services/supabaseClient';
import { useUser } from '../UserContext';

export const HeartbeatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId } = useUser();
  const prevUserIdRef = useRef<string | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateUserStatus = async (isConnected: boolean, userIdToUpdate?: string) => {
    const targetUserId = userIdToUpdate || userId;
    if (!targetUserId) {
      console.log('❌ Heartbeat skipped: No user ID');
      return;
    }

    try {
      console.log(`💓 Sending heartbeat for user ${targetUserId}...`);
      const timestamp = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('user')
        .update({ 
          is_connected: isConnected,
          last_seen: timestamp
        })
        .eq('id', targetUserId)
        .select('is_connected');

      if (error) {
        console.error('❌ Heartbeat failed:', error.message);
      } else {
        console.log(`✅ Heartbeat success - Connected: ${data?.[0]?.is_connected}`);
        if (!isConnected) {
          console.log(`👋 User last seen: ${timestamp}`);
        }
      }
    } catch (error) {
      console.error('❌ Heartbeat exception:', error);
    }
  };

  const cleanup = async () => {
    console.log('💤 Stopping heartbeat system');
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    // Disconnect previous user if exists
    if (prevUserIdRef.current && prevUserIdRef.current !== userId) {
      console.log(`🔄 Disconnecting previous user ${prevUserIdRef.current}`);
      await updateUserStatus(false, prevUserIdRef.current);
    }

    // Disconnect current user
    if (userId) {
      console.log(`🔄 Disconnecting current user ${userId}`);
      await updateUserStatus(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    // Clean up previous user if exists
    if (prevUserIdRef.current && prevUserIdRef.current !== userId) {
      console.log(`🔄 New user login detected. Disconnecting previous user ${prevUserIdRef.current}`);
      updateUserStatus(false, prevUserIdRef.current);
    }

    console.log('🚀 Starting heartbeat system for user:', userId);
    updateUserStatus(true);

    heartbeatIntervalRef.current = setInterval(() => {
      if (AppState.currentState === 'active') {
        updateUserStatus(true);
      } else {
        updateUserStatus(false);
      }
    }, 2000);

    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      console.log('📱 App state changed to:', nextAppState);
      updateUserStatus(nextAppState === 'active');
    });

    // Update ref with current userId
    prevUserIdRef.current = userId;

    return () => {
      subscription.remove();
      cleanup();
    };
  }, [userId]);

  return <>{children}</>;
};