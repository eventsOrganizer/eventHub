import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { LinearGradient } from 'expo-linear-gradient';
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
      <LinearGradient
        colors={['#4B0082', '#0066CC']}
        style={tw`p-4 rounded-xl mt-4 shadow-lg`}
      >
        <TouchableOpacity 
          style={tw`flex-row items-center mb-4`}
          onPress={() => setShowAllModal(true)}
        >
          <Ionicons name="people" size={24} color="white" />
          <Text style={tw`text-lg font-bold text-white ml-2`}>
            Attendees ({attendees.length})
          </Text>
          {friendsAttending.length > 0 && (
            <Text style={tw`text-sm text-yellow-400 ml-2`}>
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
          contentContainerStyle={tw`py-2`}
        />
      </LinearGradient>
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
        <BlurView intensity={90} tint="dark" style={tw`flex-1`}>
          <View style={tw`flex-1 mt-20 mx-4 bg-gray-900/90 rounded-t-3xl overflow-hidden`}>
            <LinearGradient
              colors={['#4B0082', '#0066CC']}
              style={tw`p-4`}
            >
              <View style={tw`flex-row justify-between items-center`}>
                <Text style={tw`text-xl font-bold text-white`}>All Attendees</Text>
                <TouchableOpacity onPress={() => setShowAllModal(false)}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <FlatList
              data={attendees}
              renderItem={({ item }) => (
                <View style={tw`flex-row items-center p-4 border-b border-gray-800`}>
                  <UserAvatar 
                    userId={item.id} 
                    size={50} 
                    style={tw`border-2 ${item.isFriend ? 'border-yellow-400' : 'border-white'}`}
                  />
                  <View style={tw`ml-3`}>
                    <Text style={tw`text-white text-lg`}>
                      {item.firstname} {item.lastname}
                    </Text>
                    {item.isFriend && (
                      <Text style={tw`text-yellow-400 text-sm`}>Friend</Text>
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