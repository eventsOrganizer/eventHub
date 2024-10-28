import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MessageCircle, Star, MessageSquare } from 'lucide-react-native';
import { Material } from '../../navigation/types';
import { themeColors } from '../../utils/themeColors';

interface ReviewAndCommentButtonsProps {
  material: Material;
  theme: any;
  onReviewPress: () => void;
  onCommentPress: () => void;
}

const ReviewAndCommentButtons: React.FC<ReviewAndCommentButtonsProps> = ({
  material,
  theme,
  onReviewPress,
  onCommentPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={onReviewPress} 
        style={[styles.actionButton, { backgroundColor: 'rgba(255, 255, 255, 0.5)' }]}
      >
        <View style={styles.actionContent}>
          <MessageCircle size={24} color={theme.primary} />
          <View style={styles.actionTextContainer}>
            <Text style={[styles.actionTitle, { color: theme.primary }]}>Reviews</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color={theme.primary} />
              <Text style={styles.ratingText}>
                {material.average_rating?.toFixed(1) || 'N/A'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={onCommentPress} 
        style={[styles.actionButton, { backgroundColor: 'rgba(255, 255, 255, 0.5)' }]}
      >
        <View style={styles.actionContent}>
          <MessageSquare size={24} color={theme.primary} />
          <View style={styles.actionTextContainer}>
            <Text style={[styles.actionTitle, { color: theme.primary }]}>Comments</Text>
            <Text style={[styles.commentCount, { color: theme.primary }]}>
              View all comments
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 12,
    marginVertical: 16,
  },
  actionButton: {
    borderRadius: 15,
    padding: 16,
    elevation: 2,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: themeColors.common.gray,
  },
  commentCount: {
    fontSize: 14,
    color: themeColors.common.gray,
    marginTop: 4,
  },
});

export default ReviewAndCommentButtons;