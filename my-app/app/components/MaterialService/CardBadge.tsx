import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Calendar, ShoppingBag } from 'lucide-react-native';

interface CardBadgeProps {
  type: 'rent' | 'sale';
}

export const CardBadge: React.FC<CardBadgeProps> = ({ type }) => {
  const isRent = type === 'rent';
  const backgroundColor = isRent ? '#4A90E2' : '#7E57C2';
  const Icon = isRent ? Calendar : ShoppingBag;

  return (
    <BlurView intensity={Platform.OS === 'ios' ? 60 : 100} style={styles.container}>
      <View style={[styles.badge, { backgroundColor }]}>
        <Icon size={14} color="white" />
        <Text style={styles.text}>{type.toUpperCase()}</Text>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
});