import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../services/supabaseClient';
import NavBar from '../components/NavBar';
import ServiceIcons from '../components/ServiceIcons';
import EventSection from '../components/event/EventSection';
import SectionComponent from '../components/SectionComponent';
import CustomButton from '../components/PersonalServiceComponents/customButton';

import RNPickerSelect from 'react-native-picker-select';

type RootStackParamList = {
  Home: undefined;
  PersonalsScreen: { category: string };
  ChatList: undefined;
  PersonalDetail: { personalId: number };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [staffServices, setStaffServices] = useState<any[]>([]);
  const [localServices, setLocalServices] = useState<any[]>([]);
  const [materialsAndFoodServices, setMaterialsAndFoodServices] = useState<any[]>([]);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('event')
      .select(`
        *,
        subcategory (
          id,
          name,
          category (
            id,
            name
          )
        ),
        location (id, longitude, latitude),
        availability (id, start, end, daysofweek, date),
        media (url)
      `);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsData = await fetchEvents();
        setEvents(eventsData);

        const { data: staffServicesData } = await supabase
          .from('personal')
          .select('*, subcategory (name), media (url)')
          .limit(5);

        const { data: localServicesData } = await supabase.from('local').select('*');
        const { data: materialsAndFoodServicesData } = await supabase.from('material').select('*');

        if (staffServicesData) setStaffServices(staffServicesData);
        if (localServicesData) setLocalServices(localServicesData);
        if (materialsAndFoodServicesData) setMaterialsAndFoodServices(materialsAndFoodServicesData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleSeeAllStaffServices = () => {
    navigation.navigate('PersonalsScreen', { category: 'Crew' });
  };

  const handleStaffServicePress = (item: any) => {
    console.log('Navigating to PersonalDetail with id:', item.id);
    navigation.navigate('PersonalDetail', { personalId: item.id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        
       
      </View>
      <NavBar selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
      <ServiceIcons />
      <ScrollView style={styles.sections} contentContainerStyle={styles.scrollViewContent}>
        <EventSection title="Your events" events={events} navigation={navigation} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top staff services</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {staffServices.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleStaffServicePress(item)}
                style={styles.serviceCard}
              >
                <Image source={{ uri: item.media?.[0]?.url }} style={styles.serviceImage} />
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.servicePrice}>${item.priceperhour}/hr</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <CustomButton title="See All" onPress={handleSeeAllStaffServices} />
        </View>
        <SectionComponent title="Top locals services" data={localServices} onSeeAll={() => {}} />
        <SectionComponent title="Top materials and food services" data={materialsAndFoodServices} onSeeAll={() => {}} />
        <CustomButton
          title="Check Messages"
          onPress={() => navigation.navigate('ChatList')}
          style={styles.messageButton}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  icon: {
    marginLeft: 10,
  },
  sections: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  serviceCard: {
    width: 150,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
  },
  serviceImage: {
    width: 130,
    height: 100,
    borderRadius: 5,
    marginBottom: 5,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  servicePrice: {
    fontSize: 14,
    color: 'green',
  },
  messageButton: {
    marginTop: 10,
    marginHorizontal: 10,
  },
});



export default HomeScreen;