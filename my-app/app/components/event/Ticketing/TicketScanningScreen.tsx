import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Image,
  Modal,
  ScrollView 
} from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { supabase } from '../../../services/supabaseClient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import tw from 'twrnc';

interface VerificationResult {
  ticketPhoto: string;
  eventSerial: string;
  eventName: string;
  eventType: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  organizer: {
    username: string;
  };
  details: string;
}

interface RouteParams {
  serial?: string;
  key?: number;
}

const TicketScanningScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as RouteParams;
  const selectedSerial = routeParams?.serial;

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [token, setToken] = useState('');
  const [cameraMode, setCameraMode] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const resetScanState = useCallback(() => {
    setScanned(false);
    setToken('');
    setVerificationResult(null);
    setShowResult(false);
  }, []);

  const fullReset = useCallback(() => {
    resetScanState();
    setCameraMode(false);
  }, [resetScanState]);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  // Only do full reset when serial or key changes
  useEffect(() => {
    if (routeParams?.key || selectedSerial !== undefined) {
      fullReset();
    }
  }, [routeParams?.key, selectedSerial, fullReset]);

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
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('order')
        .select(`
          id,
          token,
          ticket_id,
          media!order_id (
            url,
            type
          )
        `)
        .eq('token', tokenToVerify)
        .single();

      if (orderError) {
        Alert.alert('Error', 'Invalid ticket token');
        resetScanState();
        return;
      }

      if (!orderData) {
        Alert.alert('Error', 'Ticket not found');
        resetScanState();
        return;
      }

      const { data: ticketData, error: ticketError } = await supabase
        .from('ticket')
        .select(`
          id,
          event!inner (
            id,
            name,
            serial,
            type,
            details,
            user_id
          )
        `)
        .eq('id', orderData.ticket_id)
        .single();

      if (ticketError) {
        Alert.alert('Error', 'Could not verify ticket details');
        resetScanState();
        return;
      }

      if (selectedSerial && ticketData.event.serial !== selectedSerial) {
        Alert.alert(
          'Serial Mismatch',
          `This ticket is for event with serial ${ticketData.event.serial}, but you're scanning for event ${selectedSerial}`
        );
        resetScanState();
        return;
      }

      const { data: locationData, error: locationError } = await supabase
        .from('location')
        .select('*')
        .eq('event_id', ticketData.event.id)
        .single();

      if (locationError) {
        console.error('Location error:', locationError);
      }

      const { data: organizerData, error: organizerError } = await supabase
        .from('user')
        .select('username')
        .eq('id', ticketData.event.user_id)
        .single();

      if (organizerError) {
        console.error('Organizer error:', organizerError);
      }

      const ticketPhoto = orderData.media?.find(m => m.type === 'ticket_photo')?.url;

      const result: VerificationResult = {
        ticketPhoto,
        eventSerial: ticketData.event.serial,
        eventName: ticketData.event.name,
        eventType: ticketData.event.type,
        location: {
          latitude: locationData?.latitude || 0,
          longitude: locationData?.longitude || 0,
          address: locationData?.address || 'No address provided'
        },
        organizer: {
          username: organizerData?.username || 'Unknown organizer'
        },
        details: ticketData.event.details
      };

      setVerificationResult(result);
      setShowResult(true);

    } catch (error) {
      console.error('Error verifying ticket:', error);
      Alert.alert('Error', 'Failed to verify ticket. Please try again.');
      resetScanState();
    }
  };

  const navigateToSerialsList = () => {
    navigation.setParams({ 
      serial: undefined, 
      key: Date.now() 
    });
    navigation.navigate('EventSerialsList');
  };

  const clearSerial = () => {
    navigation.setParams({ 
      serial: undefined, 
      key: Date.now() 
    });
  };

  const handleModeSwitch = () => {
    setCameraMode(!cameraMode);
    resetScanState();
  };

  return (
    <View style={tw`flex-1`}>
      <View style={tw`bg-blue-100 p-4 flex-row justify-between items-center`}>
        <View>
          <Text style={tw`text-blue-800 font-bold`}>
            {selectedSerial ? 'Event-Specific Mode' : 'Free Scan Mode'}
          </Text>
          {selectedSerial && (
            <Text style={tw`text-blue-600 text-sm`}>Serial: {selectedSerial}</Text>
          )}
        </View>
        <View style={tw`flex-row`}>
          {selectedSerial && (
            <TouchableOpacity 
              style={tw`bg-red-500 px-4 py-2 rounded-lg mr-2`}
              onPress={clearSerial}
            >
              <Text style={tw`text-white font-bold`}>Clear Serial</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={tw`bg-blue-500 px-4 py-2 rounded-lg`}
            onPress={navigateToSerialsList}
          >
            <Text style={tw`text-white font-bold`}>Your Events</Text>
          </TouchableOpacity>
        </View>
      </View>

      {cameraMode ? (
        <View style={tw`flex-1`}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          {scanned && (
            <TouchableOpacity 
              style={tw`bg-blue-500 m-4 p-3 rounded-lg`}
              onPress={() => setScanned(false)}
            >
              <Text style={tw`text-white text-center font-bold`}>Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={tw`p-4`}>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 mb-4`}
            value={token}
            onChangeText={setToken}
            placeholder="Enter ticket token"
          />
          <TouchableOpacity 
            style={tw`bg-blue-500 p-3 rounded-lg`}
            onPress={() => verifyToken(token)}
          >
            <Text style={tw`text-white text-center font-bold`}>Verify Token</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity 
        style={tw`bg-gray-800 m-4 p-3 rounded-lg`}
        onPress={handleModeSwitch}
      >
        <Text style={tw`text-white text-center font-bold`}>
          {cameraMode ? 'Switch to Manual Mode' : 'Switch to Camera Mode'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showResult}
        animationType="slide"
        transparent={true}
      >
        <View style={tw`flex-1 bg-white`}>
          <TouchableOpacity 
            style={tw`absolute right-4 top-12 z-10`}
            onPress={() => {
              setShowResult(false);
              setScanned(false);
            }}
          >
            <Ionicons name="close-circle" size={32} color="#000" />
          </TouchableOpacity>

          <ScrollView style={tw`flex-1 pt-16`}>
            {verificationResult?.ticketPhoto && (
              <Image
                source={{ uri: verificationResult.ticketPhoto }}
                style={tw`w-full h-80`}
                resizeMode="cover"
              />
            )}

            <View style={tw`p-4`}>
              <Text style={tw`text-2xl font-bold mb-2`}>{verificationResult?.eventName}</Text>
              <Text style={tw`text-gray-600 mb-4`}>Serial: {verificationResult?.eventSerial}</Text>

              <View style={tw`space-y-4`}>
                <View>
                  <Text style={tw`font-bold`}>Event Type</Text>
                  <Text style={tw`capitalize`}>{verificationResult?.eventType}</Text>
                </View>

                <View>
                  <Text style={tw`font-bold`}>Location</Text>
                  <Text>{verificationResult?.location.address}</Text>
                </View>

                <View>
                  <Text style={tw`font-bold`}>Organizer</Text>
                  <Text>{verificationResult?.organizer.username}</Text>
                </View>

                <View>
                  <Text style={tw`font-bold`}>Details</Text>
                  <Text>{verificationResult?.details}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default TicketScanningScreen;