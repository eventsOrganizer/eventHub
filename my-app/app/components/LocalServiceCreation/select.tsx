import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type SelectProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  items: Array<{ label: string; value: string }>;
};

export const Select = ({ label, value, onValueChange, items }: SelectProps) => {
  return (
    <View>
      <Text>{label}</Text>
      <Picker
        selectedValue={value}
        onValueChange={onValueChange}
      >
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
};