import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

type RootStackParamList = {
  LocalServiceCreation: undefined;
  PersonnelServiceCreation: undefined;
  MaterialServiceCreation: undefined;
};

type ServiceSelectionNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ServiceSelection: React.FC = () => {
  const navigation = useNavigation<ServiceSelectionNavigationProp>();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const handleCardPress = (cardType: string) => {
    setExpandedCard(expandedCard === cardType ? null : cardType);
  };

  const renderExpandedContent = (cardType: string) => {
    if (expandedCard !== cardType) return null;

    let description = '';
    let navigateTo = '';

    switch (cardType) {
      case 'Local':
        description = 'Local services include location-based offerings.';
        navigateTo = 'LocalServiceCreation';
        break;
      case 'Personnel':
        description = 'Personnel services involve hiring staff or crew.';
        navigateTo = 'PersonnelServiceCreation';
        break;
      case 'Material':
        description = 'Material services provide tools and resources.';
        navigateTo = 'MaterialServiceCreation';
        break;
    }

    return (
      <View style={styles.expandedContent}>
        <Text style={styles.description}>{description}</Text>
        <TouchableOpacity
          style={styles.navigateButton}
          onPress={() => navigation.navigate(navigateTo as keyof RootStackParamList)}
        >
          <Text style={styles.navigateButtonText}>Go to Creation</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Service Type</Text>
      <View style={styles.cardContainer}>
        {/* Local Service Card */}
        <Animatable.View
          animation={expandedCard === 'Local' ? 'slideInLeft' : undefined}
          duration={500}
          style={[styles.cardWrapper, expandedCard === 'Local' && styles.expandedCard]}
        >
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleCardPress('Local')}
          >
            <Icon name="location-on" size={40} color="black" />
            <Text style={styles.cardText}>Local</Text>
          </TouchableOpacity>
          {renderExpandedContent('Local')}
        </Animatable.View>

        {/* Personnel Service Card */}
        <Animatable.View
          animation={expandedCard === 'Personnel' ? 'slideInLeft' : undefined}
          duration={500}
          style={[styles.cardWrapper, expandedCard === 'Personnel' && styles.expandedCard]}
        >
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleCardPress('Personnel')}
          >
            <Icon name="people" size={40} color="black" />
            <Text style={styles.cardText}>Personnel</Text>
          </TouchableOpacity>
          {renderExpandedContent('Personnel')}
        </Animatable.View>

        {/* Material Service Card */}
        <Animatable.View
          animation={expandedCard === 'Material' ? 'slideInLeft' : undefined}
          duration={500}
          style={[styles.cardWrapper, expandedCard === 'Material' && styles.expandedCard]}
        >
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleCardPress('Material')}
          >
            <Icon name="build" size={40} color="black" />
            <Text style={styles.cardText}>Material</Text>
          </TouchableOpacity>
          {renderExpandedContent('Material')}
        </Animatable.View>
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
  cardWrapper: {
    marginBottom: 20,
    overflow: 'hidden',
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
  },
  expandedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 100,
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  expandedContent: {
    flex: 1,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginLeft: 10,
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  navigateButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  navigateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ServiceSelection;
