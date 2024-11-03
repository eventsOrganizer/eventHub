import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUser } from '../../UserContext';
import { useToast } from '../../hooks/useToast';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../../navigation/types';
import { handleLocalConfirm } from './components/LocalBookingLogic';
import LocalAvailabilityCalendar from './components/LocalAvailabilityCalender';
import TimePicker from '../PersonalServiceScreen/components/TimePicker';

type LocalBookingScreenRouteProp = RouteProp<RootStackParamList, 'LocalBookingScreen'>;

const LocalBookingScreen: React.FC = () => {
  const route = useRoute<LocalBookingScreenRouteProp>();
  const navigation = useNavigation();
  const { localId, availabilityData } = route.params;
  const { userId } = useUser();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [startHour, setStartHour] = useState('09:00');
  const [endHour, setEndHour] = useState('10:00');

  const handleBooking = async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a service.",
        variant: "default",
      });
      return;
    }

    if (!selectedDate) {
      toast({
        title: "Missing Information",
        description: "Please select a date before continuing.",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await handleLocalConfirm(
        localId,
        userId,
        selectedDate,
        startHour,
        endHour
      );

      if (success) {
        toast({
          title: "Success",
          description: "Your booking request has been sent successfully.",
          variant: "default",
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error during booking:', error);
      toast({
        title: "Error",
        description: "Booking failed. Please try again.",
        variant: "destructive",
      });
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
          localId={localId}
          onSelectDate={setSelectedDate}
          startDate={availabilityData.startDate}
          endDate={availabilityData.endDate}
          availability={availabilityData.availability}
          interval={availabilityData.interval.toString()}
          selectedDate={selectedDate}
          userId={userId}
        />
        <TimePicker
          label="Start Time"
          value={startHour}
          onChange={setStartHour}
        />
        <TimePicker
          label="End Time"
          value={endHour}
          onChange={setEndHour}
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