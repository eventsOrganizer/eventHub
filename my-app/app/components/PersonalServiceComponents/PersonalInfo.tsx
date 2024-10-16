import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service } from '../../services/serviceTypes';
import { useUser } from '../../UserContext';

interface PersonalInfoProps {
  personalData: Service;
  onLike: () => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ personalData, onLike }) => {
  const { userId } = useUser();
  const likes = personalData.like?.length || 0;
  const isLiked = personalData.like?.some(like => like.user_id === userId) || false;

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
        <TouchableOpacity onPress={onLike} style={styles.likeButton}>
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