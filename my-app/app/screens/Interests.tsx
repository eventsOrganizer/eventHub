// Interests.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Checkbox } from 'react-native-paper';

const interests = [
  { label: 'Tech Events', value: 'tech' },
  { label: 'Music Festivals', value: 'music' },
  { label: 'Workshops', value: 'workshop' },
  { label: 'Networking', value: 'networking' },
];

const Interest: React.FC<{ route: any }> = ({ route }) => {
  const { onFinish } = route.params; // Retrieve the onFinish function
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (value: string) => {
    setSelectedInterests((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Interests</Text>
      {interests.map((interest) => (
        <View key={interest.value} style={styles.checkboxContainer}>
          <Checkbox
            status={selectedInterests.includes(interest.value) ? 'checked' : 'unchecked'}
            onPress={() => toggleInterest(interest.value)}
          />
          <Text>{interest.label}</Text>
        </View>
      ))}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default Interest;
