import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, RefreshControl, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '../../hooks/useNotifications2';
import { LinearGradient } from 'expo-linear-gradient';
import { themeColors } from '../../utils/themeColors';

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ visible, onClose }) => {
  const { notifications, requestNotifications, markAsRead } = useNotifications();
  const [refreshing, setRefreshing] = React.useState(false);
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderNotification = (notification: any, type: 'notification' | 'request') => {
    const isRead = type === 'notification' ? notification.is_read : (notification.is_read && notification.is_action_read);
    const statusColor = getStatusColor(type === 'request' ? notification.status : null);
    
    return (
      <TouchableOpacity
        key={`${type}-${notification.id}`}
        style={[
          {
            ...styles.notificationItem,
            overflow: 'hidden' as 'hidden', // Explicitly cast to 'hidden'
          },
          !isRead && styles.unreadNotification,
        ]}
        onPress={() => markAsRead(notification.id, type)}
      >
        <LinearGradient
          colors={[isRead ? 'rgba(255,255,255,0.9)' : 'rgba(235,245,255,0.9)', 'rgba(255,255,255,0.7)']}
          style={styles.notificationGradient}
        >
          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={type === 'notification' ? 'notifications' : 'paper-plane'} 
                  size={24} 
                  color={statusColor}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>
                  {type === 'notification' ? notification.title : getRequestTitle(notification)}
                </Text>
                <Text style={styles.timestamp}>
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </Text>
              </View>
              {!isRead && <View style={[styles.unreadDot, { backgroundColor: statusColor }]} />}
            </View>
            <Text style={styles.message}>
              {type === 'notification' ? notification.message : getRequestMessage(notification)}
            </Text>
            {type === 'request' && (
              <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20`, alignSelf: 'flex-start' }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {notification.status.toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'pending':
        return themeColors.common.warning;
      case 'accepted':
        return themeColors.common.success;
      case 'refused':
        return themeColors.common.error;
      default:
        return themeColors.rent.primary;
    }
  };

  const getRequestTitle = (request: any) => {
    switch (request.status) {
      case 'pending':
        return 'New Request';
      case 'accepted':
        return 'Request Accepted';
      case 'refused':
        return 'Request Declined';
      default:
        return 'Request Update';
    }
  };

  const getRequestMessage = (request: any) => {
    switch (request.status) {
      case 'pending':
        return 'You have a new pending request';
      case 'accepted':
        return 'Your request has been accepted';
      case 'refused':
        return 'Your request has been declined';
      default:
        return 'Your request status has been updated';
    }
  };

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <BlurView intensity={20} style={styles.blur}>
          <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
              style={styles.headerGradient}
            >
              <Text style={styles.headerTitle}>Notifications</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color={themeColors.common.black} />
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
          
          <Animated.ScrollView
            style={styles.scrollView}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                tintColor={themeColors.rent.primary}
              />
            }
          >
            <View style={styles.content}>
              {[...notifications, ...requestNotifications]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((item) => renderNotification(
                  item,
                  'title' in item ? 'notification' : 'request'
                ))
              }
              
              {notifications.length === 0 && requestNotifications.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons name="notifications-off" size={48} color={themeColors.common.gray} />
                  <Text style={styles.emptyText}>No notifications yet</Text>
                </View>
              )}
            </View>
          </Animated.ScrollView>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  blur: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: themeColors.common.black,
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    marginTop: 100,
  },
  content: {
    padding: 16,
  },
  notificationItem: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationGradient: {
    padding: 16,
  },
  unreadNotification: {
    transform: [{ scale: 1.02 }],
  },
  notificationContent: {
    gap: 8,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: themeColors.common.black,
  },
  timestamp: {
    fontSize: 12,
    color: themeColors.common.gray,
    marginTop: 2,
  },
  message: {
    fontSize: 14,
    color: themeColors.common.gray,
    marginLeft: 52,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 52,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: themeColors.common.gray,
  },
};
