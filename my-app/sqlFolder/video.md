import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, AppState, FlatList, Modal, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { supabase } from '../../../services/supabaseClient';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import { useUser } from '../../../UserContext';

const DAILY_API_KEY = '731a44ab06649fabe8300c0f5d89fd8721f34d5f685549bc92a4b44b33f9401c';
const DAILY_API_URL = 'https://api.daily.co/v1';

interface Participant {
  id: string;
  user_id: string;
  user_name: string;
  join_time: string;
  daily_co_id: string; // Added Daily.co ID
}

const VideoCall = ({ route, navigation }: { route: any; navigation: any }) => {
  const { roomUrl, isCreator, roomId } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const webViewRef = useRef<WebView>(null);
  const { userId } = useUser();
  const appState = useRef(AppState.currentState);

  const fetchParticipants = useCallback(async () => {
    console.log('Fetching participants...');
    try {
      const response = await fetch(`${DAILY_API_URL}/presence`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DAILY_API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Daily.co presence data:', data);

      const roomName = roomUrl.split('/').pop();
      console.log('Room name:', roomName);
      const roomParticipants = data[roomName] || [];
      console.log('Room participants:', roomParticipants);

      setParticipants(roomParticipants.map((p: any) => ({
        id: p.id,
        user_id: p.userId,
        user_name: p.userName,
        join_time: p.joinTime,
        daily_co_id: p.id // Using the Daily.co ID
      })));
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  }, [roomUrl]);

  useEffect(() => {
    console.log('VideoCall component mounted');
    checkAndRequestPermissions();
    joinRoom();
    fetchParticipants();

    const heartbeatInterval = setInterval(sendHeartbeat, 3000);
    const participantsFetchInterval = setInterval(fetchParticipants, 15000);
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    navigation.addListener('beforeRemove', (e: any) => {
      e.preventDefault();
      leaveRoom().then(() => navigation.dispatch(e.data.action));
    });

    return () => {
      console.log('VideoCall component will unmount');
      clearInterval(heartbeatInterval);
      clearInterval(participantsFetchInterval);
      appStateSubscription.remove();
      leaveRoom();
    };
  }, [isCreator, roomId, userId, navigation, fetchParticipants]);

  const sendHeartbeat = async () => {
    console.log('Sending heartbeat...');
    try {
      const { error } = await supabase
        .from('room_participants')
        .update({ last_heartbeat: new Date().toISOString() })
        .match({ room_id: roomId, user_id: userId });

      if (error) console.error('Error sending heartbeat:', error);
      else console.log('Heartbeat sent successfully');
    } catch (error) {
      console.error('Exception when sending heartbeat:', error);
    }
  };

  const handleAppStateChange = async (nextAppState: string) => {
    console.log('App state changed to:', nextAppState);
    if (appState.current.match(/active|foreground/) && nextAppState === 'background') {
      await leaveRoom();
    } else if (appState.current === 'background' && nextAppState === 'active') {
      await joinRoom();
    }
    appState.current = nextAppState;
  };

  const checkAndRequestPermissions = async () => {
    console.log('Checking and requesting permissions...');
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

  const joinRoom = async () => {
    console.log('Joining room...');
    try {
      const { error } = await supabase
        .from('room_participants')
        .upsert({ room_id: roomId, user_id: userId, is_active: true, last_heartbeat: new Date().toISOString() },
                 { onConflict: ['room_id', 'user_id'] });
      
      if (error) console.error('Error joining room:', error);
      else console.log('Successfully joined room');
      
      if (isCreator) {
        const { error: roomError } = await supabase
          .from('videoroom')
          .update({ is_connected: true })
          .eq('id', roomId);
        
        if (roomError) console.error('Error updating room connection status:', roomError);
        else console.log('Successfully updated room connection status');
      }
    } catch (error) {
      console.error('Exception when joining room:', error);
    }
  };

  const leaveRoom = async () => {
    console.log('Leaving room...');
    try {
      const { error } = await supabase
        .from('room_participants')
        .update({ is_active: false, left_at: new Date().toISOString() })
        .match({ room_id: roomId, user_id: userId });

      if (error) console.error('Error leaving room:', error);
      else console.log('Successfully left room');

      if (isCreator) {
        const { error: roomError } = await supabase
          .from('videoroom')
          .update({ is_connected: false })
          .eq('id', roomId);
        
        if (roomError) console.error('Error updating room connection status:', roomError);
        else console.log('Successfully updated room connection status');
      }
    } catch (error) {
      console.error('Exception when leaving room:', error);
    }
  };

  const kickParticipant = async (participantId: string) => {
    console.log('Kicking participant:', participantId);
    if (!isCreator) {
      Alert.alert('Error', 'Only the room creator can kick participants.');
      return;
    }

    try {
      const roomName = roomUrl.split('/').pop();
      const response = await fetch(`${DAILY_API_URL}/rooms/${roomName}/eject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DAILY_API_KEY}`
        },
        body: JSON.stringify({ ids: [participantId] })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Kick response:', data);

      // Update local state
      setParticipants(prevParticipants => prevParticipants.filter(p => p.daily_co_id !== participantId));

      Alert.alert('Success', 'Participant has been kicked from the room.');
    } catch (error) {
      console.error('Error kicking participant:', error);
      Alert.alert('Error', `Failed to kick participant: ${error.message}`);
    }
  };

  const handleLoadEnd = () => {
    console.log('WebView loaded');
    setIsLoading(false);
    fetchParticipants();
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

  const handleMessage = (event: any) => {
    console.log('Received message from WebView:', event.nativeEvent.data);
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.action === 'participantJoined' || data.action === 'participantLeft') {
        fetchParticipants();
      }
    } catch (error) {
      console.error('Error handling WebView message:', error);
    }
  };

  const injectedJavaScript = `
    (function() {
      console.log('Injected JavaScript running');
      if (window.call) {
        console.log('Daily.co call object found');
        window.call.on('participant-joined', () => {
          console.log('Participant joined');
          window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'participantJoined' }));
        });
        window.call.on('participant-left', () => {
          console.log('Participant left');
          window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'participantLeft' }));
        });
      } else {
        console.error('Daily.co call object not found');
      }

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
        <>
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
          {isCreator && (
            <TouchableOpacity 
              style={styles.participantsButton} 
              onPress={() => setShowParticipants(true)}
            >
              <Text style={styles.participantsButtonText}>Manage Participants</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      <Modal visible={showParticipants} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Room Participants</Text>
          <FlatList
            data={participants}
            keyExtractor={(item) => item.daily_co_id}
            renderItem={({ item }) => (
              <View style={styles.participantItem}>
                <Text>{`${item.user_name || item.user_id} (Daily.co ID: ${item.daily_co_id})`}</Text>
                {isCreator && item.user_id !== userId && (
                  <TouchableOpacity 
                    onPress={() => kickParticipant(item.daily_co_id)}
                    style={styles.kickButton}
                  >
                    <Text style={styles.kickButtonText}>Kick</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setShowParticipants(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  participantsButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  participantsButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  participantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  kickButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
  },
  kickButtonText: {
    color: 'white',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default VideoCall;


///////////////////////////////



import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, AppState, FlatList, Modal, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { supabase } from '../../../services/supabaseClient';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import { useUser } from '../../../UserContext';

const DAILY_API_KEY = '731a44ab06649fabe8300c0f5d89fd8721f34d5f685549bc92a4b44b33f9401c';
const DAILY_API_URL = 'https://api.daily.co/v1';

interface Participant {
  id: string;
  user_id: string;
  user_name: string;
  join_time: string;
  daily_co_id: string; // Added Daily.co ID
}

const VideoCall = ({ route, navigation }: { route: any; navigation: any }) => {
  const { roomUrl, isCreator, roomId } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const webViewRef = useRef<WebView>(null);
  const { userId } = useUser();
  const appState = useRef(AppState.currentState);

  const fetchParticipants = useCallback(async () => {
    console.log('Fetching participants...');
    try {
      const response = await fetch(`${DAILY_API_URL}/presence`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DAILY_API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Daily.co presence data:', data);

      const roomName = roomUrl.split('/').pop();
      console.log('Room name:', roomName);
      const roomParticipants = data[roomName] || [];
      console.log('Room participants:', roomParticipants);

      setParticipants(roomParticipants.map((p: any) => ({
        id: p.id,
        user_id: p.userId,
        user_name: p.userName,
        join_time: p.joinTime,
        daily_co_id: p.id // Using the Daily.co ID
      })));
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  }, [roomUrl]);

  useEffect(() => {
    console.log('VideoCall component mounted');
    checkAndRequestPermissions();
    joinRoom();
    fetchParticipants();

    const heartbeatInterval = setInterval(sendHeartbeat, 3000);
    const participantsFetchInterval = setInterval(fetchParticipants, 15000);
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    navigation.addListener('beforeRemove', (e: any) => {
      e.preventDefault();
      leaveRoom().then(() => navigation.dispatch(e.data.action));
    });

    return () => {
      console.log('VideoCall component will unmount');
      clearInterval(heartbeatInterval);
      clearInterval(participantsFetchInterval);
      appStateSubscription.remove();
      leaveRoom();
    };
  }, [isCreator, roomId, userId, navigation, fetchParticipants]);

  const sendHeartbeat = async () => {
    console.log('Sending heartbeat...');
    try {
      const { error } = await supabase
        .from('room_participants')
        .update({ last_heartbeat: new Date().toISOString() })
        .match({ room_id: roomId, user_id: userId });

      if (error) console.error('Error sending heartbeat:', error);
      else console.log('Heartbeat sent successfully');
    } catch (error) {
      console.error('Exception when sending heartbeat:', error);
    }
  };

  const handleAppStateChange = async (nextAppState: string) => {
    console.log('App state changed to:', nextAppState);
    if (appState.current.match(/active|foreground/) && nextAppState === 'background') {
      await leaveRoom();
    } else if (appState.current === 'background' && nextAppState === 'active') {
      await joinRoom();
    }
    appState.current = nextAppState;
  };

  const checkAndRequestPermissions = async () => {
    console.log('Checking and requesting permissions...');
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

  const joinRoom = async () => {
    console.log('Joining room...');
    try {
      const { error } = await supabase
        .from('room_participants')
        .upsert({ room_id: roomId, user_id: userId, is_active: true, last_heartbeat: new Date().toISOString() },
                 { onConflict: ['room_id', 'user_id'] });
      
      if (error) console.error('Error joining room:', error);
      else console.log('Successfully joined room');
      
      if (isCreator) {
        const { error: roomError } = await supabase
          .from('videoroom')
          .update({ is_connected: true })
          .eq('id', roomId);
        
        if (roomError) console.error('Error updating room connection status:', roomError);
        else console.log('Successfully updated room connection status');
      }
    } catch (error) {
      console.error('Exception when joining room:', error);
    }
  };

  const leaveRoom = async () => {
    console.log('Leaving room...');
    try {
      const { error } = await supabase
        .from('room_participants')
        .update({ is_active: false, left_at: new Date().toISOString() })
        .match({ room_id: roomId, user_id: userId });

      if (error) console.error('Error leaving room:', error);
      else console.log('Successfully left room');

      if (isCreator) {
        const { error: roomError } = await supabase
          .from('videoroom')
          .update({ is_connected: false })
          .eq('id', roomId);
        
        if (roomError) console.error('Error updating room connection status:', roomError);
        else console.log('Successfully updated room connection status');
      }
    } catch (error) {
      console.error('Exception when leaving room:', error);
    }
  };

  const kickParticipant = async (participantId: string) => {
    console.log('Kicking participant:', participantId);
    if (!isCreator) {
      Alert.alert('Error', 'Only the room creator can kick participants.');
      return;
    }

    try {
      const roomName = roomUrl.split('/').pop();
      const response = await fetch(`${DAILY_API_URL}/rooms/${roomName}/eject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DAILY_API_KEY}`
        },
        body: JSON.stringify({ ids: [participantId] })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Kick response:', data);

      // Update local state
      setParticipants(prevParticipants => prevParticipants.filter(p => p.daily_co_id !== participantId));

      Alert.alert('Success', 'Participant has been kicked from the room.');
    } catch (error) {
      console.error('Error kicking participant:', error);
      Alert.alert('Error', `Failed to kick participant: ${error.message}`);
    }
  };

  const handleLoadEnd = () => {
    console.log('WebView loaded');
    setIsLoading(false);
    fetchParticipants();
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

  const handleMessage = (event: any) => {
    console.log('Received message from WebView:', event.nativeEvent.data);
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.action === 'participantJoined' || data.action === 'participantLeft') {
        fetchParticipants();
      }
    } catch (error) {
      console.error('Error handling WebView message:', error);
    }
  };

  const injectedJavaScript = `
    (function() {
      console.log('Injected JavaScript running');
      if (window.call) {
        console.log('Daily.co call object found');
        window.call.on('participant-joined', () => {
          console.log('Participant joined');
          window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'participantJoined' }));
        });
        window.call.on('participant-left', () => {
          console.log('Participant left');
          window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'participantLeft' }));
        });
      } else {
        console.error('Daily.co call object not found');
      }

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
        <>
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
          {isCreator && (
            <TouchableOpacity 
              style={styles.participantsButton} 
              onPress={() => setShowParticipants(true)}
            >
              <Text style={styles.participantsButtonText}>Manage Participants</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      <Modal visible={showParticipants} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Room Participants</Text>
          <FlatList
            data={participants}
            keyExtractor={(item) => item.daily_co_id}
            renderItem={({ item }) => (
              <View style={styles.participantItem}>
                <Text>{`${item.user_name || item.user_id} (Daily.co ID: ${item.daily_co_id})`}</Text>
                {isCreator && item.user_id !== userId && (
                  <TouchableOpacity 
                    onPress={() => kickParticipant(item.daily_co_id)}
                    style={styles.kickButton}
                  >
                    <Text style={styles.kickButtonText}>Kick</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setShowParticipants(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  participantsButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  participantsButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  participantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  kickButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
  },
  kickButtonText: {
    color: 'white',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default VideoCall;