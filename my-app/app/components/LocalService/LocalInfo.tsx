import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LocalService } from '../../services/serviceTypes'; // Assuming LocalService is the correct type
import { useUser } from '../../UserContext';

interface LocalInfoProps {
  localData: LocalService;
  likes: number;
  reviewsCount: number; // Pass reviews count dynamically
  userHasLiked: boolean;
  onLike: () => void;
}

const LocalInfo: React.FC<LocalInfoProps> = ({ localData, likes, reviewsCount, userHasLiked, onLike }) => {
  const { userId } = useUser();

  // Use the first image URL from the media array, if available
  const imageUrl = localData.media && localData.media.length > 0
    ? localData.media[0].url
    : 'https://via.placeholder.com/150';

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.image}
      />
      <Text style={styles.name}>{localData.name}</Text>
      <Text style={styles.price}>{localData.priceperhour}€/hour</Text>
      <Text style={styles.details}>{localData.details}</Text>
      
      <View style={styles.footer}>
        {/* Likes Section */}
        <TouchableOpacity onPress={onLike} style={styles.likeButton}>
          <Ionicons 
            name={userHasLiked ? "heart" : "heart-outline"} 
            size={24} 
            color={userHasLiked ? "red" : "black"} 
          />
          <Text style={styles.likeText}>{likes} Likes</Text>
        </TouchableOpacity>

        {/* Reviews Section */}
        <View style={styles.reviewContainer}>
          <Ionicons name="star" size={24} color="gold" />
          <Text style={styles.reviewText}>
            {reviewsCount} Reviews
          </Text>
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
});

export default LocalInfo;
