import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Service } from '../../services/serviceTypes';
import { fetchPersonalDetail, toggleLike } from '../../services/personalService';
import PersonalInfo from '../../components/PersonalServiceComponents/PersonalInfo';
import CommentSection from '../../components/PersonalServiceComponents/CommentSection';
import AvailabilityCalendar from '../../components/PersonalServiceComponents/AvailabilityCalendar';
import BookingStatus from '../../components/PersonalServiceComponents/BookingStatus';
import ReviewForm from '../../components/PersonalServiceComponents/ReviewForm';
import { useUser } from '../../UserContext';
import { fetchAvailabilityData, AvailabilityData } from '../../services/availabilityService';
import { supabase } from '../../services/supabaseClient';
import { format, differenceInHours } from 'date-fns';

const PersonalDetail = () => {
  const route = useRoute();
  const { personalId } = route.params as { personalId: number };
  const { userId } = useUser();

  const [personalData, setPersonalData] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [startHour, setStartHour] = useState('');
  const [endHour, setEndHour] = useState('');
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
      if (!userId || !selectedDate || !startHour || !endHour) {
        Alert.alert('Error', 'Please select a date and enter start and end hours.');
        return;
      }

      const startDateTime = new Date(`${selectedDate}T${startHour}:00`);
      const endDateTime = new Date(`${selectedDate}T${endHour}:00`);
      const hours = differenceInHours(endDateTime, startDateTime);

      if (hours <= 0) {
        Alert.alert('Error', 'End time must be after start time.');
        return;
      }

      // Insert into availability table with statusday 'exception'
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('availability')
        .insert({
          date: selectedDate,
          daysofweek: format(new Date(selectedDate), 'EEEE').toLowerCase(),
          personal_id: personalId,
          startdate: selectedDate,
          enddate: selectedDate,
          statusday: 'exception',
          start: startHour,
          end: endHour
        })
        .select()
        .single();

      if (availabilityError) throw availabilityError;

      // Insert into personal_user table
      const { error: personalUserError } = await supabase
        .from('personal_user')
        .insert({
          personal_id: personalId,
          user_id: userId,
          availability_id: availabilityData.id,
          status: 'pending'
        });

      if (personalUserError) throw personalUserError;

      // Insert into request table
      const { error: requestError } = await supabase
        .from('request')
        .insert({
          user_id: userId,
          personal_id: personalId,
          status: 'pending',
          created_at: new Date().toISOString(),
        });

      if (requestError) throw requestError;

      setRequestStatus('pending');
      Alert.alert('Success', 'Your request has been sent to the service provider for confirmation.');
      fetchData(); // Refresh the data to update the calendar
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
            placeholder="Start Hour (HH:MM)"
            value={startHour}
            onChangeText={setStartHour}
            keyboardType="numbers-and-punctuation"
          />
          <TextInput
            style={styles.input}
            placeholder="End Hour (HH:MM)"
            value={endHour}
            onChangeText={setEndHour}
            keyboardType="numbers-and-punctuation"
          />
          <AvailabilityCalendar
            personalId={personalId}
            onSelectDate={handleDateSelect}
            startDate={availabilityData.startDate}
            endDate={availabilityData.endDate}
            availability={availabilityData.availability}
            interval="Monthly"
            selectedDate={selectedDate}
            userId={userId}
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