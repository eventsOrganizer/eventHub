import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../services/supabaseClient';
import NavBar from '../components/NavBar';
import ServiceIcons from '../components/ServiceIcons';
import SectionComponent from '../components/SectionComponent';

type RootStackParamList = {
  Home: undefined;
  PersonalsScreen: { category: string };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [staffServices, setStaffServices] = useState<any[]>([]);
  const [localServices, setLocalServices] = useState<any[]>([]);
  const [materialsAndFoodServices, setMaterialsAndFoodServices] = useState<any[]>([]);

  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    const fetchData = async () => {
      const { data: eventsData } = await supabase.from('event').select('*');
      const { data: staffServicesData } = await supabase
        .from('personal')
        .select('*, subcategory (name), media (url)')
        .eq('subcategory.name', 'Crew')
        .limit(5);
      const { data: localServicesData } = await supabase.from('local').select('*');
      const { data: materialsAndFoodServicesData } = await supabase.from('material').select('*');

      if (eventsData) setEvents(eventsData);
      if (staffServicesData) setStaffServices(staffServicesData);
      if (localServicesData) setLocalServices(localServicesData);
      if (materialsAndFoodServicesData) setMaterialsAndFoodServices(materialsAndFoodServicesData);
    };

    fetchData();
  }, []);

  const handleSeeAllStaffServices = () => {
    navigation.navigate('PersonalsScreen', { category: 'Crew' });
  };

  return (
    <View style={styles.container}>
      <NavBar selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
      <ServiceIcons />
      <ScrollView style={styles.sections} contentContainerStyle={styles.scrollViewContent}>
        <SectionComponent title="Your events" data={events} onSeeAll={() => {}} />
        <SectionComponent title="Top staff services" data={staffServices} onSeeAll={handleSeeAllStaffServices} />
        <SectionComponent title="Top locals services" data={localServices} onSeeAll={() => {}} />
        <SectionComponent title="Top materials and food services" data={materialsAndFoodServices} onSeeAll={() => {}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  sections: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
});

export default HomeScreen;