import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import StaffServiceCard from './PersonalServiceComponents/StaffServiceCard';
import EventCard from './event/EventCard';
import LocalServiceCard from './LocalService/LocalServiceCard';

const { width } = Dimensions.get('window');

interface SectionComponentProps {
  title: string;
  data: any[];
  onSeeAll: () => void;
  onItemPress: (item: any) => void;
  type: 'staff' | 'event' | 'local' | 'material';
}

const SectionComponent: React.FC<SectionComponentProps> = ({ title, data, onSeeAll, onItemPress, type }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const renderItem = (item: any) => {
    switch (type) {
      case 'staff':
        return <StaffServiceCard key={item.id} service={item} onPress={() => onItemPress(item)} />;
      case 'event':
        return <EventCard key={item.id} event={item} onPress={() => onItemPress(item)} />;
      case 'local':
      case 'material':
        return <LocalServiceCard key={item.id} item={item} onPress={() => onItemPress(item)} />;
      default:
        return null;
    }
  };

  const renderLocalServices = () => {
    const pages = [];
    for (let i = 0; i < data.length; i += 4) {
      const pageData = data.slice(i, i + 4);
      pages.push(
        <View key={i} style={styles.localPage}>
          {pageData.map((item, index) => (
            <View key={item.id} style={styles.localItem}>
              {renderItem(item)}
            </View>
          ))}
        </View>
      );
    }
    return pages;
  };

  const totalPages = Math.ceil(data.length / 4);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const page = Math.round(contentOffset.x / width);
    setCurrentPage(page);
  };

  return (
    <View style={styles.section}>
      <LinearGradient
        colors={['#1a1a1a', '#2c2c2c', '#3d3d3d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerContainer}
      >
        <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
        <TouchableOpacity onPress={onSeeAll} style={styles.seeAllButton}>
          <Text style={styles.seeAllButtonText}>See All</Text>
          <Ionicons name="chevron-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
      <LinearGradient
        colors={['#1a1a1a', '#2c2c2c', '#3d3d3d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.contentContainer}
      >
        {type === 'local' ? (
          <>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScroll}
            >
              {renderLocalServices()}
            </ScrollView>
            {totalPages > 1 && (
              <View style={styles.pagination}>
                <Text style={styles.pageIndicator}>{`${currentPage + 1}/${totalPages}`}</Text>
              </View>
            )}
          </>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            {data.map(renderItem)}
          </ScrollView>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  contentContainer: {
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  seeAllButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginRight: 4,
  },
  scrollViewContent: {
    paddingHorizontal: 10,
  },
  localPage: {
    width: width - 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  localItem: {
    width: '48%',
    marginBottom: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  pageIndicator: {
    color: '#fff',
    fontSize: 12,
  },
});

export default SectionComponent;