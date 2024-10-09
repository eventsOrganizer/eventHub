import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen: React.FC = ({ navigation }: any) => {
  const user = {
    name: 'Anna Avetisyan',
    birthday: 'January 1, 1990',
    phone: '818 123 4567',
    instagram: '@anna_avat',
    email: 'info@aplusdesign.co',
    profileImage: 'https://www.example.com/path-to-image.jpg', // Replace with your image URL
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user.name}</Text>
      </View>

      {/* Profile Image Section */}
      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: user.profileImage }}
          style={styles.profileImage}
        />
      </View>

      {/* Profile Information */}
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Icon name="phone" size={24} color="#555" />
          <Text style={styles.infoText}>{user.phone}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="email" size={24} color="#555" />
          <Text style={styles.infoText}>{user.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="calendar-today" size={24} color="#555" />
          <Text style={styles.infoText}>{user.birthday}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="camera-alt" size={24} color="#555" />
          <Text style={styles.infoText}>{user.instagram}</Text>
        </View>
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditProfile')}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#673AB7',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  profileImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  infoContainer: {
    paddingBottom: 30,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  button: {
    marginTop: 30,
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

export default ProfileScreen;
