import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from '../services/supabaseClient';
import { PersonalData } from '../navigation/types';
import Header from '../components/standardComponents/Header';
import ImageCarousel from '../components/standardComponents/ImageCarousel';
import PersonalInfo from '../components/standardComponents/PersonalInfo';
import DetailsList from '../components/standardComponents/DetailsList';
import BookButton from '../components/standardComponents/BookButton';

const PersonalDetail: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { personalId } = route.params as { personalId: string };
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchPersonalData = async () => {
      try {
        const { data, error } = await supabase
          .from('personal')
          .select(`
            *,
            subcategory (
              name,
              category (
                name
              )
            ),
            media (url)
          `)
          .eq('id', personalId)
          .single();

        if (error) {
          console.error('Error fetching personal data:', error);
        } else if (data) {
          setPersonalData(data);
          if (data.media && Array.isArray(data.media)) {
            setImages(data.media.map((item: { url: string }) => item.url));
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    fetchPersonalData();
  }, [personalId]);

  if (!personalData) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Header navigation={navigation} />
      <ImageCarousel images={images} />
      <View style={styles.infoContainer}>
        <PersonalInfo personalData={personalData} />
        <DetailsList personalData={personalData} />
        <BookButton />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  infoContainer: {
    padding: 16,
  },
});

export default PersonalDetail;