import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../services/supabaseClient';
import * as ImagePicker from 'expo-image-picker';

const EventCreationScreen = ({ navigation }: any) => {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('category')
        .select('*')
        .eq('type', 'event');

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleNext = () => {
    if (eventName && eventDescription && eventType && selectedImage) {
      navigation.navigate('CategorySelection', {
        eventName,
        eventDescription,
        eventType,
        eventImage: selectedImage,
      });
    } else {
      Alert.alert('Error', 'Please fill all fields and select an image.');
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

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>Select Event Image</Text>
      </TouchableOpacity>

      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
      )}

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
  imageButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  imageButtonText: {
    fontSize: 16,
    color: '#333',
  },
  imagePreview: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 15,
    alignSelf: 'center',
  },
});

export default EventCreationScreen;