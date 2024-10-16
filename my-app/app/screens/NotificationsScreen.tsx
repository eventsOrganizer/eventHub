// NotificationsScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TextInput } from 'react-native';
import { supabase } from '../services/supabaseClient';

const NotificationsScreen = ({ route, navigation }: any) => {
  const { eventName, eventDescription, eventType, selectedCategory, selectedSubcategory, selectedVenue, selectedEntertainment, timeline } = route.params;
  const [notificationMessage, setNotificationMessage] = useState<string>('');

  const sendNotification = async () => {
    // Send a notification (you can adjust this logic based on how you're managing notifications)
    const { error } = await supabase
      .from('notifications')
      .insert([
        {
          event_id: route.params.eventId,
          message: notificationMessage,
        },
      ]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Notification sent!');
      setNotificationMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Send Notifications</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter notification message"
        value={notificationMessage}
        onChangeText={setNotificationMessage}
      />
      <Button title="Send Notification" onPress={sendNotification} color="#4CAF50" />
      <Button
        title="Next"
        onPress={() =>
          navigation.navigate('Ticketing', {
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

export default NotificationsScreen;
