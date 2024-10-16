import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';

type CreatePersonalServiceStep4ScreenRouteProp = RouteProp<RootStackParamList, 'CreatePersonalServiceStep4'>;
type CreatePersonalServiceStep4ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep4'>;

const CreatePersonalServiceStep4 = () => {
  const route = useRoute<CreatePersonalServiceStep4ScreenRouteProp>();
  const navigation = useNavigation<CreatePersonalServiceStep4ScreenNavigationProp>();

  const { serviceName, description, images, price, subcategoryName, subcategoryId } = route.params;

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() !== '') {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleNext = () => {
    navigation.navigate('CreatePersonalServiceStep5', {
      serviceName,
      description,
      images,
      price,
      skills,
      subcategoryName,
      subcategoryId,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text>Add Your Skills</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a skill"
        value={newSkill}
        onChangeText={setNewSkill}
      />
      <Button title="Add Skill" onPress={addSkill} />
      <View style={styles.skillsContainer}>
        {skills.map((skill, index) => (
          <Text key={index} style={styles.skill}>{skill}</Text>
        ))}
      </View>
      <Button title="Next" onPress={handleNext} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  skill: {
    backgroundColor: '#e0e0e0',
    padding: 5,
    margin: 5,
    borderRadius: 5,
  },
});

export default CreatePersonalServiceStep4;