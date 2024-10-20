import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const SocialLoginButtons = () => {
  return (
    <View style={styles.socialContainer}>
      <TouchableOpacity style={styles.socialButton}>
        <AntDesign name="google" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        <AntDesign name="apple1" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        <AntDesign name="twitter" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

export default SocialLoginButtons;