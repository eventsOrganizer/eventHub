import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';
import tw from 'twrnc';

interface TicketPaymentModalProps {
  visible: boolean;
  onClose: () => void;
  eventName: string;
  eventDate: string;
  eventTime: string;
  ticketPrice: number;
  onConfirm: () => void;
}

const TicketPaymentModal: React.FC<TicketPaymentModalProps> = ({
  visible,
  onClose,
  eventName,
  eventDate,
  eventTime,
  ticketPrice,
  onConfirm
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 justify-center items-center bg-black/50`}>
        <View style={tw`bg-white rounded-xl w-5/6 p-4`}>
          <Text style={tw`text-xl font-bold mb-4`}>Ticket Summary</Text>
          
          <Text style={tw`mb-2`}>Event: {eventName}</Text>
          <Text style={tw`mb-2`}>Date: {eventDate}</Text>
          <Text style={tw`mb-2`}>Time: {eventTime}</Text>
          
          <View style={tw`h-[1px] bg-gray-200 my-4`} />
          
          <Text>Price: ${ticketPrice ? ticketPrice.toFixed(2) : '0.00'}</Text>
          
          <View style={tw`flex-row justify-between mt-4`}>
            <TouchableOpacity
              style={tw`bg-[#4CAF50] p-3 rounded-lg flex-1 mr-2`}
              onPress={onConfirm}
            >
              <Text style={tw`text-white font-bold text-center`}>Continue to Payment</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={tw`bg-gray-200 p-3 rounded-lg flex-1 ml-2`}
              onPress={onClose}
            >
              <Text style={tw`text-center font-bold`}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TicketPaymentModal;