import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ServiceDetailsCard from '../../services/ServiceDetailsCard';
import { Request } from '../../services/requestTypes';
import RequestHeader from './RequestHeader';
import RequestActions from './RequestActions';
import DateDisplay from './DateDisplay';
import { markRequestAsRead } from '../../services/requestService';

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

  useEffect(() => {
    // Mark request as read when component mounts
    if (!item.is_read) {
      markRequestAsRead(item.id);
    }
  }, [item.id, item.is_read]);

  return (
    <View style={styles.container}>
      <RequestHeader
        imageUrl={item.imageUrl ?? ''}
        requesterName={item.requesterName ?? 'Nom inconnu'}
        requesterEmail={item.requesterEmail ?? 'Email inconnu'}
        showDetails={showDetails}
        onToggleDetails={() => setShowDetails(!showDetails)}
      />

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

      <DateDisplay
        date={item.date}
        startTime={item.start}
        endTime={item.end}
      />

      <RequestActions
        status={item.status}
        onConfirm={() => onConfirm(item.id)}
        onReject={() => onReject(item.id)}
        onDelete={onDelete ? () => onDelete(item.id) : undefined}
        serviceUserId={item.serviceId?.toString()}
      />
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
});

export default ReceivedRequestCard;