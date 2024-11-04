import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Request } from '../../services/requestTypes';
import { styles } from './styles';

interface RequestHeaderProps {
  item: Request;
  onToggleDetails: () => void;
}

const RequestHeader: React.FC<RequestHeaderProps> = ({ item, onToggleDetails }) => {
  const fallbackImage = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b';

  return (
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
      {renderStatusIcon(item.status)}
      <TouchableOpacity onPress={onToggleDetails}>
        <Text style={styles.detailsButton}>
          {item.showDetails ? 'Hide details' : 'View details'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const renderStatusIcon = (status: string) => {
  switch (status) {
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

export default RequestHeader;