import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import SuggestToFriendButton from '../suggestions/SuggestToFriendButton';

const { width } = Dimensions.get('window');

interface LocalServiceCardProps {
  item: {
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
  onPress: () => void;
}

const LocalServiceCard: React.FC<LocalServiceCardProps> = ({ item, onPress }) => {
  if (!item) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: item.media?.[0]?.url }} style={styles.image} />
      <BlurView intensity={80} tint="light" style={styles.blurContainer}>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{item.name || 'Unnamed Service'}</Text>
          <Text style={styles.price}>${item.priceperhour || 0}/hr</Text>
          {item.subcategory && (
            <Text style={styles.category} numberOfLines={1} ellipsizeMode="tail">{item.subcategory.name}</Text>
          )}
        </View>
      </BlurView>
      <View style={styles.suggestButtonContainer}>
        <SuggestToFriendButton itemId={item.id} category={item.subcategory.category} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.45,
    height: width * 0.6,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  blurContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: width * 0.15, // Fixed height for the blurred text banner
  },
  info: {
    padding: 10,
    height: '100%',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  price: {
    fontSize: 12,
    color: 'green',
    fontWeight: '600',
  },
  category: {
    fontSize: 10,
    color: '#333',
  },
  suggestButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});

export default LocalServiceCard;