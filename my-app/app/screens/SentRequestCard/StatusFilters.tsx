import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatusFiltersProps {
  selectedStatus: string | null;
  onSelectStatus: (status: string | null) => void;
}

const StatusFilters: React.FC<StatusFiltersProps> = ({ selectedStatus, onSelectStatus }) => {
  const statuses = [
    { id: 'pending', icon: 'time', color: '#f59e0b' },
    { id: 'accepted', icon: 'checkmark-circle', color: '#10b981' },
    { id: 'refused', icon: 'close-circle', color: '#ef4444' }
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.filterButton, !selectedStatus && styles.selectedFilter]}
        onPress={() => onSelectStatus(null)}
      >
        <Text style={[styles.filterText, !selectedStatus && styles.selectedFilterText]}>All</Text>
      </TouchableOpacity>
      {statuses.map((status) => (
        <TouchableOpacity
          key={status.id}
          style={[styles.filterButton, selectedStatus === status.id && styles.selectedFilter]}
          onPress={() => onSelectStatus(status.id)}
        >
          <Ionicons 
            name={status.icon as keyof typeof Ionicons.glyphMap} 
            size={24} 
            color={selectedStatus === status.id ? 'white' : status.color} 
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedFilter: {
    backgroundColor: '#4b5563',
  },
  filterText: {
    fontSize: 16,
    color: '#4b5563',
  },
  selectedFilterText: {
    color: 'white',
  },
});

export default StatusFilters;