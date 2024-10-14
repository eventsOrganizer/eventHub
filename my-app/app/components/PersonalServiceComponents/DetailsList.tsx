import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PersonalData } from '../../navigation/types';

const DetailItem = ({ icon, text }: { icon: string; text: string }) => (
  <View style={styles.detailItem}>
    <Ionicons name={icon as any} size={20} color="gray" />
    <Text style={styles.detailText}>{text}</Text>
  </View>
);

const DetailsList = ({ personalData }: { personalData: PersonalData }) => (
  <View style={styles.detailsContainer}>
    <DetailItem icon="location-outline" text={personalData.location} />
    <DetailItem icon="time-outline" text={`${personalData.experience} years experience`} />
    <DetailItem
      icon="language-outline"
      text={personalData.languages ? personalData.languages.join(', ') : 'No languages available'}
    />
  </View>
);

const styles = StyleSheet.create({
  detailsContainer: {
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default DetailsList;