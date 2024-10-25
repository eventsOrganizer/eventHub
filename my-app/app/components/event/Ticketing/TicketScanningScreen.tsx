import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { supabase } from '../../../services/supabaseClient';

const TicketScanningScreen: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [token, setToken] = useState('');
  const [cameraMode, setCameraMode] = useState(false);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    setToken(data);
    verifyToken(data);
  };

  const verifyToken = async (tokenToVerify: string) => {
    const { data, error } = await supabase
      .from('order')
      .select('*, ticket(*, event(*))')
      .eq('token', tokenToVerify);
  
    if (error && error.code !== 'PGRST116') {
      console.error('Error verifying token:', error);
      Alert.alert('Error', 'Failed to verify ticket. Please try again.');
      return;
    }
  
    if (data && data.length > 0) {
      Alert.alert('Success', `Ticket verified for event: ${data[0].ticket.event.name}`);
    } else {
      Alert.alert('Error', 'Invalid ticket token or ticket not found');
    }
  };

  const handleManualVerify = () => {
    if (token) {
      verifyToken(token);
    } else {
      Alert.alert('Error', 'Please enter a token');
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={requestCameraPermission}>
          <Text style={styles.buttonText}>Request Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {cameraMode ? (
        <View style={styles.cameraContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          {scanned && (
            <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
              <Text style={styles.buttonText}>Tap to Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.manualContainer}>
          <TextInput
            style={styles.input}
            value={token}
            onChangeText={setToken}
            placeholder="Enter ticket token"
          />
          <TouchableOpacity style={styles.button} onPress={handleManualVerify}>
            <Text style={styles.buttonText}>Verify Token</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={() => setCameraMode(!cameraMode)}>
        <Text style={styles.buttonText}>
          {cameraMode ? 'Switch to Manual Mode' : 'Switch to Camera Mode'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    width: '100%',
    height: '80%',
  },
  manualContainer: {
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default TicketScanningScreen;