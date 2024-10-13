import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { makeServiceRequest, initiatePayment } from '../../services/serviceTypes';

interface AvailabilityListProps {
  availability: Array<{
    id: number;
    start: string;
    end: string;
    daysofweek: string;
    date: string;
  }>;
  personalId: number;
}

const AvailabilityList: React.FC<AvailabilityListProps> = ({ availability, personalId }) => {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [hours, setHours] = useState<string>('');

  const handleMakeRequest = async () => {
    if (selectedSlot !== null && hours) {
      const result = await makeServiceRequest(personalId, availability[selectedSlot].id, parseInt(hours));
      if (result) {
        const paymentResult = await initiatePayment(result.requestData.id, result.depositAmount);
        if (paymentResult) {
          // Redirect to Flouci payment page or handle the payment process
          console.log('Payment initiated:', paymentResult);
        } else {
          alert('Failed to initiate payment. Please try again.');
        }
      } else {
        alert('Failed to create request. Please try again.');
      }
    } else {
      alert('Please select an availability slot and enter the number of hours before making a request.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Availability</Text>
      {availability?.map((slot, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.availabilitySlot,
            selectedSlot === index && styles.selectedSlot
          ]}
          onPress={() => setSelectedSlot(index)}
        >
          <Text>{`${slot.date}: ${slot.start} - ${slot.end}, ${slot.daysofweek}`}</Text>
        </TouchableOpacity>
      ))}
      <TextInput
        style={styles.input}
        placeholder="Number of hours"
        value={hours}
        onChangeText={setHours}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={styles.requestButton}
        onPress={handleMakeRequest}
      >
        <Text style={styles.requestButtonText}>Make Request and Pay Deposit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  availabilitySlot: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 5,
  },
  selectedSlot: {
    backgroundColor: '#e6f7ff',
    borderColor: '#1890ff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  requestButton: {
    backgroundColor: '#1890ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  requestButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AvailabilityList;