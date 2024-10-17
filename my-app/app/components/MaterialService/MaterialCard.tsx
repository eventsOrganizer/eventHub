import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Material } from '../../navigation/types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 20;

interface MaterialCardProps {
  item: Material;
  index: number;
  onPress: () => void;
  onAddToBasket: () => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ item, index, onPress, onAddToBasket }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={{ uri: item.media[0]?.url }} style={styles.image} />
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.8)']}
      style={styles.gradient}
    />
    <View style={styles.cardContent}>
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.iconRow}>
        <Text style={styles.price}>
          {item.sell_or_rent === 'sell' ? `$${item.price}` : `$${item.price_per_hour}/hr`}
        </Text>
        <Ionicons
          name={item.sell_or_rent === 'sell' ? 'pricetag' : 'time'}
          size={20}
          color="#4CAF50"
        />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={onAddToBasket}>
        <Ionicons name="add-circle" size={24} color="#4A90E2" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 220,
    margin: 5,
    borderRadius: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  addButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 15,
    padding: 5,
  },
});

export default MaterialCard;