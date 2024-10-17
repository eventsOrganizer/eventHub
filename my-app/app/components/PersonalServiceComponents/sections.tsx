// components/Section.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Card from './cards';

interface SectionProps {
  title: string;
  data: { title: string; description: string; imageUrl: string }[];
  children?: React.ReactNode; 
  style?: { marginBottom: number; }; 
}

const Section: React.FC<SectionProps> = ({ title, data }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map((item, index) => (
          <Card key={index} title={item.title} description={item.description} imageUrl={item.imageUrl} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Section;