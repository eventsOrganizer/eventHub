import React, { useState } from 'react';
import { View, Button, Text, TextInput, StyleSheet } from 'react-native';
import { CardField } from '@stripe/stripe-react-native';
import useStripePayment from '../../hooks/userStripePayment';
import { PaymentModalProps } from "../../navigation/types";

const PaymentModal: React.FC = ({ route, navigation }) => {
  const { amount,local_id}:PaymentModalProps = route.params;
  const [cardDetails, setCardDetails] = useState<any>();
  const [billingDetails, setBillingDetails] = useState({ email: 'test@example.com' });
  const { initiatePayment, loading, paymentSuccess, errorMessage } = useStripePayment();

  const handlePayPress = async () => {
    if (cardDetails?.complete) {
      const paymentData: PaymentModalProps = {
        amount,
        local_id ,
      };
      await initiatePayment(cardDetails, billingDetails, paymentData);
    } else {
      console.log('Please complete card details.');
    }
  };
  return (
    <View style={styles.modalContainer}>
      <Text style={styles.title}>Payment</Text>
      <Text style={styles.amount}>Amount: ${(amount / 100).toFixed(2)}</Text>
      <CardField
        postalCodeEnabled={false}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
        onCardChange={(details) => {
          setCardDetails(details);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={billingDetails.email}
        onChangeText={(text) => setBillingDetails({ ...billingDetails, email: text })}
      />
      <View style={styles.buttonContainer}>
        <Button onPress={handlePayPress} title="Pay" disabled={loading} color="#4CAF50" />
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        {paymentSuccess && <Text style={styles.success}>Payment Successful!</Text>}
        <Button title="Close" onPress={() => navigation.goBack()} color="#F44336" />
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  innerContainer: {
    width: '80%', // Adjust width as needed
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  amount: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
  },
  success: {
    color: 'green',
  },
});

export default PaymentModal;