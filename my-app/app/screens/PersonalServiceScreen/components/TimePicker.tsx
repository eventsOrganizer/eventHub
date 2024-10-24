import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';

interface TimePickerProps {
  label: string;
  value: string;
  onChange: (time: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ label, value, onChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [tempHour, setTempHour] = useState(value.split(':')[0]);
  const [tempMinute, setTempMinute] = useState(value.split(':')[1]);

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  const handleHourChange = (newHour: string) => {
    setTempHour(newHour);
  };

  const handleMinuteChange = (newMinute: string) => {
    setTempMinute(newMinute);
  };

  const handleConfirm = () => {
    onChange(`${tempHour}:${tempMinute}`);
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}>
        <Text style={styles.buttonText}>{value}</Text>
      </TouchableOpacity>
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label}</Text>
            <View style={styles.pickerContainer}>
              <ScrollView style={styles.pickerColumn}>
                {hours.map((hour) => (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.pickerItem,
                      hour === tempHour && styles.selectedItem,
                    ]}
                    onPress={() => handleHourChange(hour)}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      hour === tempHour && styles.selectedItemText,
                    ]}>{hour}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ScrollView style={styles.pickerColumn}>
                {minutes.map((minute) => (
                  <TouchableOpacity
                    key={minute}
                    style={[
                      styles.pickerItem,
                      minute === tempMinute && styles.selectedItem,
                    ]}
                    onPress={() => handleMinuteChange(minute)}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      minute === tempMinute && styles.selectedItemText,
                    ]}>{minute}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowModal(false)}>
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleConfirm}>
                <Text style={styles.modalButtonText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
 },
 button: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 200,
  },
  pickerColumn: {
    flex: 1,
  },
  pickerItem: {
    padding: 10,
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
  },
  pickerItemText: {
    fontSize: 18,
    color: '#333',
  },
  selectedItemText: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#4A90E2',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TimePicker;