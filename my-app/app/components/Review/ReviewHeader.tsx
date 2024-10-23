import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { ArrowLeft, ThumbsUp } from 'lucide-react-native';

interface ReviewHeaderProps {
  onBack: () => void;
  onLike: () => void;
  isLiked: boolean;
}

export const ReviewHeader = ({ onBack, onLike, isLiked }: ReviewHeaderProps) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack}>
        <ArrowLeft size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Reviews</Text>
      <TouchableOpacity onPress={onLike}>
        <ThumbsUp size={24} color={isLiked ? '#FFD700' : 'white'} />
      </TouchableOpacity>
    </View>
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});