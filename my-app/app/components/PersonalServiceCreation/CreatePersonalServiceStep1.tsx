import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import ServiceNameInput from '../reuseableForCreationService/ServiceNameInput';
import ServiceDescriptionInput from '../reuseableForCreationService/ServiceDescriptionInput';
import CategorySelector from '../reuseableForCreationService/CategorySelector';

type CreatePersonalServiceStep1NavigationProp = StackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep1'>;

const subcategories = [
  { id: 153, name: 'Security' },
  { id: 154, name: 'Waiter' },
  { id: 155, name: 'Cooker' },
  { id: 183, name: 'Music team leader' },
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
      Alert.alert('Erreur', 'Veuillez remplir tous les champs et sélectionner une sous-catégorie');
    }
  };

  return (
    <View style={styles.container}>
      <ServiceNameInput serviceName={serviceName} setServiceName={setServiceName} />
      <ServiceDescriptionInput description={description} setDescription={setDescription} />
      <CategorySelector
        categories={subcategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <Button 
        title="Suivant" 
        onPress={handleNext} 
        disabled={!selectedCategory}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default CreatePersonalServiceStep1;