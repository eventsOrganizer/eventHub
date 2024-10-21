import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

type RootStackParamList = {
  CreateLocalServiceStep1: undefined;
  CreatePersonalServiceStep1: undefined;
  MaterialServiceCreation: undefined; // Placeholder for future implementation
};

type ServiceSelectionNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ServiceSelection: React.FC = () => {
  const navigation = useNavigation<ServiceSelectionNavigationProp>();

  const handleCardPress = (cardType: string) => {
    if (cardType === 'Local') {
      navigation.navigate('CreateLocalServiceStep1');
    } else if (cardType === 'Personnel') {
      navigation.navigate('CreatePersonalServiceStep1');
    }
    // No navigation for Material yet
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Service Type</Text>
      <View style={styles.cardContainer}>
        {/* Local Service Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleCardPress('Local')}
        >
          <Icon name="location-on" size={40} color="black" />
          <Text style={styles.cardText}>Local</Text>
        </TouchableOpacity>

        {/* Personnel Service Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleCardPress('Personnel')}
        >
          <Icon name="people" size={40} color="black" />
          <Text style={styles.cardText}>Personnel</Text>
        </TouchableOpacity>

        {/* Material Service Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            // Uncomment when implemented
            // navigation.navigate('MaterialServiceCreation');
          }}
        >
          <Icon name="build" size={40} color="black" />
          <Text style={styles.cardText}>Material</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardContainer: {
    width: '80%',
  },
  card: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    elevation: 2,
    marginBottom: 20,
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ServiceSelection;
