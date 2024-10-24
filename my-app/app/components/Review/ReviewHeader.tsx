import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { ArrowLeft, ThumbsUp } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

interface ReviewHeaderProps {
  onBack: () => void;
  onLike: () => void;
  isLiked: boolean;
  theme: {
    primary: string;
    secondary: string;
  };
}

export const ReviewHeader = ({ onBack, onLike, isLiked, theme }: ReviewHeaderProps) => {
  return (
    <BlurView intensity={80} tint="dark" style={styles.header}>
      <TouchableOpacity 
        onPress={onBack}
        style={styles.backButton}
      >
        <BlurView intensity={20} tint="light" style={styles.iconButton}>
          <ArrowLeft size={24} color={theme.primary} />
        </BlurView>
      </TouchableOpacity>
      
      <Text style={[styles.headerTitle, { color: theme.primary }]}>Reviews</Text>
      
      <TouchableOpacity 
        onPress={onLike}
        style={styles.likeButton}
      >
        <BlurView 
          intensity={20} 
          tint="light" 
          style={[
            styles.iconButton,
            isLiked && { backgroundColor: theme.primary }
          ]}
        >
          <ThumbsUp 
            size={20} 
            color={isLiked ? 'white' : theme.primary} 
          />
        </BlurView>
      </TouchableOpacity>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    height: 80,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  likeButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});