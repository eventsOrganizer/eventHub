import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from 'react-native-paper';

interface BasketIconProps {
  count: number;
  onPress: () => void;
}

const BasketIcon: React.FC<BasketIconProps> = ({ count, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Ionicons name="basket" size={24} color="#333" />
      {count > 0 && (
        <Badge style={styles.badge}>{count}</Badge>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export default BasketIcon;