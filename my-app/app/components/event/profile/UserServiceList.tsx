import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../../../services/supabaseClient';

interface Service {
  id: number;
  name: string;
  type: string;
}

const UserServicesList: React.FC<{ userId: string }> = ({ userId }) => {
  const [userServices, setUserServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchUserServices();
  }, [userId]);

  const fetchUserServices = async () => {
    const { data: personalData, error: personalError } = await supabase
      .from('personal')
      .select('id, name')
      .eq('user_id', userId);

    const { data: localData, error: localError } = await supabase
      .from('local')
      .select('id, name')
      .eq('user_id', userId);

    const { data: materialData, error: materialError } = await supabase
      .from('material')
      .select('id, name')
      .eq('user_id', userId);

    if (personalError || localError || materialError) {
      console.error('Error fetching user services:', personalError || localError || materialError);
    } else {
      const allServices = [
        ...(personalData || []).map(s => ({ ...s, type: 'Personal' })),
        ...(localData || []).map(s => ({ ...s, type: 'Local' })),
        ...(materialData || []).map(s => ({ ...s, type: 'Material' }))
      ];
      setUserServices(allServices);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Services</Text>
      <FlatList
        data={userServices}
        renderItem={({ item }) => (
          <View style={styles.serviceItem}>
            <Text style={styles.serviceName}>{item.name}</Text>
            <Text style={styles.serviceType}>{item.type}</Text>
          </View>
        )}
        keyExtractor={item => `${item.type}-${item.id}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  serviceItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  serviceType: {
    fontSize: 14,
    color: '#666',
  },
});

export default UserServicesList;