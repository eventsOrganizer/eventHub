import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import { Lock, LogIn, UserPlus, X } from 'lucide-react-native';
import { themeColors } from '../../utils/themeColors';

const { width } = Dimensions.get('window');

interface AuthRequiredModalProps {
  visible: boolean;
  onClose: () => void;
  message: string;
  onSignIn: () => void;
  onSignUp: () => void;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  visible,
  onClose,
  message,
  onSignIn,
  onSignUp,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={20} tint="dark" style={styles.blur}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={themeColors.common.gray} />
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <Lock size={32} color={themeColors.rent.primary} />
            </View>

            <Text style={styles.title}>Authentication Required</Text>
            <Text style={styles.message}>{message}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.signInButton]}
                onPress={onSignIn}
              >
                <LogIn size={20} color="white" />
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.signUpButton]}
                onPress={onSignUp}
              >
                <UserPlus size={20} color="white" />
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  blur: {
    width: width * 0.9,
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 24,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 8,
  },
  iconContainer: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: themeColors.common.black,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: themeColors.common.gray,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  signInButton: {
    backgroundColor: themeColors.rent.primary,
  },
  signUpButton: {
    backgroundColor: themeColors.sale.primary,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});