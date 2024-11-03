import React, { useState } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
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
        activeTab === tab.key ? 'bg-white/20' : ''
      } rounded-xl mx-1`}
      onPress={() => setActiveTab(tab.key)}
    >
      <Ionicons
        name={tab.icon}
        size={24}
        color="white"
        style={tw`mb-1 ${activeTab === tab.key ? 'opacity-100' : 'opacity-60'}`}
      />
      <Text
        style={tw`text-white text-sm font-medium ${
          activeTab === tab.key ? 'opacity-100' : 'opacity-60'
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
    <LinearGradient 
      colors={['#4B0082', '#0066CC']} 
      style={tw`flex-1`}
    >
      <View style={tw`flex-1`}>
        {/* Header */}
        <View style={tw`px-4 pt-6 pb-4`}>
          <Text style={tw`text-white text-3xl font-bold mb-2`}>
            Tickets
          </Text>
          <Text style={tw`text-white/60 text-base`}>
            Manage your tickets and orders
          </Text>
        </View>

        {/* Tab Navigation */}
        <BlurView 
          intensity={80} 
          tint="dark" 
          style={tw`mx-4 rounded-2xl mb-4`}
        >
          <View style={tw`flex-row justify-around p-2`}>
            {TABS.map(renderTabButton)}
          </View>
        </BlurView>

        {/* Content Area */}
        <View style={tw`flex-1`}>
          {renderContent()}
        </View>
      </View>
    </LinearGradient>
  );
};

export default TicketManagement;