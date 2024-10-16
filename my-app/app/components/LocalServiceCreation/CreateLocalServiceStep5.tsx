import React from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView, Alert, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { supabase } from '../../services/supabaseClient'; // Ensure correct import path
import { useUser } from '../../UserContext'; // Importing useUser
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assuming you're using MaterialIcons

type RouteParams = {
  serviceName: string;
  description: string;
  images: string[];
  price: string;
  availabilityFrom: string;
  availabilityTo: string;
  amenities: {
    wifi: boolean;
    parking: boolean;
    aircon: boolean;
  };
  subcategoryName: string;
  subcategoryId: string; // Add subcategoryId here
};

type NavigationProps = StackNavigationProp<RootStackParamList, 'CreateLocalServiceStep5'>;

const CreateLocalServiceStep5 = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const { serviceName, description, images, price, availabilityFrom, availabilityTo, amenities, subcategoryName, subcategoryId } = route.params; // Extract subcategoryId

  // Accessing userId from the context
  const { userId } = useUser();

  const handleConfirm = async () => {
    // Check if userId and subcategoryId are available
    if (!userId) {
      Alert.alert('You must be logged in to create a service.');
      return;
    }

    if (!subcategoryId) {
      Alert.alert('Subcategory ID is required.');
      return;
    }

    try {
      // Insert the local service
      const { data: localData, error: localError } = await supabase
        .from('local')
        .insert({
          name: serviceName,
          details: description,
          priceperhour: parseFloat(price),
          subcategory_id: parseInt(subcategoryId), // Ensure this is a valid integer
          user_id: userId,
        })
        .select()
        .single();

      if (localError) throw localError;

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
            local_id: localData.id,
            url: imageUrl,
            album_id: albumData.id,
            user_id: userId,
          })
      );

      await Promise.all(mediaPromises);

      Alert.alert('Service and images submitted successfully!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error submitting service:', error);
      Alert.alert('Error submitting service. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Spacing between the arrow and content */}
      <View style={styles.spacing} />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <Image source={{ uri: images[0] }} style={styles.image} />

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.label}>Local Name:</Text>
            <Text style={styles.value}>{serviceName}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.label}>Price:</Text>
            <Text style={styles.price}>${price} /hr</Text>
          </View>
        </View>

        <Text style={styles.label}>Category:</Text>
        <Text style={styles.subcategory}>{subcategoryName}</Text>

        {/* Center only the "Description:" label */}
        <Text style={[styles.label, styles.centeredLabel]}>Description:</Text>
        <Text style={styles.description}>{description}</Text>

        <View style={styles.availabilityContainer}>
          <View style={styles.availability}>
            <Text style={styles.label}>Available From:</Text>
            <Text style={styles.value}>{availabilityFrom}</Text>
          </View>
          <View style={styles.availability}>
            <Text style={styles.label}>Available To:</Text>
            <Text style={styles.value}>{availabilityTo}</Text>
          </View>
        </View>

        <Text style={styles.label}>Amenities:</Text>
        <View style={styles.amenitiesContainer}>
          <View style={styles.amenity}>
            <Icon name="wifi" size={30} color={amenities.wifi ? 'red' : 'grey'} />
            <Text style={[styles.amenityText, { color: amenities.wifi ? '#fff' : 'grey' }]}>Wifi</Text>
          </View>
          <View style={styles.amenity}>
            <Icon name="local-parking" size={30} color={amenities.parking ? 'red' : 'grey'} />
            <Text style={[styles.amenityText, { color: amenities.parking ? '#fff' : 'grey' }]}>Parking</Text>
          </View>
          <View style={styles.amenity}>
            <Icon name="ac-unit" size={30} color={amenities.aircon ? 'red' : 'grey'} />
            <Text style={[styles.amenityText, { color: amenities.aircon ? '#fff' : 'grey' }]}>Air Conditioning</Text>
          </View>
        </View>

        <Text style={styles.label}>Images:</Text>
        <FlatList
          data={images}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.scrollableImage} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button title="Confirm and Submit" onPress={handleConfirm} color="#FF3B30" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  spacing: {
    height: 60, // Spacing after the back button
  },
  scrollView: {
    padding: 20,
    paddingBottom: 80, // Make space for the sticky button
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  subcategory: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  centeredLabel: {
    textAlign: 'center', // Center only the Description label
  },
  description: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20, // Space between description and next element
    textAlign: 'center', // Center the description text
  },
  value: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  availabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  availability: {
    flex: 1,
    marginHorizontal: 5, // Add spacing between the availability items
  },
  amenitiesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  amenity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amenityText: {
    marginLeft: 10,
  },
  scrollableImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default CreateLocalServiceStep5;
