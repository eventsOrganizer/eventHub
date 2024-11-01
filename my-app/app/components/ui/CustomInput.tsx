import React from 'react';
import { TextInput, View, StyleSheet, TextInputProps } from 'react-native';
import { theme } from '../../../lib/theme';

interface CustomInputProps extends TextInputProps {
  leftIcon?: React.ReactNode;
}

export const CustomInput: React.FC<CustomInputProps> = ({ leftIcon, style, ...props }) => {
  return (
    <View style={styles.container}>
      {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
      <TextInput
        style={[styles.input, leftIcon ? styles.inputWithIcon : null, style]}
        placeholderTextColor="rgba(28, 85, 136, 0.5)"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(28, 85, 136, 0.1)',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    height: 45,
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.secondary,
    fontSize: 16,
  },
  inputWithIcon: {
    paddingLeft: theme.spacing.xs,
  },
  iconContainer: {
    padding: theme.spacing.sm,
  },
});