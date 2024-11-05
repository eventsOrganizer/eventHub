import React, { useState } from 'react';
import { 
  View, 
  Text,
  TextInput,
  Button,
  StyleSheet
} from 'react-native';
import { CardField } from '@stripe/stripe-react-native';
import { useEventPayment } from '../../../hooks/useEventPayment';
import { useToast } from '../../../hooks/useToast';
import tw from 'twrnc';

const EventPaymentScreen: React.FC<EventPaymentScreenProps> = ({ route, navigation }) => {
  const { initiateEventPayment, loading: stripeLoading } = useEventPayment();
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [billingDetails, setBillingDetails] = useState({ email: 'test@example.com' });
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);

  const { amount, eventId, ticketId, userId, eventType } = route.params;

  const handlePayPress = async () => {
    if (!cardDetails?.complete) {
      setErrorMessage("Please enter valid card information");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(undefined);

    try {
      const result = await initiateEventPayment(
        cardDetails,
        billingDetails,
        {
          amount,
          eventId,
          ticketId,
          eventType
        }
      );

      if (!result.success) {
        throw new Error(result.error || 'Payment failed');
      }

      navigation.navigate('EventPaymentSuccess', {
        ticketId,
        eventId,
        serviceType: 'event',
        paymentIntentId: result.paymentIntentId,
        amount,
        userId,
        eventType  // Add this line
      });

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Payment failed";
      setErrorMessage(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <Text style={tw`text-xl font-bold mb-4`}>Payment</Text>
      <Text style={tw`text-lg mb-4`}>Amount: ${amount.toFixed(2)}</Text>
      
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
        style={tw`border border-gray-300 rounded-lg p-2 mb-4`}
        placeholder="Email"
        value={billingDetails.email}
        onChangeText={(text) => setBillingDetails({ ...billingDetails, email: text })}
      />

      <View style={tw`gap-4`}>
        <Button 
          onPress={handlePayPress} 
          title={isProcessing ? "Processing..." : "Pay Now"} 
          disabled={isProcessing || stripeLoading} 
        />
        {errorMessage && <Text style={tw`text-red-500 text-center`}>{errorMessage}</Text>}
      </View>
    </View>
  );
};

export default EventPaymentScreen;