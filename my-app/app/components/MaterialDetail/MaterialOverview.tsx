import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import { Star, Tag, Heart } from 'lucide-react-native';
import { Material } from '../../navigation/types';
import { getSubcategoryIcon } from '../../utils/subcategoryIcons';

interface MaterialOverviewProps {
  material: Material;
}

const MaterialOverview: React.FC<MaterialOverviewProps> = ({ material }) => {
  const SubcategoryIcon = getSubcategoryIcon(material.subcategory_id);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.titleContainer}>
          <Title style={styles.title}>{material.name}</Title>
          {SubcategoryIcon && <SubcategoryIcon size={24} color="#4A90E2" />}
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
          <Chip icon={({ size, color }) => <Tag size={size} color={color} />} style={styles.chip} textStyle={styles.chipText}>
            {material.sell_or_rent === 'rent' ? 'For Rent' : 'For Sale'}
          </Chip>
          <Chip icon={({ size, color }) => <Heart size={size} color={color} />} style={styles.chip} textStyle={styles.chipText}>
            {material.likes || 0} Likes
          </Chip>
        </View>
        <Paragraph style={styles.description}>{material.details}</Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
    backgroundColor: 'white',
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
    color: '#4A90E2',
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
  },
  chip: {
    marginRight: 8,
    backgroundColor: '#E1E8ED',
  },
  chipText: {
    color: '#4A90E2',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
});

export default MaterialOverview;