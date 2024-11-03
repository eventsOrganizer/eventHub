import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import ManageYourEvents from './ManageYourEvents';
import AttendedEvents from './AttendedEvents';
import TicketsView from '../Ticketing/TicketManagement'; // You'll need to create this component

const EventsManagementScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'your' | 'attended' | 'tickets'>('your');

  const renderTabButton = (tab: 'your' | 'attended' | 'tickets', label: string) => (
    <TouchableOpacity 
      style={tw`px-4 py-3 rounded-xl ${activeTab === tab ? 'bg-white/20' : ''}`}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={tw`text-white font-semibold`}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#4B0082', '#0066CC']} style={tw`flex-1`}>
      <View style={tw`flex-row justify-around items-center p-4 bg-white/10`}>
        {renderTabButton('your', 'Your Events')}
        {renderTabButton('attended', 'Attended')}
        {renderTabButton('tickets', 'Tickets')}
      </View>

      {activeTab === 'your' && <ManageYourEvents />}
      {activeTab === 'attended' && <AttendedEvents />}
      {activeTab === 'tickets' && <TicketsView />}
    </LinearGradient>
  );
};

export default EventsManagementScreen;