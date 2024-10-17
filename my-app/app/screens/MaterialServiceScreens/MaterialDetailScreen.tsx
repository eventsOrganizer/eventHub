import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Material } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  MaterialDetail: { material: Material };
};

type MaterialDetailScreenProps = MaterialTopTabScreenProps<RootStackParamList, 'MaterialDetail'>;

const { width: screenWidth } = Dimensions.get('window');

const MaterialDetailScreen: React.FC<MaterialDetailScreenProps> = ({ route }) => {
  const { material } = route.params;
  const navigation = useNavigation();
  const carouselRef = useRef(null);

  const renderCarouselItem = ({ item, index }: { item: { url: string }; index: number }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: item.url }} style={styles.carouselImage} />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Carousel
            ref={carouselRef}
            data={material.media}
            renderItem={renderCarouselItem}
            sliderWidth={screenWidth}
            itemWidth={screenWidth}
            loop
            autoplay
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <Animated.View 
          entering={FadeInDown.duration(500).springify()} 
          style={styles.detailsContainer}
        >
          <Text style={styles.name}>{material.name}</Text>
          <Text style={styles.price}>
            {material.sell_or_rent === 'sell'
              ? `$${material.price}`
              : `$${material.price_per_hour}/hr`}
          </Text>

          <Animated.View entering={FadeInRight.delay(200).duration(500).springify()}>
            <View style={styles.iconTextContainer}>
              <Ionicons name="information-circle-outline" size={24} color="#4A90E2" />
              <Text style={styles.sectionTitle}>Details</Text>
            </View>
            <Text style={styles.details}>{material.details || 'No description available.'}</Text>
          </Animated.View>

          <Animated.View entering={FadeInRight.delay(400).duration(500).springify()}>
            <View style={styles.iconTextContainer}>
              <Ionicons name="pricetag-outline" size={24} color="#4A90E2" />
              <Text style={styles.sectionTitle}>Subcategory</Text>
            </View>
            {/* <Text style={styles.subcategory}>{material.subcategory}</Text> */}
          </Animated.View>
        </Animated.View>
      </ScrollView>

      <Animated.View 
        entering={FadeInDown.delay(600).duration(500).springify()} 
        style={styles.floatingButtonContainer}
      >
        <TouchableOpacity style={styles.floatingButton}>
          <Ionicons name={material.sell_or_rent === 'sell' ? 'cart-outline' : 'calendar-outline'} size={24} color="white" />
          <Text style={styles.floatingButtonText}>
            {material.sell_or_rent === 'sell' ? 'Buy Now' : 'Rent Now'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  carouselItem: {
    width: screenWidth,
    height: 300,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  details: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  subcategory: {
    fontSize: 16,
    color: '#666',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  floatingButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default MaterialDetailScreen;