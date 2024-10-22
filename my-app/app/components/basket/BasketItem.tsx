import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Trash2, ShoppingCart, Clock } from 'lucide-react-native';
import { Material } from '../../navigation/types';

interface BasketItemProps {
  item: Material;
  onRemove: () => void;
}

export const BasketItem: React.FC<BasketItemProps> = ({ item, onRemove }) => {
  return (
    <View style={styles.container}>
      {item.media && item.media.length > 0 && (
        <Image 
          source={{ uri: item.media[0].url }}
          style={styles.image}
        />
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.priceContainer}>
          {item.sell_or_rent === 'sell' ? (
            <ShoppingCart size={16} color="#4A90E2" style={styles.icon} />
          ) : (
            <Clock size={16} color="#4A90E2" style={styles.icon} />
          )}
          <Text style={styles.itemPrice}>
            ${item.sell_or_rent === 'sell' ? item.price : item.price_per_hour}
            {item.sell_or_rent === 'rent' && '/hour'}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={onRemove} style={styles.deleteButton}>
        <Trash2 size={24} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#E8F0FE', // Light blue background
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333', // Darker text for better contrast
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: '#4A90E2',
  },
  deleteButton: {
    padding: 5,
  },
});
