import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const EditProfileScreen: React.FC = ({ navigation }: any) => {
  const [name, setName] = useState('Anna Avetisyan');
  const [email, setEmail] = useState('info@aplusdesign.co');
  const [phone, setPhone] = useState('818 123 4567');

  // Handle save changes (This is where you'd usually save the data to a backend)
  const handleSaveChanges = () => {
    // For now, we'll just navigate back and display the updated info
    alert('Profile updated!');
    navigation.goBack(); // Go back to the profile screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      {/* Name Input */}
      <View style={styles.inputContainer}>
        <Text>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Text>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
      </View>

      {/* Phone Input */}
      <View style={styles.inputContainer}>
        <Text>Phone</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
        />
      </View>

      {/* Save Changes Button */}
      <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: '#673AB7',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
