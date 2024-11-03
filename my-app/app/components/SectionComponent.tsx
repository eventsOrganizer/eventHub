import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import StaffServiceCard from './PersonalServiceComponents/StaffServiceCard';
import EventCard from './event/EventCard';
import LocalServiceCard from './LocalService/LocalServiceCard';
import MaterialCard from './MaterialService/MaterialCard';
import { theme } from '../../lib/theme';

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
        return <MaterialCard key={item.id} material={item} onPress={() => onItemPress(item)} />;
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
          {pageData.map((item) => (
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
        intensity={80}
        tint="light"
      >
        <View style={styles.headerContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <TouchableOpacity onPress={onSeeAll} style={styles.seeAllButton}>
            <Text style={styles.seeAllButtonText}>See All</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.accent} />
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
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.cardBg,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  blurBackground: {
    borderRadius: theme.borderRadius.lg,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.overlay,
  },
  contentContainer: {
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.cardTitle,
    letterSpacing: 0.5,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.accent}15`,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  seeAllButtonText: {
    color: theme.colors.accent,
    fontSize: 12,
    fontWeight: '500',
    marginRight: 4,
  },
  scrollViewContent: {
    paddingHorizontal: 10,
    gap: 10,
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
    color: theme.colors.cardTitle,
    fontSize: 12,
  },
});

export default SectionComponent;