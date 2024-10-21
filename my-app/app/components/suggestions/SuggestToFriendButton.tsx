import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal, Text, FlatList, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';
import UserAvatar from '../event/UserAvatar';

interface Friend {
  id: string;
  firstname: string;
  lastname: string;
}

interface SuggestToFriendButtonProps {
  itemId: number;
  category: {
    id: number;
    name: string;
    type: string;
  };
}

const SuggestToFriendButton: React.FC<SuggestToFriendButtonProps> = ({ itemId, category }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { userId } = useUser();

  useEffect(() => {
    if (modalVisible) {
      fetchFriends();
    }
  }, [modalVisible, userId]);

  const fetchFriends = async () => {
    if (!userId) return;

    try {
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friend')
        .select('user_id, friend_id')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

      if (friendshipsError) throw friendshipsError;

      const friendIds = friendships.map(f => 
        f.user_id === userId ? f.friend_id : f.user_id
      );

      const { data: friendsData, error: friendsError } = await supabase
        .from('user')
        .select('id, firstname, lastname')
        .in('id', friendIds);

      if (friendsError) throw friendsError;

      setFriends(friendsData || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
      Alert.alert('Error', 'Failed to fetch friends. Please try again.');
    }
  };

  const handleOpenModal = () => {
    setModalVisible(true);
    setSelectedFriends([]);
  };

  const getItemType = () => {
    switch (category.name) {
      case 'Crew':
        return 'personal';
      case 'Local':
        return 'local';
      case 'Material':
        return 'material';
      default:
        return 'event';
    }
  };

  const handleSendInvitations = async () => {
    const itemType = getItemType();
    if (!itemType || !userId || selectedFriends.length === 0) {
      Alert.alert('Error', 'Please select at least one friend.');
      return;
    }

    try {
      const invitations = selectedFriends.map(friendId => ({
        sender_id: userId,
        receiver_id: friendId,
        [`${itemType}_id`]: itemId,
        status: false
      }));

      const { error } = await supabase
        .from('invitation')
        .insert(invitations);

      if (error) throw error;

      Alert.alert('Success', 'Invitations sent successfully!');
      setModalVisible(false);
    } catch (error) {
      console.error('Error sending invitations:', error);
      Alert.alert('Error', 'Failed to send invitations. Please try again.');
    }
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const filteredFriends = friends.filter(friend => {
    const fullName = `${friend.firstname} ${friend.lastname}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <View>
      <TouchableOpacity onPress={handleOpenModal} style={styles.button}>
        <Ionicons name="arrow-redo-outline" size={20} color="#007AFF" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Suggest to Friends</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search friends"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            <FlatList
              data={filteredFriends}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.friendItem}
                  onPress={() => toggleFriendSelection(item.id)}
                >
                  <UserAvatar userId={item.id} size={40} />
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>{`${item.firstname} ${item.lastname}`}</Text>
                  </View>
                  {selectedFriends.includes(item.id) ? (
                    <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                  ) : (
                    <Ionicons name="ellipse-outline" size={24} color="#999" />
                  )}
                </TouchableOpacity>
              )}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.closeButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.sendButton]}
                onPress={handleSendInvitations}
              >
                <Text style={styles.buttonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  friendInfo: {
    flex: 1,
    marginLeft: 10,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#FF3B30',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SuggestToFriendButton;