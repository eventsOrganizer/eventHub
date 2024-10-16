// TicketingScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TextInput } from 'react-native';
import { supabase } from '../services/supabaseClient';

const TicketingScreen = ({ route, navigation }: any) => {
  const { eventName, eventDescription, eventType, selectedCategory, selectedSubcategory, selectedVenue, selectedEntertainment, timeline } = route.params;
  const [ticketType, setTicketType] = useState<string>(''); // Ticket type (e.g., VIP, Regular)
  const [ticketQuantity, setTicketQuantity] = useState<number>(0); // Number of tickets available

  const createTicket = async () => {
    if (!ticketType || ticketQuantity <= 0) {
      Alert.alert('Error', 'Please enter valid ticket type and quantity.');
      return;
    }

    const { error } = await supabase
      .from('tickets')
      .insert([
        {
          event_id: route.params.eventId,
          ticket_type: ticketType,
          quantity: ticketQuantity,
        },
      ]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Ticket created!');
      setTicketType(''); // Reset input fields
      setTicketQuantity(0);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Tickets</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter ticket type (e.g., VIP, Regular)"
        value={ticketType}
        onChangeText={setTicketType}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter quantity"
        keyboardType="numeric"
        value={ticketQuantity.toString()}
        onChangeText={(text) => setTicketQuantity(Number(text))}
      />

      <Button title="Create Ticket" onPress={createTicket} color="#4CAF50" />

      <Button
        title="Next"
        onPress={() =>
          navigation.navigate('EventSummary', {
            eventName,
            eventDescription,
            eventType,
            selectedCategory,
            selectedSubcategory,
            selectedVenue,
            selectedEntertainment,
            timeline,
          })
        }
      />
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
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
});

export default TicketingScreen;
