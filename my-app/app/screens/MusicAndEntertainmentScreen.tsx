// MusicAndEntertainmentScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../services/supabaseClient';
import { Picker } from '@react-native-picker/picker';  // Import Picker

const MusicAndEntertainmentScreen = ({ route, navigation }: any) => {
  const { eventName, eventDescription, eventType, selectedCategory, selectedSubcategory, selectedVenue } = route.params;
  const [entertainments, setEntertainments] = useState<any[]>([]);
  const [selectedEntertainment, setSelectedEntertainment] = useState<any>(null);

  useEffect(() => {
    const fetchEntertainments = async () => {
      const { data, error } = await supabase
        .from('service')
        .select('*')
        .eq('subcategory_id', selectedSubcategory); // Fetch entertainment/music services related to the subcategory

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setEntertainments(data);
      }
    };

    fetchEntertainments();
  }, [selectedSubcategory]);

  const handleNext = () => {
    if (selectedEntertainment) {
      navigation.navigate('EventTimeline', { eventName, eventDescription, eventType, selectedCategory, selectedSubcategory, selectedVenue, selectedEntertainment });
    } else {
      Alert.alert('Error', 'Please select entertainment');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Music or Entertainment</Text>
      <Picker
        selectedValue={selectedEntertainment}
        onValueChange={setSelectedEntertainment}
        style={styles.picker}
      >
        <Picker.Item label="Select Entertainment" value={null} />
        {entertainments.map(ent => (
          <Picker.Item key={ent.id} label={ent.name} value={ent.id} />
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

export default MusicAndEntertainmentScreen;
