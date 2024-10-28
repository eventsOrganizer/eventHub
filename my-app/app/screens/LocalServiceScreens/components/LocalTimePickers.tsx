import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface LocalTimePickerProps {
  label: string;
  value: string;
  onChange: (time: string) => void;
}

const LocalTimePicker: React.FC<LocalTimePickerProps> = ({ label, value, onChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder="HH:MM"
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
});

export default LocalTimePicker;