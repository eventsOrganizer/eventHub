import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface RequestHeaderProps {
  imageUrl: string;
  requesterName: string;
  requesterEmail: string;
  showDetails: boolean;
  onToggleDetails: () => void;
}

const RequestHeader: React.FC<RequestHeaderProps> = ({
  imageUrl,
  requesterName,
  requesterEmail,
  showDetails,
  onToggleDetails,
}) => {
  const fallbackImage = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b';

  return (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <Image 
          source={{ uri: imageUrl || fallbackImage }} 
          style={styles.userImage}
        />
        <View>
          <Text style={styles.name}>{requesterName}</Text>
          <Text style={styles.email}>{requesterEmail}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onToggleDetails}>
        <Text style={styles.detailsButton}>
          {showDetails ? 'Hide details' : 'View details'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default RequestHeader;