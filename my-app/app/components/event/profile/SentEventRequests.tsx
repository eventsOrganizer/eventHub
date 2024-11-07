import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import UserAvatar from '../UserAvatar';

interface Request {
  id: number;
  status: 'pending' | 'accepted' | 'refused';
  event: {
    id: number;
    name: string;
    user_id: string;
    media: { url: string }[];
    subcategory: {
      name: string;
      category: {
        name: string;
      };
    };
    user: {
      firstname: string;
      lastname: string;
    };
  };
}

const getStatusStyle = (status: 'pending' | 'accepted' | 'refused') => {
  switch (status) {
    case 'pending':
      return tw`bg-blue-50 text-blue-600`;
    case 'accepted':
      return tw`bg-green-50 text-green-600`;
    case 'refused':
      return tw`bg-red-50 text-red-600`;
  }
};

const SentEventRequests: React.FC = () => {
  const { userId } = useUser();
  const navigation = useNavigation<any>();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSentRequests = useCallback(async () => {
    if (!userId) return;
  
    try {
      const { data, error } = await supabase
        .from('request')
        .select(`
          id,
          status,
          event:event_id (
            id,
            name,
            user_id,
            user:user_id (
              firstname,
              lastname
            ),
            media (url),
            subcategory (
              name,
              category (name)
            )
          )
        `)
        .eq('user_id', userId)
        .not('event_id', 'is', null)
        .order('id', { ascending: false });

      if (error) throw error;
      
      const validRequests = (data || []).filter(request => request.event !== null);
      setRequests(validRequests);
    } catch (error) {
      console.error('Error fetching sent requests:', error);
      Alert.alert('Error', 'Failed to load requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  const handleDeleteRequest = async (requestId: number) => {
    try {
      const { error } = await supabase
        .from('request')
        .delete()
        .eq('id', requestId);
  
      if (error) throw error;
      
      await fetchSentRequests();
      Alert.alert('Success', 'Request deleted successfully');
    } catch (error) {
      console.error('Error deleting request:', error);
      Alert.alert('Error', 'Failed to delete request');
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSentRequests();
  }, [fetchSentRequests]);

  useEffect(() => {
    fetchSentRequests();
  }, [fetchSentRequests]);

  if (loading && !refreshing) {
    return (
      <View style={tw`flex-1 bg-white justify-center items-center`}>
        <Text style={tw`text-gray-600 text-lg`}>Loading requests...</Text>
      </View>
    );
  }

  return (
<ScrollView 
  style={[tw`flex-1 bg-white`, { marginRight: -10 }]}
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
        <Text style={tw`text-gray-800 text-2xl font-bold mb-6`}>Sent Requests</Text>
        
        {requests.length === 0 ? (
          <View style={tw`bg-white rounded-3xl p-8 items-center border border-gray-100 shadow-sm`}>
            <Ionicons name="paper-plane-outline" size={48} color="#0066CC" style={tw`mb-4`} />
            <Text style={tw`text-gray-800 text-xl font-bold mb-2`}>No Sent Requests</Text>
            <Text style={tw`text-gray-500 text-center`}>
              Your event join requests will appear here
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
                      <TouchableOpacity
                        style={tw`bg-red-50 p-2 rounded-xl border border-red-100`}
                        onPress={() => {
                          Alert.alert(
                            'Delete Request',
                            'Are you sure you want to delete this request?',
                            [
                              { text: 'Cancel', style: 'cancel' },
                              { 
                                text: 'Delete', 
                                onPress: () => handleDeleteRequest(request.id),
                                style: 'destructive'
                              },
                            ]
                          );
                        }}
                      >
                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={tw`bg-gray-50 rounded-xl p-4`}>
                  <View style={tw`flex-row items-center`}>
                    <UserAvatar 
                      userId={request.event.user_id}
                      style={tw`w-12 h-12 rounded-full border-2 border-white shadow-sm`}
                    />
                    <View style={tw`ml-4 flex-1`}>
                      <Text style={tw`text-gray-800 font-medium`}>Organized by</Text>
                      <Text style={tw`text-gray-500 text-sm`}>
                        {request.event.user?.firstname} {request.event.user?.lastname}
                      </Text>
                    </View>
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

export default SentEventRequests;