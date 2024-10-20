import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Text } from 'react-native';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Calendar, DateData } from 'react-native-calendars';
import { Material, RootStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../lib/supabase';
import ImageCarousel from '../../components/MaterialService/ImageCarousel';
import MaterialInfo from '../../components/MaterialService/MaterialInfo';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
type MaterialDetailScreenProps = MaterialTopTabScreenProps<RootStackParamList, keyof RootStackParamList>;
const MaterialDetailScreen: React.FC<MaterialDetailScreenProps> = ({ route }) => {
  const { material } = route.params as { material: Material };
  const navigation = useNavigation();
  const [availableDates, setAvailableDates] = useState<{ [date: string]: { selected: boolean, marked: boolean, selectedColor: string } }>({});
  const [basket, setBasket] = useState<Material[]>([]);
  useEffect(() => {
    if (material.sell_or_rent === 'rent') {
      fetchAvailability();
    }
  }, [material.id]);
  const fetchAvailability = async () => {
    const { data, error } = await supabase
      .from('availability')
      .select('date')
      .eq('material_id', material.id);
    if (error) {
      console.error('Error fetching availability:', error);
    } else {
      const dates = data.reduce<{ [date: string]: { selected: boolean, marked: boolean, selectedColor: string } }>((acc, { available_date }) => {
        acc[available_date] = { selected: true, marked: true, selectedColor: '#4CAF50' };
        return acc;
      }, {});
      setAvailableDates(dates);
    }
  };
  const onDayPress = (day: DateData) => {
    console.log('Selected day', day);
  };
  const addToBasket = () => {
    setBasket([...basket, material]);
  };
  const navigateToBasket = () => {
    navigation.navigate('Basket', { basket });
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView}>
        <ImageCarousel media={material.media} />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Card style={styles.infoCard}>
          <Card.Content>
            <Title>{material.name}</Title>
            <Paragraph style={styles.price}>${material.price} {material.sell_or_rent === 'rent' ? '/ hour' : ''}</Paragraph>
            <MaterialInfo material={material} />
          </Card.Content>
        </Card>
        {material.sell_or_rent === 'rent' && (
          <Animated.View entering={FadeInDown.delay(600).duration(500).springify()}>
            <Card style={styles.calendarCard}>
              <Card.Content>
                <View style={styles.iconTextContainer}>
                  <Ionicons name="calendar-outline" size={24} color="#4A90E2" />
                  <Text style={styles.sectionTitle}>Availability</Text>
                </View>
                <Calendar
                  markedDates={availableDates}
                  onDayPress={onDayPress}
                  theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: '#b6c1cd',
                    selectedDayBackgroundColor: '#4CAF50',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#4A90E2',
                    dayTextColor: '#2d4150',
                    textDisabledColor: '#d9e1e8',
                    dotColor: '#4CAF50',
                    selectedDotColor: '#ffffff',
                    arrowColor: '#4A90E2',
                    monthTextColor: '#4A90E2',
                    indicatorColor: '#4A90E2',
                    textDayFontWeight: '300',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '300',
                    textDayFontSize: 16,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 16
                  }}
                />
              </Card.Content>
            </Card>
          </Animated.View>
        )}
      </ScrollView>
      <Animated.View 
        entering={FadeInDown.delay(800).duration(500).springify()} 
        style={styles.floatingButtonContainer}
      >
        <Button 
          mode="contained" 
          onPress={addToBasket}
          icon={material.sell_or_rent === 'sell' ? 'cart' : 'calendar'}
          style={styles.floatingButton}
        >
          {material.sell_or_rent === 'sell' ? 'Add to Cart' : 'Request Rental'}
        </Button>
      </Animated.View>
      <TouchableOpacity style={styles.basketButton} onPress={navigateToBasket}>
        <Ionicons name="basket-outline" size={24} color="white" />
        <Text style={styles.basketButtonText}>View Basket ({basket.length})</Text>
      </TouchableOpacity>
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  infoCard: {
    margin: 16,
    elevation: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginVertical: 8,
  },
  calendarCard: {
    margin: 16,
    elevation: 4,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  floatingButton: {
    borderRadius: 10,
  },
  basketButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
  },
  basketButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});
export default MaterialDetailScreen;