import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert } from 'react-native';  // Add Alert import here

const EventTimelineScreen = ({ route, navigation }: any) => {
  const { eventName, eventDescription, eventType, selectedCategory, selectedSubcategory, selectedVenue, selectedEntertainment } = route.params;
  const [timeline, setTimeline] = useState<string>('');

  const handleNext = () => {
    if (timeline) {
      navigation.navigate('GuestManagement', { eventName, eventDescription, eventType, selectedCategory, selectedSubcategory, selectedVenue, selectedEntertainment, timeline });
    } else {
      Alert.alert('Error', 'Please define the event timeline');  // Use Alert to show the error
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Define Event Timeline</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter event timeline"
        value={timeline}
        onChangeText={setTimeline}
        multiline
      />
      <Button title="Next" onPress={handleNext} color="#4CAF50" />
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
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
});

export default EventTimelineScreen;
