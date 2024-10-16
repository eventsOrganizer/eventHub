import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { supabase } from '../services/supabaseClient';

const GuestManagementScreen = ({ route, navigation }: any) => {
  const { eventName, eventDescription, eventType, selectedCategory, selectedSubcategory, selectedVenue, selectedEntertainment, timeline } = route.params;
  const [guests, setGuests] = useState<any[]>([]);
  const [guestEmail, setGuestEmail] = useState<string>('');

  useEffect(() => {
    const fetchGuests = async () => {
      const { data, error } = await supabase
        .from('event_has_user')
        .select('user_id')
        .eq('event_id', route.params.eventId);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setGuests(data || []); // Always set to an array
      }
    };

    fetchGuests();
  }, [route.params.eventId]);

  const addGuest = async () => {
    if (!guestEmail) {
      Alert.alert('Error', 'Please enter a valid email.');
      return;
    }

    const { error } = await supabase
      .from('event_has_user')
      .insert([{ event_id: route.params.eventId, user_id: guestEmail }]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Guest added!');
      setGuestEmail(''); // Reset input field
    }
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Guests</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter guest email"
        value={guestEmail}
        onChangeText={setGuestEmail}
      />
      <Button title="Add Guest" onPress={addGuest} color="#4CAF50" />

      <FlatList
        data={guests}
        keyExtractor={(item) => item.user_id.toString()} // Ensure keyExtractor handles non-string IDs
        renderItem={({ item }) => (
          <View style={styles.guestItem}>
            <Text>{item.user_id}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No guests added yet!</Text>} // Fallback message when no guests
      />

      <Button
        title="Next"
        onPress={() =>
          navigation.navigate('TeamCollaboration', {
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
  guestItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});

export default GuestManagementScreen;
