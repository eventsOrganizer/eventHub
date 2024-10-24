import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import { DollarSign } from 'lucide-react-native';
import { themeColors } from '../../utils/themeColors';

interface PriceFilterProps {
  minPrice: string;
  maxPrice: string;
  setMinPrice: (value: string) => void;
  setMaxPrice: (value: string) => void;
  onApply: () => void;
}

export const PriceFilter: React.FC<PriceFilterProps> = ({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  onApply,
}) => {
  return (
    <BlurView intensity={80} tint="light" style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Price Range:</Text>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <DollarSign size={16} color={themeColors.common.gray} />
            <TextInput
              style={styles.input}
              placeholder="Min"
              value={minPrice}
              onChangeText={setMinPrice}
              keyboardType="numeric"
              placeholderTextColor={themeColors.common.gray}
            />
          </View>
          <Text style={styles.separator}>-</Text>
          <View style={styles.inputWrapper}>
            <DollarSign size={16} color={themeColors.common.gray} />
            <TextInput
              style={styles.input}
              placeholder="Max"
              value={maxPrice}
              onChangeText={setMaxPrice}
              keyboardType="numeric"
              placeholderTextColor={themeColors.common.gray}
            />
          </View>
          <Button
            mode="contained"
            onPress={onApply}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Apply
          </Button>
        </View>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: themeColors.common.black,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: themeColors.common.lightGray,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: themeColors.common.black,
  },
  separator: {
    fontSize: 20,
    color: themeColors.common.gray,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 8,
    backgroundColor: themeColors.rent.primary,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});