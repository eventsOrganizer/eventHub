import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';

const EventCreationScreen: React.FC = ({ navigation }: any) => {
  // States for event creation
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('');

  const handleNext = () => {
    if (eventName && eventDescription && eventType) {
      navigation.navigate('EventDetails', {
        eventName,
        eventDescription,
        eventType,
      });
    } else {
      alert('Please fill in all fields before proceeding.');
    }
  };

  return (
    <ImageBackground source={require('../assets/svgs/OnBoardingSvg')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.header}>Create New Event</Text>

        {/* Event Name Input */}
        <Text style={styles.label}>Event Name</Text>
        <TextInput
          value={eventName}
          onChangeText={setEventName}
          style={styles.input}
          placeholder="Enter event name"
          placeholderTextColor="#fff"
        />

        {/* Event Description Input */}
        <Text style={styles.label}>Event Description</Text>
        <TextInput
          value={eventDescription}
          onChangeText={setEventDescription}
          style={[styles.input, styles.descriptionInput]}
          placeholder="Enter event description"
          placeholderTextColor="#fff"
          multiline
        />

        {/* Event Type Picker */}
        <Text style={styles.label}>Event Type</Text>
        <RNPicker
          selectedValue={eventType}
          onValueChange={setEventType}
          style={styles.picker}
        >
          <RNPicker.Item label="Select event type" value="" />
          <RNPicker.Item label="Conference" value="Conference" />
          <RNPicker.Item label="Workshop" value="Workshop" />
          <RNPicker.Item label="Meeting" value="Meeting" />
          <RNPicker.Item label="Party" value="Party" />
        </RNPicker>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <Button title="Next" onPress={handleNext} color="#4CAF50" />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#fff',
  },
  input: {
    height: 45,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    color: '#fff',
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    height: 45,
    width: '100%',
    color: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default EventCreationScreen;
