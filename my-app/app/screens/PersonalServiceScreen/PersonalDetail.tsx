import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Service } from '../../services/serviceTypes';
import { fetchPersonalDetail, makeServiceRequest  } from '../../services/personalService';
import PersonalInfo from '../../components/PersonalServiceComponents/PersonalInfo';
import CommentSection from '../../components/PersonalServiceComponents/CommentSection';
import Calendar from '../../components/PersonalServiceComponents/personalServiceCalandar';
import BookingForm from '../../components/PersonalServiceComponents/BookingForm';
import BookingStatus from '../../components/PersonalServiceComponents/BookingStatus';

const PersonalDetail = () => {
  const route = useRoute();
  const { personalId } = route.params as { personalId: number };

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
    setShowCalendar(true);
  };

  const handleConfirm = async (selectedDate: string, hours: string) => {
    try {
      const result = await makeServiceRequest(personalId, parseInt(hours), selectedDate);
      if (result) {
        setRequestStatus('pending');
        Alert.alert('Success', 'Your request has been sent to the service provider for confirmation.');
      } else {
        Alert.alert('Error', 'Failed to send request. Please try again.');
      }
    } catch (error) {
      console.error('Error making service request:', error);
      Alert.alert('Error', 'An error occurred while sending your request.');
    }
  };

  if (isLoading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  if (!personalData) {
    return <View style={styles.container}><Text>No data available</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <PersonalInfo personalData={personalData} />
      
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

      <CommentSection 
        comments={personalData.comment} 
        personalId={personalData.id}
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