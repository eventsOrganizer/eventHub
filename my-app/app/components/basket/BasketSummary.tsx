import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import { CreditCard, ArrowRight } from 'lucide-react-native';
import { themeColors } from '../../utils/themeColors';
import { LinearGradient } from 'expo-linear-gradient';

interface BasketSummaryProps {
  totalPrice: number;
  onCheckout: () => void;
}

export const BasketSummary: React.FC<BasketSummaryProps> = ({ totalPrice, onCheckout }) => {
  const serviceFee = totalPrice * 0.05; // 5% service fee

  return (
    <BlurView intensity={80} tint="light" style={styles.container}>
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.95)']}
        style={styles.content}
      >
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>${totalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Service Fee (5%)</Text>
          <Text style={styles.value}>${serviceFee.toFixed(2)}</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            ${(totalPrice + serviceFee).toFixed(2)}
          </Text>
        </View>
        
        <TouchableOpacity onPress={onCheckout}>
          <LinearGradient
            colors={['#4CAF50', '#45A049']}
            style={styles.checkoutButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <CreditCard size={20} color="white" />
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            <ArrowRight size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  content: {
    padding: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: themeColors.common.gray,
  },
  value: {
    fontSize: 16,
    color: themeColors.common.black,
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: themeColors.common.black,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  checkoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
});