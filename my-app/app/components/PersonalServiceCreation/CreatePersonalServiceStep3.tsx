import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';

type CreatePersonalServiceStep3ScreenRouteProp = RouteProp<RootStackParamList, 'CreatePersonalServiceStep3'>;
type CreatePersonalServiceStep3ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep3'>;

const CreatePersonalServiceStep3: React.FC = () => {
  const route = useRoute<CreatePersonalServiceStep3ScreenRouteProp>();
  const navigation = useNavigation<CreatePersonalServiceStep3ScreenNavigationProp>();
  const { serviceName, description, images, subcategoryName, subcategoryId } = route.params;

  const [price, setPrice] = useState('');

  const handleNext = useCallback(() => {
    if (!price) {
      Alert.alert('Please enter a price');
    } else {
      navigation.navigate('CreatePersonalServiceStep4', {
        serviceName,
        description,
        subcategoryName,
        subcategoryId,
        images,
        price,
      });
    }
  }, [price, navigation, serviceName, description, subcategoryName, subcategoryId, images]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Price per hour</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <Button title="Next" onPress={handleNext} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default CreatePersonalServiceStep3;