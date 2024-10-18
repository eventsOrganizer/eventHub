import React from 'react';
import { View, Text, Button, StyleSheet, Alert, Linking } from 'react-native';
import { initiatePayment } from './flouciService';

interface PaymentActionScreenProps {
  price: number;
  personalId: string;
}

const PaymentActionScreen: React.FC<PaymentActionScreenProps> = ({ price, personalId }) => {
  const handlePayment = async () => {
    const paymentUrl = await initiatePayment(personalId, price);
    if (paymentUrl) {
      Alert.alert('Payment Initiated', `Please complete the payment at: ${paymentUrl}`);
      Linking.openURL(paymentUrl);
    } else {
      Alert.alert('Payment Failed', 'Unable to initiate payment. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Action</Text>
      <Button title="Process Payment" onPress={handlePayment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default PaymentActionScreen;