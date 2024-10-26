import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, AppState } from 'react-native';
import { WebView } from 'react-native-webview';
import { supabase } from '../../../services/supabaseClient';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import { useUser } from '../../../UserContext';

const VideoCall = ({ route, navigation }: { route: any; navigation: any }) => {
  const { roomUrl, isCreator, roomId } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const webViewRef = useRef<WebView>(null);
  const { userId } = useUser();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    console.log('VideoCall component mounted');
    checkAndRequestPermissions();
    joinRoom();

    const heartbeatInterval = setInterval(sendHeartbeat, 3000);
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    navigation.addListener('beforeRemove', (e: any) => {
      e.preventDefault();
      leaveRoom().then(() => navigation.dispatch(e.data.action));
    });

    return () => {
      console.log('VideoCall component will unmount');
      clearInterval(heartbeatInterval);
      appStateSubscription.remove();
      leaveRoom();
    };
  }, [isCreator, roomId, userId, navigation]);

  const sendHeartbeat = async () => {
    try {
      const { error } = await supabase
        .from('room_participants')
        .update({ last_heartbeat: new Date().toISOString() })
        .match({ room_id: roomId, user_id: userId });

      if (error) {
        console.error('Error sending heartbeat:', error);
      } else {
        console.log('Heartbeat sent successfully');
      }
    } catch (error) {
      console.error('Exception when sending heartbeat:', error);
    }
  };

  const handleAppStateChange = async (nextAppState: string) => {
    if (appState.current.match(/active|foreground/) && nextAppState === 'background') {
      console.log('App has gone to background');
      await leaveRoom();
    } else if (appState.current === 'background' && nextAppState === 'active') {
      console.log('App has come to the foreground');
      await joinRoom();
    }
    appState.current = nextAppState;
  };

  const checkAndRequestPermissions = async () => {
    console.log('Checking and requesting permissions');
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    const { status: audioStatus } = await Audio.requestPermissionsAsync();
  
    if (cameraStatus === 'granted' && audioStatus === 'granted') {
      console.log('Permissions granted');
      setPermissionsGranted(true);
    } else {
      console.log('Permissions denied');
      setError('Camera and microphone permissions are required for video calls.');
    }
  };

  const cleanupInactiveParticipants = async () => {
    const nineSecondsAgo = new Date(Date.now() - 9 * 1000).toISOString();
    try {
      await supabase
        .from('room_participants')
        .update({ is_active: false, left_at: new Date().toISOString() })
        .match({ room_id: roomId })
        .lt('last_heartbeat', nineSecondsAgo);
    } catch (error) {
      console.error('Error cleaning up inactive participants:', error);
    }
  };

  const joinRoom = async () => {
    console.log(`Joining room ${roomId} as user ${userId}`);
    try {
      await cleanupInactiveParticipants();
      const { data, error } = await supabase
        .from('room_participants')
        .upsert({ room_id: roomId, user_id: userId, is_active: true, last_heartbeat: new Date().toISOString() },
                 { onConflict: ['room_id', 'user_id'] });
      
      if (error) {
        console.error('Error joining room:', error);
      } else {
        console.log('Successfully joined room:', data);
      }
      
      if (isCreator) {
        const { data: roomData, error: roomError } = await supabase
          .from('videoroom')
          .update({ is_connected: true })
          .eq('id', roomId);
        
        if (roomError) {
          console.error('Error updating room connection status:', roomError);
        } else {
          console.log('Updated room connection status:', roomData);
        }
      }
    } catch (error) {
      console.error('Exception when joining room:', error);
    }
  };

  const leaveRoom = async () => {
    console.log(`Leaving room ${roomId} as user ${userId}`);
    try {
      const { data, error } = await supabase
        .from('room_participants')
        .update({ is_active: false, left_at: new Date().toISOString() })
        .match({ room_id: roomId, user_id: userId });

      if (error) {
        console.error('Error leaving room:', error);
      } else {
        console.log('Successfully left room:', data);
      }

      if (isCreator) {
        const { data: roomData, error: roomError } = await supabase
          .from('videoroom')
          .update({ is_connected: false })
          .eq('id', roomId);
        
        if (roomError) {
          console.error('Error updating room connection status:', roomError);
        } else {
          console.log('Updated room connection status:', roomData);
        }
      }
    } catch (error) {
      console.error('Exception when leaving room:', error);
    }
  };

  const handleLoadEnd = () => {
    console.log('WebView loaded');
    setIsLoading(false);
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    setError('Failed to load the video call. Please try again.');
    setIsLoading(false);
  };

  const reloadWebView = () => {
    console.log('Reloading WebView');
    setIsLoading(true);
    setError(null);
    webViewRef.current?.reload();
  };

  const handleMessage = async (event: any) => {
    console.log('Received message from WebView:', event.nativeEvent.data);
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.action === 'participant-joined' || data.action === 'participant-left') {
        console.log(`${data.action}: ${data.participants.join(', ')}`);
        await updateParticipants(data.participants);
      }
    } catch (error) {
      console.error('Error handling WebView message:', error);
    }
  };
  
  const updateParticipants = async (participants: string[]) => {
    console.log(`Updating participants for room ${roomId}:`, participants);
    try {
      const { data, error } = await supabase
        .from('room_participants')
        .upsert(
          participants.map(participantId => ({
            room_id: roomId,
            user_id: participantId,
            is_active: true,
            last_heartbeat: new Date().toISOString()
          })),
          { onConflict: ['room_id', 'user_id'] }
        );
      
      if (error) {
        console.error('Error updating participants:', error);
      } else {
        console.log('Successfully updated participants:', data);
      }
    } catch (error) {
      console.error('Exception when updating participants:', error);
    }
  };

  const injectedJavaScript = `
    (function() {
      console.log('Injected JavaScript running');
      
      window.addEventListener('message', function(e) {
        console.log('Message received in injected JS:', e.data);
        const participants = Object.values(call.participants()).map(p => p.user_id);
        console.log('Participants:', participants);
        window.ReactNativeWebView.postMessage(JSON.stringify({
          action: e.data.action,
          participants: participants
        }));
      });

      call.on('participant-joined', (event) => {
        console.log('Participant joined:', event);
        window.postMessage({ action: 'participant-joined' });
      });

      call.on('participant-left', (event) => {
        console.log('Participant left:', event);
        window.postMessage({ action: 'participant-left' });
      });

      navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    })();
    true;
  `;

  return (
    <View style={styles.container}>
      {isLoading && <Text style={styles.loadingText}>Loading video call...</Text>}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.reloadButton} onPress={reloadWebView}>
            <Text style={styles.reloadButtonText}>Reload</Text>
          </TouchableOpacity>
        </View>
      )}
      {permissionsGranted && (
        <WebView
          ref={webViewRef}
          source={{ uri: roomUrl }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          injectedJavaScript={injectedJavaScript}
          onMessage={handleMessage}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  hidden: {
    opacity: 0,
  },
  loadingText: {
    textAlign: 'center',
    margin: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    margin: 10,
    fontSize: 16,
    color: 'red',
  },
  reloadButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  reloadButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default VideoCall;