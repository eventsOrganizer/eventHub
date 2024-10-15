import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

interface BookingStatusProps {
  status: 'pending' | 'confirmed' | 'rejected' | null;
}

const BookingStatus: React.FC<BookingStatusProps> = ({ status }) => {
  const handlePayment = () => {
    Alert.alert('Payment', 'Redirecting to payment gateway...');
  };

  switch (status) {
    case 'pending':
      return <Text style={styles.statusText}>Your request is pending confirmation from the service provider.</Text>;
    case 'confirmed':
      return (
        <View>
          <Text style={styles.statusText}>Your request has been confirmed!</Text>
          <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
            <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </View>
      );
    case 'rejected':
      return <Text style={styles.statusText}>Your request has been rejected by the service provider.</Text>;
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  statusText: {
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
  },
  paymentButton: {
    backgroundColor: 'orange',
    padding: 15,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  paymentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingStatus;