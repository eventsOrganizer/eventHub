// app/screens/CalendarScreen.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import CalendarComponent from '../components/Calendar';
const CalendarScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calendar</Text>
      <CalendarComponent navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default CalendarScreen;
