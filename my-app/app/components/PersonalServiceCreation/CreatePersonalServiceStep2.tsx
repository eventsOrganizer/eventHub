import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList, CreatePersonalServiceStep2NavigationProp } from '../../navigation/types';

type CreatePersonalServiceStep2RouteProp = RouteProp<RootStackParamList, 'CreatePersonalServiceStep2'>;

const CreatePersonalServiceStep2: React.FC = () => {
  const navigation = useNavigation<CreatePersonalServiceStep2NavigationProp>();
  const route = useRoute<CreatePersonalServiceStep2RouteProp>();
  const { serviceName, description, subcategoryName, subcategoryId } = route.params;
  const [images, setImages] = useState<string[]>([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImages((prevImages) => [
        ...prevImages,
        ...result.assets.map((asset) => asset.uri)
      ]);
    }
  };

  const handleNext = () => {
    if (images.length === 0) {
      Alert.alert('Please select at least one image');
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
      <Text style={styles.label}>Service Name: {serviceName}</Text>
      <Text style={styles.label}>Description: {description}</Text>
      <Text style={styles.label}>Category: {subcategoryName}</Text>

      <Button title="Pick Images" onPress={pickImage} />
      {images.length > 0 && (
        <Text style={styles.imagesText}>{images.length} image(s) selected</Text>
      )}
      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  imagesText: { fontSize: 14, color: 'gray', marginTop: 10 },
});

export default CreatePersonalServiceStep2;