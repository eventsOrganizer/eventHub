import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import QRCode from 'react-native-qrcode-svg';

interface Ticket {
  id: number;
  event_name: string;
  token: string;
  type: 'online' | 'physical';
}

const PurchasedTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const { userId } = useUser();

  useEffect(() => {
    fetchPurchasedTickets();
  }, [userId]);

  const fetchPurchasedTickets = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('order')
      .select(`
        id,
        token,
        type,
        ticket:ticket_id (
          event:event_id (name)
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching purchased tickets:', error);
      return;
    }

    if (data) {
      const formattedTickets: Ticket[] = data.map((item: any) => ({
        id: item.id,
        event_name: item.ticket.event.name,
        token: item.token,
        type: item.type,
      }));
      setTickets(formattedTickets);
    }
  };

  const renderTicket = ({ item }: { item: Ticket }) => (
    <View style={styles.ticketContainer}>
      <Text style={styles.eventName}>{item.event_name}</Text>
      <Text style={styles.ticketType}>{item.type === 'online' ? 'Online Event' : 'Physical Event'}</Text>
      <Text style={styles.tokenText}>Token: {item.token}</Text>
      {item.type === 'physical' && (
        <QRCode
          value={item.token}
          size={150}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Purchased Tickets</Text>
      <FlatList
        data={tickets}
        renderItem={renderTicket}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No purchased tickets found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  ticketContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ticketType: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  tokenText: {
    fontSize: 14,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});

export default PurchasedTickets;