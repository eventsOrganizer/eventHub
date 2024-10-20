import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import SuggestToFriendButton from '../../suggestions/SuggestToFriendButton';
import { supabase } from '../../../services/supabaseClient';

const { width: screenWidth } = Dimensions.get('window');
const containerWidth = screenWidth - 40;
const cardWidth = (containerWidth - 40) / 3;
const cardHeight = cardWidth * 1.2;

interface JokerCardProps {
  item: {
    id: number;
    name: string;
    subcategory: {
      category: {
        id: number;
        name: string;
        type: string;
      };
      name: string;
    };
    priceperhour?: number;
  };
  onPress: () => void;
}

const JokerCard: React.FC<JokerCardProps> = ({ item, onPress }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchMediaUrl();
  }, [item.id, item.subcategory.category.type]);

  const fetchMediaUrl = async () => {
    try {
      let query = supabase
        .from('media')
        .select('url');

      switch (item.subcategory.category.type) {
        case 'personal':
          query = query.eq('personal_id', item.id);
          break;
        case 'local':
          query = query.eq('local_id', item.id);
          break;
        case 'material':
          query = query.eq('material_id', item.id);
          break;
        case 'event':
          query = query.eq('event_id', item.id);
          break;
        default:
          console.error(`Unknown category type: ${item.subcategory.category.type}`);
          return;
      }

      const { data, error } = await query.single();

      if (error) throw error;

      if (data && data.url) {
        setImageUrl(data.url);
      } else {
        console.log(`No media found for ${item.subcategory.category.type} item with id ${item.id}`);
        setImageUrl('https://via.placeholder.com/150');
      }
    } catch (error) {
      console.error(`Error fetching media for ${item.subcategory.category.type} item:`, error);
      setImageUrl('https://via.placeholder.com/150');
    }
  };

  const getTypeIcon = () => {
    switch (item.subcategory.category.name) {
      case 'Crew': return 'person-outline';
      case 'Local': return 'location-outline';
      case 'Material': return 'cube-outline';
      default: return 'calendar-outline';
    }
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <LinearGradient
        colors={['#1a1a1a', '#2a2a2a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <Image 
          source={{ uri: imageUrl || 'https://via.placeholder.com/150' }} 
          style={styles.image} 
          onError={(e) => console.log(`Image load error for ${item.subcategory.category.type} item ${item.name}:`, e.nativeEvent.error)}
        />
        <View style={styles.textContainer}>
          <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
          <Text style={styles.subcategory} numberOfLines={1} ellipsizeMode="tail">
            {item.subcategory.name}
          </Text>
          {item.priceperhour !== undefined && (
            <Text style={styles.price}>${item.priceperhour}/hr</Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Ionicons name={getTypeIcon()} size={16} color="#fff" />
          </TouchableOpacity>
          <SuggestToFriendButton itemId={item.id} category={item.subcategory.category} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: cardWidth,
    height: cardHeight,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradientBackground: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
  },
  textContainer: {
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  itemName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subcategory: {
    color: '#ccc',
    fontSize: 10,
    textAlign: 'center',
  },
  price: {
    color: '#4CD964',
    fontSize: 10,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '15%',
    paddingHorizontal: 5,
  },
  button: {
    padding: 5,
  },
});

export default JokerCard;