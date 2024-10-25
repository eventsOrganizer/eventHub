import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Trash2, Send, ShoppingBag } from 'lucide-react-native';
import { Material } from '../../navigation/types';

interface BasketItemProps {
  item: Material;
  onRemove: () => void;
  onPress: () => void;
  onAction: () => void;
}

export const BasketItem: React.FC<BasketItemProps> = ({ item, onRemove, onPress, onAction }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {item.media && item.media.length > 0 && (
        <Image source={{ uri: item.media[0].url }} style={styles.image} />
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>
          ${item.sell_or_rent === 'sell' ? item.price : item.price_per_hour}
          {item.sell_or_rent === 'rent' && '/hour'}
        </Text>
        <TouchableOpacity onPress={onAction} style={styles.actionButton}>
          {item.sell_or_rent === 'rent' ? (
            <>
              <Send size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Send Request</Text>
            </>
          ) : (
            <>
              <ShoppingBag size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Purchase</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onRemove} style={styles.deleteButton}>
        <Trash2 size={24} color="#FF6B6B" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#E8F0FE',
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
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#4A90E2',
    marginBottom: 5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    padding: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 12,
  },
  deleteButton: {
    padding: 5,
  },
});
