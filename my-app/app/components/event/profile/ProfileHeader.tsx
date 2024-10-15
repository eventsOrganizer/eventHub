import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ProfileHeaderProps {
  userProfile: {
    firstname: string;
    lastname: string;
    email: string;
    avatar_url: string;
  };
  onEditPress: () => void;
  onChatPress: () => void;
  requestCount: number;
  onRequestPress: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userProfile,
  onEditPress,
  onChatPress,
  requestCount,
  onRequestPress,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const animatedHeight = new Animated.Value(200);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    Animated.spring(animatedHeight, {
      toValue: isCollapsed ? 200 : 60,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Animated.View style={[styles.container, { height: animatedHeight }]}>
      <LinearGradient colors={['#FF6B6B', '#4ECDC4']} style={styles.gradient}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={onRequestPress} style={styles.iconButton}>
            <Ionicons name="notifications" size={24} color="#fff" />
            {requestCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{requestCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleCollapse} style={styles.collapseButton}>
            <Ionicons name={isCollapsed ? "chevron-down" : "chevron-up"} size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onChatPress} style={styles.iconButton}>
            <Ionicons name="chatbubbles" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {!isCollapsed && (
          <View style={styles.profileInfo}>
            <Image source={{ uri: userProfile.avatar_url }} style={styles.avatar} />
            <Text style={styles.name}>{`${userProfile.firstname} ${userProfile.lastname}`}</Text>
            <Text style={styles.email}>{userProfile.email}</Text>
            <TouchableOpacity onPress={onEditPress} style={styles.editButton}>
              <Ionicons name="pencil" size={20} color="#fff" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    padding: 15,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    padding: 5,
  },
  collapseButton: {
    padding: 5,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4500',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    marginLeft: 5,
  },
});

export default ProfileHeader;