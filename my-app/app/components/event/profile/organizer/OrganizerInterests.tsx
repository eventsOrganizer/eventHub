import React, { useEffect, useState } from 'react';
import { View, Text , ScrollView } from 'react-native';
import { supabase } from '../../../../services/supabaseClient';
import tw from 'twrnc';

interface Interest {
  id: number;
  subcategory: {
    name: string;
    category: {
      name: string;
    };
  };
}

interface Props {
  organizerId: string;
}

const OrganizerInterests: React.FC<Props> = ({ organizerId }) => {
  const [interests, setInterests] = useState<Interest[]>([]);

  useEffect(() => {
    fetchInterests();
  }, [organizerId]);

  const fetchInterests = async () => {
    try {
      const { data, error } = await supabase
        .from('interest')
        .select(`
          id,
          subcategory (
            name,
            category (
              name
            )
          )
        `)
        .eq('user_id', organizerId);

      if (error) throw error;
      setInterests(data || []);
    } catch (error) {
      console.error('Error fetching interests:', error);
    }
  };

  return (
    <View style={tw`mt-4`}>
      <Text style={tw`text-blue-500 text-xl font-bold mb-2`}>Interests</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`flex-row flex-wrap`}
        style={tw`max-h-20`}
      >
        {interests.map((interest) => (
          <View 
            key={interest.id} 
            style={tw`bg-white/20 rounded-full px-3 py-1 mr-2 mb-2`}
          >
            <Text style={tw`text-blue-500 text-sm`}>
              {`${interest.subcategory.category.name} - ${interest.subcategory.name}`}
            </Text>
          </View>
        ))}
        {interests.length === 0 && (
          <Text style={tw`text-black-500/70 text-sm`}>No interests added yet</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default OrganizerInterests;

