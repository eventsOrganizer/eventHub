import React from 'react';
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';
import { ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

interface ImageSectionProps {
  images: string[];
}

const ImageSection: React.FC<ImageSectionProps> = ({ images }) => {
  return (
    <View style={styles.imageContainer}>
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
            <Text style={styles.noImageText}>Aucune image disponible</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    height: width * 0.75,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: width,
    height: '100%',
  },
  noImageContainer: {
    width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#666',
    fontSize: 16,
  },
});

export default ImageSection;