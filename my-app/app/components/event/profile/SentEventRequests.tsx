import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

interface Request {
  id: number;
  status: 'pending' | 'accepted' | 'refused';
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

const SentEventRequests: React.FC = () => {
  const { userId } = useUser();
  const navigation = useNavigation<any>();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

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
            media (url),
            subcategory (
              name,
              category (name)
            )
          )
        `)
        .eq('user_id', userId)
        .not('event_id', 'is', null)
        .order('id', { ascending: false });// Add this line to filter out null events
  
      if (error) throw error;
      
      // Filter out any requests where event is null
      const validRequests = (data || []).filter(request => request.event !== null);
      setRequests(validRequests);
    } catch (error) {
      console.error('Error fetching sent requests:', error);
      Alert.alert('Error', 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSentRequests();
  }, [fetchSentRequests]);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  // Add this status style function at the top of both components, after the interfaces
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

  const handleDeleteRequest = async (requestId: number) => {
    try {
      const { error } = await supabase
        .from('request')
        .delete()
        .eq('id', requestId);
  
      if (error) throw error;
      
      // Refresh the requests list
      await fetchSentRequests();
      Alert.alert('Success', 'Request deleted successfully');
    } catch (error) {
      console.error('Error deleting request:', error);
      Alert.alert('Error', 'Failed to delete request');
    }
  };

return (
  <ScrollView style={tw`flex-1`}>
    <View style={tw`px-4 pt-6 pb-20`}>
      <Text style={tw`text-white text-3xl font-bold mb-8`}>Sent Requests</Text>
      
      {requests.length === 0 ? (
        <Text style={tw`text-white/60 text-lg text-center mt-10`}>
          No requests sent yet
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
                  
                  <View style={tw`flex-row justify-between items-center`}>
                    <Text style={tw`text-white/50 text-xs`}>
                      {request.event.subcategory?.category?.name} • {request.event.subcategory?.name}
                    </Text>
                    <TouchableOpacity
                      style={tw`p-2`}
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
            </TouchableOpacity>
          </BlurView>
        ))
      )}
    </View>
  </ScrollView>
);
};

export default SentEventRequests;