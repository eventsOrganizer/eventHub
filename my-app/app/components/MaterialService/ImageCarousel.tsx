import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

interface ImageCarouselProps {
  media: { url: string }[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ media }) => {
  const renderCarouselItem = ({ item }: { item: { url: string } }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: item.url }} style={styles.carouselImage} />
    </View>
  );

  return (
    <View style={styles.imageContainer}>
      <Carousel
        data={media}
        renderItem={renderCarouselItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        loop
        autoplay
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  carouselItem: {
    width: screenWidth,
    height: 300,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
});

export default ImageCarousel;