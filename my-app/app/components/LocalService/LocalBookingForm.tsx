import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useToast } from '../../hooks/useToast';
import LocalAvailabilityCalendar from './LocalAvailabilityCalendar';
import { LocalAvailabilityData } from '../../services/availabilityService';
import Toast from '../../components/ui/Toast';
import BookingConfirmation from '../../screens/PersonalServiceScreen/components/BookingConfirmation';
import { styles } from '../../screens/PersonalServiceScreen/components/BookingFormStyles';
import { handleLocalConfirm } from './LocalBookingLogic';

interface LocalBookingFormProps {
  localId: number;
  userId: string | null;
  availabilityData: LocalAvailabilityData;
  onBookingComplete: () => void;
}

const LocalBookingForm: React.FC<LocalBookingFormProps> = ({ localId, userId, availabilityData, onBookingComplete }) => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [startHour, setStartHour] = useState('');
  const [endHour, setEndHour] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const { toast } = useToast();

  const handleBooking = () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to book a service.",
        variant: "default",
      });
      return;
    }
    setShowBookingForm(true);
  };

  const validateInputs = () => {
    if (!selectedDate) {
      Alert.alert("Missing Information", "Please select a date.");
      return false;
    }
    if (!startHour) {
      Alert.alert("Missing Information", "Please enter a start time.");
      return false;
    }
    if (!endHour) {
      Alert.alert("Missing Information", "Please enter an end time.");
      return false;
    }
    return true;
  };

  const onConfirm = async () => {
    if (!validateInputs() || !userId) return;

    try {
      await handleLocalConfirm(localId, userId, selectedDate!, startHour, endHour);
      setShowSuccessToast(true);
      setBookingConfirmed(true);
      
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000);

    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while sending your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (bookingConfirmed) {
    return <BookingConfirmation selectedDate={selectedDate} startHour={startHour} endHour={endHour} />;
  }

  if (!showBookingForm) {
    return (
      <TouchableOpacity style={styles.bookNowButton} onPress={handleBooking}>
        <Text style={styles.bookNowButtonText}>Book Now</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book a Local Service</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Start Time:</Text>
        <TextInput
          style={styles.input}
          placeholder="HH:MM"
          value={startHour}
          onChangeText={setStartHour}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>End Time:</Text>
        <TextInput
          style={styles.input}
          placeholder="HH:MM"
          value={endHour}
          onChangeText={setEndHour}
        />
      </View>
      <LocalAvailabilityCalendar
        localId={localId}
        onSelectDate={setSelectedDate}
        startDate={availabilityData.startDate}
        endDate={availabilityData.endDate}
        availability={availabilityData.availability}
        interval="Monthly"
        selectedDate={selectedDate}
        userId={userId}
      />
      <TouchableOpacity 
        style={styles.confirmButton}
        onPress={onConfirm}
      >
        <Text style={styles.confirmButtonText}>Send Request</Text>
      </TouchableOpacity>
      {showSuccessToast && (
        <Toast
          message="Your request has been sent to the service provider for confirmation."
          type="success"
        />
      )}
    </View>
  );
};

export default LocalBookingForm;