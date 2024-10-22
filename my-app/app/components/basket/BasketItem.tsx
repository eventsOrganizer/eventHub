import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Material } from '../../navigation/types';
import { Swipeable } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';

interface BasketItemProps {
  item: Material;
  onRemove: (id: string) => void;
}

export const BasketItem: React.FC<BasketItemProps> = ({ item, onRemove }) => {
  const renderRightActions = () => {
    return (
      <TouchableOpacity style={styles.deleteButton} onPress={() => onRemove(item.id)}>
        <AntDesign name="delete" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.media[0]?.url }} style={styles.image} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>
            ${item.sell_or_rent === 'sell' ? item.price : item.price_per_hour}
            {item.sell_or_rent === 'rent' ? ' / hour' : ''}
          </Text>
          <Text style={styles.itemType}>{item.sell_or_rent === 'sell' ? 'For Sale' : 'For Rent'}</Text>
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    alignItems: 'center',
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
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: '#4A90E2',
    marginBottom: 5,
  },
  itemType: {
    fontSize: 12,
    color: '#888',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
});