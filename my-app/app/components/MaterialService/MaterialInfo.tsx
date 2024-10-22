import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Material } from '../../navigation/types';

interface MaterialInfoProps {
  material: Material;
}

const MaterialInfo: React.FC<MaterialInfoProps> = ({ material }) => {
  return (
    <Animated.View entering={FadeInRight.duration(500).springify()} style={styles.detailsContainer}>
      <Text style={styles.name}>{material.name}</Text>
      <Text style={styles.price}>
        {material.sell_or_rent === 'sell'
          ? `$${material.price}`
          : `$${material.price_per_hour}/hr`}
      </Text>

      <Animated.View entering={FadeInRight.delay(200).duration(500).springify()}>
        <View style={styles.iconTextContainer}>
          <Ionicons name="information-circle-outline" size={24} color="#4A90E2" />
          <Text style={styles.sectionTitle}>Details</Text>
        </View>
        <Text style={styles.details}>{material.details || 'No description available.'}</Text>
      </Animated.View>

      <Animated.View entering={FadeInRight.delay(400).duration(500).springify()}>
        <View style={styles.iconTextContainer}>
          <Ionicons name="pricetag-outline" size={24} color="#4A90E2" />
          <Text style={styles.sectionTitle}>Subcategory</Text>
        </View>
        <Text style={styles.subcategory}>{material.subcategory_id}</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  details: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  subcategory: {
    fontSize: 16,
    color: '#666',
  },
});

export default MaterialInfo;