import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Modal, TouchableOpacity, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { supabase } from '../../../services/supabaseClient';
import tw from 'twrnc';
import CloudinaryUpload from '../CloudinaryUpload';
import { createEventNotificationSystem } from '../../../services/eventNotificationService';
type EventPaymentSuccessParams = {
  ticketId: number;
  eventId: number;
  serviceType: string;
  paymentIntentId: string;
  amount: number;
  userId: string;
  eventType: 'online' | 'indoor' | 'outdoor';
};

type EventPaymentSuccessRouteProp = RouteProp<
  { EventPaymentSuccess: EventPaymentSuccessParams },
  'EventPaymentSuccess'
>;

const EventPaymentSuccessScreen = () => {
  const route = useRoute<EventPaymentSuccessRouteProp>();
  const navigation = useNavigation();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const { handleTicketPurchaseNotification } = createEventNotificationSystem();
  const { ticketId, eventId, paymentIntentId, amount, userId, eventType } = route.params;
  const handleImageUploaded = async (urls: string[]) => {
    if (urls.length > 0) {
      try {
        const { error: mediaError } = await supabase
          .from('media')
          .insert({
            url: urls[0],
            order_id: ticketId,
            type: 'ticket_photo'
          });
  
        if (mediaError) throw mediaError;
        
        navigation.navigate('EventDetails', { eventId });
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Error', 'Failed to upload image. Please try again.');
      }
    }
  };

  useEffect(() => {
    const createOrder = async () => {
      try {
        const { data: ticketData, error: getTicketError } = await supabase
          .from('ticket')
          .select('quantity')
          .eq('id', ticketId)
          .single();
    
        if (getTicketError) throw getTicketError;
    
        const currentQuantity = parseInt(ticketData.quantity || '0');
        const newQuantity = (currentQuantity - 1).toString();
    
        const generatedToken = `${ticketId}-${userId}`;
        
        const { data: orderData, error: orderError } = await supabase
  .from('order')
  .insert({
    user_id: userId,
    ticket_id: ticketId,
    payment_id: paymentIntentId,
    type: eventType === 'online' ? 'online' : 'physical',
    token: generatedToken,
    payedamount: amount,
    totalprice: amount,
    created_at: new Date().toISOString()
  })
  .select()
  .single();
    
        if (orderError) throw orderError;
    
        const { error: ticketError } = await supabase
          .from('ticket')
          .update({ quantity: newQuantity })
          .eq('id', ticketId);
    
        if (ticketError) throw ticketError;
        console.log('Creating notification for order:', orderData.id);
    await handleTicketPurchaseNotification(orderData.id);
    console.log('Notification sent successfully');
        setIsProcessing(false);
        setShowImageUpload(true);
    
      } catch (error) {
        console.error('Error creating order:', error);
        setError(error instanceof Error ? error.message : 'Failed to create order');
        setIsProcessing(false);
      }
    };

    createOrder();
  }, [ticketId, eventId, paymentIntentId, amount, userId, eventType]);

  if (isProcessing) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={tw`mt-4`}>Processing your order...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center p-4`}>
        <Text style={tw`text-red-500 text-center`}>Error: {error}</Text>
        <TouchableOpacity 
          style={tw`mt-4 bg-gray-200 p-3 rounded-lg`}
          onPress={() => navigation.goBack()}
        >
          <Text style={tw`text-center`}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-1 justify-center items-center p-4`}>
        <Text style={tw`text-2xl font-bold mb-4`}>Payment Successful!</Text>
        <Text style={tw`text-center mb-4`}>
          Your ticket has been purchased successfully.
        </Text>
      </View>

      <Modal
        visible={showImageUpload}
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
              onPress={() => {
                setShowImageUpload(false);
                navigation.navigate('EventDetails', { eventId });
              }}
            >
              <Text style={tw`text-center font-bold`}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EventPaymentSuccessScreen;