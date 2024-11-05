import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';

interface TicketPaymentStatusProps {
  paymentStatus: 'pending' | 'completed' | 'failed';
  amount?: number;
}

const TicketPaymentStatus: React.FC<TicketPaymentStatusProps> = ({ 
  paymentStatus,
  amount
}) => {
  if (paymentStatus === 'completed') {
    return (
      <View style={tw`p-3 mt-2 bg-[#f0f9ff] rounded-lg`}>
        <Text style={tw`text-[#22c55e] text-base font-semibold`}>
          Payment Completed: ${amount?.toFixed(2)}
        </Text>
      </View>
    );
  }

  if (paymentStatus === 'pending') {
    return (
      <View style={tw`p-3 mt-2 bg-[#f0f9ff] rounded-lg`}>
        <Text style={tw`text-[#f59e0b] text-base font-semibold`}>
          Payment in progress...
        </Text>
      </View>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <View style={tw`p-3 mt-2 bg-[#fee2e2] rounded-lg`}>
        <Text style={tw`text-[#ef4444] text-base font-semibold`}>
          Payment failed. Please try again.
        </Text>
      </View>
    );
  }

  return null;
};

export default TicketPaymentStatus;