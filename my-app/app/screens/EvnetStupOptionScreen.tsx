import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define types for navigation and route params
type RootStackParamList = {
  EventSetupOptions: { 
    eventName: string; 
    eventDescription: string; 
    eventType: string; 
    selectedCategory: string; 
    selectedSubcategory: string;
  };
  LandingPage: undefined;
  GuestManagement: undefined;
  EventTimeline: undefined;
  MusicAndEntertainment: undefined;
  TeamCollaboration: undefined;
  Notifications: undefined;
  Ticketing: undefined;
};

type EventSetupOptionsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EventSetupOptions'>;
type EventSetupOptionsScreenRouteProp = RouteProp<RootStackParamList, 'EventSetupOptions'>;

interface EventSetupOptionsScreenProps {
  route: EventSetupOptionsScreenRouteProp;
  navigation: EventSetupOptionsScreenNavigationProp;
}

const EventSetupOptionsScreen: React.FC<EventSetupOptionsScreenProps> = ({ route, navigation }) => {
  const { eventName, eventDescription, eventType, selectedCategory, selectedSubcategory } = route.params;

  const setupOptions = [
    { name: 'Guest Management', screen: 'GuestManagement' },
    { name: 'Event Timeline', screen: 'EventTimeline' },
    { name: 'Music and Entertainment', screen: 'MusicAndEntertainment' },
    { name: 'Team Collaboration', screen: 'TeamCollaboration' },
    { name: 'Notifications', screen: 'Notifications' },
    { name: 'Ticketing', screen: 'Ticketing' }
  ];

  const navigateToOption = (screen: 'GuestManagement' | 'EventTimeline' | 'MusicAndEntertainment' | 'TeamCollaboration' | 'Notifications' | 'Ticketing') => {
    navigation.navigate(screen, {
      eventName,
      eventDescription,
      eventType,
      selectedCategory,
      selectedSubcategory
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose Event Setup Options</Text>
      {setupOptions.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionButton}
          onPress={() => navigateToOption(option.screen as 'GuestManagement' | 'EventTimeline' | 'MusicAndEntertainment' | 'TeamCollaboration' | 'Notifications' | 'Ticketing')}
        >
          <Text style={styles.optionText}>{option.name}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.finishButton}
        onPress={() => navigation.navigate('LandingPage')}
      >
        <Text style={styles.finishButtonText}>Finish Setup</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
  },
  finishButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default EventSetupOptionsScreen;
