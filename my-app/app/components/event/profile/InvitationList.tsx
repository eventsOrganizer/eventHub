import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Dimensions, Image } from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import UserAvatar from '../UserAvatar';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = width - 40;

interface Invitation {
  id: number;
  sender_id: string;
  event_id?: number;
  personal_id?: number;
  local_id?: number;
  material_id?: number;
  group_id?: number;
  created_at: string;
  sender?: {
    firstname?: string;
    lastname?: string;
  };
  event?: {
    name?: string;
    id: number;
  };
  personal?: {
    name?: string;
    id: number;
  };
  local?: {
    name?: string;
    id: number;
  };
  material?: {
    name?: string;
    id: number;
  };
  group?: {
    name?: string;
    id: number;
  };
  media_url?: string;

}

const InvitationList: React.FC = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const { userId } = useUser();
  const navigation = useNavigation();

  useEffect(() => {
    if (userId) {
      fetchInvitations();
    }
  }, [userId]);

  const fetchInvitations = async () => {
    if (!userId) return;
  
    try {
      const { data, error } = await supabase
        .from('invitation')
        .select(`
          *,
          sender:user!sender_id(firstname, lastname),
          event(id, name),
          personal(id, name),
          local(id, name),
          material(id, name),
          group(id, name)
        `)
        .eq('receiver_id', userId)
        .order('created_at', { ascending: false });
  
      if (error) throw error;
  
      if (data) {
        const invitationsWithMedia = await Promise.all(data.map(async (invitation) => {
          let mediaUrl = null;
          if (invitation.event_id) {
            const { data: mediaData } = await supabase
              .from('media')
              .select('url')
              .eq('event_id', invitation.event_id)
              .limit(1)
              .single();
            mediaUrl = mediaData?.url;
          } else if (invitation.personal_id) {
            const { data: mediaData } = await supabase
              .from('media')
              .select('url')
              .eq('personal_id', invitation.personal_id)
              .limit(1)
              .single();
            mediaUrl = mediaData?.url;
          } else if (invitation.local_id) {
            const { data: mediaData } = await supabase
              .from('media')
              .select('url')
              .eq('local_id', invitation.local_id)
              .limit(1)
              .single();
            mediaUrl = mediaData?.url;
          }
          // Add similar checks for material and group if needed
          return { ...invitation, media_url: mediaUrl };
        }));
  
        setInvitations(invitationsWithMedia);
      }
    } catch (error) {
      console.error('Error fetching invitations:', error);
      Alert.alert('Error', 'Failed to fetch invitations. Please try again.');
    }
  };

  const handleRemove = async (invitationId: number) => {
    try {
      const { error } = await supabase
        .from('invitation')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;

      setInvitations(prevInvitations => 
        prevInvitations.filter(inv => inv.id !== invitationId)
      );

      Alert.alert('Success', 'Invitation removed!');
    } catch (error) {
      console.error('Error removing invitation:', error);
      Alert.alert('Error', 'Failed to remove invitation. Please try again.');
    }
  };

  const getInvitationType = (item: Invitation) => {
    if (item.event_id) return 'Event';
    if (item.personal_id) return 'Personal';
    if (item.local_id) return 'Local';
    if (item.material_id) return 'Material';
    if (item.group_id) return 'Group';
    return 'Unknown';
  };

  const getInvitationName = (item: Invitation) => {
    return item.event?.name || item.personal?.name || item.local?.name || 
           item.material?.name || item.group?.name || 'Unknown';
  };

  const navigateToDetails = (item: Invitation) => {
    const type = getInvitationType(item);
    switch (type) {
      case 'Event':
        navigation.navigate('EventDetails' as any, { eventId: item.event_id } as any);
        break;
      case 'Personal':
        navigation.navigate('PersonalDetail' as any, { personalId: item.personal_id } as any);
        break;
      case 'Local':
        navigation.navigate('LocalServiceDetails' as any, { localServiceId: item.local_id } as any);
        break;
      case 'Material':
        navigation.navigate('MaterialDetails' as any, { materialId: item.material_id } as any);
        break;
      case 'Group':
        navigation.navigate('GroupDetails' as any, { groupId: item.group_id } as any);
        break;
      default:
        Alert.alert('Error', 'Unknown item type');
    }
  };

  const renderInvitationItem = ({ item }: { item: Invitation }) => {
    const invitationType = getInvitationType(item);
    const invitationName = getInvitationName(item);

    return (
      <TouchableOpacity style={styles.card} onPress={() => navigateToDetails(item)}>
        <LinearGradient
          colors={['#1a1a1a', '#2a2a2a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardContent}
        >
          <View style={styles.headerContainer}>
            <UserAvatar userId={item.sender_id} size={40} />
            <View style={styles.headerText}>
              <Text style={styles.senderName}>{`${item.sender?.firstname || ''} ${item.sender?.lastname || ''}`}</Text>
              <Text style={styles.invitationType}>{`Invited you to a ${invitationType}`}</Text>
            </View>
          </View>
          <Text style={styles.itemName}>{invitationName}</Text>
          <View style={styles.imageContainer}>
            {item.media_url ? (
              <Image 
                source={{ uri: item.media_url }} 
                style={styles.itemImage} 
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage} />
            )}
          </View>
          <TouchableOpacity 
            style={styles.removeButton} 
            onPress={() => handleRemove(item.id)}
          >
            <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invitations</Text>
      <FlatList
        data={invitations}
        renderItem={renderInvitationItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    margin: 20,
  },
  listContent: {
    padding: 10,
  },
  card: {
    width: cardWidth,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    marginLeft: 10,
  },
  senderName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  invitationType: {
    fontSize: 16,
    color: '#BBBBBB',
  },
  itemName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 10,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#333',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#555',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default InvitationList;