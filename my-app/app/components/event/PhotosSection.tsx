import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../services/supabaseClient';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

interface Media {
  id: number;
  url: string;
}

const PhotosSection: React.FC<{ eventId: number }> = ({ eventId }) => {
  const [photos, setPhotos] = useState<Media[]>([]);
  const windowWidth = Dimensions.get('window').width;
  const photoSize = (windowWidth - 64) / 2.5;

  useEffect(() => {
    fetchPhotos();
    {console.log(eventId)}
  }, [eventId]);

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from('media')
      .select('id, url')
      .eq('event_id', eventId)
      // .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching photos:', error);
    } else {
      setPhotos(data || []);
      console.log(data)
    }
  };

  if (photos.length === 0) {
    return (
      <LinearGradient
        colors={['#4B0082', '#0066CC']}
        style={tw`p-4 rounded-xl mt-4 shadow-lg`}
      >
        <View style={tw`flex-row items-center mb-2`}>
          <Ionicons name="images" size={24} color="white" />
          <Text style={tw`text-lg font-bold text-white ml-2`}>Photos</Text>
        </View>
        <Text style={tw`text-white/70 text-center py-4`}>No photos available</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#4B0082', '#0066CC']}
      style={tw`p-4 rounded-xl mt-4 shadow-lg`}
    >
      <View style={tw`flex-row items-center mb-4`}>
        <Ionicons name="images" size={24} color="white" />
        <Text style={tw`text-lg font-bold text-white ml-2`}>
          Photos ({photos.length})
        </Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`pb-2`}
      >
        {photos.map((photo, index) => (
          <TouchableOpacity 
            key={photo.id}
            style={[
              tw`mr-3 rounded-lg overflow-hidden shadow-lg`,
              { width: photoSize, height: photoSize }
            ]}
          >
            <Image
              source={{ uri: photo.url }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

export default PhotosSection;