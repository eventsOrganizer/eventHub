import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import { ShoppingBag } from 'lucide-react-native';
import { themeColors } from '../../utils/themeColors';

interface BasketHeaderProps {
  itemCount: number;
}

export const BasketHeader: React.FC<BasketHeaderProps> = ({ itemCount }) => {
  return (
    <BlurView intensity={80} tint="light" style={styles.header}>
      <View style={styles.iconContainer}>
        <ShoppingBag size={32} color={themeColors.rent.primary} />
      </View>
      <Text style={styles.title}>Your Basket</Text>
      <Text style={styles.subtitle}>
        {itemCount} {itemCount === 1 ? 'item' : 'items'}
      </Text>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: themeColors.common.black,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: themeColors.common.gray,
  },
});