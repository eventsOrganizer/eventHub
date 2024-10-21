import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { supabase } from '../../../services/supabaseClient';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';

const VideoCall = ({ route }: { route: any }) => {
  const { roomUrl, isCreator, roomId } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    checkAndRequestPermissions();

    if (isCreator) {
      const updateRoomStatus = async (isConnected: boolean) => {
        try {
          await supabase
            .from('videoroom')
            .update({ is_connected: isConnected })
            .eq('id', roomId);
        } catch (error) {
          console.error('Error updating room status:', error);
        }
      };

      updateRoomStatus(true);
      return () => {
        updateRoomStatus(false);
      };
    }
  }, [isCreator, roomId]);

  const checkAndRequestPermissions = async () => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    const { status: audioStatus } = await Audio.requestPermissionsAsync();
  
    if (cameraStatus === 'granted' && audioStatus === 'granted') {
      setPermissionsGranted(true);
    } else {
      setError('Camera and microphone permissions are required for video calls.');
    }
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    setError('Failed to load the video call. Please try again.');
    setIsLoading(false);
  };

  const reloadWebView = () => {
    setIsLoading(true);
    setError(null);
    webViewRef.current?.reload();
  };

  const injectedJavaScript = `
    navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
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
          onMessage={(event) => {
            console.log('WebView message:', event.nativeEvent.data);
          }}
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