import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import QRCode from 'react-native-qrcode-svg';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

interface Ticket {
  id: number;
  token: string;
  type: 'online' | 'physical';
  ticket: {
    event: {
      id: number;
      name: string;
      details: string;
      media: { url: string }[];
      availability: {
        date: string;
        start: string;
        end: string;
      }[];
      subcategory: {
        name: string;
        category: {
          name: string;
        };
      };
    };
  };
}

const PurchasedTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  const { userId } = useUser();

  useEffect(() => {
    fetchPurchasedTickets();
  }, [userId]);

  const fetchPurchasedTickets = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('order')
        .select(`
          id,
          token,
          type,
          ticket!inner (
            event!inner (
              id,
              name,
              details,
              media (url),
              availability (date, start, end),
              subcategory!inner (
                name,
                category!inner (name)
              )
            )
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      if (data) {
        const validTickets = data.filter(item => 
          item?.ticket?.event && 
          item.ticket.event.name && 
          item.token
        );
        setTickets(validTickets as Ticket[]);
      }
    } catch (error) {
      console.error('Error fetching purchased tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Date not set';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };


  const renderTicket = ({ item }: { item: Ticket }) => (
    <View style={tw`bg-white rounded-xl mb-4 shadow-sm border border-gray-100 overflow-hidden`}>
      <View style={tw`p-4`}>
        {/* Event Information */}
        <View style={tw`flex-row mb-4`}>
          <Image
            source={{ uri: item.ticket.event.media?.[0]?.url || 'https://via.placeholder.com/150' }}
            style={tw`w-28 h-28 rounded-xl mr-4`}
          />
          <View style={tw`flex-1 justify-between`}>
            <View>
              <Text style={tw`text-gray-800 text-xl font-bold mb-1`}>
                {item.ticket.event.name}
              </Text>
              <Text style={tw`text-gray-500 text-sm mb-2`}>
                {item.ticket.event.availability?.[0]?.date 
                  ? formatDate(item.ticket.event.availability[0].date)
                  : 'Date not set'}
              </Text>
              <Text style={tw`text-gray-400 text-xs`}>
                {item.ticket.event.subcategory?.category?.name || 'Category'} • 
                {item.ticket.event.subcategory?.name || 'Subcategory'}
              </Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Ionicons 
                name={item.type === 'online' ? 'laptop-outline' : 'location-outline'} 
                size={16} 
                color="#0066CC" 
              />
              <Text style={tw`text-gray-600 text-sm ml-1`}>
                {item.type === 'online' ? 'Online Event' : 'Physical Event'}
              </Text>
            </View>
          </View>
        </View>

        {/* QR Code Section */}
        <View style={tw`bg-gray-50 rounded-xl p-4`}>
          <View style={tw`flex-row items-center justify-between`}>
            {item.type === 'physical' ? (
              <>
                <View style={tw`bg-white p-4 rounded-xl shadow-sm border border-gray-100`}>
                  <QRCode
                    value={item.token || ''}
                    size={120}
                  />
                </View>
                <View style={tw`ml-4`}>
                  <TouchableOpacity 
                    onPress={() => console.log('Refund requested')}
                    style={tw`bg-red-50 px-6 py-2 rounded-xl flex-row items-center mb-2 border border-red-100`}
                  >
                    <Ionicons name="refresh-outline" size={20} color="#EF4444" />
                    <Text style={tw`text-red-500 ml-2 font-medium`}>Refund</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setSelectedQR(item.token)}
                    style={tw`bg-blue-50 px-6 py-2 rounded-xl flex-row items-center border border-blue-100`}
                  >
                    <Ionicons name="expand-outline" size={20} color="#0066CC" />
                    <Text style={tw`text-blue-600 ml-2 font-medium`}>Preview QR</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={tw`flex-row items-center justify-between w-full`}>
                <View style={tw`bg-white px-4 py-3 rounded-xl flex-1 mr-4 border border-gray-100`}>
                  <Text style={tw`text-gray-700 text-base`}>Access Code: {item.token}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => console.log('Refund requested')}
                  style={tw`bg-red-50 px-6 py-2 rounded-xl flex-row items-center border border-red-100`}
                >
                  <Ionicons name="refresh-outline" size={20} color="#EF4444" />
                  <Text style={tw`text-red-500 ml-2 font-medium`}>Refund</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  const renderQRModal = () => {
    if (!selectedQR) return null;
    
    return (
      <Modal
        visible={true}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedQR(null)}
      >
        <TouchableOpacity 
          style={tw`flex-1 justify-center items-center bg-black/50`}
          onPress={() => setSelectedQR(null)}
        >
          <View style={tw`bg-white p-8 rounded-3xl shadow-lg`}>
            <View style={tw`bg-gray-50 p-6 rounded-2xl border border-gray-100`}>
              <QRCode
                value={selectedQR}
                size={250}
              />
            </View>
            <TouchableOpacity 
              style={tw`mt-4 items-center`}
              onPress={() => setSelectedQR(null)}
            >
              <Text style={tw`text-gray-600 text-lg font-medium`}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  if (loading) {
    return (
      <View style={tw`flex-1 bg-white justify-center items-center`}>
        <Text style={tw`text-gray-600 text-lg`}>Loading tickets...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <FlatList
        contentContainerStyle={tw`p-4`}
        data={tickets}
        renderItem={renderTicket}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={tw`bg-white rounded-3xl p-8 items-center border border-gray-100 shadow-sm`}>
            <Ionicons name="ticket-outline" size={48} color="#0066CC" style={tw`mb-4`} />
            <Text style={tw`text-gray-800 text-xl font-bold mb-2`}>No Tickets Yet</Text>
            <Text style={tw`text-gray-500 text-center`}>
              Your purchased tickets will appear here
            </Text>
          </View>
        }
      />
      {renderQRModal()}
    </View>
  );
};

export default PurchasedTickets;