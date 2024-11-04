import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const DEFAULT_USER_IMAGE = 'https://via.placeholder.com/40';

interface RequestHeaderProps {
  imageUrl?: string | null;
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
  return (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <Image 
          source={{ uri: imageUrl || DEFAULT_USER_IMAGE }} 
          style={styles.userImage}
          defaultSource={{ uri: DEFAULT_USER_IMAGE }}
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
    fontSize: 16,
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