import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Service } from '../../services/serviceTypes';
import { fetchPersonalDetail, makeServiceRequest, toggleLike } from '../../services/personalService';
import PersonalInfo from '../../components/PersonalServiceComponents/PersonalInfo';
import CommentSection from '../../components/PersonalServiceComponents/CommentSection';
import AvailabilityCalendar from '../../components/PersonalServiceComponents/AvailabilityCalendar';
import BookingStatus from '../../components/PersonalServiceComponents/BookingStatus';
import ReviewForm from '../../components/PersonalServiceComponents/ReviewForm';
import { useUser } from '../../UserContext';
import { fetchAvailabilityData, AvailabilityData } from '../../services/availabilityService';

const PersonalDetail = () => {
  const route = useRoute();
  const { personalId } = route.params as { personalId: number };
  const { userId } = useUser();

  const [personalData, setPersonalData] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hours, setHours] = useState('');
  const [requestStatus, setRequestStatus] = useState<'pending' | 'confirmed' | 'rejected' | null>(null);
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData | null>(null);
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchPersonalDetail(personalId);
      setPersonalData(data);
      const availability = await fetchAvailabilityData(personalId);
      setAvailabilityData(availability);
    } catch (error) {
      console.error('Error fetching personal detail:', error);
      Alert.alert('Error', 'Failed to load personal details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [personalId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBooking = () => {
    if (!userId) {
      Alert.alert('Authentication Required', 'Please log in to book a service.');
      return;
    }
    setShowBookingForm(true);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleConfirm = async () => {
    try {
      if (!userId || !selectedDate || !hours) {
        Alert.alert('Error', 'Please select a date and enter the number of hours.');
        return;
      }
      const result = await makeServiceRequest(personalId, parseInt(hours), selectedDate, userId);
      if (result) {
        setRequestStatus('pending');
        Alert.alert('Success', 'Your request has been sent to the service provider for confirmation.');
        setShowBookingForm(false);
      } else {
        Alert.alert('Error', 'Failed to send request. Please try again.');
      }
    } catch (error) {
      console.error('Error making service request:', error);
      Alert.alert('Error', 'An error occurred while sending your request. Please try again.');
    }
  };
  const handleLike = async () => {
    if (!userId) {
      Alert.alert('Authentication Required', 'Please log in to like a service.');
      return;
    }
    const result = await toggleLike(personalId, userId);
    if (result !== null) {
      setPersonalData(prevData => {
        if (!prevData) return null;
        const newLikes = result
          ? [...(prevData.like || []), { user_id: userId }]
          : (prevData.like || []).filter(like => like.user_id !== userId);
        return { ...prevData, like: newLikes };
      });
    }
  };

  const handleReviewSubmitted = () => {
    Alert.alert('Success', 'Your review has been submitted successfully.');
    fetchData();
  };

  if (isLoading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  if (!personalData || !availabilityData) {
    return <View style={styles.container}><Text>No data available</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <PersonalInfo personalData={personalData} onLike={handleLike} />
      
      {!requestStatus && !showBookingForm && (
        <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      )}

      {showBookingForm && !requestStatus && (
        <View style={styles.bookingForm}>
          <TextInput
            style={styles.input}
            placeholder="Number of hours"
            value={hours}
            onChangeText={setHours}
            keyboardType="numeric"
          />
          <AvailabilityCalendar
            personalId={personalId}
            onSelectDate={handleDateSelect}
            startDate={availabilityData.startDate}
            endDate={availabilityData.endDate}
            availability={availabilityData.availability}
            interval="Monthly"
          />
          <TouchableOpacity style={styles.sendRequestButton} onPress={handleConfirm}>
            <Text style={styles.sendRequestButtonText}>Send Request</Text>
          </TouchableOpacity>
        </View>
      )}

      <BookingStatus status={requestStatus} />

      <ReviewForm personalId={personalData.id} onReviewSubmitted={handleReviewSubmitted} />

      <CommentSection 
        comments={personalData.comment} 
        personalId={personalData.id}
        userId={userId}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  bookButton: {
    backgroundColor: 'blue',
    padding: 15,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookingForm: {
    marginVertical: 20,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  sendRequestButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  sendRequestButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PersonalDetail;