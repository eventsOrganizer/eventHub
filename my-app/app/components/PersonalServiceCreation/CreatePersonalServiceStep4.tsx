import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';

type RouteParams = {
  serviceName: string;
  description: string;
  images: string[];
  price: string;
  availabilityFrom: string;
  availabilityTo: string;
  subcategoryName: string;
  subcategoryId: string;
};

type CreatePersonalServiceStep4NavigationProp = StackNavigationProp<
  RootStackParamList,
  'CreatePersonalServiceStep4'
>;

const CreatePersonalServiceStep4 = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'CreatePersonalServiceStep4'>>();
  const navigation = useNavigation<CreatePersonalServiceStep4NavigationProp>();

  const { serviceName, description, images, price, availabilityFrom, availabilityTo, subcategoryName, subcategoryId } = route.params;

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
      availabilityFrom,
      availabilityTo,
      skills,
      subcategoryName,
      subcategoryId,
    });
  };

  return (
    <View style={styles.container}>
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
    </View>
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