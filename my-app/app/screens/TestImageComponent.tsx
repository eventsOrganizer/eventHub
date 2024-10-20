import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface TestImageComponentProps {
  images: any[];
}

const TestImageComponent: React.FC<TestImageComponentProps> = ({ images }) => {
  return (
    <View style={styles.container}>
      {images.map((image, index) => (
        <Image key={index} source={image} style={styles.image} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 370, // Adjust width as needed
    height: 370, // Adjust height as needed
    resizeMode: 'contain',
    marginBottom: 65, // Add margin between images
  },
});

export default TestImageComponent;
