import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../../lib/theme';

interface CardProps {
  style?: ViewStyle;
  children: React.ReactNode;
  onPress?: () => void;
}

interface CardHeaderProps {
  style?: ViewStyle;
  children: React.ReactNode;
}

interface CardTitleProps {
  style?: TextStyle;
  children: React.ReactNode;
  numberOfLines?: number;
}

interface CardDescriptionProps {
  style?: TextStyle;
  children: React.ReactNode;
  numberOfLines?: number;
}

interface CardContentProps {
  style?: ViewStyle;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

export const CardHeader: React.FC<CardHeaderProps> = ({ children, style }) => (
  <View style={[styles.cardHeader, style]}>
    {children}
  </View>
);

export const CardTitle: React.FC<CardTitleProps> = ({ children, style, numberOfLines }) => (
  <Text 
    style={[styles.cardTitle, style]}
    numberOfLines={numberOfLines}
  >
    {children}
  </Text>
);

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, style, numberOfLines }) => (
  <Text 
    style={[styles.cardDescription, style]}
    numberOfLines={numberOfLines}
  >
    {children}
  </Text>
);

export const CardContent: React.FC<CardContentProps> = ({ children, style }) => (
  <View style={[styles.cardContent, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    marginVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: theme.borderRadius.sm,
    elevation: 4,
    borderWidth: 1,
    borderColor: theme.colors.cardBg,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.cardTitle,
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontSize: 18,
    color: theme.colors.cardDescription,
    lineHeight: 24,
    letterSpacing: 0.25,
  },
  cardContent: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
});

export default Card;
