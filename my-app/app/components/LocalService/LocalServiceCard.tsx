import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface LocalServiceCardProps {
  item: {
    id?: number;
    name?: string;
    priceperhour?: number;
    media?: { url: string }[];
    subcategory?: { name: string };
  };
  onPress: () => void;
}

const LocalServiceCard: React.FC<LocalServiceCardProps> = ({ item, onPress }) => {
  if (!item) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: item.media?.[0]?.url }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name || 'Unnamed Service'}</Text>
        <Text style={styles.price}>${item.priceperhour || 0}/hr</Text>
        {item.subcategory && (
          <Text style={styles.category}>{item.subcategory.name}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: 'green',
  },
  category: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
});

export default LocalServiceCard;