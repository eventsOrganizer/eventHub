import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import ServiceNameInput from '../reuseableForCreationService/ServiceNameInput';
import ServiceDescriptionInput from '../reuseableForCreationService/ServiceDescriptionInput';
import CategorySelector from '../reuseableForCreationService/CategorySelector';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

type CreatePersonalServiceStep1NavigationProp = StackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep1'>;

const subcategories = [
  { id: 153, name: 'Security' },
  { id: 154, name: 'Waiter' },
  { id: 155, name: 'Cooker' },
  { id: 183, name: 'Music team leader' },
  { id: 182, name: 'Cleaning' }
];

const CreatePersonalServiceStep1: React.FC = () => {
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<{ id: number; name: string } | null>(null);
  const navigation = useNavigation<CreatePersonalServiceStep1NavigationProp>();

  const handleNext = () => {
    if (serviceName && description && selectedCategory) {
      navigation.navigate('CreatePersonalServiceStep2', { 
        serviceName, 
        description, 
        subcategoryName: selectedCategory.name,
        subcategoryId: selectedCategory.id
      });
    } else {
      alert('Error', 'Please fill in all fields and select a subcategory');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.card}>
        <Text style={styles.title}>Create New Crew</Text>
        <Text style={styles.subtitle}>Step 1: Basic Information</Text>
        <View style={styles.inputContainer}>
          <ServiceNameInput serviceName={serviceName} setServiceName={setServiceName} />
          <ServiceDescriptionInput description={description} setDescription={setDescription} />
          <CategorySelector
            categories={subcategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </View>
        <TouchableOpacity 
          style={[styles.button, !selectedCategory && styles.buttonDisabled]}
          onPress={handleNext} 
          disabled={!selectedCategory}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4c669f',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CreatePersonalServiceStep1;