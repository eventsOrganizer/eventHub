import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../../../../services/supabaseClient';
import { useUser } from '../../../../UserContext'
import UserAvatar from '../../UserAvatar';

interface Notification {
  id: number;
  event_id?: number;
  user_id?: any;
  personal_id?: number;
  material_id?: number;
  local_id?: number;
  group_id?: number;
  seen: boolean;
  created_at: string;
  event?: { name: string; user_id: string };
  personal?: { name: string; user_id: string };
  material?: { name: string; user_id: string };
  local?: { name: string; user_id: string };
  group?: { name: string; user_id: string };
}

const NotificationComponent: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { userId } = useUser();

  useEffect(() => {
    fetchNotifications();
  }, [userId]);


  const fetchNotifications = async () => {
    if (!userId) return;
  
    const { data, error } = await supabase
      .from('update')
      .select(`
        id,
        event_id,
        personal_id,
        material_id,
        local_id,
        group_id,
        seen,
        created_at,
        event:event_id (name, user_id),
        personal:personal_id (name, user_id),
        material:material_id (name, user_id),
        local:local_id (name, user_id),
        group:group_id (name)
      `)
      .eq('follower_id', userId)
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error('Error fetching notifications:', error);
    } else {
      setNotifications(data as unknown as Notification[]);
    }
  };
  const markAsSeen = async (notificationId: number) => {
    const { error } = await supabase
      .from('update')
      .update({ seen: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as seen:', error);
    } else {
      setNotifications(notifications.map(notif => 
        notif.id === notificationId ? { ...notif, seen: true } : notif
      ));
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => {
    const entityType = item.event_id ? 'event' :
                       item.personal_id ? 'personal' :
                       item.material_id ? 'material' :
                       item.local_id ? 'local' :
                       item.group_id ? 'group' : null;

    const entity = item[entityType as keyof Notification];
    if (!entity) return null;

    return (
      <TouchableOpacity 
        style={[styles.notificationItem, !item.seen && styles.unreadNotification]}
        onPress={() => markAsSeen(item.id)}
      >
        <UserAvatar userId={entity.user_id} size={40} />
        <View style={styles.notificationContent}>
          <Text style={styles.notificationText}>
            New {entityType}: {entity.name}
          </Text>
          <Text style={styles.notificationTime}>
            {new Date(item.created_at).toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  unreadNotification: {
    backgroundColor: '#f0f8ff',
  },
  notificationContent: {
    marginLeft: 10,
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
  },
});

export default NotificationComponent;