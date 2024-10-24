import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';

const PaymentScreen = ({ route, navigation }) => {
  const { clientSecret } = route.params; // Get the client secret from route params
  const { confirmPayment } = useStripe();

  const handlePayment = async () => {
    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      type: 'Card', // You can set this based on your payment method
    });

    if (error) {
      console.log('Payment Confirmation Error:', error);
      Alert.alert('Payment Error', error.message); // Show error alert
    } else if (paymentIntent) {
      console.log('Payment successful!', paymentIntent);
      Alert.alert('Payment Success', 'Your payment was successful!'); // Show success alert
      // Optionally navigate to a success screen
      navigation.navigate('PaymentSuccess'); // Ensure you have a screen to navigate to
    }
  };

  useEffect(() => {
    if (clientSecret) {
      handlePayment();
    }
  }, [clientSecret]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Payment</Text>
      <CardField
        postalCodeEnabled={false}
        placeholder={{ number: '4242 4242 4242 4242' }}
        cardStyle={{
          borderColor: '#000000',
          borderWidth: 1,
          borderRadius: 8,
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
      />
      <Button title="Pay" onPress={handlePayment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default PaymentScreen;
