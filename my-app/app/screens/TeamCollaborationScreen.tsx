// TeamCollaborationScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, FlatList, TextInput } from 'react-native';
import { supabase } from '../services/supabaseClient';

const TeamCollaborationScreen = ({ route, navigation }: any) => {
  const { eventName, eventDescription, eventType, selectedCategory, selectedSubcategory, selectedVenue, selectedEntertainment, timeline } = route.params;
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [teamMemberEmail, setTeamMemberEmail] = useState<string>('');

  useEffect(() => {
    const fetchTeam = async () => {
      // Fetch current team members
      const { data, error } = await supabase
        .from('event_team')
        .select('user_id, role')
        .eq('event_id', route.params.eventId);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setTeamMembers(data);
      }
    };

    fetchTeam();
  }, [route.params.eventId]);

  const addTeamMember = async () => {
    // Add team member to the event
    const { error } = await supabase
      .from('event_team')
      .insert([
        {
          event_id: route.params.eventId,
          user_id: teamMemberEmail,
          role: 'Manager', // Role can be dynamic based on the user input
        },
      ]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Team member added!');
      setTeamMemberEmail('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Team Collaboration</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter team member email"
        value={teamMemberEmail}
        onChangeText={setTeamMemberEmail}
      />
      <Button title="Add Team Member" onPress={addTeamMember} color="#4CAF50" />

      <FlatList
        data={teamMembers}
        keyExtractor={(item) => item.user_id}
        renderItem={({ item }) => (
          <View style={styles.memberItem}>
            <Text>{item.user_id} - {item.role}</Text>
          </View>
        )}
      />
      <Button
        title="Next"
        onPress={() =>
          navigation.navigate('Notifications', {
            eventName,
            eventDescription,
            eventType,
            selectedCategory,
            selectedSubcategory,
            selectedVenue,
            selectedEntertainment,
            timeline,
          })
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  memberItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});

export default TeamCollaborationScreen;
