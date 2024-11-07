import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { BlurView } from 'expo-blur';
import UserAvatar from './UserAvatar';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../UserContext';
import tw from 'twrnc';
import EventFriends from './EventFriends';


interface AttendeesSectionProps {
  eventId: number;
  refreshTrigger: number;
  isOrganizer: boolean;
}

interface Attendee {
  id: string;
  firstname: string;
  lastname: string;
}

interface FriendAttendee extends Attendee {
  isFriend: boolean;
}

const AttendeesSection: React.FC<AttendeesSectionProps> = ({ 
  eventId, 
  refreshTrigger,
  isOrganizer
}) => {
  const { userId } = useUser();
  const [attendees, setAttendees] = useState<FriendAttendee[]>([]);
  const [friendsAttending, setFriendsAttending] = useState<FriendAttendee[]>([]);
  const [showAllModal, setShowAllModal] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchAttendeesAndFriends();
    }
  }, [refreshTrigger, userId]);

  const fetchAttendeesAndFriends = async () => {
    try {
      // First, fetch all friends
      const { data: friendsData } = await supabase
        .from('friend')
        .select('friend_id, user_id')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        // .eq('status', 'accepted');

      const friendIds = friendsData?.map(friend => 
        friend.user_id === userId ? friend.friend_id : friend.user_id
      ) || [];

      // Then fetch all attendees with their details
      const { data: attendeesData, error } = await supabase
        .from('event_has_user')
        .select(`
          user:user_id (
            id,
            firstname,
            lastname
          )
        `)
        .eq('event_id', eventId);

      if (error) throw error;

      const processedAttendees = attendeesData.map(item => ({
        ...item.user,
        isFriend: friendIds.includes(item.user.id)
      }));

      setAttendees(processedAttendees);
      setFriendsAttending(processedAttendees.filter(a => a.isFriend));

    } catch (error) {
      console.error('Error fetching attendees and friends:', error);
    }
  };

  const renderAttendee = ({ item }: { item: FriendAttendee }) => (
    <TouchableOpacity 
      style={tw`mr-3 items-center`}
      onPress={() => {
        // Handle navigation to user profile or other action
      }}
    >
      <UserAvatar 
        userId={item.id} 
        size={50} 
        style={tw`border-2 ${item.isFriend ? 'border-yellow-400' : 'border-white'} shadow-lg`}
      />
      {item.isFriend && (
        <View style={tw`absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1`}>
          <Ionicons name="star" size={12} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );

  if (!userId) return null;

  return (
    <View>
      <View style={tw`bg-white rounded-xl mt-4 shadow-sm border border-gray-100`}>
        <TouchableOpacity 
          style={tw`flex-row items-center mb-4 p-4`}
          onPress={() => setShowAllModal(true)}
        >
          <Ionicons name="people" size={24} color="#0066CC" />
          <Text style={tw`text-lg font-bold text-gray-800 ml-2`}>
            Attendees ({attendees.length})
          </Text>
          {friendsAttending.length > 0 && (
            <Text style={tw`text-sm text-blue-500 ml-2`}>
              {friendsAttending.length} friends joined
            </Text>
          )}
        </TouchableOpacity>

        <FlatList
          data={attendees}
          renderItem={renderAttendee}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`px-4 py-2`}
        />
      </View>

      <EventFriends 
        eventId={eventId}
        refreshTrigger={refreshTrigger}
      />

      <Modal
        visible={showAllModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAllModal(false)}
      >
        <BlurView intensity={90} tint="light" style={tw`flex-1`}>
          <View style={tw`flex-1 mt-20 mx-4 bg-white rounded-t-3xl overflow-hidden shadow-xl`}>
            <View style={tw`p-4 bg-gray-50 border-b border-gray-100`}>
              <View style={tw`flex-row justify-between items-center`}>
                <Text style={tw`text-xl font-bold text-gray-800`}>All Attendees</Text>
                <TouchableOpacity onPress={() => setShowAllModal(false)}>
                  <Ionicons name="close" size={24} color="#666666" />
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={attendees}
              renderItem={({ item }) => (
                <View style={tw`flex-row items-center p-4 border-b border-gray-100`}>
                  <UserAvatar 
                    userId={item.id} 
                    size={50} 
                    style={tw`border-2 ${item.isFriend ? 'border-blue-400' : 'border-gray-200'}`}
                  />
                  <View style={tw`ml-3`}>
                    <Text style={tw`text-gray-800 text-lg`}>
                      {item.firstname} {item.lastname}
                    </Text>
                    {item.isFriend && (
                      <Text style={tw`text-blue-500 text-sm`}>Friend</Text>
                    )}
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

export default AttendeesSection;