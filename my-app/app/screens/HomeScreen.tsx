import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, TextInput, ScrollView, StyleSheet, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import CustomButton from '../components/standardComponents/customButton';
import CustomButton from '../components/PersonalServiceComponents/customButton'
import RNPickerSelect from 'react-native-picker-select';
import Section from '../components/PersonalServiceComponents/customButton';

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
import EventSection from '../components/event/EventSection';



const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
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

  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsData = await fetchEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error(error);
      }

      const { data: staffServicesData, error: staffServicesError } = await supabase
        .from('personal')
        .select('*, subcategory (name), media (url)')
        // .eq('subcategory.name', 'Crew')
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
        <CustomButton
          title="Check Messages"
          onPress={() => navigation.navigate('ChatList')}
          style={styles.messageButton }
        />
      </ScrollView>
    </View>
  );
}

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
  services: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  serviceIcon: {
    marginHorizontal: 10,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageButton: {
    marginTop: 10,
    marginHorizontal: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
});

export default HomeScreen;