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
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={tw`flex-1`}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="white"
        />
      }
    >
      <View style={tw`px-4 pt-6 pb-20`}>
        <Text style={tw`text-white text-3xl font-bold mb-8`}>Received Requests</Text>
        
        {requests.length === 0 ? (
          <Text style={tw`text-white/60 text-lg text-center mt-10`}>
            No requests received yet
          </Text>
        ) : (
          requests.map((request) => (
            <BlurView
              key={request.id}
              intensity={80}
              tint="dark"
              style={tw`rounded-3xl mb-4 overflow-hidden border border-white/10`}
            >
              <TouchableOpacity
                style={tw`p-4`}
                onPress={() => navigation.navigate('EventDetails', { eventId: request.event.id })}
              >
                <View style={tw`flex-row items-center`}>
                  <Image
                    source={{ uri: request.event.media[0]?.url || 'https://via.placeholder.com/150' }}
                    style={tw`w-28 h-28 rounded-2xl mr-4`}
                  />
                  
                  <View style={tw`flex-1 h-28 justify-between py-1`}>
                    <View>
                      <Text style={tw`text-white text-xl font-bold mb-1`}>{request.event.name}</Text>
                      <Text style={[tw`text-sm px-2 py-1 rounded-full self-start`, getStatusStyle(request.status)]}>
                        Status: {request.status}
                      </Text>
                    </View>
                    
                    <View>
                      <Text style={tw`text-white/60 text-sm`}>From: {request.user.email}</Text>
                      <Text style={tw`text-white/50 text-xs mt-1`}>
                        {request.event.subcategory?.category?.name} • {request.event.subcategory?.name}
                      </Text>
                    </View>
                  </View>
                </View>

                {request.status === 'pending' && (
                  <View style={tw`flex-row justify-end mt-4`}>
                    <TouchableOpacity
                      style={tw`bg-green-500/20 px-4 py-2 rounded-xl mr-2`}
                      onPress={() => handleRequest(request.id, 'accepted')}
                    >
                      <Text style={tw`text-green-400`}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={tw`bg-red-500/20 px-4 py-2 rounded-xl`}
                      onPress={() => handleRequest(request.id, 'refused')}
                    >
                      <Text style={tw`text-red-400`}>Refuse</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            </BlurView>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default ReceivedEventRequests;