import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CardField } from '@stripe/stripe-react-native';
import { styles } from './styles';
import { PaymentFormProps } from '../../types/paymentTypes';

const PaymentForm: React.FC<PaymentFormProps> = ({
  isProcessing,
  onCardChange,
  onSubmit,
  amount,
  errorMessage
}) => {
  const handleSubmit = async () => {
    console.log('Pay button pressed');
    return onSubmit();
  };

  return (
    <View style={styles.container}>
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Amount to pay:</Text>
        <Text style={styles.amountValue}>${amount.toFixed(2)}</Text>
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.label}>Card Information:</Text>
        <CardField
          postalCodeEnabled={false}
          placeholders={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={styles.cardStyle}
          style={styles.cardField}
          onCardChange={(details) => {
            console.log('Card details changed:', details?.complete);
            onCardChange(details);
          }}
        />
        <Text style={styles.helperText}>
          Use 4242 4242 4242 4242 as test card number
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.button, (isProcessing) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isProcessing}
      >
        <Text style={styles.buttonText}>
          {isProcessing ? 'Processing...' : 'Pay now'}
        </Text>
        {isProcessing && <ActivityIndicator color="#FFFFFF" style={{ marginLeft: 8 }} />}
      </TouchableOpacity>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

export default PaymentForm;