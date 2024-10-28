import React from 'react';
import { View, Image, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Play } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ImageCarouselProps {
  media: Array<{ url: string; type?: 'image' | 'video' }>;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ media }) => {
  if (!media || media.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {media.map((item, index) => (
          <View key={index} style={styles.slide}>
            {item.type === 'video' ? (
              <View style={styles.videoContainer}>
                <Image 
                  source={{ uri: item.url }} 
                  style={styles.media}
                  resizeMode="cover"
                />
                <BlurView intensity={80} style={styles.playButton}>
                  <Play size={24} color="white" />
                </BlurView>
              </View>
            ) : (
              <Image 
                source={{ uri: item.url }} 
                style={styles.media}
                resizeMode="cover"
              />
            )}
          </View>
        ))}
      </ScrollView>
      
      {/* Pagination dots */}
      <View style={styles.pagination}>
        {media.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              { backgroundColor: 'white' }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: width * 0.75,
  },
  slide: {
    width: width,
    height: width * 0.75,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -25 },
      { translateY: -25 }
    ],
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.7,
  },
});

export default ImageCarousel;
