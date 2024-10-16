// VenueSelectionScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../services/supabaseClient';

const VenueSelectionScreen = ({ route, navigation }: any) => {
  const { eventName, eventDescription, eventType, selectedCategory, selectedSubcategory } = route.params;
  const [venues, setVenues] = useState<any[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);

  useEffect(() => {
    const fetchVenues = async () => {
      const { data, error } = await supabase
        .from('local')
        .select('*')
        .eq('subcategory_id', selectedSubcategory);  // Fetch venues related to the selected subcategory

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setVenues(data);
      }
    };

    fetchVenues();
  }, [selectedSubcategory]);

  const handleNext = () => {
    if (selectedVenue) {
      navigation.navigate('MusicAndEntertainment', { eventName, eventDescription, eventType, selectedCategory, selectedSubcategory, selectedVenue });
    } else {
      Alert.alert('Error', 'Please select a venue');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Venue</Text>
      <Picker
        selectedValue={selectedVenue}
        onValueChange={setSelectedVenue}
        style={styles.picker}
      >
        <Picker.Item label="Select Venue" value={null} />
        {venues.map(venue => (
          <Picker.Item key={venue.id} label={venue.name} value={venue.id} />
        ))}
      </Picker>
      <Button title="Next" onPress={handleNext} color="#4CAF50" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    marginBottom: 20,
  },
});

export default VenueSelectionScreen;
