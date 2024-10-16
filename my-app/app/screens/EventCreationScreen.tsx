import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity , ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../services/supabaseClient';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

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
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create New Event</Text>

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={40} color="#007AFF" />
            <Text style={styles.imagePlaceholderText}>Select Event Image</Text>
          </View>
        )}
      </TouchableOpacity>

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
      <View style={styles.pickerContainer}>
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
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  pickerContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  imageButton: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e1e4e8',
    borderRadius: 10,
    marginBottom: 20,
  },
  imageButtonText: {
    fontSize: 16,
    color: '#333',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 10,
    color: '#007AFF',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EventCreationScreen;