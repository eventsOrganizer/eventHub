import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';

const EventCreationScreen: React.FC = ({ navigation }: any) => {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [musicAndEntertainment, setMusicAndEntertainment] = useState(false);
  const [vendors, setVendors] = useState<string[]>([]);
  const [eventStages, setEventStages] = useState<string[]>(['Arrival', 'Speech']);
  const [guests, setGuests] = useState<number>(0);
  const [invitations, setInvitations] = useState(false);

  const handleCreateEvent = () => {
    console.log({
      eventName,
      eventDescription,
      eventType,
      eventLocation,
      musicAndEntertainment,
      vendors,
      eventStages,
      guests,
      invitations,
    });
    alert('Event Created Successfully!');
    navigation.goBack();
  };

  const handleAddVendor = (vendor: string) => {
    if (!vendors.includes(vendor)) {
      setVendors(prevVendors => [...prevVendors, vendor]);
    }
  };

  const handleRemoveVendor = (vendor: string) => {
    setVendors(vendors.filter(v => v !== vendor));
  };

  const handleAddStage = () => {
    setEventStages([...eventStages, '']);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
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

      {/* Event Location Picker */}
      <Text style={styles.label}>Event Location</Text>
      <RNPicker
        selectedValue={eventLocation}
        onValueChange={setEventLocation}
        style={styles.picker}
      >
        <RNPicker.Item label="Select location" value="" />
        <RNPicker.Item label="New York" value="New York" />
        <RNPicker.Item label="Los Angeles" value="Los Angeles" />
        <RNPicker.Item label="San Francisco" value="San Francisco" />
      </RNPicker>

      {/* Music & Entertainment Toggle */}
      <Text style={styles.label}>Music & Entertainment</Text>
      <Switch
        value={musicAndEntertainment}
        onValueChange={setMusicAndEntertainment}
      />
      <Text style={styles.switchLabel}>
        {musicAndEntertainment ? 'Music and Entertainment Included' : 'Music and Entertainment Not Included'}
      </Text>

      {/* Vendors and Services */}
      <Text style={styles.label}>Vendors and Services</Text>
      <View style={styles.checkBoxContainer}>
        {['Catering', 'Photographer', 'Decorator'].map((vendor) => (
          <TouchableOpacity key={vendor} onPress={() => handleAddVendor(vendor)}>
            <Text style={styles.vendorItem}>{vendors.includes(vendor) ? `✓ ${vendor}` : vendor}</Text>
          </TouchableOpacity>
        ))}
        {vendors.length > 0 && (
          <Text style={styles.vendorsList}>Selected Vendors: {vendors.join(', ')}</Text>
        )}
      </View>

      {/* Event Stages */}
      <Text style={styles.label}>Event Stages</Text>
      {eventStages.map((stage, index) => (
        <View key={index} style={styles.stageInputContainer}>
          <TextInput
            value={stage}
            onChangeText={(text) => {
              const newStages = [...eventStages];
              newStages[index] = text;
              setEventStages(newStages);
            }}
            style={styles.input}
            placeholder={`Enter stage (e.g., ${stage})`}
          />
        </View>
      ))}
      <Button title="Add Stage" onPress={handleAddStage} />

      {/* Guest Management */}
      <Text style={styles.label}>Number of Guests</Text>
      <TextInput
        value={String(guests)}
        onChangeText={(text) => setGuests(Number(text))}
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter number of guests"
      />

      {/* Invitations */}
      <Text style={styles.label}>Manage Invitations</Text>
      <Switch
        value={invitations}
        onValueChange={setInvitations}
      />
      <Text style={styles.switchLabel}>
        {invitations ? 'Invitations enabled' : 'Invitations disabled'}
      </Text>

      {/* Create Event Button */}
      <View style={styles.buttonContainer}>
        <Button title="Create Event" onPress={handleCreateEvent} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 20, // To ensure there's space at the bottom when content is large
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#4CAF50',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
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
    textAlignVertical: 'top',
  },
  picker: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  switchLabel: {
    marginBottom: 15,
    color: '#666',
  },
  checkBoxContainer: {
    marginBottom: 15,
  },
  vendorItem: {
    fontSize: 16,
    marginBottom: 8,
    color: '#007AFF',
  },
  vendorsList: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
  stageInputContainer: {
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default EventCreationScreen;
