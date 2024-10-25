import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { CardField } from '@stripe/stripe-react-native';
import useStripePayment from '../hooks/userStripePayment'; // The hook we just created

export default function PaymentScreen() {
  const [cardDetails, setCardDetails] = useState();
  const [billingDetails, setBillingDetails] = useState({
    email: 'test@example.com', // Replace with real billing details
  });

  const { initiatePayment, loading, paymentSuccess, errorMessage } = useStripePayment();

  const handlePayPress = () => {

    //@ts-ignore
    initiatePayment(cardDetails, billingDetails);
  };

  return (
    <View>
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
            // console.log("details",details);
            
            //@ts-ignore
          setCardDetails(details);
        }}
      />
      <Button onPress={handlePayPress} title="Pay" disabled={loading} />

      {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
      {paymentSuccess && <Text style={{ color: 'green' }}>Payment Successful!</Text>}
    </View>
  );
}
