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

      <Text>Event Name</Text>
      <TextInput
        value={eventName}
        onChangeText={setEventName}
        style={styles.input}
        placeholder="Enter event name"
      />

      <Text>Event Description</Text>
      <TextInput
        value={eventDescription}
        onChangeText={setEventDescription}
        style={[styles.input, styles.descriptionInput]}
        placeholder="Enter event description"
        multiline
      />

      <Text>Event Type</Text>
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

      <Button title="Create Event" onPress={handleCreateEvent} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default EventCreationScreen;
