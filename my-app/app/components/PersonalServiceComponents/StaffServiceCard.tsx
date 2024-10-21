import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import SuggestToFriendButton from '../suggestions/SuggestToFriendButton';
const { width, height } = Dimensions.get('window');

interface StaffServiceCardProps {
  service: {
    id: number;
    name: string;
    priceperhour: number;
    media: { url: string }[];
    reviews?: number;
    likes?: number;
    subcategory: {
      category: {
        id: number;
        name: string;
        type: string;
      };
      name: string;
    };
  };
  onPress: (service: any) => void;
}

const StaffServiceCard: React.FC<StaffServiceCardProps> = ({ service, onPress }) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={() => onPress(service)}>
      <BlurView intensity={80} tint="dark" style={styles.cardFrame}>
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>Personal</Text>
        </View>
        <Image source={{ uri: service.media[0]?.url }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardName}>{service.name}</Text>
          <View style={styles.cardInfoRow}>
            <Ionicons name="cash-outline" size={14} color="#A0A0A0" />
            <Text style={styles.cardInfoText}>${service.priceperhour}/hr</Text>
          </View>
          <View style={styles.reviewLikeRow}>
            <View style={styles.reviewContainer}>
              <Ionicons name="star" size={12} color="#A0A0A0" />
              <Text style={styles.reviewText}>{service.reviews || 0} Reviews</Text>
            </View>
            <View style={styles.likeContainer}>
              <Ionicons name="heart" size={12} color="#A0A0A0" />
              <Text style={styles.likeText}>{service.likes || 0} Likes</Text>
            </View>
          </View>
        </View>
      </BlurView>
      <View style={styles.suggestButtonContainer}>
        <SuggestToFriendButton itemId={service.id} category={service.subcategory.category} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.35,
    height: height * 0.32,
    marginRight: 10,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardFrame: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(28, 28, 28, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  topBar: {
    height: '8%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardImage: {
    width: '100%',
    height: '62%',
    resizeMode: 'cover',
  },
  cardContent: {
    height: '30%',
    padding: 8,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(40, 40, 40, 0.8)',
  },
  cardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  cardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardInfoText: {
    fontSize: 12,
    color: '#A0A0A0',
    fontWeight: 'bold',
    marginLeft: 4,
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
    fontSize: 10,
    color: '#A0A0A0',
    marginLeft: 2,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeText: {
    fontSize: 10,
    color: '#A0A0A0',
    marginLeft: 2,
  },
  suggestButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});

export default StaffServiceCard;