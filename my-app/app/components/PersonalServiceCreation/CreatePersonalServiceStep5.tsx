import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';

type CreatePersonalServiceStep5ScreenRouteProp = RouteProp<RootStackParamList, 'CreatePersonalServiceStep5'>;
type CreatePersonalServiceStep5ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep5'>;

const CreatePersonalServiceStep5 = () => {
  const navigation = useNavigation<CreatePersonalServiceStep5ScreenNavigationProp>();
  const route = useRoute<CreatePersonalServiceStep5ScreenRouteProp>();
  const { serviceName, description, images, price, skills, subcategoryName } = route.params;

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
      Alert.alert('Error', 'Failed to fetch subcategory. Please try again.');
      return;
    }

    try {
      // Insert the personal service
      const { data: personalData, error: personalError } = await supabase
        .from('personal')
        .insert({
          name: serviceName,
          details: description,
          priceperhour: parseFloat(price),
          subcategory_id: subcategoryId,
          user_id: userId,
        })
        .select()
        .single();

      if (personalError) throw personalError;

      // Create an album for the service
      const { data: albumData, error: albumError } = await supabase
        .from('album')
        .insert({
          name: `${serviceName} Album`,
          details: `Album for ${serviceName}`,
          user_id: userId,
        })
        .select()
        .single();

      if (albumError) throw albumError;

      // Insert images into the media table
      const mediaPromises = images.map(imageUrl => 
        supabase
          .from('media')
          .insert({
            personal_id: personalData.id,
            url: imageUrl,
            album_id: albumData.id,
            user_id: userId,
          })
      );

      await Promise.all(mediaPromises);

      // Insert skills
      const skillPromises = skills.map(skill =>
        supabase
          .from('skill')
          .insert({
            personal_id: personalData.id,
            name: skill,
          })
      );

      await Promise.all(skillPromises);

      Alert.alert('Success', 'Service and images submitted successfully!');
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
      <Text style={styles.label}>Skills: {skills.join(', ')}</Text>
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