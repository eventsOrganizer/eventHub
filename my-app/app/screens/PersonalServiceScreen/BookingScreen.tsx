import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUser } from '../../UserContext';
import AvailabilityCalendar from '../../components/PersonalServiceComponents/AvailabilityCalendar';
import { handleConfirm } from './components/BookingLogic';
import { RootStackParamList } from '../../navigation/types';
import TimePicker from './components/TimePicker';

type BookingScreenRouteProp = RouteProp<RootStackParamList, 'BookingScreen'>;
type BookingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookingScreen'>;

const BookingScreen: React.FC = () => {
  const route = useRoute<BookingScreenRouteProp>();
  const navigation = useNavigation<BookingScreenNavigationProp>();
  const { personalId, availabilityData } = route.params;
  const { userId } = useUser();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [startHour, setStartHour] = useState('09:00');
  const [endHour, setEndHour] = useState('10:00');

  const handleBooking = async () => {
    if (!userId) {
      Alert.alert("Authentication Required", "Please log in to book a service.");
      return;
    }

    if (!selectedDate) {
      Alert.alert("Missing Information", "Please select a date before submitting.");
      return;
    }

    try {
      const result = await handleConfirm(personalId, userId, selectedDate, startHour, endHour);
      
      if (result) {
        Alert.alert(
          "Success",
          "Your booking request has been sent successfully.",
          [
            { text: "OK", onPress: () => navigation.goBack() }
          ]
        );
      }
    } catch (error) {
      console.error('Error during booking:', error);
      let errorMessage = "Booking failed. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Book a Service</Text>
      <AvailabilityCalendar
        personalId={personalId}
        onSelectDate={(date: string) => setSelectedDate(date)}
        startDate={availabilityData.startDate}
        endDate={availabilityData.endDate}
        availability={availabilityData.availability}
        interval="Monthly"
        selectedDate={selectedDate}
        userId={userId}
      />
      <TimePicker
        label="Start Time"
        value={startHour}
        onChange={(time: string) => setStartHour(time)}
      />
      <TimePicker
        label="End Time"
        value={endHour}
        onChange={(time: string) => setEndHour(time)}
      />
      <TouchableOpacity 
        style={[styles.bookButton, !selectedDate && styles.disabledButton]} 
        onPress={handleBooking}
        disabled={!selectedDate}
      >
        <Text style={styles.bookButtonText}>Send Booking Request</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bookButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BookingScreen;