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
      <View style={tw`bg-white rounded-xl mt-4 shadow-sm border border-gray-100`}>
        <View style={tw`flex-row items-center p-4`}>
          <Ionicons name="images" size={24} color="#0066CC" />
          <Text style={tw`text-lg font-bold text-gray-800 ml-2`}>Photos</Text>
        </View>
        <Text style={tw`text-gray-500 text-center py-4`}>No photos available</Text>
      </View>
    );
  }

  return (
    <View style={tw`bg-white rounded-xl mt-4 shadow-sm border border-gray-100`}>
      <View style={tw`flex-row items-center p-4`}>
        <Ionicons name="images" size={24} color="#0066CC" />
        <Text style={tw`text-lg font-bold text-gray-800 ml-2`}>
          Photos ({photos.length})
        </Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`px-4 pb-4`}
      >
        {photos.map((photo, index) => (
          <TouchableOpacity 
            key={photo.id}
            style={[
              tw`mr-3 rounded-lg overflow-hidden shadow-sm border border-gray-100`,
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
    </View>
  );
};

export default PhotosSection;