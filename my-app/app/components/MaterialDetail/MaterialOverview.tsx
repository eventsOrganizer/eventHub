import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import { Star, Tag, Heart } from 'lucide-react-native';
import { Material } from '../../navigation/types';
import { getSubcategoryIcon } from '../../utils/subcategoryIcons';
import { LinearGradient } from 'expo-linear-gradient';

interface MaterialOverviewProps {
  material: Material;
}

const MaterialOverview: React.FC<MaterialOverviewProps> = ({ material }) => {
  const SubcategoryIcon = getSubcategoryIcon(material.subcategory_id);

  return (
    <Card style={styles.card}>
      <LinearGradient
        colors={['rgba(126, 87, 194, 0.1)', 'rgba(74, 144, 226, 0.1)']}
        style={styles.gradient}
      >
        <Card.Content>
          <View style={styles.titleContainer}>
            <Title style={styles.title}>{material.name}</Title>
            {SubcategoryIcon && <SubcategoryIcon size={24} color="#7E57C2" />}
          </View>
          <View style={styles.priceRatingContainer}>
            <Paragraph style={styles.price}>
              ${material.price} {material.sell_or_rent === 'rent' ? '/ hour' : ''}
            </Paragraph>
            <View style={styles.ratingContainer}>
              <Star size={20} color="#FFD700" />
              <Paragraph style={styles.ratingText}>
                {material.average_rating?.toFixed(1) || 'N/A'}
              </Paragraph>
            </View>
          </View>
          <View style={styles.chipContainer}>
            <Chip 
              icon={({ size }) => <Tag size={size} color="#7E57C2" />} 
              style={styles.chip} 
              textStyle={styles.chipText}
            >
              {material.sell_or_rent === 'rent' ? 'For Rent' : 'For Sale'}
            </Chip>
            <Chip 
              icon={({ size }) => <Heart size={size} color="#7E57C2" />} 
              style={styles.chip} 
              textStyle={styles.chipText}
            >
              {material.likes || 0} Likes
            </Chip>
          </View>
          <Paragraph style={styles.description}>{material.details}</Paragraph>
        </Card.Content>
      </LinearGradient>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  priceRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7E57C2',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  chip: {
    backgroundColor: 'rgba(126, 87, 194, 0.1)',
  },
  chipText: {
    color: '#7E57C2',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
});

export default MaterialOverview;