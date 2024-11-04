import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { theme } from '../../../../lib/theme';

interface ButtonWrapperProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

export const ButtonWrapper: React.FC<ButtonWrapperProps> = ({ children, style, ...props }) => (
  <MotiView
    from={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      type: 'spring',
      damping: 15,
      stiffness: 200,
    }}
  >
    <TouchableOpacity
      style={[styles.buttonBase, style]}
      activeOpacity={0.8}
      {...props}
    >
      {children}
    </TouchableOpacity>
  </MotiView>
);

const styles = StyleSheet.create({
  buttonBase: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});