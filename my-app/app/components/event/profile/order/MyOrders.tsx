import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useUser } from '../../../../UserContext';
import { supabase } from '../../../../services/supabaseClient';
import OrderCard from './OrderCard';
import { useToast } from '../../../../hooks/useToast';

interface Order {
  id: number;
  type: string;
  totalprice: number;
  payedamount: number;
  remainingamount: number;
  created_at: string;
  ticket?: {
    id: number;
    price: number;
    event: {
      id: number;
      name: string;
      availability: {
        date: string;
        start: string;
        end: string;
      }[];
      media: { id: number; url: string }[];
    };
  };
  // Rest of the interface remains the same
}

const MyOrders = () => {
  const { userId } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('order')
        .select(`
          id,
          type,
          totalprice,
          payedamount,
          remainingamount,
          created_at,
          ticket:ticket_id (
            id,
            price,
            event:event_id (
              id,
              name,
              availability (
                date,
                start,
                end
              ),
              media (
                id,
                url
              )
            )
          ),
          personal:personal_id (
            id,
            name,
            media (
              id,
              url
            )
          ),
          local:local_id (
            id,
            name,
            media (
              id,
              url
            )
          ),
          material:material_id (
            id,
            name,
            media (
              id,
              url
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
  
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderCard order={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No orders found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 24,
  }
});

export default MyOrders;