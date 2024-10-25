import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import bcrypt from 'react-native-bcrypt';
import QRCode from 'react-native-qrcode-svg';
import { useUser } from '../../../UserContext';

interface BuyTicketProps {
  eventId: number;
  eventType: 'online' | 'indoor' | 'outdoor';
}

const BuyTicket: React.FC<BuyTicketProps> = ({ eventId, eventType }) => {
  const [ticketAvailable, setTicketAvailable] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<number | null>(null);
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

  const handleBuyTicket = async () => {
    if (!userId || !ticketId) {
      Alert.alert('Error', 'Unable to purchase ticket. Please try again.');
      return;
    }

    const generatedToken = bcrypt.hashSync(`${ticketId}-${userId}`, 10);

    try {
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

      const { error: updateError } = await supabase
        .from('ticket')
        .update({ quantity: ticketQuantity - 1 })
        .eq('id', ticketId);

      if (updateError) throw updateError;

      setToken(generatedToken);
      setTicketQuantity(prevQuantity => prevQuantity - 1);
      Alert.alert('Success', 'Ticket purchased successfully!');
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      Alert.alert('Error', 'Failed to purchase ticket. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {ticketAvailable ? (
        <>
          <TouchableOpacity style={styles.buyButton} onPress={handleBuyTicket}>
            <Text style={styles.buyButtonText}>Buy Ticket</Text>
          </TouchableOpacity>
          <Text style={styles.availableText}>
            {ticketQuantity} tickets still available
          </Text>
          {token && (
            <View style={styles.tokenContainer}>
              <Text style={styles.tokenText}>Your ticket token:</Text>
              <Text selectable>{token}</Text>
              {eventType !== 'online' && (
                <QRCode
                  value={token}
                  size={200}
                />
              )}
            </View>
          )}
        </>
      ) : (
        <TouchableOpacity style={styles.soldOutButton} disabled>
          <Text style={styles.soldOutButtonText}>No more available tickets</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  buyButton: {
    backgroundColor: 'yellow',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buyButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  availableText: {
    marginTop: 5,
    color: 'gray',
  },
  soldOutButton: {
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  soldOutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tokenContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  tokenText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default BuyTicket;