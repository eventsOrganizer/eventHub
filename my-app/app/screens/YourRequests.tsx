import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useUser } from '../UserContext';
import { useRoute, RouteProp } from '@react-navigation/native';
import { handleRequestConfirmation, handleRequestRejection } from '../services/requestService';
import { useToast } from '../hooks/useToast';
import { useNotifications } from '../hooks/useNotifications';
import { Request, RouteParams } from '../services/requestTypes';
import { fetchSentRequests, fetchReceivedRequests } from '../services/requestQuerries';
import   ReceivedRequestCard  from './ReceivedRequestCard';
import  SentRequestCard  from './SentRequestCard';
import  FilterButtons  from './FilterButtons';

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
    if (!userId) return;
    
    setLoading(true);
    try {
      const data = mode === 'sent' 
        ? await fetchSentRequests(userId)
        : await fetchReceivedRequests(userId);
        
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
    setFilteredRequests(
      category === 'All' 
        ? requests 
        : requests.filter(request => request.type === category)
    );
  };

  const handleDelete = async (requestId: number) => {
    const updatedRequests = requests.filter(req => req.id !== requestId);
    setRequests(updatedRequests);
    setFilteredRequests(updatedRequests);
  };

  const renderRequestItem = ({ item }: { item: Request }) => {
    return mode === 'sent' ? (
      <SentRequestCard item={item} />
    ) : (
      <ReceivedRequestCard 
        item={item} 
        onConfirm={handleConfirm}
        onReject={handleReject}
        onDelete={handleDelete}
      />
    );
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
      <Text style={styles.title}>
        {mode === 'sent' ? 'Your Requests' : 'Received Requests'}
      </Text>
      
      <FilterButtons 
        selectedCategory={selectedCategory}
        onSelectCategory={filterRequests}
      />

      <FlatList
        data={filteredRequests}
        renderItem={renderRequestItem}
        keyExtractor={item => `${item.type}-${item.id}`}
      />
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
  statusText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#666',
    marginTop: 5,
  },
});

export default YourRequests;
