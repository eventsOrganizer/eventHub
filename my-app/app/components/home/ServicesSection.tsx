import React from 'react';
import { View } from 'react-native';
import { MotiView } from 'moti';
import Banner from '../event/Banner';
import SectionComponent from '../SectionComponent';
import tw from 'twrnc';
import { HomeScreenSection } from '../../navigation/types';

interface ServicesSectionProps {
  sections: HomeScreenSection[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ sections = [] }) => {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <View style={tw`mt-6`}>
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 700, delay: 600 }}
      >
        <Banner title="Services" />
        {sections.map((section, index) => (
          <SectionComponent
            key={index}
            title={section.title}
            data={section.data || []}
            onSeeAll={section.onSeeAll}
            onItemPress={section.onItemPress}
            type={section.type}
          />
        ))}
      </MotiView>
    </View>
  );
};

export default ServicesSection;