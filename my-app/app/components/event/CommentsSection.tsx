import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CommentsSection: React.FC<{ eventId: number }> = ({ eventId }) => {
  return (
    <LinearGradient
      colors={['#FF8C00', '#FFA500']}
      style={styles.container}
    >
      <Text style={styles.title}>Comments</Text>
      {/* Display comments here */}
      <TextInput style={styles.input} placeholder="Add a comment..." placeholderTextColor="#fff" />
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FF8C00',
    fontWeight: 'bold',
  },
});

export default CommentsSection;