import React from 'react';
import { View, ScrollView, Image, Text, Dimensions, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../../../lib/theme';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 15 }}
      style={styles.container}
    >
      <BlurView intensity={60} tint="light" style={styles.blurContainer}>
        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={width}
        >
          {images.length > 0 ? (
            images.map((imageUrl, index) => (
              <Image 
                key={index} 
                source={{ uri: imageUrl }} 
                style={styles.image} 
                resizeMode="cover"
              />
            ))
          ) : (
            <View style={styles.noImageContainer}>
              <Text style={styles.noImageText}>No images available</Text>
            </View>
          )}
        </ScrollView>
      </BlurView>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: theme.layout.personalDetail.imageHeight,
    marginBottom: theme.layout.personalDetail.cardSpacing,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  blurContainer: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
  },
  image: {
    width,
    height: theme.layout.personalDetail.imageHeight,
  },
  noImageContainer: {
    width,
    height: theme.layout.personalDetail.imageHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.overlay,
  },
  noImageText: {
    ...theme.typography.body,
    color: theme.colors.cardDescription,
  },
});

export default ImageGallery;