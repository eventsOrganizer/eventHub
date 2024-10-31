import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RequestActionsProps {
  status: string;
  onConfirm: () => void;
  onReject: () => void;
  onDelete?: () => void;
}

const RequestActions: React.FC<RequestActionsProps> = ({
  status,
  onConfirm,
  onReject,
  onDelete,
}) => {
  if (status === 'pending') {
    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={onConfirm}
          style={[styles.button, styles.confirmButton]}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={onReject}
          style={[styles.button, styles.rejectButton]}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.statusContainer}>
      <Text style={[
        styles.statusText,
        status === 'accepted' ? styles.statusAccepted : styles.statusRejected
      ]}>
        {status === 'accepted' ? 'Request confirmed' : 'Request rejected'}
      </Text>
      {onDelete && (
        <TouchableOpacity 
          onPress={onDelete}
          style={[styles.button, styles.deleteButton]}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmButton: {
    backgroundColor: '#22c55e',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  statusContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  statusText: {
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '600',
  },
  statusAccepted: {
    color: '#22c55e',
  },
  statusRejected: {
    color: '#ef4444',
  },
});

export default RequestActions;