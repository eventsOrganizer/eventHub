import React from 'react';
import { View, Text, Button, StyleSheet, ImageBackground } from 'react-native';

const LandingPage = ({ navigation }: any) => {
  return (
    <ImageBackground
      source={{ uri: 'https://your-image-url.jpg' }} // Add your image URL here
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Welcome to Event Creator</Text>
        <Button 
          title="Create Event"
          onPress={() => navigation.navigate('EventCreation')}  // Navigate to EventCreation screen
          color="#4CAF50"
        />


        
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default LandingPage;
