import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import bcrypt from 'react-native-bcrypt';
import { useUser } from '../../../UserContext';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import CloudinaryUpload from '../CloudinaryUpload';
import { createEventNotificationSystem } from '../../../services/eventNotificationService';
import TicketPaymentModal from './TicketPaymentModal';
import TicketPaymentStatus from './TicketPaymentStatus';
import { useNavigation } from '@react-navigation/native';
interface BuyTicketProps {
  eventId: number;
  eventType: 'online' | 'indoor' | 'outdoor';
}

const BuyTicket: React.FC<BuyTicketProps> = ({ eventId, eventType }) => {
  const { handleTicketPurchaseNotification } = createEventNotificationSystem();
  const [ticketAvailable, setTicketAvailable] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<number | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { userId } = useUser();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentStatus, setShowPaymentStatus] = useState<'pending' | 'completed' | 'failed' | null>(null);
  const [ticketPrice, setTicketPrice] = useState<number>(0);
  
  const [eventDetails, setEventDetails] = useState({
    name: '',
    date: '',
    time: ''
  });

  const navigation = useNavigation();
  useEffect(() => {
    checkTicketAvailability();
  }, [eventId]);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      if (!ticketId) return;
      
      const { data: ticketData, error } = await supabase
        .from('ticket')
        .select('price, event!inner(name, date, time)')
        .eq('id', ticketId)
        .single();
  
      console.log('Ticket data received:', ticketData);
      if (ticketData) {
        setTicketPrice(parseFloat(ticketData.price));  // Parse price as float
        setEventDetails({
          name: ticketData.event.name,
          date: ticketData.event.date,
          time: ticketData.event.time
        });
      }
    };
  
    fetchTicketDetails();
  }, [ticketId]);

  const checkTicketAvailability = async () => {
    const { data, error } = await supabase
      .from('ticket')
      .select('id, quantity, price')
      .eq('event_id', eventId)
      .single();
  
    if (error) {
      console.error('Error checking ticket availability:', error);
      return;
    }
  
    if (data && parseInt(data.quantity) > 0) {  // Parse quantity as integer
      setTicketAvailable(true);
      setTicketQuantity(parseInt(data.quantity));
      setTicketId(data.id);
      setTicketPrice(parseFloat(data.price));  // Parse price as float
      console.log('Setting initial ticket price to:', parseFloat(data.price));
    }
  };
  const handleImageUploaded = async (urls: string[]) => {
    if (urls.length > 0) {
      try {
        const imageUrl = urls[0];
        if (!userId || !ticketId || !imageUrl) {
          console.log('Debug Info:', { userId, ticketId, imageUrl });
          Alert.alert('Error', 'Unable to complete purchase. Please try again.');
          return;
        }
      
        const generatedToken = bcrypt.hashSync(`${ticketId}-${userId}`, 10);
      
        const { data: orderData, error: orderError } = await supabase
        .from('order')
        .insert({
          user_id: userId,
          ticket_id: ticketId,
          type: eventType === 'online' ? 'online' : 'physical',
          token: generatedToken,
        })
        .select()
        .single();
    
      if (orderError) throw orderError;

      // Add media
      const { error: mediaError } = await supabase
        .from('media')
        .insert({
          url: imageUrl,
          order_id: orderData.id,
          type: 'ticket_photo'
        });
    
      if (mediaError) throw mediaError;
    
      // Update ticket quantity
      const { error: updateError } = await supabase
        .from('ticket')
        .update({ quantity: ticketQuantity - 1 })
        .eq('id', ticketId);
    
      if (updateError) throw updateError;

      console.log('Creating notification for order:', orderData.id);
      // Send notification to event owner
      await handleTicketPurchaseNotification(orderData.id);
      console.log('Notification sent successfully');

      setToken(generatedToken);
      setTicketQuantity(prevQuantity => prevQuantity - 1);
      setShowImageUpload(false);
      Alert.alert('Success', 'Ticket purchased successfully!');
    } catch (error) {
      console.error('Error in ticket purchase process:', error);
      Alert.alert('Error', 'Failed to complete purchase. Please try again.');
    }
  }
};
 
// In BuyTicket.tsx, modify handleBuyTicket:
const handleBuyTicket = () => {
  if (ticketPrice <= 0) {
    Alert.alert('Error', 'Invalid ticket price');
    return;
  }

  navigation.navigate('EventPaymentScreen', {
    amount: ticketPrice,
    eventId,
    ticketId,
    userId,
    eventType
  });
};

const handlePaymentConfirm = () => {
  setShowPaymentModal(false);
  navigation.navigate('EventPaymentScreen', {
    amount: ticketPrice,
    eventId,
    ticketId,
    userId,
    eventType
  });
};

const handlePaymentCancel = () => {
  setShowPaymentModal(false);
  setShowPaymentStatus(null);
};


  return (
    <>
      <View style={tw`w-full`}>
        {ticketAvailable ? (
          <LinearGradient
            colors={['#90EE90', '#228B22']}
            style={tw`rounded-lg overflow-hidden w-48`}
          >
            <TouchableOpacity 
              style={tw`p-2 items-center w-full`}
              onPress={handleBuyTicket}
            >
              <Text style={tw`text-white font-bold text-base shadow-sm`}>Buy Ticket</Text>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <TouchableOpacity 
            style={tw`bg-red-500/50 p-2 rounded-lg items-center w-32`}
            disabled
          >
            <Text style={tw`text-white font-bold text-base`}>Sold Out</Text>
          </TouchableOpacity>
        )}
      </View>
      <TicketPaymentModal
        visible={showPaymentModal}
        onClose={handlePaymentCancel}
        onConfirm={handlePaymentConfirm}
        eventName={eventDetails.name}
        eventDate={eventDetails.date}
        eventTime={eventDetails.time}
  ticketPrice={ticketPrice}
/>

{showPaymentStatus && (
  <TicketPaymentStatus
    paymentStatus={showPaymentStatus}
    amount={ticketPrice}
  />
)}
      <Modal
  visible={showImageUpload && showPaymentStatus === 'completed'}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setShowImageUpload(false)}
>
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`bg-white rounded-xl w-5/6 p-4`}>
            <Text style={tw`text-xl font-bold mb-4`}>Upload Your Photo</Text>
            <Text style={tw`text-sm text-gray-600 mb-4`}>
              Please upload a clear photo of yourself for ticket verification
            </Text>
            
            <CloudinaryUpload onImagesUploaded={handleImageUploaded} />
            
            <TouchableOpacity
              style={tw`mt-4 bg-gray-200 p-3 rounded-lg`}
              onPress={() => setShowImageUpload(false)}
            >
              <Text style={tw`text-center font-bold`}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default BuyTicket;