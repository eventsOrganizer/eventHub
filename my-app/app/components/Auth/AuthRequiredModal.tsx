import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import { Lock, LogIn, UserPlus, X } from 'lucide-react-native';
import { themeColors } from '../../utils/themeColors';
import { LinearGradient } from 'expo-linear-gradient';

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
        <BlurView intensity={30} tint="dark" style={styles.blur}>
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(240,244,248,0.95)']}
            style={styles.modalContent}
          >
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
            >
              <BlurView intensity={80} tint="light" style={styles.closeButtonBg}>
                <X size={24} color={themeColors.common.gray} />
              </BlurView>
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <LinearGradient
                colors={themeColors.rent.gradient}
                style={styles.iconGradient}
              >
                <Lock size={32} color="white" />
              </LinearGradient>
            </View>

            <Text style={styles.title}>Authentication Required</Text>
            <Text style={styles.message}>{message}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.signInButton]}
                onPress={onSignIn}
              >
                <LinearGradient
                  colors={themeColors.rent.gradient}
                  style={styles.buttonGradient}
                >
                  <LogIn size={20} color="white" />
                  <Text style={styles.buttonText}>Sign In</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.signUpButton]}
                onPress={onSignUp}
              >
                <LinearGradient
                  colors={themeColors.sale.gradient}
                  style={styles.buttonGradient}
                >
                  <UserPlus size={20} color="white" />
                  <Text style={styles.buttonText}>Sign Up</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  blur: {
    width: width * 0.9,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalContent: {
    padding: 24,
    alignItems: 'center',
    borderRadius: 24,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  closeButtonBg: {
    padding: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  iconContainer: {
    marginTop: 20,
    marginBottom: 24,
  },
  iconGradient: {
    padding: 20,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: themeColors.common.black,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: themeColors.common.gray,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    paddingHorizontal: 8,
  },
  button: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
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