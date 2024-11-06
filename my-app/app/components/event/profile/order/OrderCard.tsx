import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OrderCard = ({ order }) => {
  const navigation = useNavigation();
  
  const getOrderDetails = () => {
    if (order.ticket) {
      return {
        name: order.ticket.event.name,
        image: order.ticket.event.media?.[0]?.url,
        type: 'Event Ticket',
        icon: 'event'
      };
    } else if (order.personal) {
      return {
        name: order.personal.name,
        image: order.personal.media?.[0]?.url,
        type: 'Crew Service',
        icon: 'person'
      };
    } else if (order.local) {
      return {
        name: order.local.name,
        image: order.local.media?.[0]?.url,
        type: 'Local Service',
        icon: 'place'
      };
    } else if (order.material) {
      return {
        name: order.material.name,
        image: order.material.media?.[0]?.url,
        type: 'Material',
        icon: 'inventory'
      };
    }
    return null;
  };

  const details = getOrderDetails();
  if (!details) return null;

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => {
        // Navigate to specific details based on type
        if (order.ticket) {
          navigation.navigate('EventDetails', { eventId: order.ticket.event.id });
        }
        // Add navigation for other types as needed
      }}
    >
      <View style={styles.header}>
        <Icon name={details.icon} size={24} color="#4CAF50" />
        <Text style={styles.type}>{details.type}</Text>
      </View>

      <View style={styles.content}>
        {details.image && (
          <Image 
            source={{ uri: details.image }} 
            style={styles.image}
          />
        )}
        <View style={styles.details}>
          <Text style={styles.name}>{details.name}</Text>
          <Text style={styles.price}>
            Total: ${order.totalprice}
          </Text>
          {order.remainingamount > 0 && (
            <Text style={styles.remaining}>
              Remaining: ${order.remainingamount}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  type: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  content: {
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: '#666',
  },
  remaining: {
    fontSize: 14,
    color: '#f44336',
    marginTop: 4,
  },
});

export default OrderCard;