import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { makeServiceRequest } from '../../services/personalService';

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

  const handleMakeRequest = async () => {
    if (selectedSlot !== null) {
      const result = await makeServiceRequest(personalId, availability[selectedSlot].id);
      if (result) {
        alert('Request sent successfully!');
      } else {
        alert('Failed to send request. Please try again.');
      }
    } else {
      alert('Please select an availability slot before making a request.');
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
      <TouchableOpacity
        style={styles.requestButton}
        onPress={handleMakeRequest}
      >
        <Text style={styles.requestButtonText}>Make Request</Text>
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