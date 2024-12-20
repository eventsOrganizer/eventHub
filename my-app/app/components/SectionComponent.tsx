import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import StaffServiceCard from './PersonalServiceComponents/StaffServiceCard';
import EventCard from './event/EventCard';
import LocalServiceCard from './LocalService/LocalServiceCard';
import MaterialCard from './MaterialService/MaterialCard';
import tw from 'twrnc';
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
        return <LocalServiceCard key={item.id} item={item} onPress={() => onItemPress(item)} />;
      case 'material':
        // Ensure this is the correct component for "material"
        return <MaterialCard key={item.id} material={item} onPress={() => onItemPress(item)} />;
      default:
        return null;
    }
  };

  // Debugging: Check if items are being rendered
  // console.log('Rendering items for type:', type, 'Data:', data);

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
      <BlurView
        style={styles.blurBackground}
        blurType ="dark " 
        blurAmount={10}
        reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.8)"
      >
        <View style={styles.headerContainer}>
          <Text style={[tw`text-lg font-bold mb-2`, { color: '#0066CC' }]}>
            {title}
          </Text>
          <TouchableOpacity onPress={onSeeAll} style={styles.seeAllButton}>
            <Text style={styles.seeAllButtonText}>See All</Text>
            <Ionicons name="chevron-forward" size={16} color="#000000" />
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
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
        </View>
      </BlurView>
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
  blurBackground: {
    borderRadius: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#BAE6FD',
  },
  contentContainer: {
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.5,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  seeAllButtonText: {
    color: '#000000',
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
