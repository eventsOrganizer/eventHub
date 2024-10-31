import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PaymentStatusProps {
  paymentStatus: 'pending' | 'completed' | null;
  payedAmount?: number;
  remainingAmount?: number;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ 
  paymentStatus, 
  payedAmount, 
  remainingAmount 
}) => {
  if (paymentStatus === 'completed') {
    return (
      <View style={styles.container}>
        <Text style={styles.successText}>
          Payment Completed: ${payedAmount?.toFixed(2)}
        </Text>
        {remainingAmount && remainingAmount > 0 && (
          <Text style={styles.remainingText}>
            Remaining amount to pay later: ${remainingAmount.toFixed(2)}
          </Text>
        )}
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginTop: 8,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
  },
  successText: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: '600',
  },
  remainingText: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 4,
  },
});

export default PaymentStatus;