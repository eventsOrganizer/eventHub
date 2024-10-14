import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface StaffServiceCardProps {
  service: {
    id: number;
    name: string;
    priceperhour: number;
    media: { url: string }[];
    reviews?: number;
    likes?: number;
  };
  onPress: (service: any) => void;
}

const StaffServiceCard: React.FC<StaffServiceCardProps> = ({ service, onPress }) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={() => onPress(service)}>
      <View style={styles.cardFrame}>
        <View style={styles.topWhiteSpace}>
          <Text style={styles.personalText}>Personal</Text>
        </View>
        <Image source={{ uri: service.media[0]?.url }} style={styles.cardImage} />
        <LinearGradient
  colors={['transparent', '#FFD780', '#FFFFFF']}
  style={styles.cardContent}
>
          <Text style={styles.cardName}>{service.name}</Text>
          <View style={styles.cardInfoRow}>
            <Ionicons name="cash-outline" size={14} color="#4CAF50" />
            <Text style={styles.cardInfoText}>${service.priceperhour}/hr</Text>
          </View>
          <View style={styles.reviewLikeRow}>
            <View style={styles.reviewContainer}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.reviewText}>{service.reviews || 0} Reviews</Text>
            </View>
            <View style={styles.likeContainer}>
              <Ionicons name="heart" size={14} color="#FF6B6B" />
              <Text style={styles.likeText}>{service.likes || 0} Likes</Text>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.blackBar} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.3,
    height: height * 0.28,
    marginRight: 10,
    marginBottom: 15,
  },
  cardFrame: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  topWhiteSpace: {
    height: '8%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  personalText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  cardImage: {
    width: '100%',
    height: '57%', // Increased image height
    resizeMode: 'cover',
  },
  cardContent: {
    height: '35%', // Adjusted content height
    justifyContent: 'flex-end',
    padding: 8,
  },
  cardName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#000', // Changed to black for better visibility
    textShadowColor: 'rgba(255, 255, 255, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  cardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardInfoText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginLeft: 2,
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  reviewLikeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewText: {
    fontSize: 8,
    color: 'black',
    marginLeft: 2,
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeText: {
    fontSize: 8,
    color: 'black',
    marginLeft: 2,
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  blackBar: {
    height: '5%',
    backgroundColor: 'rgba(0, 10, 0, 0.8)',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
});
export default StaffServiceCard;