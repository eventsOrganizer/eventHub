import React from 'react';
import { ScrollView, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ImageCarousel = ({ images }: { images: string[] }) => (
  <ScrollView horizontal pagingEnabled style={styles.imageContainer}>
    {images.length > 0 ? (
      images.map((imageUrl, index) => (
        <Image key={index} source={{ uri: imageUrl }} style={styles.image} />
      ))
    ) : (
      <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.image} />
    )}
  </ScrollView>
);

const styles = StyleSheet.create({
  imageContainer: {
    height: 300,
  },
  image: {
    width,
    height: 300,
    resizeMode: 'cover',
  },
});

export default ImageCarousel;