import React, { useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import PurchasedTickets from './PurchasedTickets';
import SoldTickets from './SoldTickets';
import TicketScanningScreen from './TicketScanningScreen';
import { TouchableOpacity, Text } from 'react-native';

type TabType = 'purchased' | 'sold' | 'scan';

interface TabConfig {
  key: TabType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const TABS: TabConfig[] = [
  { key: 'purchased', label: 'My Tickets', icon: 'ticket-outline' },
  { key: 'sold', label: 'Sold', icon: 'cash-outline' },
  { key: 'scan', label: 'Scan', icon: 'scan-outline' }
];

const TicketManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('purchased');

  const renderTabButton = (tab: TabConfig) => (
    <TouchableOpacity
      key={tab.key}
      style={tw`flex-1 items-center py-3 px-4 ${
        activeTab === tab.key ? 'bg-blue-50 border border-blue-100' : ''
      } rounded-xl mx-1`}
      onPress={() => setActiveTab(tab.key)}
    >
      <Ionicons
        name={tab.icon}
        size={24}
        color={activeTab === tab.key ? '#0066CC' : '#64748b'}
        style={tw`mb-1`}
      />
      <Text
        style={tw`text-sm font-medium ${
          activeTab === tab.key ? 'text-blue-600' : 'text-gray-500'
        }`}
      >
        {tab.label}
      </Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'purchased':
        return <PurchasedTickets />;
      case 'sold':
        return <SoldTickets />;
      case 'scan':
        return <TicketScanningScreen />;
      default:
        return null;
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`px-4 pt-6 pb-4 border-b border-gray-100`}>
        <Text style={tw`text-gray-800 text-3xl font-bold mb-2`}>
          Tickets
        </Text>
        <Text style={tw`text-gray-500 text-base`}>
          Manage your tickets and orders
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={tw`mx-4 mt-4 bg-white rounded-2xl shadow-sm border border-gray-100`}>
        <View style={tw`flex-row justify-around p-2`}>
          {TABS.map(renderTabButton)}
        </View>
      </View>

      {/* Content Area */}
      <View style={tw`flex-1 px-4 pt-4`}>
        {renderContent()}
      </View>
    </View>
  );
};

export default TicketManagement;