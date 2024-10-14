import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from './PersonalServiceComponents/customButton';
import Section from './PersonalServiceComponents/sections';

interface SectionComponentProps {
  title: string;
  data: any[];
  onSeeAll: () => void;
}

const SectionComponent: React.FC<SectionComponentProps> = ({ title, data, onSeeAll }) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.seeAllButtonContainer}>
          <CustomButton title="See All" onPress={onSeeAll} style={styles.seeAllButton} />
        </View>
      </View>
      <Section
        data={data.map(item => ({
          title: item.name,
          description: item.details || '',
          imageUrl: item.media && item.media.length > 0 ? item.media[0].url : ''
        }))}
        style={styles.sectionContent}
        title=""
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllButtonContainer: {
    width: 80,
  },
  seeAllButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  sectionContent: {
    marginBottom: 10,
  },
});

export default SectionComponent;