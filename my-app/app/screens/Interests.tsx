import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

type RootStackParamList = {
  Interests: { onComplete: () => void };
  Home: undefined; // Define other routes as needed
};

type InterestsProps = StackScreenProps<RootStackParamList, 'Interests'>;

const interestsList = [
  { id: '1', title: 'Technology' },
  { id: '2', title: 'Sports' },
  { id: '3', title: 'Music' },
  { id: '4', title: 'Art' },
  { id: '5', title: 'Travel' },
];

const Interests: React.FC<InterestsProps> = ({ navigation, route }) => {
  const { onComplete } = route.params; // Access the onComplete function
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((interest) => interest !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    onComplete(); // Call the onComplete function
    navigation.navigate('Home'); // Navigate to Home after completing
  };

  return (
    <View style={styles.container}>
      <Text>Select Your Interests:</Text>
      <FlatList
        data={interestsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.interestItem,
              selectedInterests.includes(item.id) && styles.selectedInterest,
            ]}
            onPress={() => toggleInterest(item.id)}
          >
            <Text>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Finish" onPress={handleFinish} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  interestItem: {
    padding: 12,
    marginVertical: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    width: '100%',
  },
  selectedInterest: {
    backgroundColor: '#a0d0f0', // Highlight selected interest
  },
});

export default Interests;
