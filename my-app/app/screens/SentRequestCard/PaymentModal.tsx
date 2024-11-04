import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { Request } from '../../services/requestTypes';
import { styles } from './styles';
import { calculateTotalPrice, calculateAdvancePayment } from './utils';
import { useUser } from '../../UserContext';

interface PaymentModalProps {
  item: Request;
  visible: boolean;
  onClose: () => void;
  navigation: StackNavigationProp<RootStackParamList, 'PaymentScreen'>;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  item, 
  visible, 
  onClose,
  navigation 
}) => {
  // Move all useState declarations before any other hooks or logic
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [advancePayment, setAdvancePayment] = useState<number>(0);
  const { userId } = useUser();

  useEffect(() => {
    const calculatePrices = async () => {
      let serviceId: number | undefined;
      let serviceType: 'personal' | 'local' | 'material';
      
      switch (item.type.toLowerCase()) {
        case 'personal':
          serviceId = item.personal_id;
          serviceType = 'personal';
          break;
        case 'local':
          serviceId = item.local_id;
          serviceType = 'local';
          break;
        case 'material':
          serviceId = item.material_id;
          serviceType = 'material';
          break;
        default:
          console.error('Invalid service type:', item.type);
          return;
      }

      if (!serviceId) {
        console.error('No service ID found for type:', serviceType);
        return;
      }

      const total = await calculateTotalPrice(serviceId, serviceType, item.start, item.end);
      const advance = await calculateAdvancePayment(serviceId, serviceType, item.start, item.end);
      
      setTotalPrice(total);
      setAdvancePayment(advance);
    };

    calculatePrices();
  }, [item]);

  const handlePaymentConfirmation = () => {
    if (!userId) {
      console.error('No user ID available');
      return;
    }

    onClose();
    
    let serviceId: number | undefined;
    let serviceType: 'personal' | 'local' | 'material';
    
    switch (item.type.toLowerCase()) {
      case 'personal':
        serviceId = item.personal_id;
        serviceType = 'personal';
        break;
      case 'local':
        serviceId = item.local_id;
        serviceType = 'local';
        break;
      case 'material':
        serviceId = item.material_id;
        serviceType = 'material';
        break;
      default:
        console.error('Invalid service type:', item.type);
        return;
    }

    if (!serviceId) {
      console.error('No service ID found for type:', serviceType);
      return;
    }
    
    navigation.navigate('PaymentScreen', {
      amount: advancePayment,
      totalPrice,
      serviceId,
      serviceType,
      requestId: item.id,
      userId,
      start: item.start || '',
      end: item.end || ''
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Payment Summary</Text>
          
          <Text>You have requested '{item.name}' from {item.creatorName || 'Unknown creator'}</Text>
          <Text>On {item.date || 'Unspecified date'} from {item.start || 'Unspecified'} to {item.end || 'Unspecified'}</Text>
          
          <Text style={styles.sectionTitle}>Service Details:</Text>
          <Text>Name: {item.name}</Text>
          <Text>Price per hour: ${((item.priceperhour || 0).toFixed(2))}</Text>
          <Text>Percentage: {item.percentage?.toFixed(2)}%</Text>
          
          <View style={styles.separator} />
          
          <Text style={styles.totalPrice}>Total price to pay: ${totalPrice.toFixed(2)}</Text>
          <Text style={styles.advancePayment}>
            {item.type === 'Material' && item.sell_or_rent === 'sell' 
              ? 'Full payment required: '
              : 'Advance payment: '}
            ${advancePayment.toFixed(2)}
          </Text>
          
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={handlePaymentConfirmation}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentModal;