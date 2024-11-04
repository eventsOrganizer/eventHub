import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import UserAvatar from '../../event/UserAvatar';

interface SoldTicket {
  id: number;
  ticket: {
    id: number;
    price: string;
    event: {
      id: number;
      name: string;
      type: string;
      user_id: string;
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
    }
  };
  user: {
    id: string;
    firstname: string;
    lastname: string;
    media: { url: string }[];
  }
}

const SoldTickets: React.FC = () => {
  const [tickets, setTickets] = useState<SoldTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useUser();

  useEffect(() => {
    fetchSoldTickets();
  }, [userId]);

  const fetchSoldTickets = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('order')
        .select(`
          id,
          ticket:ticket_id (
            id,
            price,
            event:event_id (
              id,
              name,
              type,
              user_id,
              media (url),
              availability (date, start, end),
              subcategory (
                name,
                category (name)
              )
            )
          ),
          user:user_id (
            id,
            firstname,
            lastname,
            media (url)
          )
        `)
        .eq('ticket.event.user_id', userId);

      if (error) {
        console.error('Error fetching sold tickets:', error);
      } else if (data) {
        const validTickets = data.filter(item => 
          item?.ticket?.event && 
          item.user
        );
        console.log('Fetched tickets:', validTickets);
        setTickets(validTickets);
      }
    } catch (error) {
      console.error('Error fetching sold tickets:', error);
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

  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numericPrice);
  };

  const renderTicket = ({ item }: { item: SoldTicket }) => (
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
            <Text style={tw`text-white/80 text-lg font-bold`}>
              {formatPrice(item.ticket.price)}
            </Text>
          </View>
        </View>

    {/* Buyer Information */}
<View style={tw`bg-black/20 rounded-xl p-4`}>
  <View style={tw`flex-row items-center mb-3`}>
    <UserAvatar 
      userId={item.user.id}
      style={tw`w-12 h-12 rounded-full`}  // Removed mr-3
    />
    <View style={tw`ml-4`}> 
      <Text style={tw`text-white font-medium text-lg`}>
        {item.user.firstname} {item.user.lastname}
      </Text>
      <Text style={tw`text-white/60 text-sm`}>
        Order ID: #{item.id}
      </Text>
    </View>
  </View>

          <View style={tw`flex-row justify-between items-center`}>
            <View style={tw`flex-row items-center`}>
              <Ionicons 
                name={item.ticket.event.type === 'online' ? 'laptop-outline' : 'location-outline'} 
                size={16} 
                color="white" 
              />
              <Text style={tw`text-white/80 text-sm ml-1`}>
                {item.ticket.event.type === 'online' ? 'Online Event' : 'Physical Event'}
              </Text>
            </View>
            <Text style={tw`text-white/70 text-sm`}>
              Price: {formatPrice(item.ticket.price)}
            </Text>
          </View>
        </View>
      </View>
    </BlurView>
  );

  if (loading) {
    return (
      <LinearGradient colors={['#4B0082', '#0066CC']} style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-white text-lg`}>Loading sold tickets...</Text>
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
            <Text style={tw`text-white text-xl font-bold mb-2`}>No Sold Tickets</Text>
            <Text style={tw`text-white/70 text-center`}>
              Tickets you've sold will appear here
            </Text>
          </BlurView>
        }
      />
    </LinearGradient>
  );
};

export default SoldTickets;