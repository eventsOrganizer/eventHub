import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface ServiceDetailsCardProps {
  name: string;
  type?: string;
  subcategory?: string;
  category?: string;
  details?: string;
  price?: number;
  imageUrl?: string;
}

const ServiceDetailsCard: React.FC<ServiceDetailsCardProps> = ({
  name,
  type = 'Unknown Type',
  subcategory = 'Uncategorized',
  category = 'Uncategorized',
  details = 'No details available',
  price,
  imageUrl = 'https://via.placeholder.com/150',
}) => {
  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.image}
      />
      <View style={styles.details}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.type}>{type}</Text>
        <Text style={styles.category}>{category} - {subcategory}</Text>
        <Text style={styles.description}>{details}</Text>
        {price !== undefined && (
          <Text style={styles.price}>${price.toFixed(2)}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  details: {
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  type: {
    fontSize: 16,
    color: '#666',
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 8,
  },
});

export default ServiceDetailsCard;