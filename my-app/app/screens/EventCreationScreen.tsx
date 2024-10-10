import React, { useState , useEffect} from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../services/supabaseClient'; // Assuming you've already configured supabase

const EventCreationScreen = ({ navigation }: any) => {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [categories, setCategories] = useState<any[]>([]);

  // Fetch categories from supabase with type 'event'

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('category')
        .select('*')
        .eq('type', 'event'); // Only 'event' type categories

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  const handleNext = () => {
    if (eventName && eventDescription && eventType) {
      navigation.navigate('CategorySelection', {
        eventName,
        eventDescription,
        eventType,
      });
    } else {
      Alert.alert('Error', 'Please fill all fields.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create New Event</Text>

      <Text style={styles.label}>Event Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter event name"
        value={eventName}
        onChangeText={setEventName}
      />

      <Text style={styles.label}>Event Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter event description"
        value={eventDescription}
        onChangeText={setEventDescription}
        multiline
      />

      <Text style={styles.label}>Event Type</Text>
      <Picker
        selectedValue={eventType}
        onValueChange={setEventType}
        style={styles.picker}
      >
        <Picker.Item label="Select Event Type" value="" />
        <Picker.Item label="Online" value="online" />
        <Picker.Item label="Outdoor" value="outdoor" />
        <Picker.Item label="Indoor" value="indoor" />
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
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    height: 50,
    marginBottom: 15,
  },
});

export default EventCreationScreen;
