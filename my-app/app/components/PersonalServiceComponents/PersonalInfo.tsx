import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service } from '../../services/serviceTypes';
import { toggleLike } from '../../services/personalService';

interface PersonalInfoProps {
  personalData: Service;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ personalData }) => {
  const [likes, setLikes] = useState(personalData.like?.length || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    const result = await toggleLike(personalData.id);
    if (result !== null) {
      setLikes(prev => isLiked ? prev - 1 : prev + 1);
      setIsLiked(!isLiked);
    }
  };

  const reviewCount = personalData.review?.length || 0;
  const averageRating = personalData.review && personalData.review.length > 0
    ? personalData.review.reduce((sum, review) => sum + review.rate, 0) / reviewCount
    : 0;

  return (
    <View style={styles.infoContainer}>
      <Image source={{ uri: personalData.imageUrl || 'https://via.placeholder.com/150' }} style={styles.image} />
      <Text style={styles.name}>{personalData.name}</Text>
      <Text style={styles.price}>${personalData.priceperhour}/hr</Text>
      <Text style={styles.details}>{personalData.details}</Text>
      
      <View style={styles.statsContainer}>
        <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
          <Ionicons name={isLiked ? "heart" : "heart-outline"} size={24} color={isLiked ? "red" : "black"} />
          <Text>{likes} Likes</Text>
        </TouchableOpacity>
        <View style={styles.statItem}>
          <Ionicons name="star" size={24} color="gold" />
          <Text>{reviewCount} Reviews (Avg: {averageRating.toFixed(1)})</Text>
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
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PersonalInfo;