import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Modal } from 'react-native';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
}

export const AuthModal = ({ visible, onClose, onSignIn, onSignUp }: AuthModalProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Authentication Required</Text>
          <Text style={styles.modalText}>
            Please sign in or sign up to post comments.
          </Text>
          <View style={styles.modalButtonContainer}>
            <Button
              mode="contained"
              onPress={onSignIn}
              style={styles.modalButton}
            >
              Sign In
            </Button>
            <Button
              mode="outlined"
              onPress={onSignUp}
              style={styles.modalButton}
            >
              Sign Up
            </Button>
          </View>
          <Button
            onPress={onClose}
            style={styles.closeButton}
          >
            Close
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    width: '85%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    borderRadius: 12,
    width: '45%',
  },
  closeButton: {
    marginTop: 20,
  },
});