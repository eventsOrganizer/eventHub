import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

interface AuthenticationModalProps {
  visible: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignup: () => void;
}

export const AuthenticationModal = ({ visible, onClose, onLogin, onSignup }: AuthenticationModalProps) => {
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
            Please log in or sign up to interact with reviews and likes.
          </Text>
          <View style={styles.modalButtonContainer}>
            <Button
              mode="contained"
              onPress={onLogin}
              style={styles.modalButton}
            >
              Log In
            </Button>
            <Button
              mode="outlined"
              onPress={onSignup}
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
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
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
    width: '45%',
  },
  closeButton: {
    marginTop: 20,
  },
});