import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../services/supabaseClient';

const ServiceSelectionScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const [localServices, setLocalServices] = useState<any[]>([]);
  const [materialServices, setMaterialServices] = useState<any[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data: localData, error: localError } = await supabase.from('local_services').select('*');
    const { data: materialData, error: materialError } = await supabase.from('material_services').select('*');

    if (localError || materialError) {
      console.error('Error fetching services:', localError || materialError);
    } else {
      setLocalServices(localData || []);
      setMaterialServices(materialData || []);
    }
  };

  const toggleServiceSelection = (id: number) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(serviceId => serviceId !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    navigation.navigate('EventCreation', { selectedServices });
  };

  const renderServiceItem = (service: any) => (
    <TouchableOpacity 
      style={[styles.serviceItem, selectedServices.includes(service.id) && styles.selectedItem]} 
      onPress={() => toggleServiceSelection(service.id)}
    >
      <Text style={styles.serviceName}>{service.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Services</Text>
      <FlatList
        data={[...localServices, ...materialServices]}
        renderItem={({ item }) => renderServiceItem(item)}
        keyExtractor={item => item.id.toString()}
      />
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
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
  serviceItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  selectedItem: {
    backgroundColor: '#e0f7fa',
  },
  serviceName: {
    fontSize: 18,
  },
  nextButton: {
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ServiceSelectionScreen;