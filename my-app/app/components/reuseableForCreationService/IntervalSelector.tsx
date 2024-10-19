import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

interface IntervalSelectorProps {
  interval: 'Yearly' | 'Monthly' | 'Weekly' | null;
  setInterval: (interval: 'Yearly' | 'Monthly' | 'Weekly' | null) => void;
}

const IntervalSelector: React.FC<IntervalSelectorProps> = ({ interval, setInterval }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Availability Interval</Text>
      <RNPickerSelect
        onValueChange={setInterval}
        items={[
          { label: 'Yearly', value: 'Yearly' },
          { label: 'Monthly', value: 'Monthly' },
          { label: 'Weekly', value: 'Weekly' },
        ]}
        style={pickerSelectStyles}
        value={interval}
        placeholder={{ label: "Select an interval", value: null }}
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
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
});

export default IntervalSelector;