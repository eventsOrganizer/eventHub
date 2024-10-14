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
  };
  onPress: (service: any) => void;
}

const StaffServiceCard: React.FC<StaffServiceCardProps> = ({ service, onPress }) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={() => onPress(service)}>
      <Image source={{ uri: service.media[0]?.url }} style={styles.cardImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.cardGradient}
      >
        <Text style={styles.cardName}>{service.name}</Text>
        <View style={styles.cardInfoRow}>
          <Ionicons name="cash-outline" size={16} color="#fff" />
          <Text style={styles.cardInfoText}>${service.priceperhour}/hr</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.6,
    height: height * 0.25,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  cardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardInfoText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 5,
  },
});

export default StaffServiceCard;