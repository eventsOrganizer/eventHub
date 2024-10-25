import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import { supabase } from '../services/supabaseClient';
import { useUser } from '../UserContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute, RouteProp } from '@react-navigation/native';
import { handleRequestConfirmation, handleRequestRejection } from '../services/requestService';
import { useToast } from '../hooks/useToast';
import { useNotifications } from '../hooks/useNotifications';

interface Request {
  id: number;
  name: string;
  type: string;
  status: string;
  subcategory: string;
  imageUrl: string | null;
  serviceImageUrl?: string | null;
  requesterName?: string;
  requesterEmail?: string;
  createdAt?: string;
  date?: string;
  start?: string;
  end?: string;
  details?: string;
}

type RouteParams = {
  userId: string;
  mode: 'sent' | 'received';
};

const YourRequests: React.FC = () => {
  const { userId } = useUser();
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { mode } = route.params;
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { toast } = useToast();
  const { unreadCount } = useNotifications(userId);

  useEffect(() => {
    if (userId) {
      fetchRequests();
    }
  }, [userId, mode]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      let data;
      if (mode === 'sent') {
        data = await fetchSentRequests();
      } else {
        data = await fetchReceivedRequests();
      }
      setRequests(data);
      setFilteredRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      Alert.alert('Error', 'Failed to fetch requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const { data: requests, error } = await supabase
        .from('request')
        .select(`
          id, status,
          personal:personal_id (id, name, subcategory:subcategory_id (name), media (url)),
          local:local_id (id, name, subcategory:subcategory_id (name), media (url)),
          material:material_id (id, name, subcategory:subcategory_id (name), media (url))
        `)
        .eq('user_id', userId);

      if (error) throw error;

      const formattedRequests = requests.map(req => {
        const service = req.personal || req.local || req.material;
        return {
          id: req.id,
          name: service?.name || 'Service sans nom',
          status: req.status || 'Statut inconnu',
          type: req.personal ? 'Personal' : req.local ? 'Local' : 'Material',
          subcategory: service?.subcategory?.name || 'Sous-catégorie inconnue',
          imageUrl: service?.media?.[0]?.url || null,
        };
      });

      return formattedRequests;
    } catch (error) {
      console.error('Error in fetchSentRequests:', error);
      throw error;
    }
  };

  const fetchReceivedRequests = async () => {
    try {
      const fetchServiceRequests = async (serviceType: 'personal' | 'local' | 'material') => {
        const { data, error } = await supabase
          .from('request')
          .select(`
            id, status, created_at,
            ${serviceType}:${serviceType}_id (id, name, subcategory:subcategory_id (name), user_id, details),
            user:user_id (id, firstname, lastname, email)
          `)
          .eq(`${serviceType}.user_id`, userId)
          .eq('status', 'pending');

        if (error) throw error;
        return data;
      };

      const personalRequests = await fetchServiceRequests('personal');
      const localRequests = await fetchServiceRequests('local');
      const materialRequests = await fetchServiceRequests('material');

      const allRequests = [...personalRequests, ...localRequests, ...materialRequests];

      const formattedRequests = await Promise.all(allRequests.map(async req => {
        const service = req.personal || req.local || req.material;
        const serviceType = req.personal ? 'Personal' : req.local ? 'Local' : 'Material';
        
        if (!service) return null;

        const { data: userMediaData } = await supabase
          .from('media')
          .select('url')
          .eq('user_id', req.user.id)
          .eq('type', 'profile')
          .limit(1);

        const { data: serviceMediaData } = await supabase
          .from('media')
          .select('url')
          .eq(`${serviceType.toLowerCase()}_id`, service.id)
          .limit(1);

        const { data: availabilityData } = await supabase
          .from('availability')
          .select('date, start, end')
          .eq(`${serviceType.toLowerCase()}_id`, service.id)
          .limit(1);

        const availability = availabilityData && availabilityData[0];
        
        return {
          id: req.id,
          name: service?.name || 'Service sans nom',
          status: req.status || 'Statut inconnu',
          type: serviceType,
          subcategory: service?.subcategory?.name || 'Sous-catégorie inconnue',
          details: service?.details || '',
          imageUrl: userMediaData?.[0]?.url || null,
          serviceImageUrl: serviceMediaData?.[0]?.url || null,
          requesterName: `${req.user?.firstname || ''} ${req.user?.lastname || ''}`.trim() || 'Nom inconnu',
          requesterEmail: req.user?.email || 'Email inconnu',
          createdAt: req.created_at,
          date: availability?.date,
          start: availability?.start,
          end: availability?.end,
        };
      }));

      return formattedRequests.filter(req => req !== null);
    } catch (error) {
      console.error('Error in fetchReceivedRequests:', error);
      throw error;
    }
  };

  const handleConfirm = async (requestId: number) => {
    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) return;

      const result = await handleRequestConfirmation(requestId, request.type, request.id);
      if (result.success) {
        toast({
          title: result.title,
          description: result.message,
          variant: result.variant,
        });
      }
      
      fetchRequests();
    } catch (error) {
      console.error('Error confirming request:', error);
      toast({
        title: "Error",
        description: "Failed to confirm request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) return;

      const result = await handleRequestRejection(requestId, request.type, request.id);
      if (result.success) {
        toast({
          title: result.title,
          description: result.message,
          variant: result.variant,
        });
      }
      
      fetchRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Error",
        description: "Failed to reject request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getBackgroundColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return '#A5D6A7';
      case 'pending':
        return '#FFF9C4';
      case 'rejected':
        return '#EF9A9A';
      default:
        return '#fff';
    }
  };

  const filterRequests = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(request => request.type === category));
    }
  };

  const ReceivedRequestCard = ({ item }: { item: Request }) => {
    const [showServiceDetails, setShowServiceDetails] = useState(false);
  
    return (
      <View style={[styles.requestItem, { backgroundColor: getBackgroundColor(item.status) }]}>
        <Image 
          source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} 
          style={styles.requestImage} 
        />
        <View style={styles.requestDetailsContainer}>
          <Text style={styles.serviceName}>{item.requesterName}</Text>
          <Text style={styles.requesterInfo}>{item.requesterEmail}</Text>
          <TouchableOpacity onPress={() => setShowServiceDetails(!showServiceDetails)}>
            <Text style={styles.serviceNameLink}>{item.name}</Text>
          </TouchableOpacity>
          
          {showServiceDetails && (
            <View style={styles.serviceDetailsCard}>
              <Image 
                source={{ uri: item.serviceImageUrl || 'https://via.placeholder.com/150' }} 
                style={styles.serviceDetailImage} 
              />
              <Text style={styles.serviceDetailText}>Type: {item.type}</Text>
              <Text style={styles.serviceDetailText}>Subcategory: {item.subcategory}</Text>
              <Text style={styles.serviceDetailText}>Details: {item.details || 'No details available'}</Text>
            </View>
          )}
          
          <Text style={styles.dateInfo}>Date: {item.date}</Text>
          <Text style={styles.dateInfo}>From {item.start} to {item.end}</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.confirmButton} onPress={() => handleConfirm(item.id)}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item.id)}>
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const SentRequestCard = ({ item }: { item: Request }) => (
    <View style={[styles.requestItem, { backgroundColor: getBackgroundColor(item.status) }]}>
      <Image 
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} 
        style={styles.requestImage} 
      />
      <View style={styles.requestDetailsContainer}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.subcategoryName}>{item.subcategory}</Text>
        <View style={styles.iconsContainer}>
          <Icon 
            name={item.type === 'Personal' ? 'person' : item.type === 'Local' ? 'location-on' : 'shopping-cart'} 
            size={20} 
            color="#000" 
          />
          <Icon 
            name={item.status === 'confirmed' ? 'check-circle' : item.status === 'pending' ? 'hourglass-top' : 'cancel'} 
            size={20} 
            color="#000" 
          />
        </View>
      </View>
    </View>
  );

  const renderRequestItem = ({ item }: { item: Request }) => {
    return mode === 'sent' ? (
      <SentRequestCard item={item} />
    ) : (
      <ReceivedRequestCard item={item} />
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <Text style={styles.title}>{mode === 'sent' ? 'Your Requests' : 'Received Requests'}</Text>
          
          <View style={styles.filterContainer}>
            <TouchableOpacity onPress={() => filterRequests('All')} style={styles.filterButton}>
              <Icon name="filter-list" size={24} color={selectedCategory === 'All' ? '#4CAF50' : '#000'} />
              <Text style={[styles.filterText, selectedCategory === 'All' && styles.activeFilterText]}>All</Text>
            </TouchableOpacity>
            {['Local', 'Personal', 'Material'].map((category) => (
              <TouchableOpacity 
                key={category}
                onPress={() => filterRequests(category)} 
                style={styles.filterButton}
              >
                <Icon 
                  name={category === 'Personal' ? 'person' : category === 'Local' ? 'location-on' : 'shopping-cart'} 
                  size={24} 
                  color={selectedCategory === category ? '#4CAF50' : '#000'} 
                />
                <Text style={[styles.filterText, selectedCategory === category && styles.activeFilterText]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={filteredRequests}
            renderItem={renderRequestItem}
            keyExtractor={item => `${item.type}-${item.id}`}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 12,
    color: '#000',
  },
  activeFilterText: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  requestItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  requestImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  requestDetailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subcategoryName: {
    fontSize: 14,
    color: '#757575',
  },
  requesterInfo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  dateInfo: {
    fontSize: 12,
    color: '#555',
    marginBottom: 5,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: '#F44336',
    padding: 5,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 12,
  },
  serviceNameLink: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 5,
  },
  serviceDetailsCard: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  serviceDetailImage: {
    width: '100%',
    height: 100,
    borderRadius: 5,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  serviceDetailText: {
    fontSize: 12,
    marginBottom: 3,
  },
});

export default YourRequests;