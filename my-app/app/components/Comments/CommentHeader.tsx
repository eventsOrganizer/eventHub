import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { MessageCircle, ArrowLeft } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface CommentHeaderProps {
  onBack: () => void;
  newComment: string;
  onChangeComment: (text: string) => void;
  onSubmitComment: () => void;
}

export const CommentHeader = ({ 
  onBack, 
  newComment, 
  onChangeComment, 
  onSubmitComment 
}: CommentHeaderProps) => {
  return (
    <Animated.View 
      entering={FadeInUp}
      style={styles.header}
    >
      <View style={styles.headerTop}>
        <TouchableOpacity 
          onPress={onBack}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comments</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.newCommentContainer}>
        <TextInput
          mode="outlined"
          placeholder="Share your thoughts..."
          value={newComment}
          onChangeText={onChangeComment}
          style={styles.commentInput}
          outlineStyle={styles.commentInputOutline}
          right={
            <TextInput.Icon 
              icon={() => <MessageCircle size={20} color="#7E57C2" />} 
              onPress={onSubmitComment}
            />
          }
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 24,
  },
  newCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 25,
    elevation: 3,
  },
  commentInputOutline: {
    borderRadius: 25,
    borderColor: '#7E57C2',
  },
});