import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
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
      Alert.alert('Erreur', 'Veuillez sélectionner au moins une image');
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
    <View style={styles.container}>
      <Text style={styles.label}>Nom du service : {serviceName}</Text>
      <Text style={styles.label}>Description : {description}</Text>
      <Text style={styles.label}>Catégorie : {subcategoryName}</Text>
      <ImagePicker images={images} setImages={setImages} />
      <Button title="Suivant" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default CreatePersonalServiceStep2;