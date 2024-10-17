import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Material } from '../navigation/types';

type RootStackParamList = {
  MaterialDetail: { material: Material };
};

type MaterialDetailScreenProps = MaterialTopTabScreenProps<RootStackParamList, 'MaterialDetail'>;

const MaterialDetailScreen: React.FC<MaterialDetailScreenProps> = ({ route }) => {
  const { material } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: material.media[0]?.url }} style={styles.image} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />
        <View style={styles.imageOverlay}>
          <Text style={styles.name}>{material.name}</Text>
          <Text style={styles.price}>
            {material.sell_or_rent === 'sell'
              ? `$${material.price}`
              : `$${material.price_per_hour}/hr`}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.iconTextContainer}>
          <Ionicons name="information-circle-outline" size={24} color="#4A90E2" />
          <Text style={styles.sectionTitle}>Details</Text>
        </View>
        <Text style={styles.details}>{material.details || 'No description available.'}</Text>

        <View style={styles.iconTextContainer}>
          <Ionicons name="pricetag-outline" size={24} color="#4A90E2" />
          <Text style={styles.sectionTitle}>Subcategory</Text>
        </View>
        <Text style={styles.subcategory}>{material.subcategory}</Text>

        <TouchableOpacity style={styles.button}>
          <Ionicons name="cart-outline" size={24} color="white" />
          <Text style={styles.buttonText}>
            {material.sell_or_rent === 'sell' ? 'Buy Now' : 'Rent Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
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
  button: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default MaterialDetailScreen;