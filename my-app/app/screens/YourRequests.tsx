import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useUser } from '../UserContext';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { handleRequestConfirmation, handleRequestRejection } from '../services/requestService';
import { useToast } from '../hooks/useToast';
import { useNotifications } from '../hooks/useNotifications';
import { Request } from '../services/requestTypes';
import { fetchSentRequests, fetchReceivedRequests } from '../services/requestQuerries';
import ReceivedRequestCard from '../screens/ReceivedRequest/ReceivedRequestCard';
import SentRequestCard from '../screens/SentRequestCard';
import { RootStackParamList } from '../navigation/types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StatusFilters from '../screens/SentRequestCard/StatusFilters';

const YourRequests: React.FC = () => {
  const { userId } = useUser();
  const route = useRoute<RouteProp<Record<string, { mode: 'sent' | 'received' }>, string>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { mode } = route.params;
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [categories] = useState<string[]>(['All', 'Crew', 'Local', 'Material']);
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
      filterRequests(selectedCategory, selectedStatus, data);
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

  const filterRequests = (category: string, status: string | null, requestsList = requests) => {
    let filtered = [...requestsList];

    if (category !== 'All') {
      filtered = filtered.filter(request => 
        category === 'Crew' ? request.type === 'Personal' : request.type === category
      );
    }

    if (mode === 'sent' && status) {
      filtered = filtered.filter(request => request.status === status);
    }

    setSelectedCategory(category);
    setSelectedStatus(status);
    setFilteredRequests(filtered);
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
          variant: "default",
        });
        
        const updatedRequests = requests.map(req => 
          req.id === requestId ? { ...req, status: 'accepted' as const } : req
        );
        setRequests(updatedRequests);
        filterRequests(selectedCategory, selectedStatus, updatedRequests);
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
          variant: "default",
        });
        
        const updatedRequests = requests.map(req => 
          req.id === requestId ? { ...req, status: 'refused' as const } : req
        );
        setRequests(updatedRequests);
        filterRequests(selectedCategory, selectedStatus, updatedRequests);
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

  const handleDelete = async (requestId: number) => {
    const updatedRequests = requests.filter(req => req.id !== requestId);
    setRequests(updatedRequests);
    filterRequests(selectedCategory, selectedStatus, updatedRequests);
  };

  const renderRequestItem = ({ item }: { item: Request }) => {
    return mode === 'sent' ? (
      <SentRequestCard 
        item={item} 
        onRequestDeleted={() => handleDelete(item.id)}
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

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.filterButton,
            selectedCategory === category && styles.selectedFilterButton
          ]}
          onPress={() => filterRequests(category, selectedStatus)}
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
      {mode === 'sent' && (
        <StatusFilters
          selectedStatus={selectedStatus}
          onSelectStatus={(status) => filterRequests(selectedCategory, status)}
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  filterButton: {
    alignItems: 'center',
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
  listContainer: {
    paddingBottom: 24,
  }
});

export default YourRequests;