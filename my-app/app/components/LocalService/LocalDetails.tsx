import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions } from 'react-native';
import { LocalService } from '../../services/serviceTypes';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { useToast } from '../../hooks/useToast';

interface LocalDetailsProps {
  localData: LocalService;
}

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.75;

const LocalDetails: React.FC<LocalDetailsProps> = ({ localData }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  if (!localData) return null;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch additional data if needed
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "An error occurred while loading data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <ScrollView style={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>Local Service Details</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="list-outline" size={24} color="#4A90E2" />
            <Text>{localData.subcategory?.name || 'N/A'}</Text>
          </View>
          <View style={styles.iconContainer}>
            <Ionicons name="pricetag-outline" size={24} color="#4A90E2" />
            <Text>{localData.priceperhour}€/hour</Text>
          </View>
          <View style={styles.iconContainer}>
            <Ionicons name="calendar-outline" size={24} color="#4A90E2" />
            <Text>
              {localData.startdate ? moment(localData.startdate).format('MMMM Do YYYY') : 'N/A'} to 
              {localData.enddate ? moment(localData.enddate).format('MMMM Do YYYY') : 'N/A'}
            </Text>
          </View>
          <View style={styles.iconContainer}>
            <Ionicons name="information-circle-outline" size={24} color="#4A90E2" />
            <Text>{localData.details || 'No details available'}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#fff',
  },
  detailsContainer: {
    gap: 8,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default LocalDetails;
