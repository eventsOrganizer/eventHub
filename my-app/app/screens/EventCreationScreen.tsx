import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';

const EventCreationScreen: React.FC = ({ navigation }: any) => {
  // Event Details States
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [musicAndEntertainment, setMusicAndEntertainment] = useState(false);
  const [vendors, setVendors] = useState<string[]>([]);
  const [eventStages, setEventStages] = useState<string[]>(['Arrival', 'Speech']);
  const [guests, setGuests] = useState<number>(0);
  const [invitations, setInvitations] = useState(false);

  // Budget and Payment States
  const [budget, setBudget] = useState<number>(0);
  const [calculatedCost, setCalculatedCost] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<{ [key: string]: string }>({});

  // Handle adding vendors and calculating the total cost
  const handleAddVendor = (vendor: string) => {
    if (!vendors.includes(vendor)) {
      setVendors(prevVendors => [...prevVendors, vendor]);
    }
  };

  const handleRemoveVendor = (vendor: string) => {
    setVendors(vendors.filter(v => v !== vendor));
  };

  const calculateTotalCost = () => {
    let total = 0;

    // Base prices for services
    const servicePrices = {
      'Catering': 500,
      'Photographer': 300,
      'Decorator': 200,
      'Music & Entertainment': 150,
    };

    // Calculate total based on selected vendors
    vendors.forEach(vendor => {
      total += servicePrices[vendor] || 0;
    });

    // Add cost for venue (mocked)
    const venuePrice = eventLocation === 'New York' ? 1000 : eventLocation === 'Los Angeles' ? 800 : 600;
    total += venuePrice;

    // Add music & entertainment if enabled
    if (musicAndEntertainment) {
      total += servicePrices['Music & Entertainment'];
    }

    setCalculatedCost(total);
  };

  const handlePayment = () => {
    // Simulate payment logic (in a real app, this would involve payment processing)
    alert(`Total cost: $${calculatedCost}\nPayment Successful!`);
    setPaymentStatus({
      'Catering': 'paid',
      'Photographer': 'paid',
      'Decorator': 'paid',
      'Music & Entertainment': 'paid',
      'Venue': 'paid',
    });

    // You can add a notification system to notify the user
    sendNotification('Payment Successful', `Your payment of $${calculatedCost} was successful.`);
  };

  const sendNotification = (title: string, message: string) => {
    // This function simulates sending a notification
    Alert.alert(title, message);
  };

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
      budget,
      calculatedCost,
      paymentStatus,
    });

    if (calculatedCost <= budget) {
      handlePayment();
    } else {
      alert('Your event exceeds the set budget!');
    }
  };

  const handleAddStage = () => {
    setEventStages([...eventStages, '']);
  };

  const checkPaymentStatus = () => {
    // Check for any pending payments
    const pendingPayments = Object.entries(paymentStatus).filter(([service, status]) => status === 'pending');
    if (pendingPayments.length > 0) {
      const message = pendingPayments.map(([service]) => service).join(', ') + ' payments are pending.';
      sendNotification('Payment Reminder', message);
    }
  };

  // UseEffect hook to check for payments at intervals (e.g., every minute)
  useEffect(() => {
    const interval = setInterval(checkPaymentStatus, 60000); // Check every 60 seconds

    return () => clearInterval(interval); // Clean up the interval when the component is unmounted
  }, [paymentStatus]);

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

      {/* Budget Management */}
      <Text style={styles.label}>Event Budget</Text>
      <TextInput
        value={String(budget)}
        onChangeText={(text) => setBudget(Number(text))}
        style={styles.input}
        keyboardType="numeric"
        placeholder="Set your budget"
      />

      {/* Display Calculated Cost */}
      <Text style={styles.label}>Calculated Cost: ${calculatedCost}</Text>

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
    paddingBottom: 20,
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
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top', // Align text to the top
  },
  switchLabel: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
  },
  checkBoxContainer: {
    marginBottom: 20,
  },
  vendorItem: {
    fontSize: 16,
    padding: 5,
  },
  vendorsList: {
    fontSize: 14,
    marginTop: 10,
  },
  stageInputContainer: {
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  picker: {
    height: 45,
    width: '100%',
  },
});

export default EventCreationScreen;
