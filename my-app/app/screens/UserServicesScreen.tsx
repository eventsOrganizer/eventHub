// UserServicesScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import UserServicesList from '../components/event/profile/UserServiceList';

const UserServicesScreen: React.FC<{ route: any }> = ({ route }) => {
  const { userId } = route.params; // Get userId from route params

  return (
    <View style={styles.container}>
      <UserServicesList userId={userId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
});

export default UserServicesScreen;
