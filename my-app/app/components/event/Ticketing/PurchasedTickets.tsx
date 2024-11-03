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
    <BlurView
      intensity={80}
      tint="dark"
      style={tw`rounded-3xl mb-4 overflow-hidden border border-white/10`}
    >
      <View style={tw`p-4`}>
        {/* Event Information */}
        <View style={tw`flex-row mb-4`}>
          <Image
            source={{ uri: item.ticket.event.media?.[0]?.url || 'https://via.placeholder.com/150' }}
            style={tw`w-28 h-28 rounded-2xl mr-4`}
          />
          <View style={tw`flex-1 justify-between`}>
            <View>
              <Text style={tw`text-white text-xl font-bold mb-1`}>
                {item.ticket.event.name}
              </Text>
              <Text style={tw`text-white/60 text-sm mb-2`}>
                {item.ticket.event.availability?.[0]?.date 
                  ? formatDate(item.ticket.event.availability[0].date)
                  : 'Date not set'}
              </Text>
              <Text style={tw`text-white/50 text-xs`}>
                {item.ticket.event.subcategory?.category?.name || 'Category'} • 
                {item.ticket.event.subcategory?.name || 'Subcategory'}
              </Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Ionicons 
                name={item.type === 'online' ? 'laptop-outline' : 'location-outline'} 
                size={16} 
                color="white" 
              />
              <Text style={tw`text-white/80 text-sm ml-1`}>
                {item.type === 'online' ? 'Online Event' : 'Physical Event'}
              </Text>
            </View>
          </View>
        </View>




{/* QR Code Section with Refund and Preview buttons for both types */}
<View style={tw`bg-black/20 rounded-xl p-4`}>
  <View style={tw`flex-row items-center justify-between`}>
    {item.type === 'physical' ? (
      <>
        <View style={tw`bg-white p-4 rounded-xl`}>
          <QRCode
            value={item.token || ''}
            size={120}
          />
        </View>
        <View style={tw`ml-4`}>
          <TouchableOpacity 
            onPress={() => console.log('Refund requested')}
            style={tw`bg-red-500/20 px-6 py-2 rounded-xl flex-row items-center mb-2`}
          >
            <Ionicons name="refresh-outline" size={20} color="white" />
            <Text style={tw`text-white ml-2 font-medium`}>Refund</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setSelectedQR(item.token)}
            style={tw`bg-white/10 px-6 py-2 rounded-xl flex-row items-center`}
          >
            <Ionicons name="expand-outline" size={20} color="white" />
            <Text style={tw`text-white ml-2 font-medium`}>Preview QR</Text>
          </TouchableOpacity>
        </View>
      </>
    ) : (
      <View style={tw`flex-row items-center justify-between w-full`}>
        <View style={tw`bg-white/20 px-4 py-3 rounded-xl flex-1 mr-4`}>
          <Text style={tw`text-white text-base`}>Access Code: {item.token}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => console.log('Refund requested')}
          style={tw`bg-red-500/20 px-6 py-2 rounded-xl flex-row items-center`}
        >
          <Ionicons name="refresh-outline" size={20} color="white" />
          <Text style={tw`text-white ml-2 font-medium`}>Refund</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
</View>
      </View>
    </BlurView>
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
          style={tw`flex-1 justify-center items-center bg-black/70`}
          onPress={() => setSelectedQR(null)}
        >
          <BlurView intensity={80} tint="dark" style={tw`p-8 rounded-3xl`}>
            <View style={tw`bg-white p-6 rounded-2xl`}>
              <QRCode
                value={selectedQR}
                size={250}
              />
            </View>
            <TouchableOpacity 
              style={tw`mt-4 items-center`}
              onPress={() => setSelectedQR(null)}
            >
              <Text style={tw`text-white text-lg`}>Close</Text>
            </TouchableOpacity>
          </BlurView>
        </TouchableOpacity>
      </Modal>
    );
  };

  if (loading) {
    return (
      <LinearGradient colors={['#4B0082', '#0066CC']} style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-white text-lg`}>Loading tickets...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#4B0082', '#0066CC']} style={tw`flex-1`}>
      <FlatList
        contentContainerStyle={tw`p-4`}
        data={tickets}
        renderItem={renderTicket}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <BlurView intensity={80} tint="dark" style={tw`rounded-3xl p-8 items-center`}>
            <Ionicons name="ticket-outline" size={48} color="white" style={tw`mb-4 opacity-80`} />
            <Text style={tw`text-white text-xl font-bold mb-2`}>No Tickets Yet</Text>
            <Text style={tw`text-white/70 text-center`}>
              Your purchased tickets will appear here
            </Text>
          </BlurView>
        }
      />
      {renderQRModal()}
    </LinearGradient>
  );
};

export default PurchasedTickets;