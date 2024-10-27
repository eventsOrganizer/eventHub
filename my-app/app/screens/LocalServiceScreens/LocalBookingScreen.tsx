import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUser } from '../../UserContext';
import LocalAvailabilityCalendar from './components/LocalAvailabilityCalender';
import { handleLocalConfirm } from './components/LocalBookingLogic'; // Adjusted import for handleConfirm
import { RootStackParamList } from '../../navigation/types';
import LocalTimePicker from './components/LocalTimePickers'; // Adjusted import for TimePicker
import { LinearGradient } from 'expo-linear-gradient';



type LocalBookingScreenRouteProp = RouteProp<RootStackParamList, 'LocalBookingScreen'>; // Ensure 'LocalBookingScreen' is a key in RootStackParamList
type LocalBookingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LocalBookingScreen'>; // Ensure 'LocalBookingScreen' is a key in RootStackParamList

const LocalBookingScreen: React.FC = () => {
  const route = useRoute<LocalBookingScreenRouteProp>();
  const navigation = useNavigation<LocalBookingScreenNavigationProp>();
  const { localId, availabilityData } = route.params; // Correctly destructuring localId
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
      const result = await handleLocalConfirm(localId, userId, selectedDate, startHour, endHour); // Use localId here
      
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
    <LinearGradient
      colors={['#F0F4F8', '#E1E8ED', '#D2DCE5', '#C3D0D9']}
      style={styles.container}
    >
      <ScrollView>
        <Text style={styles.title}>Book a Service</Text>
        <LocalAvailabilityCalendar
          localId={localId} // Pass localId to AvailabilityCalendar
          onSelectDate={(date: string) => setSelectedDate(date)}
          startDate={availabilityData.startDate}
          endDate={availabilityData.endDate}
          availability={availabilityData.availability}
          interval="Monthly"
          selectedDate={selectedDate}
          userId={userId}
        />
        <LocalTimePicker // Adjusted to use LocalTimePicker
          label="Start Time"
          value={startHour}
          onChange={(time: string) => setStartHour(time)}
        />
        <LocalTimePicker // Adjusted to use LocalTimePicker
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4A90E2',
  },
  bookButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#B0C4DE',
  },
  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LocalBookingScreen;