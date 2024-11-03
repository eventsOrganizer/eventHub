import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Request } from '../../services/requestTypes';
import { styles } from './styles';
import { deleteRequest } from '../../services/requestService';
import { supabase } from '../../services/supabaseClient';
import PaymentStatus from './PaymentStatus';

interface RequestActionsProps {
  item: Request;
  onShowPaymentModal: () => void;
  onRequestDeleted: () => void;
}

const RequestActions: React.FC<RequestActionsProps> = ({ 
  item, 
  onShowPaymentModal,
  onRequestDeleted
}) => {
  const [orderDetails, setOrderDetails] = useState<{
    payment: boolean;
    payedamount: number;
    remainingamount: number;
  } | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const { data } = await supabase
        .from('order')
        .select('payment, payedamount, remainingamount')
        .eq('request_id', item.id)
        .single();
      setOrderDetails(data);
    };

    fetchOrderDetails();
  }, [item.id]);

  const handleDelete = () => {
    Alert.alert(
      "Delete Request",
      "Are you sure you want to delete this request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteRequest(item.id);
              onRequestDeleted();
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

  return (
    <View>
      {orderDetails?.payment ? (
        <PaymentStatus 
          paymentStatus="completed"
          payedAmount={orderDetails.payedamount}
          remainingAmount={orderDetails.remainingamount}
        />
      ) : item.status === 'accepted' ? (
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={onShowPaymentModal}
        >
          <Text style={styles.paymentButtonText}>Pass to Payment</Text>
        </TouchableOpacity>
      ) : null}

      {(item.status === 'refused' || orderDetails?.payment) && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>Delete Request</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default RequestActions;