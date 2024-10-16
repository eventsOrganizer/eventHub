import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

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
      <BlurView intensity={90} tint="dark" style={styles.cardFrame}>
        <View style={styles.topBlackSpace}>
          <Text style={styles.personalText}>Personal</Text>
        </View>
        <Image source={{ uri: service.media[0]?.url }} style={styles.cardImage} />
        <LinearGradient
          colors={['#1c1c1c', '#333333', '#FFD780']}
          style={styles.cardContent}
        >
          <Text style={styles.cardName}>{service.name}</Text>
          <View style={styles.cardInfoRow}>
            <Ionicons name="cash-outline" size={14} color="#FFD700" />
            <Text style={styles.cardInfoText}>${service.priceperhour}/hr</Text>
          </View>
          <View style={styles.reviewLikeRow}>
            <View style={styles.reviewContainer}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.reviewText}>{service.reviews || 0} Reviews</Text>
            </View>
            <View style={styles.likeContainer}>
              <Ionicons name="heart" size={14} color="#FF6347" />
              <Text style={styles.likeText}>{service.likes || 0} Likes</Text>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.blackBar} />
      </BlurView>
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Glassy effect
  },
  cardFrame: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(28, 28, 28, 0.6)', // Semi-transparent background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  topBlackSpace: {
    height: '8%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Slightly transparent
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  personalText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  cardImage: {
    width: '100%',
    height: '57%',
    resizeMode: 'cover',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  cardContent: {
    height: '35%',
    justifyContent: 'flex-end',
    padding: 8,
  },
  cardName: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  cardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardInfoText: {
    fontSize: 10,
    color: 'white',
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
    fontSize: 8,
    color: '#FFD700',
    marginLeft: 2,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeText: {
    fontSize: 8,
    color: '#FF6347',
    marginLeft: 2,
  },
  blackBar: {
    height: '5%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
});

export default StaffServiceCard;
