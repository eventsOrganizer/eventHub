import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ServiceDetailsCard from '../services/ServiceDetailsCard';
import { Request } from '../services/requestTypes';

interface SentRequestCardProps {
    item: Request;
  }
  
  const SentRequestCard: React.FC<SentRequestCardProps> = ({ item }) => {
    const [showDetails, setShowDetails] = useState(false);
    const fallbackImage = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b';
    
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image 
            source={{ uri: item.creatorImageUrl || fallbackImage }} 
            style={styles.serviceImage}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.creatorName}</Text>
            <Text style={styles.status}>
              {item.status === 'accepted' 
                ? '✅ Acceptée' 
                : item.status === 'refused'
                ? '❌ Refusée'
                : '⏳ En attente'}
            </Text>
          </View>
        </View>
  
        <TouchableOpacity onPress={() => setShowDetails(!showDetails)}>
          <Text style={styles.detailsButton}>
            {showDetails ? 'Masquer les détails' : 'Voir les détails'}
          </Text>
        </TouchableOpacity>
  
        {showDetails && (
          <ServiceDetailsCard
            name={item.name}
            type={item.type}
            category={item.category} // Ajoutez cette ligne
            subcategory={item.subcategory}
            details={item.details}
            imageUrl={item.serviceImageUrl ?? ''}
            price={item.price}
          />
        )}
  
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>Date: {item.date}</Text>
          <Text style={styles.dateText}>De {item.start} à {item.end}</Text>
        </View>
  
        <Text style={[
          styles.statusText,
          item.status === 'accepted' && styles.statusAccepted,
          item.status === 'refused' && styles.statusRefused
        ]}>
          {item.status === 'accepted' 
            ? 'Demande acceptée' 
            : item.status === 'refused'
            ? 'Demande refusée'
            : 'En attente de réponse'}
        </Text>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      marginBottom: 16,
      padding: 16,
      backgroundColor: 'white',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    serviceImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 12,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    status: {
      fontSize: 14,
      color: '#666',
      marginTop: 4,
    },
    detailsButton: {
      color: '#007AFF',
      marginBottom: 8,
    },
    dateContainer: {
      marginTop: 16,
    },
    dateText: {
      fontSize: 14,
    },
    statusText: {
      marginTop: 16,
      textAlign: 'center',
      fontWeight: '600',
    },
    statusAccepted: {
      color: '#22c55e',
    },
    statusRefused: {
      color: '#ef4444',
    },
  });
  
  export default SentRequestCard;