import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import useStripePayment from '../payment/UseStripePayment';

type PaymentActionScreenRouteProp = RouteProp<RootStackParamList, 'PaymentAction'>;

const PaymentActionScreen: React.FC = () => {
  const route = useRoute<PaymentActionScreenRouteProp>();
  const { price, personalId } = route.params;
  const { handlePayment, loading } = useStripePayment();

  const onProcessPayment = async () => {
    await handlePayment(personalId, price);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Processing</Text>
      <Text style={styles.amount}>Amount to pay: ${price.toFixed(2)}</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.buttonContainer}>
          <Button
            onPress={onProcessPayment}
            title="Process Payment"
            disabled={loading}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  amount: {
    fontSize: 18,
    marginBottom: 30,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  }
});

export default PaymentActionScreen;