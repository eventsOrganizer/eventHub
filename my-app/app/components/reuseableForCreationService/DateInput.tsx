import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface DateInputProps {
  label: string;
  date: string;
  setDate: (date: string) => void;
  editable?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({ label, date, setDate, editable = true }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !editable && styles.disabledInput]}
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
        keyboardType="numeric"
        editable={editable}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
  },
});

export default DateInput;