import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useUser } from '../UserContext';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { handleRequestConfirmation, handleRequestRejection } from '../services/requestService';
import { useToast } from '../hooks/useToast';
import { useNotifications } from '../hooks/useNotifications';
import { Request, RouteParams } from '../services/requestTypes';
import { fetchSentRequests, fetchReceivedRequests } from '../services/requestQuerries';
import ReceivedRequestCard from './ReceivedRequestCard';
import SentRequestCard from './SentRequestCard';
import { RootStackParamList } from '../navigation/types';
import Icon from 'react-native-vector-icons/MaterialIcons';

const YourRequests: React.FC = () => {
  const { userId } = useUser();
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { mode } = route.params;
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>(['All', 'Crew', 'Local', 'Material']);
  const { toast } = useToast();
  const { unreadCount } = useNotifications(userId);

  useEffect(() => {
    if (userId) {
      fetchRequests();
    }
  }, [userId, mode]);

  const fetchRequests = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const data = mode === 'sent' 
        ? await fetchSentRequests(userId)
        : await fetchReceivedRequests(userId);
        
      console.log('Fetched requests:', data);
      setRequests(data);
      setFilteredRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
        
        // Update local state immediately
        const updatedRequests = requests.map(req => 
          req.id === requestId ? { ...req, status: 'accepted' as const } : req
        );
        setRequests(updatedRequests);
        setFilteredRequests(updatedRequests);
      }
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
        
        // Update local state immediately
        const updatedRequests = requests.map(req => 
          req.id === requestId ? { ...req, status: 'refused' as const } : req
        );
        setRequests(updatedRequests);
        setFilteredRequests(updatedRequests);
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Error",
        description: "Failed to reject request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filterRequests = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredRequests(requests);
    } else {
      const filtered = requests.filter(request => {
        // Pour Crew, on vérifie si c'est un service de type Personal
        if (category === 'Crew') {
          return request.type === 'Personal';
        }
        // Pour les autres catégories, on compare directement avec le type
        return request.type === category;
      });
      setFilteredRequests(filtered);
    }
  };

  const handleDelete = async (requestId: number) => {
    const updatedRequests = requests.filter(req => req.id !== requestId);
    setRequests(updatedRequests);
    setFilteredRequests(updatedRequests);
  };

  const handleRequestDeleted = () => {
    // Rafraîchir la liste des demandes après une suppression
    fetchRequests();
  };

  const renderRequestItem = ({ item }: { item: Request }) => {
    return mode === 'sent' ? (
      <SentRequestCard 
        item={item} 
        onRequestDeleted={handleRequestDeleted}
      />
    ) : (
      <ReceivedRequestCard 
        item={item} 
        onConfirm={handleConfirm}
        onReject={handleReject}
        onDelete={handleDelete}
      />
    );
  };

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.filterButton,
            selectedCategory === category && styles.selectedFilterButton
          ]}
          onPress={() => filterRequests(category)}
        >
          <Icon
            name={getIconNameForCategory(category)}
            size={24}
            color={selectedCategory === category ? '#4CAF50' : '#666'}
          />
          <Text style={[
            styles.filterText,
            selectedCategory === category && styles.selectedFilterText
          ]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const getIconNameForCategory = (category: string) => {
    switch (category) {
      case 'Crew':
        return 'group';
      case 'Local':
        return 'place';
      case 'Material':
        return 'inventory';
      default:
        return 'all-inclusive';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderFilterButtons()}
      <FlatList
        data={filteredRequests}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    marginBottom: 16,
  },
  filterButton: {
    alignItems: 'center',
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
  statusText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#666',
    marginTop: 5,
  },
  selectedFilterButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 8,
    padding: 8,
  },
  filterText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  selectedFilterText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },

});

export default YourRequests;
