import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';

interface SavedItem {
  id: number;
  event?: { id: number; name: string };
  personal?: { id: number; name: string };
  material?: { id: number; name: string };
  local?: { id: number; name: string };
}

const SavedScreen: React.FC = () => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useUser();

  useEffect(() => {
    fetchSavedItems();
  }, [userId]);

  const fetchSavedItems = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved')
        .select(`
          id,
          event:event_id (id, name),
          personal:personal_id (id, name),
          material:material_id (id, name),
          local:local_id (id, name)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      setSavedItems(data as unknown as SavedItem[]);
    } catch (error) {
      console.error('Error fetching saved items:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSavedItem = ({ item }: { item: SavedItem }) => {
    const savedItem = item.event || item.personal || item.material || item.local;
    if (!savedItem) return null;

    return (
      <TouchableOpacity style={styles.itemContainer}>
        <Text style={styles.itemName}>{savedItem.name}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Items</Text>
      {savedItems.length > 0 ? (
        <FlatList
          data={savedItems}
          renderItem={renderSavedItem}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <Text style={styles.emptyText}>No saved items</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemName: {
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
  },
});

export default SavedScreen;