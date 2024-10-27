import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNotifications } from '../../hooks/useNotifications';
import { format } from 'date-fns';
import { supabase } from '../../services/supabaseClient';

interface NotificationListProps {
  userId: string;
}

const NotificationList: React.FC<NotificationListProps> = ({ userId }) => {
  const { notifications } = useNotifications(userId);

  const markAsRead = async (notificationId: number) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
  };

  return (
    <ScrollView style={styles.container}>
      {notifications.length === 0 ? (
        <Text style={styles.emptyText}>No notifications</Text>
      ) : (
        notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationItem,
              notification.is_read ? styles.readNotification : styles.unreadNotification
            ]}
            onPress={() => markAsRead(notification.id)}
          >
            <Text style={styles.title}>{notification.title}</Text>
            <Text style={styles.message}>{notification.message}</Text>
            <Text style={styles.timestamp}>
              {format(new Date(notification.created_at), 'PPp')}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 384, // equivalent to max-h-96
  },
  emptyText: {
    color: '#6B7280', // text-gray-500
    padding: 16,
    textAlign: 'center',
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // border-gray-200
  },
  readNotification: {
    backgroundColor: '#F9FAFB', // bg-gray-50
  },
  unreadNotification: {
    backgroundColor: '#EBF5FF', // bg-blue-50
  },
  title: {
    fontWeight: 'bold',
    color: '#1F2937', // text-gray-800
  },
  message: {
    color: '#4B5563', // text-gray-600
    marginTop: 4,
  },
  timestamp: {
    color: '#9CA3AF', // text-gray-400
    fontSize: 12,
    marginTop: 8,
  },
});

export default NotificationList;