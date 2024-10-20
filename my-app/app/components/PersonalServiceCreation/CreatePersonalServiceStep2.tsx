import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import ImagePicker from '../reuseableForCreationService/ImagePicker';

type CreatePersonalServiceStep2RouteProp = RouteProp<RootStackParamList, 'CreatePersonalServiceStep2'>;
type CreatePersonalServiceStep2NavigationProp = StackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep2'>;

const CreatePersonalServiceStep2: React.FC = () => {
  const navigation = useNavigation<CreatePersonalServiceStep2NavigationProp>();
  const route = useRoute<CreatePersonalServiceStep2RouteProp>();
  const { serviceName, description, subcategoryName, subcategoryId } = route.params;
  const [images, setImages] = React.useState<string[]>([]);

  const handleNext = () => {
    if (images.length === 0) {
      Alert.alert('Error', 'Please select at least one image');
    } else {
      navigation.navigate('CreatePersonalServiceStep3', {
        serviceName,
        description,
        images,
        subcategoryName,
        subcategoryId,
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create a Personal Service</Text>
        <Text style={styles.subtitle}>Step 2: Add Images</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Service Name: {serviceName}</Text>
          <Text style={styles.infoText}>Description: {description}</Text>
          <Text style={styles.infoText}>Category: {subcategoryName}</Text>
        </View>
        <ImagePicker images={images} setImages={setImages} />
        <TouchableOpacity 
          style={[styles.button, images.length === 0 && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={images.length === 0}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  card: {
    backgroundColor: 'white',
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
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CreatePersonalServiceStep2;