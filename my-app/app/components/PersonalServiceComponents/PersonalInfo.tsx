import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service } from '../../services/serviceTypes';
import { useUser } from '../../UserContext';

interface PersonalInfoProps {
  personalData: Service;
  onLike: () => void;
  averageRating: number | null;
  reviewCount: number;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ personalData, onLike, averageRating, reviewCount }) => {
  const { userId } = useUser();
  const isLiked = personalData.like?.some(like => like.user_id === userId) || false;
  const likes = personalData.like?.length || 0;

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: personalData.imageUrl || 'https://via.placeholder.com/150' }} 
        style={styles.image}
      />
      <Text style={styles.name}>{personalData.name}</Text>
      <Text style={styles.price}>{personalData.priceperhour}€/hour</Text>
      <Text style={styles.details}>{personalData.details}</Text>
      
      <View style={styles.footer}>
        <TouchableOpacity onPress={onLike} style={styles.likeButton}>
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={24} 
            color={isLiked ? "red" : "black"} 
          />
          <Text style={styles.likeText}>{likes} Likes</Text>
        </TouchableOpacity>
        <View style={styles.reviewContainer}>
          <Ionicons name="star" size={24} color="gold" />
          <Text style={styles.reviewText}>
            {reviewCount} Reviews
          </Text>
          {averageRating !== null && (
            <Text style={styles.ratingText}>
              ({averageRating.toFixed(1)})
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 192,
    borderRadius: 8,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    color: 'green',
    marginBottom: 8,
  },
  details: {
    color: '#4B5563',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeText: {
    marginLeft: 8,
  },
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewText: {
    marginLeft: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
});

export default PersonalInfo;