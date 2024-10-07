import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, IconButton } from 'react-native-paper';

const interests = [
  { label: 'Tech Events', value: 'tech' },
  { label: 'Music Festivals', value: 'music' },
  { label: 'Workshops', value: 'workshop' },
  { label: 'Networking', value: 'networking' },
];

const Interest: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { onFinish } = route.params; // Retrieve the onFinish function
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (value: string) => {
    setSelectedInterests((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          onPress={() => navigation.goBack()}
          size={30}
        />
        <Text style={styles.title}>Select Your Interests</Text>
      </View>
      <View style={styles.interestContainer}>
        {interests.map((interest) => (
          <TouchableOpacity
            key={interest.value}
            style={[
              styles.interestItem,
              selectedInterests.includes(interest.value) && styles.selectedItem,
            ]}
            onPress={() => toggleInterest(interest.value)}
          >
            <Text style={styles.interestText}>{interest.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button mode="contained" onPress={onFinish} style={styles.button}>
        Finish
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center', // Center the content vertically
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  interestContainer: {
    flex: 1,
    justifyContent: 'center', // Center interests in the remaining space
  },
  interestItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 10,
  },
  selectedItem: {
    backgroundColor: '#e0e0e0',
  },
  interestText: {
    fontSize: 18,
    color: 'black',
  },
  button: {
    marginTop: 20,
  },
});

export default Interest;
