import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch, ScrollView, Alert } from 'react-native';

const EventDetailsScreen: React.FC = ({ route, navigation }: any) => {
  const { eventName, eventDescription, eventType } = route.params;

  // Additional Event Details States
  const [budget, setBudget] = useState<number>(0);
  const [calculatedCost, setCalculatedCost] = useState<number>(0);
  const [musicAndEntertainment, setMusicAndEntertainment] = useState(false);

  const calculateTotalCost = () => {
    let total = budget;
    if (musicAndEntertainment) {
      total += 150; // Example cost for music & entertainment
    }
    setCalculatedCost(total);
  };

  useEffect(() => {
    calculateTotalCost();
  }, [musicAndEntertainment, budget]);

  const handleSubmit = () => {
    // Submit event details and navigate back or to another page
    Alert.alert('Event Created', `Your event "${eventName}" has been created!`);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <Text style={styles.header}>Event Details</Text>

      {/* Displaying Passed Data */}
      <Text style={styles.eventInfo}>Event Name: {eventName}</Text>
      <Text style={styles.eventInfo}>Event Description: {eventDescription}</Text>
      <Text style={styles.eventInfo}>Event Type: {eventType}</Text>

      {/* Budget Input */}
      <Text style={styles.label}>Event Budget</Text>
      <TextInput
        value={String(budget)}
        onChangeText={(text) => setBudget(Number(text))}
        style={styles.input}
        keyboardType="numeric"
        placeholder="Set your budget"
      />

      {/* Music & Entertainment Toggle */}
      <Text style={styles.label}>Music & Entertainment</Text>
      <Switch value={musicAndEntertainment} onValueChange={setMusicAndEntertainment} />
      <Text style={styles.switchLabel}>
        {musicAndEntertainment ? 'Music and Entertainment Included' : 'Music and Entertainment Not Included'}
      </Text>

      {/* Display Calculated Cost */}
      <Text style={styles.label}>Calculated Cost: ${calculatedCost}</Text>

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <Button title="Create Event" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  switchLabel: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
  },
  eventInfo: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default EventDetailsScreen;
