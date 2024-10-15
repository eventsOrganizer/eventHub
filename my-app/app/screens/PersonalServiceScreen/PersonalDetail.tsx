import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Service } from '../../services/serviceTypes';
import { fetchPersonalDetail, makeServiceRequest } from '../../services/personalService';
import PersonalInfo from '../../components/PersonalServiceComponents/PersonalInfo';
import CommentSection from '../../components/PersonalServiceComponents/CommentSection';
import BookingForm from '../../components/PersonalServiceComponents/BookingForm';
import BookingStatus from '../../components/PersonalServiceComponents/BookingStatus';
import ReviewForm from '../../components/PersonalServiceComponents/ReviewForm';
import { styles } from './styles';

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

  const handleReviewSubmitted = () => {
    Alert.alert('Success', 'Your review has been submitted successfully.');
    fetchData(); // Refresh the data to show the updated review
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!personalData) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No data available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{personalData.name}</Text>
        </View>
        <View style={styles.content}>
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

          <ReviewForm personalId={personalId} onReviewSubmitted={handleReviewSubmitted} />

          <CommentSection 
            comments={personalData.comment} 
            personalId={personalData.id}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PersonalDetail;