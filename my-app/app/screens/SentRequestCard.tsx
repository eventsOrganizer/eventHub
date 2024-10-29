import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import ServiceDetailsCard from '../services/ServiceDetailsCard';
import { Request } from '../services/requestTypes';
import { deleteRequest } from '../services/requestService';
import useStripePayment from '.././payment/UseStripePayment';

type PaymentActionNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentAction'>;

interface SentRequestCardProps {
  item: Request;
  onRequestDeleted: () => void;
}

const SentRequestCard: React.FC<SentRequestCardProps> = ({ item, onRequestDeleted }) => {
  const navigation = useNavigation<PaymentActionNavigationProp>();
  const [showDetails, setShowDetails] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { handlePayment, loading } = useStripePayment();
  const fallbackImage = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b';
  
  const calculateTotalPrice = () => {
    if (item.type === 'Material') {
      if (item.sell_or_rent === 'sell') {
        return item.price || 0;
      } else {
        const hours = calculateHours(item.start, item.end);
        return hours * (item.price_per_hour || 0);
      }
    } else {
      const hours = calculateHours(item.start, item.end);
      return hours * (item.priceperhour || 0);
    }
  };

  const calculateAdvancePayment = () => {
    const totalPrice = calculateTotalPrice();
    if (item.type === 'Material' && item.sell_or_rent === 'sell') {
      return totalPrice;
    }
    return (totalPrice * (item.percentage || 0)) / 100;
  };

  const calculateHours = (start: string, end: string) => {
    if (start === 'Not specified' || end === 'Not specified') return 0;
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  };

  const handlePaymentConfirmation = async () => {
    setShowPaymentModal(false);
    const amount = calculateAdvancePayment();
    navigation.navigate('PaymentAction', {
      price: amount,
      personalId: item.id.toString()
    });
  };

  const renderPaymentModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showPaymentModal}
      onRequestClose={() => setShowPaymentModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Payment Summary</Text>
          
          <Text>You have requested '{item.name}' from {item.creatorName || 'Unknown creator'}</Text>
          <Text>On {item.date || 'Unspecified date'} from {item.start || 'Unspecified'} to {item.end || 'Unspecified'}</Text>
          
          <Text style={styles.sectionTitle}>Service Details:</Text>
          <Text>Name: {item.name}</Text>
          {item.availability && <Text>Availability: {item.availability}</Text>}
          {item.type === 'Material' && (
            <>
              <Text>Sell or Rent: {item.sell_or_rent}</Text>
              <Text>Price: ${item.price?.toFixed(2) || '0.00'}</Text>
            </>
          )}
          <Text>Price per hour: ${((item.priceperhour || item.price_per_hour || 0).toFixed(2))}</Text>
          <Text>Percentage: {item.percentage.toFixed(2)}%</Text>
          
          <View style={styles.separator} />
          
          <Text style={styles.totalPrice}>Total price to pay: ${calculateTotalPrice().toFixed(2)}</Text>
          {item.type !== 'Material' || item.sell_or_rent !== 'sell' ? (
            <Text style={styles.advancePayment}>Advance payment: ${calculateAdvancePayment().toFixed(2)}</Text>
          ) : (
            <Text style={styles.fullPayment}>Full payment required for purchase</Text>
          )}
          
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={handlePaymentConfirmation}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Processing...' : 'Confirm'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowPaymentModal(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const handleDelete = async () => {
    Alert.alert(
      "Confirm deletion",
      "Are you sure you want to delete this request?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteRequest(item.id);
              onRequestDeleted(); // Informer le composant parent de la suppression
            } catch (error) {
              console.error('Error deleting request:', error);
              Alert.alert("Error", "Unable to delete the request. Please try again.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderStatusIcon = () => {
    switch (item.status) {
      case 'accepted':
        return <Ionicons name="checkmark-circle" size={24} color="green" />;
      case 'refused':
        return <Ionicons name="close-circle" size={24} color="red" />;
      case 'pending':
        return <Ionicons name="time" size={24} color="orange" />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: item.creatorImageUrl || fallbackImage }} 
          style={styles.image}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.creatorName}</Text>
          <Text style={styles.email}>{item.creatorEmail || 'Email non disponible'}</Text>
          <Text style={styles.serviceLabel}>Service : <Text style={styles.serviceValue}>{item.name}</Text></Text>
          <Text style={styles.dateLabel}>Date : <Text style={styles.dateValue}>{item.date}</Text></Text>
          <Text style={styles.timeLabel}>From : <Text style={styles.timeValue}>{item.start}</Text> To : <Text style={styles.timeValue}>{item.end}</Text></Text>
        </View>
        {renderStatusIcon()}
      </View>

      <TouchableOpacity onPress={() => setShowDetails(!showDetails)}>
        <Text style={styles.detailsButton}>
          {showDetails ? 'Hide details' : 'View details'}
        </Text>
      </TouchableOpacity>

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

      {item.status === 'accepted' && (
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={() => setShowPaymentModal(true)}
        >
          <Text style={styles.paymentButtonText}>Pass to Payment</Text>
        </TouchableOpacity>
      )}

      {item.status === 'refused' && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>Delete Request</Text>
        </TouchableOpacity>
      )}

      {renderPaymentModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    marginTop: -10, // Ajoutez cette ligne pour déplacer l'image vers le haut
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  serviceName: {
    fontSize: 14,
    color: '#444',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  detailsButton: {
    color: '#007AFF',
    marginTop: 8,
  },
  paymentButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  paymentButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  advancePayment: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fullPayment: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButton: {
    marginRight: 10,
  },
  cancelButton: {
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  serviceLabel: { fontWeight: 'bold' },
  serviceValue: { fontWeight: 'normal' },
  dateLabel: { fontWeight: 'bold' },
  dateValue: { fontWeight: 'normal' },
  timeLabel: { fontWeight: 'bold' },
  timeValue: { fontWeight: 'normal' },
});

export default SentRequestCard;
