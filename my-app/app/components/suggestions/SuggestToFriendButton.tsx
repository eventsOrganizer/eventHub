import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';
import UserAvatar from '../event/UserAvatar';

interface Friend {
  id: string;
  firstname: string | null;
  lastname: string | null;
}

interface SuggestToFriendButtonProps {
  itemId: number;
  itemType: 'event' | 'personal' | 'local' | 'material' | 'group';
}

const SuggestToFriendButton: React.FC<SuggestToFriendButtonProps> = ({ itemId, itemType }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { userId } = useUser();

  useEffect(() => {
    if (modalVisible) {
      fetchFriends();
    }
  }, [modalVisible, userId]);

  const fetchFriends = async () => {
    if (!userId) {
      console.log("No user ID available");
      return;
    }

    console.log("Fetching friends for user ID:", userId);

    try {
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friend')
        .select('user_id, friend_id')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

      if (friendshipsError) {
        console.error('Error fetching friendships:', friendshipsError);
        return;
      }

      console.log("Fetched friendships:", friendships);

      if (friendships && friendships.length > 0) {
        const friendIds = friendships.map(f => 
          f.user_id === userId ? f.friend_id : f.user_id
        );

        console.log("Friend IDs:", friendIds);

        const { data: friendsData, error: friendsError } = await supabase
          .from('user')
          .select('id, firstname, lastname')
          .in('id', friendIds);

        if (friendsError) {
          console.error('Error fetching friends data:', friendsError);
          return;
        }

        console.log("Fetched friends data:", friendsData);

        if (friendsData) {
          setFriends(friendsData);
        }
      } else {
        console.log("No friendships found");
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleSuggestToFriend = async (friendId: string) => {
    if (!itemType) {
      console.error('Item type is not defined');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('invitation')
        .insert({
          sender_id: userId,
          receiver_id: friendId,
          [`${itemType}_id`]: itemId,
          status: false
        });

      if (error) {
        console.error('Error sending invitation:', error);
      } else {
        console.log('Invitation sent successfully');
      }
    } catch (error) {
      console.error('Unexpected error sending invitation:', error);
    }

    setModalVisible(false);
  };

  const getFriendDisplayName = (friend: Friend) => {
    if (friend.firstname && friend.lastname) {
      return `${friend.firstname} ${friend.lastname}`;
    } else if (friend.firstname) {
      return friend.firstname;
    } else if (friend.lastname) {
      return friend.lastname;
    } else {
      return `Friend (${friend.id})`;
    }
  };

  const filteredFriends = friends.filter(friend => {
    const displayName = getFriendDisplayName(friend).toLowerCase();
    return displayName.includes(searchQuery.toLowerCase());
  });

  return (
    <View>
      <TouchableOpacity onPress={handleOpenModal} style={styles.button}>
        <Ionicons name="arrow-redo-outline" size={20} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Suggest to Friend</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search friends"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <FlatList
              data={filteredFriends}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.friendItem}
                  onPress={() => handleSuggestToFriend(item.id)}
                >
                  <UserAvatar userId={item.id} size={50} />
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>{getFriendDisplayName(item)}</Text>
                  </View>
                  <Ionicons name="arrow-redo-outline" size={20} color="#007AFF" />
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 15,
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
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
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SuggestToFriendButton;