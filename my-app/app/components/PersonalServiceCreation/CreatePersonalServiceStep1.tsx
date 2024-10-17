import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';

type CreatePersonalServiceStep1NavigationProp = NavigationProp<RootStackParamList, 'CreatePersonalServiceStep1'>;

type Subcategory = {
  id: number;
  name: string;
};

const subcategories: Subcategory[] = [
  { id: 153, name: 'Security' },
  { id: 154, name: 'Waiter' },
  { id: 155, name: 'Cooker' },
  { id: 183, name: 'Music team leader' },
];

const CreatePersonalServiceStep1: React.FC = () => {
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const navigation = useNavigation<CreatePersonalServiceStep1NavigationProp>();

  const handleNext = () => {
    if (serviceName && description && selectedSubcategory) {
      navigation.navigate('CreatePersonalServiceStep2', { 
        serviceName, 
        description, 
        subcategoryName: selectedSubcategory.name,
        subcategoryId: selectedSubcategory.id
      });
    } else {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs et sélectionner une sous-catégorie');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nom du service</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez le nom du service"
        value={serviceName}
        onChangeText={setServiceName}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez la description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Text style={styles.label}>Sous-catégorie</Text>
      <Picker
        selectedValue={selectedSubcategory ? selectedSubcategory.id : undefined}
        onValueChange={(itemValue) => {
          const selected = subcategories.find(sub => sub.id === itemValue);
          setSelectedSubcategory(selected || null);
        }}
        style={styles.input}
      >
        <Picker.Item label="Sélectionnez une sous-catégorie" value={undefined} />
        {subcategories.map((subcategory: Subcategory) => (
          <Picker.Item key={subcategory.id} label={subcategory.name} value={subcategory.id} />
        ))}
      </Picker>
      <Button 
        title="Suivant" 
        onPress={handleNext} 
        disabled={!selectedSubcategory}
      />
    </View>
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

export default CreatePersonalServiceStep1;