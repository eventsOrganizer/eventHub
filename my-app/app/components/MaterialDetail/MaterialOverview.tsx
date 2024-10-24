import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import { Star, Tag, Heart, Headphones } from 'lucide-react-native';
import { Material } from '../../navigation/types';
import { getSubcategoryIcon } from '../../utils/subcategoryIcons';
import { BlurView } from 'expo-blur';

interface MaterialOverviewProps {
  material: Material;
  theme: any;
}

const MaterialOverview: React.FC<MaterialOverviewProps> = ({ material, theme }) => {
  const SubcategoryIcon = getSubcategoryIcon(material.subcategory_id) || Headphones;

  return (
    <View style={styles.container}>
      <View style={[styles.blurContainer, { backgroundColor: theme.primary }]}>
        <View style={styles.headerContainer}>
          <View style={styles.titlePriceContainer}>
            <Title style={[styles.title, styles.whiteText]}>
              {material.name}
            </Title>
            <View style={styles.priceContainer}>
              <Title style={[styles.price, styles.whiteText]}>
                ${material.price}
              </Title>
              {material.sell_or_rent === 'rent' && (
                <Paragraph style={[styles.priceUnit, styles.whiteText]}>
                  / hour
                </Paragraph>
              )}
            </View>
          </View>
          <View style={[styles.iconContainer]}>
            <SubcategoryIcon size={32} color="white" />
          </View>
        </View>

        <View style={styles.ratingContainer}>
          <Star size={24} color="white" />
          <Paragraph style={[styles.ratingText, styles.whiteText]}>
            {material.average_rating?.toFixed(1) || 'N/A'}
          </Paragraph>
        </View>

        <View style={styles.chipContainer}>
          <Chip 
            icon={({ size }) => <Tag size={size} color="white" />} 
            style={[styles.chip, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]} 
            textStyle={[styles.chipText, styles.whiteText]}
          >
            {material.sell_or_rent === 'rent' ? 'For Rent' : 'For Sale'}
          </Chip>
          <Chip 
            icon={({ size }) => <Heart size={size} color="white" />} 
            style={[styles.chip, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]} 
            textStyle={[styles.chipText, styles.whiteText]}
          >
            {material.likes || 0} Likes
          </Chip>
        </View>

        <View style={[styles.descriptionContainer, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
          <Paragraph style={[styles.description, styles.whiteText]}>
            {material.details}
          </Paragraph>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 24,
    overflow: 'hidden',
  },
  blurContainer: {
    padding: 20,
    borderRadius: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titlePriceContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  priceUnit: {
    fontSize: 16,
    marginLeft: 4,
    opacity: 0.8,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionContainer: {
    borderRadius: 16,
    padding: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.9,
  },
  whiteText: {
    color: 'white',
  },
});

export default MaterialOverview;