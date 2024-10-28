import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import bcrypt from 'react-native-bcrypt';
import { useUser } from '../../../UserContext';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import CloudinaryUpload from '../CloudinaryUpload';

interface BuyTicketProps {
  eventId: number;
  eventType: 'online' | 'indoor' | 'outdoor';
}

const BuyTicket: React.FC<BuyTicketProps> = ({ eventId, eventType }) => {
  const [ticketAvailable, setTicketAvailable] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<number | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { userId } = useUser();

  useEffect(() => {
    checkTicketAvailability();
  }, [eventId]);

  const checkTicketAvailability = async () => {
    const { data, error } = await supabase
      .from('ticket')
      .select('id, quantity')
      .eq('event_id', eventId)
      .single();

    if (error) {
      console.error('Error checking ticket availability:', error);
      return;
    }

    if (data && data.quantity > 0) {
      setTicketAvailable(true);
      setTicketQuantity(data.quantity);
      setTicketId(data.id);
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
      
        const { error: mediaError } = await supabase
          .from('media')
          .insert({
            url: imageUrl,
            order_id: orderData.id,
            type: 'ticket_photo'
          });
      
        if (mediaError) throw mediaError;
      
        const { error: updateError } = await supabase
          .from('ticket')
          .update({ quantity: ticketQuantity - 1 })
          .eq('id', ticketId);
      
        if (updateError) throw updateError;
      
        setToken(generatedToken);
        setTicketQuantity(prevQuantity => prevQuantity - 1);
        setShowImageUpload(false);
        Alert.alert('Success', 'Ticket purchased successfully!');
      } catch (error) {
        console.error('Error purchasing ticket:', error);
        Alert.alert('Error', 'Failed to purchase ticket. Please try again.');
      }
    }
  };
 
  const handleBuyTicket = () => {
    setShowImageUpload(true);
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