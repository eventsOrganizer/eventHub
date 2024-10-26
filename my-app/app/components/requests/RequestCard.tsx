import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const RequestCard = ({ 
  item, 
  mode, 
  onConfirm, 
  onReject, 
  getStatusIcon, 
  getCategoryIcon 
}: {
  item: any;
  mode: 'received' | 'sent';
  onConfirm: (id: string) => void;
  onReject: (id: string) => void;
  getStatusIcon: (status: string) => React.ReactNode;
  getCategoryIcon: (type: string) => React.ReactNode;
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const getStatusGradient = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return ['#A5D6A7', '#81C784'];
      case 'pending':
        return ['#FFE082', '#FFD54F'];
      case 'rejected':
        return ['#EF9A9A', '#E57373'];
      default:
        return ['#FFFFFF', '#F5F5F5'];
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      style={styles.container}
    >
      <LinearGradient
        colors={getStatusGradient(item.status)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Image 
            source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
            style={styles.image}
          />
          <View style={styles.headerContent}>
            <Text style={styles.name}>
              {mode === 'received' ? item.requesterName : item.name}
            </Text>
            <Text style={styles.subtitle}>
              {item.subcategory}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => setExpanded(!expanded)}
        >
          <Icon 
            name={expanded ? 'expand-less' : 'expand-more'} 
            size={24} 
            color="#666"
          />
        </TouchableOpacity>

        {expanded && (
          <MotiView
            from={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ type: 'timing', duration: 300 }}
            style={styles.details}
          >
            {mode === 'received' && (
              <>
                <Text style={styles.detailText}>Email: {item.requesterEmail}</Text>
                <Text style={styles.detailText}>Date: {item.date}</Text>
                <Text style={styles.detailText}>Time: {item.start} - {item.end}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.confirmButton]}
                    onPress={() => onConfirm(item.id)}
                  >
                    <Icon name="check" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => onReject(item.id)}
                  >
                    <Icon name="close" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </MotiView>
        )}

        <View style={styles.footer}>
          {getCategoryIcon(item.type)}
          {getStatusIcon(item.status)}
        </View>
      </LinearGradient>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  detailsButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  details: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#FFF',
    marginLeft: 8,
    fontWeight: 'bold',
  },
});
