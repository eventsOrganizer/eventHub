import React, { useEffect, useState } from 'react';
import { View,Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import {  Service } from '../../services/serviceTypes';
import { fetchPersonalDetail } from '../../services/personalService';
import PersonalInfo from '../../components/PersonalServiceComponents/PersonalInfo';
import AvailabilityList from '../../components/PersonalServiceComponents/AvailabilityList';
import CommentSection from '../../components/PersonalServiceComponents/CommentSection';

const PersonalDetail: React.FC = () => {
  const route = useRoute();
  const { personalId } = route.params as { personalId: number };
  const [personalData, setPersonalData] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPersonalDetail(personalId);
        setPersonalData(data);
      } catch (error) {
        console.error('Error fetching personal detail:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [personalId]);

  if (isLoading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  if (!personalData) {
    return <View style={styles.container}><Text>No data available</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <PersonalInfo personalData={personalData} />
      <AvailabilityList 
        availability={personalData.availability} 
        personalId={personalData.id} 
      />
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
});

export default PersonalDetail;