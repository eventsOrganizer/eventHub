import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';

type PaymentSuccessScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PaymentSuccess'
>;

type PaymentSuccessRouteProp = RouteProp<
  RootStackParamList,
  'PaymentSuccess'
>;

const PaymentSuccessScreen = () => {
  const navigation = useNavigation<PaymentSuccessScreenNavigationProp>();
  const route = useRoute<PaymentSuccessRouteProp>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useUser();

  const { requestId, serviceId, serviceType, paymentIntentId, amount, totalPrice } = route.params;

  useEffect(() => {
    const updatePaymentStatus = async () => {
      if (!requestId || !serviceId || !serviceType || !paymentIntentId || !userId) {
        setError('Missing required parameters');
        setIsLoading(false);
        return;
      }

      try {
        // 1. Update request payment status
        const { error: requestError } = await supabase
          .from('request')
          .update({ payment_status: 'completed' })
          .eq('id', requestId);

        if (requestError) throw requestError;

        // Determine the appropriate service field
        const serviceIdField = `${serviceType.toLowerCase()}_id`;

        // 2. Create order with payment details
        const { error: orderError } = await supabase
          .from('order')
          .insert({
            [serviceIdField]: serviceId,
            user_id: userId,
            payment: true,
            payment_id: paymentIntentId,
            request_id: requestId,
            totalprice: totalPrice,
            payedamount: amount,
          });

        if (orderError) throw orderError;

        setIsLoading(false);
      } catch (error) {
        console.error('Error updating payment status:', error);
        setError('Failed to update payment status');
        setIsLoading(false);
      }
    };

    updatePaymentStatus();
  }, [requestId, serviceId, serviceType, paymentIntentId, amount, totalPrice, userId]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={styles.loadingText}>Processing payment confirmation...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Icon name="error" size={64} color="#EF4444" />
        <Text style={[styles.title, { color: '#EF4444' }]}>Payment Error</Text>
        <Text style={styles.description}>{error}</Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#EF4444' }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="check-circle" size={64} color="#22C55E" />
      </View>
      
      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.description}>
        Your payment has been processed successfully. You can view the details in your requests.
      </Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('YourRequests', { mode: 'sent' })}
      >
        <Text style={styles.buttonText}>View My Requests</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22C55E',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default PaymentSuccessScreen;