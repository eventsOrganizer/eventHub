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
      style={tw`px-4 py-3 rounded-xl ${activeTab === tab ? 'bg-blue-50 border border-blue-100' : ''}`}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={tw`${activeTab === tab ? 'text-blue-600' : 'text-gray-600'} font-semibold`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`flex-row justify-around items-center p-4 bg-white border-b border-gray-100`}>
        {renderTabButton('your', 'Your Events')}
        {renderTabButton('attended', 'Attended')}
        {renderTabButton('tickets', 'Tickets')}
      </View>

      {activeTab === 'your' && <ManageYourEvents />}
      {activeTab === 'attended' && <AttendedEvents />}
      {activeTab === 'tickets' && <TicketsView />}
    </View>
  );
};

export default EventsManagementScreen;