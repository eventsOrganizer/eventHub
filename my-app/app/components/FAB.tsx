import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { theme } from '../../lib/theme';
import tw from 'twrnc';

interface FABProps {
  isFabOpen: boolean;
  toggleFab: () => void;
  onCreateService: () => void;
  onCreateEvent: () => void;
}

const FAB: React.FC<FABProps> = ({ isFabOpen, toggleFab, onCreateService, onCreateEvent }) => {
  return (
    <View style={[tw`absolute bottom-20 right-5 items-end`, styles.container]}>
      {isFabOpen && (
        <MotiView
          from={{ opacity: 0, scale: 0.8, translateY: 20 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          exit={{ opacity: 0, scale: 0.8, translateY: 20 }}
          style={tw`mb-2`}
        >
          <TouchableOpacity
            style={[styles.fabButton, styles.actionButton]}
            onPress={onCreateService}
          >
            <BlurView intensity={80} tint="light" style={styles.blurView} />
            <Ionicons name="briefcase-outline" size={24} color={theme.colors.secondary} />
            <Text style={[styles.buttonText, { color: theme.colors.secondary }]}>Create Service</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.fabButton, styles.actionButton]}
            onPress={onCreateEvent}
          >
            <BlurView intensity={80} tint="light" style={styles.blurView} />
            <Ionicons name="calendar-outline" size={24} color={theme.colors.secondary} />
            <Text style={[styles.buttonText, { color: theme.colors.secondary }]}>Create Event</Text>
          </TouchableOpacity>
        </MotiView>
      )}
      
      <TouchableOpacity
        style={[styles.fabButton, styles.mainButton]}
        onPress={toggleFab}
      >
        <BlurView intensity={80} tint="light" style={styles.blurView} />
        <Ionicons 
          name={isFabOpen ? 'close' : 'add'} 
          size={24} 
          color={theme.colors.secondary} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 6,
    zIndex: 1000,
  },
  fabButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  mainButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.overlay,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.overlay,
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: theme.borderRadius.lg,
  },
  buttonText: {
    marginLeft: theme.spacing.sm,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default FAB;
