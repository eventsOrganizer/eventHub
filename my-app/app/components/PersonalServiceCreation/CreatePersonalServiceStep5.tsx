import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';

type RouteParams = {
  serviceName: string;
  description: string;
  images: string[];
  price: string;
  availabilityFrom: string;
  availabilityTo: string;
  subcategoryName: string;
  subcategoryId: string;
};

type NavigationProps = StackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep5'>;

const CreatePersonalServiceStep5 = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const { serviceName, description, images, price, availabilityFrom, availabilityTo, subcategoryName } = route.params;

  const { userId } = useUser();
  const [subcategoryId, setSubcategoryId] = useState<number | null>(null);

  useEffect(() => {
    const fetchSubcategoryId = async () => {
      const { data, error } = await supabase
        .from('subcategory')
        .select('id')
        .eq('name', subcategoryName)
        .single();

      if (error) {
        console.error('Error fetching subcategory:', error);
        Alert.alert('Error', 'Failed to fetch subcategory. Please try again.');
      } else if (data) {
        setSubcategoryId(data.id);
      }
    };

    fetchSubcategoryId();
  }, [subcategoryName]);

  const handleConfirm = async () => {
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to create a service.');
      return;
    }

    if (!subcategoryId) {
      Alert.alert('Error', 'Subcategory not found. Please try again.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('personal')
        .insert({
          name: serviceName,
          details: description,
          priceperhour: parseFloat(price),
          subcategory_id: subcategoryId,
          user_id: userId,
        });

      if (error) throw error;

      Alert.alert('Success', 'Service submitted successfully!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error submitting service:', error);
      Alert.alert('Error', 'Error submitting service. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Service Name: {serviceName}</Text>
      <Text style={styles.label}>Description: {description}</Text>
      <Text style={styles.label}>Subcategory: {subcategoryName}</Text>
      <Text style={styles.label}>Price per hour: {price}</Text>
      <Text style={styles.label}>Available From: {availabilityFrom}</Text>
      <Text style={styles.label}>Available To: {availabilityTo}</Text>
      <Text style={styles.label}>Images:</Text>
      {images.map((imageUri, index) => (
        <Image key={index} source={{ uri: imageUri }} style={styles.image} />
      ))}
      <Button title="Confirm and Submit" onPress={handleConfirm} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  image: { width: 100, height: 100, marginVertical: 10 },
});

export default CreatePersonalServiceStep5;