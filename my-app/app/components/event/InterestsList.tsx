import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../../services/supabaseClient';

interface Interest {
    id: number;
    subcategory: {
      id: string;
      name: string;
    };
  }

const InterestsList: React.FC<{ userId: string }> = ({ userId }) => {
  const [interests, setInterests] = useState<Interest[]>([]);

  useEffect(() => {
    fetchInterests();
  }, [userId]);

  const fetchInterests = async () => {
    const { data, error } = await supabase
      .from('interest')
      .select(`
        id,
        subcategory:subcategory_id (
          id,
          name
        )
      `)
      .eq('user_id', userId);
  
    if (error) {
      console.error('Error fetching interests:', error);
    } else if (data) {
      setInterests(data as any);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Interests</Text>
      <FlatList     
        data={interests}
        renderItem={({ item }) => (
          <View style={styles.interestItem}>
            <Text style={styles.interestName}>{item.subcategory.name}</Text>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        horizontal
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
  interestItem: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  interestName: {
    fontSize: 14,
  },
});

export default InterestsList;