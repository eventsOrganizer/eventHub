import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import PurchasedTickets from './PurchasedTickets';
import TicketScanningScreen from './TicketScanningScreen';

const TicketManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'purchased' | 'sold' | 'scan'>('purchased');
  const [soldTickets, setSoldTickets] = useState([]);
  const { userId } = useUser();

  useEffect(() => {
    if (activeTab === 'sold') {
      fetchSoldTickets();
    }
  }, [activeTab, userId]);

  const fetchSoldTickets = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('order')
      .select(`
        id,
        ticket:ticket_id (
          id,
          event:event_id (
            id,
            name,
            user_id,
            media (url)
          )
        ),
        user:user_id (
          id,
          firstname,
          lastname
        )
      `)
      .eq('ticket.event.user_id', userId);

    if (error) {
      console.error('Error fetching sold tickets:', error);
    } else if (data) {
      setSoldTickets(data as any);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'purchased':
        return <PurchasedTickets />;
      case 'sold':
        return (
          <ScrollView>
            {soldTickets.map((ticket: any) => (
              <View key={ticket.id} style={styles.ticketItem}>
                <Text style={styles.eventName}>{ticket.ticket?.event?.name || 'Unknown Event'}</Text>
                <Text>Purchased by: {ticket.user?.firstname || 'Unknown'} {ticket.user?.lastname || ''}</Text>
              </View>
            ))}
          </ScrollView>
        );
      case 'scan':
        return <TicketScanningScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'purchased' && styles.activeTab]}
          onPress={() => setActiveTab('purchased')}
        >
          <Text style={styles.tabText}>Purchased</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sold' && styles.activeTab]}
          onPress={() => setActiveTab('sold')}
        >
          <Text style={styles.tabText}>Sold</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'scan' && styles.activeTab]}
          onPress={() => setActiveTab('scan')}
        >
          <Text style={styles.tabText}>Scan</Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ticketItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default TicketManagement;