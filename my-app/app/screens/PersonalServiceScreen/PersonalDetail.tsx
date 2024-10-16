import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Service } from '../../services/serviceTypes';
import { fetchPersonalDetail, makeServiceRequest, toggleLike } from '../../services/personalService';
import PersonalInfo from '../../components/PersonalServiceComponents/PersonalInfo';
import CommentSection from '../../components/PersonalServiceComponents/CommentSection';
import Calendar from '../../components/PersonalServiceComponents/personalServiceCalandar';
import BookingForm from '../../components/PersonalServiceComponents/BookingForm';
import BookingStatus from '../../components/PersonalServiceComponents/BookingStatus';
import ReviewForm from '../../components/PersonalServiceComponents/ReviewForm';
import { useUser } from '../../UserContext';

const PersonalDetail = () => {
  const route = useRoute();
  const { personalId } = route.params as { personalId: number };
  const { userId } = useUser();

  const [personalData, setPersonalData] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [requestStatus, setRequestStatus] = useState<'pending' | 'confirmed' | 'rejected' | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchPersonalDetail(personalId);
      setPersonalData(data);
      if (data && data.availability) {
        const dates = data.availability.map(a => a.date);
        setAvailableDates(dates);
      }
    } catch (error) {
      console.error('Error fetching personal detail:', error);
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
    setShowCalendar(true);
  };

  const handleConfirm = async (selectedDate: string, hours: string) => {
    try {
      if (!userId) {
        Alert.alert('Authentication Required', 'Please log in to book a service.');
        return;
      }
      console.log('Making service request with data:', { personalId, hours: parseInt(hours), selectedDate, userId });
      const result = await makeServiceRequest(personalId, parseInt(hours), selectedDate, userId);
      if (result) {
        setRequestStatus('pending');
        Alert.alert('Success', 'Your request has been sent to the service provider for confirmation.');
      } else {
        Alert.alert('Error', 'Failed to send request. Please try again.');
      }
    } catch (error) {
      console.error('Error making service request:', error);
      if (error instanceof Error) {
        Alert.alert('Error', `An error occurred while sending your request: ${error.message}`);
      } else {
        Alert.alert('Error', 'An unknown error occurred while sending your request.');
      }
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
    fetchData(); // Refresh the data to show the updated review
  };

  if (isLoading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  if (!personalData) {
    return <View style={styles.container}><Text>No data available</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <PersonalInfo personalData={personalData} onLike={handleLike} />
      
      {!requestStatus && (
        <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      )}

      {showCalendar && !requestStatus && (
        <BookingForm
          availableDates={availableDates}
          onConfirm={handleConfirm}
        />
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
});

export default PersonalDetail;