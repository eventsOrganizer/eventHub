import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const EventCreationScreen: React.FC = ({ navigation }: any) => {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('');

  const handleCreateEvent = () => {
    // Handle event creation (e.g., send data to a backend or save in local state)
    console.log('Event Created:', { eventName, eventDescription, eventType });
    alert('Event Created Successfully!');
    // Navigate to event list or some other screen
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create New Event</Text>

      {/* Event Name Input */}
      <Text style={styles.label}>Event Name</Text>
      <TextInput
        value={eventName}
        onChangeText={setEventName}
        style={styles.input}
        placeholder="Enter event name"
      />

      {/* Event Description Input */}
      <Text style={styles.label}>Event Description</Text>
      <TextInput
        value={eventDescription}
        onChangeText={setEventDescription}
        style={[styles.input, styles.descriptionInput]}
        placeholder="Enter event description"
        multiline
      />

      {/* Event Type Picker */}
      <Text style={styles.label}>Event Type</Text>
      <Picker
        selectedValue={eventType}
        onValueChange={setEventType}
        style={styles.picker}
      >
        <Picker.Item label="Select event type" value="" />
        <Picker.Item label="Conference" value="Conference" />
        <Picker.Item label="Workshop" value="Workshop" />
        <Picker.Item label="Meeting" value="Meeting" />
        <Picker.Item label="Party" value="Party" />
      </Picker>

      {/* Create Event Button */}
      <View style={styles.buttonContainer}>
        <Button title="Create Event" onPress={handleCreateEvent} color="#fff" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f5f5f5', // Light background color
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#4CAF50', // Green color for header
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333', // Dark color for labels
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top', // Align text to the top in multiline input
  },
  picker: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: '#4CAF50', // Green background for button
    overflow: 'hidden', // Make sure the button has rounded corners
  },
});

export default EventCreationScreen;
