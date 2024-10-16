import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, FlatList, Image, ScrollView, Alert } from 'react-native';
import { supabase } from '../services/supabaseClient'; // Import the supabase client you initialized
import { Picker } from '@react-native-picker/picker';

// Service Interface
interface Service {
  id: string;
  name: string;
  details: string;
}

const ProfileScreen: React.FC = ({ navigation }) => {
  const [user, setUser] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>({
    firstname: 'John',
    lastname: 'Doe',
    age: 30,
    username: 'johndoe',
    gender: 'male',
    email: 'johndoe@example.com',
    avatar_url: 'https://lumiere-a.akamaihd.net/v1/images/a_avatarpandorapedia_neytiri_16x9_1098_01_0e7d844a.jpeg?region=420%2C0%2C1080%2C1080'
  });

  const [userServices, setUserServices] = useState<Service[]>([
    {
      id: 'service-1',
      name: 'House Cleaning',
      details: 'Deep cleaning of your home or office. Includes dusting, vacuuming, and surface cleaning.',
      user_id: '7a1247d6-3d59-4d9f-8b1d-149f27b98c58',
    },
    {
      id: 'service-2',
      name: 'Personal Training',
      details: 'Personalized fitness training sessions to help you achieve your goals.',
      user_id: '7a1247d6-3d59-4d9f-8b1d-149f27b98c58',
    }
  ]);

  const [userEvents, setUserEvents] = useState<any[]>([
    {
      id: 'event-1',
      title: 'Yoga Workshop',
      description: 'Join us for a relaxing and rejuvenating yoga session. Open to all skill levels.',
      user_id: '7a1247d6-3d59-4d9f-8b1d-149f27b98c58',
      date: '2024-10-15T10:00:00Z'
    },
    {
      id: 'event-2',
      title: 'Cooking Class',
      description: 'Learn how to cook delicious meals with our step-by-step cooking class.',
      user_id: '7a1247d6-3d59-4d9f-8b1d-149f27b98c58',
      date: '2024-10-20T14:00:00Z'
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);

  // Fetch user data (Profile, Services, and Events) - This part assumes that user authentication is handled elsewhere
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
  const renderEventItem = ({item } : any )=> (
    <View style={styles.eventItem}>
      {/* <Text style={styles.eventItem}>{item.name}</Text> */}
      <Text style={styles.serviceDescription}>{item.details}</Text>
    </View>
  )

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
  <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
    <Text style={styles.headerText}>
      <Text>🡸</Text>
    </Text>
  </TouchableOpacity>
  <Text style={styles.profileTitle}>Profile</Text>
</View>

      {/* Edit Profile Button */}
      {isEditing ? (
        <TouchableOpacity style={styles.editButton} onPress={handleSaveProfile}>
          <Text style={styles.editButtonText}>Save Profile</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      )}

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image source={{ uri: profileData.avatar_url || 'https://via.placeholder.com/150' }} style={styles.profileImage} />
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={profileData.firstname}
              onChangeText={(text) => setProfileData({ ...profileData, firstname: text })}
              placeholder="First Name"
            />
            <TextInput
              style={styles.input}
              value={profileData.lastname}
              onChangeText={(text) => setProfileData({ ...profileData, lastname: text })}
              placeholder="Last Name"
            />
            <TextInput
              style={styles.input}
              value={profileData.username}
              onChangeText={(text) => setProfileData({ ...profileData, username: text })}
              placeholder="Username"
            />
            <TextInput
              style={styles.input}
              value={profileData.email}
              onChangeText={(text) => setProfileData({ ...profileData, email: text })}
              placeholder="Email"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              value={profileData.age?.toString()}
              onChangeText={(text) => setProfileData({ ...profileData, age: parseInt(text) || 0 })}
              placeholder="Age"
              keyboardType="numeric"
            />
            <Picker
              selectedValue={profileData.gender}
              onValueChange={(itemValue) => setProfileData({ ...profileData, gender: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </>
        ) : (
          <>
            <Text style={styles.profileName}>{`${profileData.firstname} ${profileData.lastname}`}</Text>
            <Text style={styles.profileUsername}>{profileData.username}</Text>
            <Text style={styles.profileEmail}>{profileData.email}</Text>
            <Text style={styles.profileAge}>Age: {profileData.age}</Text>
            <Text style={styles.profileGender}>Gender: {profileData.gender}</Text>
          </>
        )}
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
      flexDirection: 'row',  // Ensures that the arrow is aligned with the text
      alignItems: 'center',
    },
    headerText: {
      fontSize: 20,  // Adjusted size for better visibility of the arrow
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
  profileUsername: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  profileAge: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  profileGender: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
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

  eventItem : {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  } ,
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
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },
});

export default ProfileScreen;
