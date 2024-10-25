import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import { supabase } from '../services/supabaseClient';
import { useUser } from '../UserContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute, RouteProp } from '@react-navigation/native';

interface Request {
  id: number;
  name: string;
  type: string;
  status: string;
  subcategory: string;
  imageUrl: string | null;
  requesterName?: string;
  requesterEmail?: string;
  createdAt?: string;
  date?: string;
  start?: string;
  end?: string;
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
    console.log('Début de fetchSentRequests');
    console.log('userId:', userId);
  
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
  
      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error('Error fetching requests');
      }
  
      console.log('Données brutes reçues:', JSON.stringify(requests, null, 2));
  
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
  
      console.log('Données formatées:', JSON.stringify(formattedRequests, null, 2));
      return formattedRequests;
    } catch (error) {
      console.error('Erreur dans fetchSentRequests:', error);
      throw error;
    }
  };
  
  const fetchReceivedRequests = async () => {
    console.log('Début de fetchReceivedRequests');
    console.log('userId:', userId);
  
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
  
      console.log('Données brutes reçues:', JSON.stringify(allRequests, null, 2));
  
      const formattedRequests = await Promise.all(allRequests.map(async req => {
        const service = req.personal || req.local || req.material;
        const serviceType = req.personal ? 'Personal' : req.local ? 'Local' : 'Material';
        
        if (!service) {
          console.log(`Requête sans service associé: ${JSON.stringify(req)}`);
          return null;
        }
    
        // Fetch user's image URL
        const { data: userMediaData, error: userMediaError } = await supabase
          .from('media')
          .select('url')
          .eq('user_id', req.user.id)
          .eq('type', 'profile')
          .limit(1);
    
        if (userMediaError) {
          console.error('Error fetching user image:', userMediaError);
        }
    
        const userImageUrl = userMediaData && userMediaData[0] ? userMediaData[0].url : null;
    
        // Fetch service's image URL
        const { data: serviceMediaData, error: serviceMediaError } = await supabase
          .from('media')
          .select('url')
          .eq(`${serviceType.toLowerCase()}_id`, service.id)
          .limit(1);
    
        if (serviceMediaError) {
          console.error('Error fetching service image:', serviceMediaError);
        }
    
        const serviceImageUrl = serviceMediaData && serviceMediaData[0] ? serviceMediaData[0].url : null;
  
        // Fetch availability information
        const { data: availabilityData, error: availabilityError } = await supabase
          .from('availability')
          .select('date, start, end')
          .eq(`${serviceType.toLowerCase()}_id`, service.id)
          .limit(1);
        
        if (availabilityError) {
          console.error('Error fetching availability:', availabilityError);
        }
        
        const availability = availabilityData && availabilityData[0];
        
        return {
          id: req.id,
          name: service?.name || 'Service sans nom',
          status: req.status || 'Statut inconnu',
          type: serviceType,
          subcategory: service?.subcategory?.name || 'Sous-catégorie inconnue',
          details: service?.details || '',
          imageUrl: userImageUrl,
          serviceImageUrl: serviceImageUrl,
          requesterName: `${req.user?.firstname || ''} ${req.user?.lastname || ''}`.trim() || 'Nom inconnu',
          requesterEmail: req.user?.email || 'Email inconnu',
          createdAt: req.created_at,
          date: availability?.date,
          start: availability?.start,
          end: availability?.end,
        };
      }));
  
      // Filtrer les requêtes null (celles sans service associé)
      const validRequests = formattedRequests.filter(req => req !== null);
  
      console.log('Données formatées:', JSON.stringify(validRequests, null, 2));
      return validRequests;
    } catch (error) {
      console.error('Erreur dans fetchReceivedRequests:', error);
      throw error;
    }
  };

  const handleConfirm = async (requestId: number) => {
    // Implement confirmation logic here
    console.log('Confirming request:', requestId);
  };

  const handleReject = async (requestId: number) => {
    // Implement rejection logic here
    console.log('Rejecting request:', requestId);
  };

  const getBackgroundColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return '#A5D6A7'; // Lighter green for confirmed
      case 'pending':
        return '#FFF9C4'; // Original yellow for pending
      case 'rejected':
        return '#EF9A9A'; // Light red for rejected
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <Icon name="check-circle" size={20} color="#000" />;
      case 'pending':
        return <Icon name="hourglass-top" size={20} color="#000" />;
      case 'rejected':
        return <Icon name="cancel" size={20} color="#000" />;
      default:
        return <Icon name="help-outline" size={20} color="#000" />;
    }
  };

  const getCategoryIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'personal':
        return <Icon name="person" size={20} color="#000" />;
      case 'local':
        return <Icon name="location-on" size={20} color="#000" />;
      case 'material':
        return <Icon name="shopping-cart" size={20} color="#000" />;
      default:
        return <Icon name="help-outline" size={20} color="#000" />;
    }
  };

  const ReceivedRequestCard = ({ item }: { item: Request }) => {
    const [showServiceDetails, setShowServiceDetails] = useState(false);
  
    const toggleServiceDetails = () => {
      setShowServiceDetails(!showServiceDetails);
    };
  
    return (
      <View style={[styles.requestItem, { backgroundColor: getBackgroundColor(item.status) }]}>
        <Image 
          source={{ uri: item.imageUrl || 'https://i.pinimg.com/736x/96/bc/7d/96bc7d374e2814211408bd00fa10939b.jpg' }} 
          style={styles.requestImage} 
        />
        <View style={styles.requestDetailsContainer}>
          <Text style={styles.serviceName}>{item.requesterName}</Text>
          <Text style={styles.requesterInfo}>{item.requesterEmail}</Text>
          <TouchableOpacity onPress={toggleServiceDetails}>
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
              <View style={styles.iconsContainer}>
                {getCategoryIcon(item.type)}
                {getStatusIcon(item.status)}
              </View>
            </View>
          )}
          <Text style={styles.dateInfo}>Reservation date: {item.date}</Text>
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

  const renderRequestItem = ({ item }: { item: Request }) => {
    if (mode === 'sent') {
      // Carte pour les "sent requests" (inchangée)
      return (
        <View style={[styles.requestItem, { backgroundColor: getBackgroundColor(item.status) }]}>
          <Image 
            source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} 
            style={styles.requestImage} 
          />
          <View style={styles.requestDetailsContainer}>
            <Text style={styles.serviceName}>{item.name}</Text>
            <Text style={styles.subcategoryName}>{item.subcategory}</Text>
            <View style={styles.iconsContainer}>
              {getCategoryIcon(item.type)}
              {getStatusIcon(item.status)}
            </View>
          </View>
        </View>
      );
    } else {
      // Carte pour les "received requests" (modifiée)
      return <ReceivedRequestCard item={item} />;
    }
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
            <TouchableOpacity onPress={() => filterRequests('Local')} style={styles.filterButton}>
              {getCategoryIcon('local')}
              <Text style={[styles.filterText, selectedCategory === 'Local' && styles.activeFilterText]}>Local</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => filterRequests('Personal')} style={styles.filterButton}>
              {getCategoryIcon('personal')}
              <Text style={[styles.filterText, selectedCategory === 'Personal' && styles.activeFilterText]}>Personal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => filterRequests('Material')} style={styles.filterButton}>
              {getCategoryIcon('material')}
              <Text style={[styles.filterText, selectedCategory === 'Material' && styles.activeFilterText]}>Material</Text>
            </TouchableOpacity>
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
    height: 100, // Ajustez la hauteur pour qu'elle s'adapte à la carte
    borderRadius: 5,
    marginBottom: 10,
    resizeMode: 'cover', // Assurez-vous que l'image est bien ajustée
  },
  serviceDetailText: {
    fontSize: 12,
    marginBottom: 3,
  },
});

export default YourRequests;
