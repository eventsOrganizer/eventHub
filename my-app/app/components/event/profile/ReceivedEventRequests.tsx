import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import { useNavigation } from '@react-navigation/native';
import { createEventNotificationSystem } from '../../../services/eventNotificationService';
import UserAvatar from '../../../components/event/UserAvatar';
import tw from 'twrnc';

interface Request {
  id: number;
  status: 'pending' | 'accepted' | 'refused';
  user: {
    id: string;
    email: string;
  };
  event: {
    id: number;
    name: string;
    media: { url: string }[];
    subcategory: {
      name: string;
      category: {
        name: string;
      };
    };
  };
}

const getStatusStyle = (status: 'pending' | 'accepted' | 'refused') => {
  switch (status) {
    case 'pending':
      return tw`bg-white/10 text-white/70`;
    case 'accepted':
      return tw`bg-green-500/20 text-green-400`;
    case 'refused':
      return tw`bg-red-500/20 text-red-400`;
  }
};

const ReceivedEventRequests: React.FC = () => {
  const { userId } = useUser();
  const navigation = useNavigation<any>();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { handleEventRequestNotification } = createEventNotificationSystem();

  const fetchReceivedRequests = useCallback(async () => {
    if (!userId) return;
  
    try {
      const { data, error } = await supabase
        .from('request')
        .select(`
          id,
          status,
          user:user_id (
            id,
            email
          ),
          event:event_id (
            id,
            name,
            media (url),
            subcategory (
              name,
              category (name)
            )
          )
        `)
        .eq('event.user_id', userId)
        .order('id', { ascending: false });

      if (error) throw error;
      
      const validRequests = (data || []).filter(request => 
        request.event !== null && request.user !== null
      );
      
      setRequests(validRequests);
    } catch (error) {
      console.error('Error fetching received requests:', error);
      Alert.alert('Error', 'Failed to load requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  const handleRequest = async (requestId: number, status: 'accepted' | 'refused') => {
    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) throw new Error('Request not found');

      const { error } = await supabase
        .from('request')
        .update({ 
          status,
          is_read: true,
          is_action_read: true 
        })
        .eq('id', requestId);

      if (error) throw error;

      if (status === 'accepted') {
        const { error: insertError } = await supabase
          .from('event_has_user')
          .insert({ 
            user_id: request.user.id, 
            event_id: request.event.id 
          });

        if (insertError) throw insertError;
      }

      await handleEventRequestNotification(requestId, status);
      await fetchReceivedRequests();
      Alert.alert('Success', `Request ${status}`);
    } catch (error) {
      console.error('Error handling request:', error);
      Alert.alert('Error', 'Failed to handle request');
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchReceivedRequests();
  }, [fetchReceivedRequests]);

  useEffect(() => {
    fetchReceivedRequests();
  }, [fetchReceivedRequests]);

  if (loading && !refreshing) {
    return (
      <View style={tw`flex-1 bg-white justify-center items-center`}>
        <Text style={tw`text-gray-600 text-lg`}>Loading requests...</Text>
      </View>
    );
  }

  return (
<ScrollView 
  style={[tw`flex-1 bg-white`, { marginRight: -3 }]}
  showsVerticalScrollIndicator={false}
  indicatorStyle="black"
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor="#0066CC"
    />
  }
>
      <View style={tw`px-4 pt-6 pb-20`}>
        <Text style={tw`text-gray-800 text-2xl font-bold mb-6`}>Received Requests</Text>
        
        {requests.length === 0 ? (
          <View style={tw`bg-white rounded-3xl p-8 items-center border border-gray-100 shadow-sm`}>
            <Ionicons name="mail-outline" size={48} color="#0066CC" style={tw`mb-4`} />
            <Text style={tw`text-gray-800 text-xl font-bold mb-2`}>No Received Requests</Text>
            <Text style={tw`text-gray-500 text-center`}>
              Event join requests will appear here
            </Text>
          </View>
        ) : (
          requests.map((request) => (
            <View 
              key={request.id}
              style={tw`bg-white rounded-xl mb-4 shadow-sm border border-gray-100 overflow-hidden`}
            >
              <TouchableOpacity
                style={tw`p-4`}
                onPress={() => navigation.navigate('EventDetails', { eventId: request.event.id })}
              >
                <View style={tw`flex-row mb-4`}>
                  <Image
                    source={{ uri: request.event.media[0]?.url || 'https://via.placeholder.com/150' }}
                    style={tw`w-28 h-28 rounded-xl mr-4`}
                  />
                  <View style={tw`flex-1 justify-between`}>
                    <View>
                      <Text style={tw`text-gray-800 text-xl font-bold mb-1`}>{request.event.name}</Text>
                      <Text style={tw`text-gray-400 text-xs`}>
                        {request.event.subcategory?.category?.name} • {request.event.subcategory?.name}
                      </Text>
                    </View>
                    <View style={tw`flex-row items-center justify-between`}>
                      <Text style={[tw`text-sm px-3 py-1 rounded-full`, getStatusStyle(request.status)]}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={tw`bg-gray-50 rounded-xl p-4`}>
                  <View style={tw`flex-row items-center`}>
                    <UserAvatar 
                      userId={request.user.id}
                      style={tw`w-12 h-12 rounded-full border-2 border-white shadow-sm`}
                    />
                    <View style={tw`ml-4 flex-1`}>
                      <Text style={tw`text-gray-800 font-medium`}>Request from</Text>
                      <Text style={tw`text-gray-500 text-sm`}>
                        {request.user.firstname} {request.user.lastname}
                      </Text>
                    </View>
                    {request.status === 'pending' && (
                      <View style={tw`flex-row`}>
                        <TouchableOpacity
                          style={tw`bg-green-50 px-4 py-2 rounded-xl mr-2 border border-green-100`}
                          onPress={() => handleRequest(request.id, 'accepted')}
                        >
                          <Text style={tw`text-green-600`}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={tw`bg-red-50 px-4 py-2 rounded-xl border border-red-100`}
                          onPress={() => handleRequest(request.id, 'refused')}
                        >
                          <Text style={tw`text-red-600`}>Refuse</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default ReceivedEventRequests;