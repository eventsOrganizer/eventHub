import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CustomButton from './PersonalServiceComponents/customButton';
import StaffServiceCard from './PersonalServiceComponents/StaffServiceCard';
import EventCard from './event/EventCard';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface SectionComponentProps {
  title: string;
  data: any[];
  onSeeAll: () => void;
  onItemPress: (item: any) => void;
  type: 'staff' | 'event' | 'other';
}

const SectionComponent: React.FC<SectionComponentProps> = ({ title, data, onSeeAll, onItemPress, type }) => {
  const renderItem = (item: any) => {
    switch (type) {
      case 'staff':
        return (
          <StaffServiceCard
            key={item.id}
            service={item}
            onPress={() => onItemPress(item)}
          />
        );
      case 'event':
        return (
          <EventCard
            key={item.id}
            event={item}
            onPress={() => onItemPress(item)}
          />
        );
      default:
        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => onItemPress(item)}
            style={styles.serviceCard}
          >
            <Image source={{ uri: item.media?.[0]?.url }} style={styles.serviceImage} />
            <Text style={styles.serviceName}>{item.name}</Text>
            <Text style={styles.serviceDescription}>{item.details || ''}</Text>
          </TouchableOpacity>
        );
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.seeAllButtonContainer}>
          <CustomButton title="See All" onPress={onSeeAll} style={styles.seeAllButton} />
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map(renderItem)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  seeAllButtonContainer: {
    width: 100,
  },
  seeAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
  },
  serviceCard: {
    width: width * 0.3,
    height: height * 0.2,
    marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
    marginHorizontal: 5,
  },
  serviceDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 5,
  },
});

export default SectionComponent;