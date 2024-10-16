import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FollowersComponent from './FollowersComponent';
import FollowingComponent from './FollowingComponent';

const Subscriptions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'followers' && styles.activeTab]}
          onPress={() => setActiveTab('followers')}
        >
          <Text style={styles.tabText}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'following' && styles.activeTab]}
          onPress={() => setActiveTab('following')}
        >
          <Text style={styles.tabText}>Following</Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'followers' ? <FollowersComponent /> : <FollowingComponent />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tab: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FFA500',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Subscriptions;