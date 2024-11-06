import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../../UserContext';

interface MessageFriendButtonProps {
  friendId: string;
}

const MessageFriendButton: React.FC<MessageFriendButtonProps> = ({ friendId }) => {
  const navigation = useNavigation<any>();
  const { userId } = useUser();

  const handlePress = () => {
    if (userId) {
      navigation.navigate('ChatRoom', { organizerId: friendId });
    }
  };

  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={handlePress}
    >
      <Ionicons name="chatbubble" size={24} color="#4CAF50" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
  }
});

export default MessageFriendButton;