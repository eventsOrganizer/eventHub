import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Calendar from '../../components/PersonalServiceComponents/personalServiceCalandar';

interface BookingFormProps {
  availableDates: string[];
  onConfirm: (selectedDate: string, hours: string) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ availableDates, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hours, setHours] = useState('');

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    if (selectedDate && hours) {
      onConfirm(selectedDate, hours);
    }
  };

  return (
    <View>
      <Calendar
        availableDates={availableDates}
        onSelectDate={handleDateSelect}
      />
      {selectedDate && (
        <View style={styles.bookingForm}>
          <Text>Selected Date: {selectedDate}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  bookingForm: {
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  confirmButton: {
    backgroundColor: 'green',
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