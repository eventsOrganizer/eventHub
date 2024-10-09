import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AccountScreen: React.FC = () => {
  const user = {
    name: 'Anna Avetisyan',
    birthday: 'January 1, 1990',
    phone: '818 123 4567',
    instagram: '@anna_avat',
    email: 'info@aplusdesign.co',
    password: 'Password123',
    // Add a sample image URL for the profile image
    profileImage: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png', // Replace with an actual image URL or local image path
  };

  return (
    <View style={styles.container}>
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
          source={{ uri: user.profileImage }} // Use the image URL from the user object
          style={styles.profileImage}
        />
      </View>

      {/* Profile Information */}
      <View style={styles.infoContainer}>
        {Object.entries(user).map(([key, value]) => (
          key !== 'profileImage' && (
            <View key={key} style={styles.infoItem}>
              <Icon
                name={
                  key === 'password'
                    ? 'visibility-off'
                    : key === 'instagram'
                    ? 'camera-alt'
                    : key === 'phone'
                    ? 'phone'
                    : key === 'email'
                    ? 'email'
                    : key === 'birthday'
                    ? 'calendar-today'
                    : 'person'
                }
                size={20}
                color="#555"
              />
              <Text style={styles.infoText}>{value}</Text>
            </View>
          )
        ))}
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#673AB7',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  profileImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  profileImage: {
    width: 120,  // Image width
    height: 120, // Image height
    borderRadius: 60, // Half of the width/height to make it circular
    borderWidth: 4,
    borderColor: '#fff', // Border color to match background or accent
  },
  infoContainer: {
    paddingHorizontal: 20,
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
    marginHorizontal: 20,
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

export default AccountScreen;
