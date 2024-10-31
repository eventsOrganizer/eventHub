import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { Request } from '../../services/requestTypes';
import RequestHeader from './RequestHeader';
import RequestDetails from './RequestDetails';
import RequestActions from './RequestActions';
import PaymentModal from './PaymentModal';
import { styles } from './styles';

type PaymentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentScreen'>;

interface SentRequestCardProps {
  item: Request;
  onRequestDeleted: () => void;
}

const SentRequestCard: React.FC<SentRequestCardProps> = ({ item, onRequestDeleted }) => {
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const [showDetails, setShowDetails] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <View style={styles.container}>
      <RequestHeader 
        item={item} 
        onToggleDetails={() => setShowDetails(!showDetails)} 
      />
      
      <RequestDetails 
        item={item}
        showDetails={showDetails}
      />
      
      <RequestActions 
        item={item}
        onRequestDeleted={onRequestDeleted}
        onShowPaymentModal={() => setShowPaymentModal(true)}
      />
      
      <PaymentModal
        item={item}
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        navigation={navigation}
      />
    </View>
  );
};

export default SentRequestCard;