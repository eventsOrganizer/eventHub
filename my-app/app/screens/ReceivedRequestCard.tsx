import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import ServiceDetailsCard from '../services/ServiceDetailsCard';
import { deleteRequest } from '../services/requestService';
import { Request } from '../services/requestTypes';
import { useToast } from '../hooks/useToast';

interface ReceivedRequestCardProps {
    item: Request;
    onConfirm: (id: number) => void;
    onReject: (id: number) => void;
    onDelete?: (id: number) => void;
  }
  
  const ReceivedRequestCard: React.FC<ReceivedRequestCardProps> = ({ 
    item, 
    onConfirm, 
    onReject,
    onDelete 
  }) => {
    const [showDetails, setShowDetails] = useState(false);
    const fallbackImage = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b';
  
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image 
              source={{ uri: item.imageUrl || fallbackImage }} 
              style={styles.userImage}
            />
            <View>
              <Text style={styles.name}>{item.requesterName}</Text>
              <Text style={styles.email}>{item.requesterEmail}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setShowDetails(!showDetails)}>
            <Text style={styles.detailsButton}>
              {showDetails ? 'Masquer les détails' : 'Voir les détails'}
            </Text>
          </TouchableOpacity>
        </View>
  
        {showDetails && (
          <ServiceDetailsCard
            name={item.name}
            type={item.type}
            subcategory={item.subcategory}
            category={item.category}
            details={item.details}
            price={item.price}
            imageUrl={item.serviceImageUrl ?? ''}
          />
        )}
  
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>Date: {item.date}</Text>
          <Text style={styles.dateText}>De {item.start} à {item.end}</Text>
        </View>
  
        {item.status === 'pending' ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              onPress={() => onConfirm(item.id)}
              style={[styles.button, styles.confirmButton]}
            >
              <Text style={styles.buttonText}>Confirmer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => onReject(item.id)}
              style={[styles.button, styles.rejectButton]}
            >
              <Text style={styles.buttonText}>Refuser</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.statusContainer}>
            <Text style={[
              styles.statusText,
              item.status === 'accepted' ? styles.statusAccepted : styles.statusRejected
            ]}>
              {item.status === 'accepted' ? 'Demande confirmée' : 'Demande refusée'}
            </Text>
            {onDelete && (
              <TouchableOpacity 
                onPress={() => onDelete(item.id)}
                style={[styles.button, styles.deleteButton]}
              >
                <Text style={styles.buttonText}>Supprimer</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
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
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    userImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    email: {
      fontSize: 14,
      color: '#666',
    },
    detailsButton: {
      color: '#007AFF',
    },
    dateContainer: {
      marginTop: 16,
    },
    dateText: {
      fontSize: 14,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    button: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    confirmButton: {
      backgroundColor: '#22c55e',
    },
    rejectButton: {
      backgroundColor: '#ef4444',
    },
    buttonText: {
      color: 'white',
      fontWeight: '600',
    },
    statusText: {
      textAlign: 'center',
      marginTop: 16,
      fontWeight: '600',
    },
    statusContainer: {
        marginTop: 16,
        alignItems: 'center',
      },
      deleteButton: {
        backgroundColor: '#dc2626',
        marginTop: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
      },
      statusAccepted: {
        color: '#22c55e',
      },
      statusRejected: {
        color: '#ef4444',
      }
  });
  
  export default ReceivedRequestCard;