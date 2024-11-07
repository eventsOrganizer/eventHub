import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const DEFAULT_IMAGE = 'https://wac-cdn.atlassian.com/dam/jcr:a5389e4f-ead1-4ce6-873b-693300b7e844/JSM%20Product%20Tour%20Gartner%20ITSM.svg?cdnVersion=1277';

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
  imageUrl = DEFAULT_IMAGE,
}) => {
  // Validate imageUrl before using it
  const validImageUrl = (imageUrl && imageUrl.trim().length > 0) ? imageUrl : DEFAULT_IMAGE;

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: validImageUrl }} 
        style={styles.image}
        defaultSource={{ uri: DEFAULT_IMAGE }}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.subtitle}>Type: {type}</Text>
        <Text style={styles.subtitle}>Catégorie: {category}</Text>
        <Text style={styles.subtitle}>Sous-catégorie: {subcategory}</Text>
        {price !== undefined && (
          <Text style={styles.price}>
            Prix: {price} {type === 'Material' ? '' : '/heure'}
          </Text>
        )}
        <Text style={styles.details}>{details}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: '#2E8B57',
    fontWeight: '600',
    marginBottom: 8,
  },
  details: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
});

export default ServiceDetailsCard;