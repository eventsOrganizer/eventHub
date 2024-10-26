import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import { supabase } from '../services/supabaseClient';
import { useUser } from '../UserContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types'; // Import the Request interface from types.ts

type RouteParams = {
  userId: string;
  mode: 'sent' | 'received';
};

// Add this interface at the top of your file
interface Request {
  id: number;
  name: string;
  status: string;
  type: string | undefined;
  subcategory: string;
  serviceImageUrl: string | null;
  details?: string;
  imageUrl?: string | null;
  requesterName?: string;
  requesterEmail?: string;
  createdAt?: string;
  date?: string;
  start?: string;
  end?: string;
}

const YourRequests: React.FC = () => {
  const { userId } = useUser();
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { mode } = route.params;
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedRequest, setExpandedRequest] = useState<number | null>(null);

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
        const service = req.personal?.[0] || req.local?.[0] || req.material?.[0];
        return {
          id: req.id,
          name: service?.name || 'Service sans nom',
          status: req.status || 'Statut inconnu',
          type: req.personal ? 'Personal' : req.local ? 'Local' : 'Material',
          subcategory: service?.subcategory?.name || 'Sous-catégorie inconnue',
          serviceImageUrl: service?.media?.[0]?.url || null,
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
        let service, serviceType;
        if ('personal' in req && req.personal) {
          service = req.personal;
          serviceType = 'Personal';
        } else if ('local' in req && req.local) {
          service = req.local;
          serviceType = 'Local';
        } else if ('material' in req && req.material) {
          service = req.material;
          serviceType = 'Material';
        }
        
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

  const filterRequests = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(request => request.type === category));
    }
  };

  const renderRequestItem = ({ item, index }: { item: Request; index: number }) => (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 100 }}
      style={styles.requestCard}
    >
      <TouchableOpacity onPress={() => setExpandedRequest(expandedRequest === item.id ? null : item.id)}>
        <View style={styles.requestHeader}>
          <Text style={styles.requestName}>{item.name}</Text>
          {getStatusIcon(item.status)}
          {getCategoryIcon(item.type)}
        </View>
      </TouchableOpacity>

      {item.serviceImageUrl && (
        <Image source={{ uri: item.serviceImageUrl }} style={styles.requestImage} />
      )}

      <Text style={styles.requestStatus}>Status: {item.status}</Text>
      <Text style={styles.requestType}>Type: {item.type}</Text>
      <Text style={styles.requestSubcategory}>Subcategory: {item.subcategory}</Text>

      {expandedRequest === item.id && (
        <View style={styles.expandedContent}>
          <Text style={styles.expandedText}>Requester: {item.requesterName}</Text>
          <Text style={styles.expandedText}>Email: {item.requesterEmail}</Text>
          <Text style={styles.expandedText}>Created: {item.createdAt}</Text>
          {item.date && <Text style={styles.expandedText}>Date: {item.date}</Text>}
          {item.start && item.end && (
            <Text style={styles.expandedText}>Time: {item.start} - {item.end}</Text>
          )}
          <TouchableOpacity 
            style={styles.detailButton}
            onPress={() => navigation.navigate('PersonalDetail', { personalId: item.id })}
          >
            <Text style={styles.detailButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      )}

      {mode === 'received' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={() => handleConfirm(item.id)}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item.id)}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </MotiView>
  );

  return (
    <LinearGradient
      colors={['#f8f9fa', '#e9ecef']}
      style={styles.container}
    >
      {loading ? (
        <MotiView 
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 1000 }}
          style={styles.loadingContainer}
        >
          <ActivityIndicator size="large" color="#4CAF50" />
        </MotiView>
      ) : (
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          style={styles.content}
        >
          <Text style={styles.title}>
            {mode === 'sent' ? 'Your Requests' : 'Received Requests'}
          </Text>

          <View style={styles.filterContainer}>
            <FilterButton
              onPress={() => filterRequests('All')}
              isSelected={selectedCategory === 'All'}
              icon="filter-list"
              label="All"
            />
            <FilterButton
              onPress={() => filterRequests('Local')}
              isSelected={selectedCategory === 'Local'}
              icon="location-on"
              label="Local"
            />
            <FilterButton
              onPress={() => filterRequests('Personal')}
              isSelected={selectedCategory === 'Personal'}
              icon="person"
              label="Personal"
            />
            <FilterButton
              onPress={() => filterRequests('Material')}
              isSelected={selectedCategory === 'Material'}
              icon="shopping-cart"
              label="Material"
            />
          </View>

          <FlatList
            data={filteredRequests}
            renderItem={renderRequestItem}
            keyExtractor={item => `${item.type}-${item.id}`}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </MotiView>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  listContainer: {
    paddingBottom: 24,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  requestStatus: {
    fontSize: 14,
    color: '#666',
  },
  requestType: {
    fontSize: 14,
    color: '#666',
  },
  requestSubcategory: {
    fontSize: 14,
    color: '#666',
  },
  requestImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  expandedContent: {
    marginBottom: 16,
  },
  expandedText: {
    fontSize: 14,
    color: '#666',
  },
  detailButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default YourRequests;
