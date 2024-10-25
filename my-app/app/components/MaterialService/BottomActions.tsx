import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Snackbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { themeColors } from '../../utils/themeColors';

interface BottomActionsProps {
  onAddNew: () => void;
  snackbarVisible: boolean;
  snackbarMessage: string;
  onDismissSnackbar: () => void;
}

export const BottomActions: React.FC<BottomActionsProps> = ({
  onAddNew,
  snackbarVisible,
  snackbarMessage,
  onDismissSnackbar,
}) => {
  return (
    <>
      <FAB
        style={[styles.fab, { backgroundColor: themeColors.rent.primary }]}
        icon={({ size, color }) => (
          <Ionicons name="add-circle-outline" size={size} color={color} />
        )}
        onPress={onAddNew}
        label="Add New"
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackbar}
        duration={3000}
        style={styles.snackbar}
        action={{
          label: 'Dismiss',
          onPress: onDismissSnackbar,
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 16,
    bottom: 16,
    borderRadius: 28,
    elevation: 4,
  },
  snackbar: {
    backgroundColor: themeColors.common.black,
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: 16,
  },
});