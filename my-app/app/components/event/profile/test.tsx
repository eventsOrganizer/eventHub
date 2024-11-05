import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../../services/supabaseClient';
import UserAvatar from '../UserAvatar';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// ... interfaces and types stay the same ...

const FriendsList2: React.FC<{ userId: string }> = ({ userId }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // ... fetchFriends and other functions stay the same ...

 

