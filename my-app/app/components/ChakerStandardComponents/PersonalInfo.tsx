import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service } from '../../services/personalService';

interface PersonalInfoProps {
  personalData: Service;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ personalData }) => {
  return (
    <View style={styles.infoContainer}>
      <Image source={{ uri: personalData.imageUrl || 'https://via.placeholder.com/150' }} style={styles.image} />
      <Text style={styles.name}>{personalData.name}</Text>
      <Text style={styles.price}>${personalData.priceperhour}/hr</Text>
      <Text style={styles.details}>{personalData.details}</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="heart" size={24} color="red" />
          <Text>{personalData.likes?.length || 0} Likes</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="star" size={24} color="gold" />
          <Text>{personalData.reviews?.length || 0} Reviews</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: 'green',
    marginBottom: 8,
  },
  details: {
    fontSize: 16,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PersonalInfo;