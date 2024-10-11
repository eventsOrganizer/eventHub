import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from './ChakerStandardComponents/customButton';
import Section from './ChakerStandardComponents/sections';

interface SectionComponentProps {
  title: string;
  data: any[];
  onSeeAll: () => void;
}

const SectionComponent: React.FC<SectionComponentProps> = ({ title, data, onSeeAll }) => {
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <CustomButton title="See all" onPress={onSeeAll} />
      </View>
      <Section
        data={data.map(item => ({
          title: item.name,
          description: item.details || '',
          imageUrl: item.media && item.media.length > 0 ? item.media[0].url : ''
        }))}
        style={styles.section}
        title=""
      />
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
});

export default SectionComponent;