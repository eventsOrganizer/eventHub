import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import AvailabilityCalendar from './AvailabilityCalendar';
import { fetchAvailabilityData, AvailabilityData } from '../../services/availabilityService';

interface BookingFormProps {
  personalId: number;
  onConfirm: (selectedDate: string, hours: string) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ personalId, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hours, setHours] = useState('');
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData | null>(null);

  useEffect(() => {
    const loadAvailabilityData = async () => {
      try {
        const data = await fetchAvailabilityData(personalId);
        setAvailabilityData(data);
      } catch (error) {
        console.error('Error fetching availability data:', error);
      }
    };

    loadAvailabilityData();
  }, [personalId]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    if (selectedDate && hours) {
      onConfirm(selectedDate, hours);
    } else {
      console.log('Please select a date and enter the number of hours.');
    }
  };

  if (!availabilityData) {
    return <Text>Loading availability data...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <AvailabilityCalendar
        personalId={personalId}
        onSelectDate={handleDateSelect}
        startDate={availabilityData.startDate}
        endDate={availabilityData.endDate}
        availability={availabilityData.availability}
        interval="Monthly"
      />
      {selectedDate && (
        <View style={styles.bookingForm}>
          <Text style={styles.selectedDateText}>Selected Date: {selectedDate}</Text>
          <TextInput
            style={styles.input}
            placeholder="Number of hours"
            value={hours}
            onChangeText={setHours}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Send Request</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  bookingForm: {
    marginTop: 20,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingForm;