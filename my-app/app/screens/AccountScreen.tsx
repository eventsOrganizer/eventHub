import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, FlatList, Image, ScrollView, Alert } from 'react-native';
import { supabase } from '../services/supabaseClient'; // import the supabase client you initialized

// Service Interface
interface Service {
  id: string;
  name: string;
  details: string;
}

const ProfileScreen: React.FC = ({ navigation }) => {
  const [user, setUser] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>({
    firstname: '',
    lastname: '',
    age: 0,
    username: '',
    gender: '',
    email: ''
  });
  const [userServices, setUserServices] = useState<Service[]>([]);
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user data (Profile, Services, and Events)
  useEffect(() => {
    const fetchProfileData = async () => {
      const currentUser = supabase.auth.user();
      if (currentUser) {
        setUser(currentUser);

        // Fetch the user's profile data
        const { data, error } = await supabase
          .from('user')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error.message);
        } else {
          setProfileData(data);
        }

        // Fetch the user's services
        const { data: services, error: servicesError } = await supabase
          .from('service')
          .select('*')
          .eq('user_id', currentUser.id);

        if (servicesError) {
          console.error('Error fetching services:', servicesError.message);
        } else {
          setUserServices(services);
        }

        // Fetch the user's events
        const { data: events, error: eventsError } = await supabase
          .from('event')
          .select('*')
          .eq('user_id', currentUser.id);

        if (eventsError) {
          console.error('Error fetching events:', eventsError.message);
        } else {
          setUserEvents(events);
        }
      }
    };

    fetchProfileData();
  }, []);

  const handleSaveProfile = async () => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    const { error } = await supabase
      .from('user')
      .update(profileData)
      .eq('id', user.id);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false); // Exit editing mode
    }
  };

  const renderServiceItem = ({ item }: any) => (
    <View style={styles.serviceItem}>
      <Text style={styles.serviceName}>{item.name}</Text>
      <Text style={styles.serviceDescription}>{item.details}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.headerText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.profileTitle}>Profile</Text>
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image source={{ uri: 'profileImageURL' }} style={styles.profileImage} />
        <Text style={styles.profileName}>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={profileData.firstname}
              onChangeText={(text) => setProfileData({ ...profileData, firstname: text })}
            />
          ) : (
            profileData.firstname
          )}
        </Text>
        <Text style={styles.profileName}>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={profileData.lastname}
              onChangeText={(text) => setProfileData({ ...profileData, lastname: text })}
            />
          ) : (
            profileData.lastname
          )}
        </Text>
        <Text style={styles.profileBio}>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={profileData.email}
              onChangeText={(text) => setProfileData({ ...profileData, email: text })}
            />
          ) : (
            profileData.email
          )}
        </Text>
        <Text style={styles.profileBio}>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={profileData.age?.toString()}
              keyboardType="numeric"
              onChangeText={(text) => setProfileData({ ...profileData, age: Number(text) })}
            />
          ) : (
            `Age: ${profileData.age}`
          )}
        </Text>
      </View>

      {/* Services & Events Section */}
      <View style={styles.iconsContainer}>
        <View style={styles.iconRow}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate('CreateService', { serviceType: 'local' })}
          >
            <Text style={styles.icon}>🏡</Text>
            <Text style={styles.iconLabel}>Local Services</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate('EventCreation', { eventType: 'create' })}
          >
            <Text style={styles.icon}>🎨</Text>
            <Text style={styles.iconLabel}>Create Events</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.iconRow}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate('CreateService', { serviceType: 'material' })}
          >
            <Text style={styles.icon}>🛠</Text>
            <Text style={styles.iconLabel}>Material Services</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate('CreateService', { serviceType: 'personal' })}
          >
            <Text style={styles.icon}>👤</Text>
            <Text style={styles.iconLabel}>Personal Services</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Services Section */}
      <View style={styles.servicesContainer}>
        <Text style={styles.sectionTitle}>Your Services</Text>
        <FlatList
          data={userServices}
          keyExtractor={(item) => item.id}
          renderItem={renderServiceItem}
        />
      </View>

      {/* Events Section */}
      <View style={styles.eventsContainer}>
        <Text style={styles.sectionTitle}>Your Events</Text>
        <FlatList
          data={userEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Text>{item.title}</Text>}
        />
      </View>

      {/* Save Button (only in editing mode) */}
      {isEditing && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 10,
  },
  headerText: {
    fontSize: 18,
    color: '#673AB7',
  },
  profileTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#673AB7',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  profileBio: {
    fontSize: 16,
    color: '#666',
  },
  editButton: {
    backgroundColor: '#673AB7',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1,
    width: 200,
    marginBottom: 10,
    padding: 5,
    textAlign: 'center',
  },
  iconsContainer: {
    marginTop: 20,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: 'center',
    width: '48%',
    marginHorizontal: '1%',
  },
  icon: {
    fontSize: 40,
    color: '#673AB7',
  },
  iconLabel: {
    fontSize: 14,
    marginTop: 8,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  servicesContainer: {
    marginTop: 20,
  },
  eventsContainer: {
    marginTop: 20,
  },
  serviceItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },
});

export default ProfileScreen;
