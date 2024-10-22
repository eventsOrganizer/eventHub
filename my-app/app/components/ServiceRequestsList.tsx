import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../services/supabaseClient';
import { useToast } from "../hooks/use-toast";

interface ServiceRequest {
  id: string;
  service_id: string;
  user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  service: {
    name: string;
  };
  user: {
    firstname: string;
    lastname: string;
  };
}

const ServiceRequestsList: React.FC<{ userId: string }> = ({ userId }) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  const fetchServiceRequests = async () => {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        id,
        service_id,
        user_id,
        status,
        created_at,
        service:services(name),
        user:users(firstname, lastname)
      `)
      .eq('status', 'pending')
      .eq('services.user_id', userId);

    if (error) {
      console.error('Error fetching service requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch service requests. Please try again.",
        variant: "destructive",
      });
    } else {
      setRequests(data.map(request => ({
        ...request,
        service: { ...request.service, name: request.service.name[0].name },
        user: { ...request.user, firstname: request.user.firstname[0].firstname, lastname: request.user.lastname[0].lastname }
      })));
    }
  };

  const handleRequestAction = async (requestId: string, action: 'accept' | 'reject') => {
    const { error } = await supabase
      .from('service_requests')
      .update({ status: action === 'accept' ? 'accepted' : 'rejected' })
      .eq('id', requestId);

    if (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Error",
        description: `Failed to ${action} the request. Please try again.`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Request ${action === 'accept' ? 'accepted' : 'rejected'} successfully.`,
      });
      fetchServiceRequests(); // Refresh the list
    }
  };

  const renderRequestItem = ({ item }: { item: ServiceRequest }) => (
    <View style={styles.requestItem}>
      <Text style={styles.serviceName}>{item.service.name}</Text>
      <Text style={styles.requesterName}>
        Requested by: {item.user.firstname} {item.user.lastname}
      </Text>
      <Text style={styles.requestStatus}>Status: {item.status}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => handleRequestAction(item.id, 'accept')}
        >
          <Text style={styles.actionButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={() => handleRequestAction(item.id, 'reject')}
        >
          <Text style={styles.actionButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={requests}
      renderItem={renderRequestItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Text style={styles.emptyText}>No pending service requests found.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  requestItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  requesterName: {
    fontSize: 16,
    marginBottom: 5,
  },
  requestStatus: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default ServiceRequestsList;