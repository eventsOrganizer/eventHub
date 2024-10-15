import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'; // Add image picker library if needed

type RouteParams = {
  serviceName: string;
  description: string;
  subcategoryId: number;
};

// Define the type for your navigation stack
type RootStackParamList = {
  CreateLocalServiceStep3: {
    serviceName: string;
    description: string;
    images: string[];
    subcategoryId: number;
  };
  // ... other routes
};

// Define the props for your component
type CreateLocalServiceStep2NavigationProp = NavigationProp<
  RootStackParamList,
  'CreateLocalServiceStep3'
>;

type CreateLocalServiceStep2RouteProp = RouteProp<
  RootStackParamList,
  'CreateLocalServiceStep3'
>;

type Props = {
  navigation: CreateLocalServiceStep2NavigationProp;
  route: CreateLocalServiceStep2RouteProp;
};

const CreateLocalServiceStep2: React.FC<Props> = ({ navigation, route }) => {
  const { serviceName, description, subcategoryId } = route.params;
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
      navigation.navigate('CreateLocalServiceStep3', {
        serviceName,
        description,
        images,
        subcategoryId,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Service Name: {serviceName}</Text>
      <Text style={styles.label}>Description: {description}</Text>
      <Text style={styles.label}>Subcategory ID: {subcategoryId}</Text>

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

export default CreateLocalServiceStep2;
