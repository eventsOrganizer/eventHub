import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import UserAvatar from '../UserAvatar';
import { useUser } from '../../../UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import bcrypt from 'react-native-bcrypt';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

interface BuyForFriendsProps {
  eventId: number;
  eventType: 'online' | 'indoor' | 'outdoor';
}

interface Friend {
  id: string;
  firstname: string;
  lastname: string;
  avatar_url?: string;
}

const BuyForFriends: React.FC<BuyForFriendsProps> = ({ eventId, eventType }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [ticketId, setTicketId] = useState<number | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(0);
  const { userId } = useUser();

  useEffect(() => {
    if (modalVisible) {
      fetchFriends();
      fetchTicketDetails();
    }
  }, [modalVisible]);

  const fetchTicketDetails = async () => {
    const { data, error } = await supabase
      .from('ticket')
      .select('id, quantity, price')
      .eq('event_id', eventId)
      .single();

    if (error) {
      console.error('Error fetching ticket details:', error);
      return;
    }

    if (data) {
      setTicketPrice(data.price);
      setTicketId(data.id);
      setTicketQuantity(data.quantity);
    }
  };

  const fetchFriends = async () => {
    const { data: friendships, error } = await supabase
      .from('friend')
      .select('user_id, friend_id')
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`);
  
    if (error) {
      console.error('Error fetching friendships:', error);
      return;
    }

    if (friendships) {
      const friendIds = friendships.map(friendship => 
        friendship.user_id === userId ? friendship.friend_id : friendship.user_id
      );
  
      const { data: friendsData, error: friendsError } = await supabase
        .from('user')
        .select('id, firstname, lastname')
        .in('id', friendIds);
  
      if (friendsError) {
        console.error('Error fetching friends data:', friendsError);
      } else if (friendsData) {
        setFriends(friendsData);
      }
    }
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleBuyForFriends = async () => {
    if (!ticketId || selectedFriends.length === 0) {
      Alert.alert('Error', 'Please select at least one friend.');
      return;
    }

    if (selectedFriends.length > ticketQuantity) {
      Alert.alert('Error', 'Not enough tickets available.');
      return;
    }

    try {
      for (const friendId of selectedFriends) {
        const generatedToken = bcrypt.hashSync(`${ticketId}-${friendId}`, 10);
        
        const { error: orderError } = await supabase
          .from('order')
          .insert({
            user_id: friendId,
            ticket_id: ticketId,
            type: eventType === 'online' ? 'online' : 'physical',
            token: generatedToken,
            gifted_by: userId
          });

        if (orderError) throw orderError;
      }

      const { error: updateError } = await supabase
        .from('ticket')
        .update({ quantity: ticketQuantity - selectedFriends.length })
        .eq('id', ticketId);

      if (updateError) throw updateError;

      Alert.alert('Success', 'Tickets purchased for friends successfully!');
      setModalVisible(false);
      setSelectedFriends([]);
    } catch (error) {
      console.error('Error purchasing tickets:', error);
      Alert.alert('Error', 'Failed to purchase tickets. Please try again.');
    }
  };

  return (
    <>
      <View style={tw`flex-row items-center justify-center`}>
        <LinearGradient
          colors={['#FFD700', '#FFA500']}  // Gold to Orange gradient
          style={tw`rounded-lg overflow-hidden w-48`}
        >
          <TouchableOpacity 
            style={tw`p-2 flex-row items-center justify-center space-x-2`}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="gift-outline" size={20} color="white" />
            <Text style={tw`text-white font-bold text-base shadow-sm`}>Gift Tickets</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
  
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`bg-white rounded-xl w-5/6 max-h-[70%] p-4`}>
            <View style={tw`flex-row items-center mb-4`}>
              <Ionicons name="gift-outline" size={24} color="#FFD700" />
              <Text style={tw`text-xl font-bold ml-2`}>Gift Tickets to Friends</Text>
            </View>
            
            <FlatList
              data={friends}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={tw`flex-row items-center p-3 border-b border-gray-200`}
                  onPress={() => toggleFriendSelection(item.id)}
                >
                  <UserAvatar userId={item.id} size={40} />
                  <Text style={tw`flex-1 ml-3`}>
                    {`${item.firstname} ${item.lastname}`}
                  </Text>
                  {selectedFriends.includes(item.id) ? (
                    <Ionicons name="gift" size={24} color="#FFD700" />
                  ) : (
                    <Ionicons name="gift-outline" size={24} color="#999" />
                  )}
                </TouchableOpacity>
              )}
            />
  
            <View style={tw`mt-4 border-t border-gray-200 pt-4`}>
              <Text style={tw`text-lg font-bold text-center`}>
                Total: ${(ticketPrice * selectedFriends.length).toFixed(2)}
              </Text>
              <Text style={tw`text-sm text-gray-500 text-center`}>
                {selectedFriends.length} friend{selectedFriends.length !== 1 ? 's' : ''} selected
              </Text>
            </View>
  
            <View style={tw`flex-row justify-between mt-4`}>
              <TouchableOpacity
                style={tw`bg-gray-200 p-3 rounded-lg flex-1 mr-2`}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedFriends([]);
                }}
              >
                <Text style={tw`text-center font-bold`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-[#FFD700] p-3 rounded-lg flex-1 ml-2`}
                onPress={handleBuyForFriends}
              >
                <Text style={tw`text-black text-center font-bold`}>Gift Tickets</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default BuyForFriends;