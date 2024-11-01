import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Request } from '../../services/requestTypes';
import { supabase } from '../../services/supabaseClient';
import { deleteRequest } from '../../services/requestService';
import PaymentStatus from './PaymentStatus';

interface PaymentSectionProps {
    item: Request;
    onShowPaymentModal: () => void;
    onRequestDeleted: () => void;
  }
  
  interface OrderData {
    payment: boolean;
    payedamount: number;
    remainingamount: number;
  }
  
  const PaymentSection: React.FC<PaymentSectionProps> = ({ 
    item, 
    onShowPaymentModal,
    onRequestDeleted
  }) => {
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchOrderData = async () => {
        try {
          const { data: orders, error } = await supabase
            .from('order')
            .select('payment, payedamount, remainingamount')
            .eq('request_id', item.id);
  
          if (error) {
            console.error('Error fetching order data:', error);
            return;
          }
  
          // Si nous avons des commandes, prenons la dernière (la plus récente)
          if (orders && orders.length > 0) {
            const latestOrder = orders[orders.length - 1];
            setOrderData(latestOrder);
          }
        } catch (error) {
          console.error('Error in fetchOrderData:', error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchOrderData();
    }, [item.id]);
  
    const handleDelete = () => {
      Alert.alert(
        "Delete Request",
        "Are you sure you want to delete this request?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            onPress: async () => {
              try {
                await deleteRequest(item.id);
                onRequestDeleted();
              } catch (error) {
                console.error('Error deleting request:', error);
                Alert.alert("Error", "Unable to delete the request. Please try again.");
              }
            },
            style: "destructive"
          }
        ]
      );
    };
  
    if (isLoading) {
      return null;
    }
  
    // Vérification plus stricte du statut de paiement
    const isPaymentCompleted = item.payment_status === 'completed' || 
                             (orderData && orderData.payment === true) || 
                             (orderData && orderData.payedamount > 0);
    const isPendingPayment = item.payment_status === 'pending';
    const canShowPaymentButton = item.status === 'accepted' && !isPaymentCompleted && !isPendingPayment;
  
    return (
      <View style={styles.container}>
        {isPaymentCompleted ? (
          <>
            <PaymentStatus 
              paymentStatus="completed"
              payedAmount={orderData?.payedamount}
              remainingAmount={orderData?.remainingamount}
            />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>Delete Request</Text>
            </TouchableOpacity>
          </>
        ) : isPendingPayment ? (
          <PaymentStatus paymentStatus="pending" />
        ) : canShowPaymentButton ? (
          <TouchableOpacity
            style={styles.paymentButton}
            onPress={onShowPaymentModal}
          >
            <Text style={styles.paymentButtonText}>Pass to Payment</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      padding: 12,
      marginTop: 8,
      backgroundColor: '#f0f9ff',
      borderRadius: 8,
    },
    paymentButton: {
      backgroundColor: '#4CAF50',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
      alignItems: 'center',
    },
    paymentButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    deleteButton: {
      backgroundColor: '#ef4444',
      padding: 10,
      borderRadius: 5,
      marginTop: 8,
      alignItems: 'center',
    },
    deleteButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
  
  export default PaymentSection;