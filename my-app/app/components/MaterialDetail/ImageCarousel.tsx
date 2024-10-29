import React, { useState, useRef } from 'react';
import { View, Image, ScrollView, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { BlurView } from 'expo-blur';
import { Play, Pause } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ImageCarouselProps {
  media: Array<{ url: string; type?: 'image' | 'video' }>;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ media }) => {
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<Video | null>(null);

  if (!media || media.length === 0) return null;

  const handleVideoPress = async (index: number) => {
    if (activeVideoIndex === index) {
      if (videoRef.current) {
        if (isPlaying) {
          await videoRef.current.pauseAsync();
        } else {
          await videoRef.current.playAsync();
        }
        setIsPlaying(!isPlaying);
      }
    } else {
      setActiveVideoIndex(index);
      setIsPlaying(true);
    }
  };

  const handleVideoStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    setIsPlaying(status.isPlaying);
  };

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
                <Video
                  ref={index === activeVideoIndex ? videoRef : null}
                  source={{ uri: item.url }}
                  style={styles.media}
                  resizeMode={ResizeMode.COVER}
                  isLooping
                  shouldPlay={activeVideoIndex === index && isPlaying}
                  onPlaybackStatusUpdate={handleVideoStatusUpdate}
                />
                <TouchableOpacity 
                  style={styles.playButtonContainer}
                  onPress={() => handleVideoPress(index)}
                >
                  <BlurView intensity={80} style={styles.playButton}>
                    {activeVideoIndex === index && isPlaying ? (
                      <Pause size={32} color="white" />
                    ) : (
                      <Play size={32} color="white" fill="white" />
                    )}
                  </BlurView>
                </TouchableOpacity>
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
  playButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
