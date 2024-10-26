import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { Trash2, Send, ShoppingBag } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Material } from '../../navigation/types';
import { themeColors } from '../../utils/themeColors';

const { width } = Dimensions.get('window');

interface BasketItemProps {
  item: Material;
  onRemove: () => void;
  onPress: () => void;
  onAction: () => void;
}

export const BasketItem: React.FC<BasketItemProps> = ({ 
  item, 
  onRemove, 
  onPress, 
  onAction 
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <BlurView intensity={50} tint="light" style={styles.container}>
        <View style={styles.imageContainer}>
          {item.media && item.media.length > 0 && (
            <Image source={{ uri: item.media[0].url }} style={styles.image} />
          )}
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.itemName}>{item.name}</Text>
            <TouchableOpacity 
              onPress={onRemove} 
              style={styles.deleteButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Trash2 size={20} color={themeColors.common.error} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.itemPrice}>
            ${item.sell_or_rent === 'sell' ? item.price : item.price_per_hour}
            {item.sell_or_rent === 'rent' && '/hour'}
          </Text>
          
          <TouchableOpacity onPress={onAction}>
            <LinearGradient
              colors={item.sell_or_rent === 'rent' 
                ? themeColors.rent.gradient 
                : themeColors.sale.gradient
              }
              style={styles.actionButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
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
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imageContainer: {
    width: width * 0.25,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    margin: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    paddingLeft: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: themeColors.common.black,
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: themeColors.rent.primary,
    fontWeight: '600',
    marginVertical: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});