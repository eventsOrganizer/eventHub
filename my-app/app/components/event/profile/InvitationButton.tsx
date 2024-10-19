import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../services/supabaseClient';
import { useUser } from '../../../UserContext';
import { useNavigation } from '@react-navigation/native';

const InvitationButton: React.FC = () => {
  const [invitationCount, setInvitationCount] = useState(0);
  const { userId } = useUser();
  const navigation = useNavigation();

  useEffect(() => {
    fetchInvitationCount();
  }, [userId]);

  const fetchInvitationCount = async () => {
    if (!userId) return;

    try {
      const { count, error } = await supabase
        .from('invitation')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', userId)
        .eq('status', false);

      if (error) throw error;

      setInvitationCount(count || 0);
    } catch (error) {
      console.error('Error fetching invitation count:', error);
    }
  };

  const handlePress = () => {
    navigation.navigate('InvitationList' as never);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.iconContainer}>
        <Ionicons name="globe-outline" size={24} color="#007AFF" />
        <Ionicons name="arrow-forward" size={16} color="#007AFF" style={styles.arrow} />
      </View>
      {invitationCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{invitationCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    position: 'absolute',
    right: -5,
    bottom: -5,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default InvitationButton;