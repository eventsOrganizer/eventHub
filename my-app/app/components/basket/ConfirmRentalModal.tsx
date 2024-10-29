import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import { Calendar, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { themeColors } from '../../utils/themeColors';

interface ConfirmRentalModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  materialName: string;
}

export const ConfirmRentalModal: React.FC<ConfirmRentalModalProps> = ({
  visible,
  onClose,
  onConfirm,
  materialName,
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
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <BlurView intensity={80} tint="light" style={styles.closeButtonBg}>
                <X size={24} color={themeColors.common.gray} />
              </BlurView>
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <LinearGradient
                colors={themeColors.rent.gradient}
                style={styles.iconGradient}
              >
                <Calendar size={32} color="white" />
              </LinearGradient>
            </View>

            <Text style={styles.title}>Confirm Rental Request</Text>
            <Text style={styles.message}>
              Are you sure you want to send a rental request for {materialName}?
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={onConfirm}
              >
                <LinearGradient
                  colors={themeColors.rent.gradient}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Confirm Request</Text>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  blur: {
    width: '90%',
    borderRadius: 24,
    overflow: 'hidden',
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
  },
  title: {
    fontSize: 24,
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
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: themeColors.rent.primary,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: themeColors.common.gray,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: themeColors.common.gray,
    textAlign: 'center',
    padding: 16,
  },
});